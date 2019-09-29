/*Buscar token*/
/*BASE INICIAL
export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  //console.log(authHeader);

  //validando tocken


  return next();
}
*/

//Configurando validação acesso routes
/*Buscar token*/
import jwt from 'jsonwebtoken';
import { promisify } from 'util'; //biblioteca node
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  /*validando tocken*/
  if(!authHeader){
    return res.status(401).json({error: 'Token not provided!'});
  }

  /* virgula idica que estamo pegando o segundo parametro recebido do header*/
  const [,token] = authHeader.split(' ');

  try{
    /*decodificando o token*/
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    //console.log(decoded);
    //passando id usuario para UserController
    req.userId = decoded.id;

    return next();
  }
  catch(err){
    return res.status(401).json({error: 'Token invalid!'});
  }
};
