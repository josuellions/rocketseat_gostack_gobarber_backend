import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import Notificarion from '../schemas/Notification';

//Sem uso de fila para envio de email*/
//import Mail from '../../lib/Mail';

/*Com uso de filas para envio de email*/
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

import User from '../models/User';
import File from '../models/File';

class AppointmentController {
  /*Lista agendamentos*/
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20, //limite de registro list da page
      offset: (page - 1) * 20, //calcula qtd registro por page e pula de 20->20
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { provider_id, date } = req.body;

    /*
     * Check if provider_id is a provider
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers!' });
    }

    /*
     *  Check for past dates
     */
    /*Transformar horas quebradas em horas cheias ex: 9:30 em 9:00*/
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted!' });
    }

    /*
     *  Check date availability
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available!' });
    }

    /*Criar agendamento*/
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    /*
     * Notify appointment provider - mongoose
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notificarion.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permisson to cancel this appointment!",
      });
    }

    //remover 02 duas horas da data agendada para verificação
    const dateWithSub = subHours(appointment.date, 2);

    //verificando se o agendamento e menor que a data e hora atual - 2horas
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel apponitments 2 hours in advance!',
      });
    }

    //se passar pela validações cancela o agendamento
    appointment.canceled_at = new Date();

    await appointment.save();

    //Sem uso de fila para envio de email
    // await Mail.sendMail({
    //   to: `${appointment.provider.name} <${appointment.provider.email}>`,
    //   subject: 'Agendamento cancelado',
    //   template: 'cancellation', //text: 'Seu agendamento foi cancelado!', //ou html
    //   context: {
    //     provider: appointment.provider.name,
    //     user: appointment.user.name,
    //     date: format(appointment.date, "'dia' dd 'de' MMMM', às' H:mm'h'", {
    //       locale: pt,
    //     }),
    //   },
    // });

    //com uso de filas para envio de email
    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
