import Usuario from '../models/Usuario';
import jwt from 'jsonwebtoken';

//Verificar se o usuario existe na base de dados para poder logar

class TokenController {
  async store(req, res) {
    const { email = '', password = '' } = req.body;
    //Se o usuario nao digitar nada
    if(!email || !password) {
      return res.status(401).json({
        errors: ['Credenciais invalidas'],
      });
    }

    const usuario = await Usuario.findOne({ where: { email } });

  //Se o usuario existe
  if(!usuario) {
    return res.status(401).json({
      errors: ['Usuario nao existe'],
    });
  }

  if(!(await usuario.passwordIsValid(password))) {
    return res.status(401).json({
      errors: ['Senha invalida'],
    });
  }
// Criando token para o usuario
  const { id } = usuario;
  const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION,
  });

    return res.json({ token });

  }


}

export default new TokenController();
