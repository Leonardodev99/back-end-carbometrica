import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario';

//middlawere que verifica o token do usuario afim de dar autorizacao a determinada pagina da aplicacao
export default async (req, res, next) => {
  const { authorization } = req.headers;

  if(!authorization) {
    return res.status(401).json({
      errors: ['Login required'],
    });
  }


  const [, token] = authorization.split(' ');

  try{
    const dados = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id, email } = dados;

    const usuario = await Usuario.findOne({
      where: {
        id,
        email,
      },
    });

    if(!usuario) {
      return res.status(401).json({
        errors: ['Usuario invalido'],
      });
    }



    req.usuarioId = id;
    req.usuarioEmail = email;
    return next();

  } catch(e) {
    return res.status(401).json({
      errors: ['Token expirado ou invalido'],
    });
  }
};
