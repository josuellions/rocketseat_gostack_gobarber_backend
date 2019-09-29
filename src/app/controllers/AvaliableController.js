import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import Appointment from '../models/Appointment';
import { Op } from 'sequelize';

class AvaliableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date!' });
    }

    const searchDate = Number(date);

    /**Lista os agendamentos */
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    /**Horarios disponiveis para agendamento */
    const schedule = [
      '08:00', //2019-09-03 08:00:00
      '09:00', //2019-09-03 09:00:00
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '19:00',
    ];

    /**Verificando se horario esta disponiviel ou passou hora */
    const avaliable = schedule.map(time => {
      const [hour, min] = time.split(':');
      const value = setSeconds(setMinutes(setHours(searchDate, hour), min), 0);

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        avaliable:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.date, 'HH:mm') === time),
      };
    });

    return res.json(avaliable);
  }
}

export default new AvaliableController();
