/*Validações de acesso yup
  importar com * para trazer todos a funções no caso do yup
  por não possuir export default
*/
import * as Yup from 'yup';

import jwt from  'jsonwebtoken';

import User from '../models/User';

/*Com uso do arquivo auth.js*/
import authConfig from '../../config/auth'

class SessionController{
  async store(req, res){

    /*validando com yup*/
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const {email, password} = req.body;

    /*Verifica se cadastro existe*/
    const user = await User.findOne({where: {email}});

    /*Validações*/
    if(!user){
      return res.status(401).json({error: 'User not found!'});
    }

    /*verifica com metodo criado em User.js */
    if(!(await user.checkePassword(password))) {
      return res.status(401).json({error: 'Password does not match!'});
    }

    /*Retornado TOKEN quando autenticado*/
    const {id, name} = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      /*Criar um hash em https://www.md5online.org/ -> com uma frase unica
      que devera ser usada como chave de criptografria
      */
      //Sem uso do arquivo auth.js*/
      /*token: jwt.sign({ id }, 'f29618255c309de4469993cce24286ea',{
        expiresIn:'7d',
      }),*/

      //com auth.js
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
