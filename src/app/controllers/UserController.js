/*Validações de acesso yup
  importar com * para trazer todos a funções no caso do yup
  por não possuir export default
*/
import * as Yup from 'yup';

import User from '../models/User';

class UserController{
  async store(req, res){
    /*validando com yup*/
    const schema =  Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6)
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails!'});
    }

    /*Validando se usuario já cadastrado por email*/
    const userExists = await User.findOne({where: {email: req.body.email}});

    if(userExists){
      return res.status(400).json({error: 'User already exists.'});
    }

    /*Retorna todos os dados
    const user = await User.create(req.body);

    return res.json(user);
    */

    /*Retorno custom dados*/
    const {id, name, email, provider} = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider
    });
  }

  /*Acesso a routes com autenticação*/
  async update(req, res){

    /*validando com yup*/
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
      .min(6)
      .when('oldPassword', (oldPassword, field) =>
        //validação condicional somente quando oldpassword for prenchido
        oldPassword ? field.required() : field
      ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    //Recebendo id do usuario do auth
    //console.log(req.userId);

    const {email, oldPassword} = req.body;

    //buscar usuario no BD com ID
    const user = await User.findByPk(req.userId);

    if(email !== user.email){
      const userExists = await User.findOne({ where : { email } } );

      if(userExists){
        return res.status(400).json({error: 'User already exists!'});
      }
    }

    if(oldPassword && !(await user.checkePassword(oldPassword))){
      return res.status(401).json({error: 'Password does not match!'});
    }

    const {id, name, provider} = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
