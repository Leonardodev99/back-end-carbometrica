import Usuario from "../models/Usuario";

class UsersController {
  //store -- criar conta
  async store(req, res){
    try {
      const novoUsuario = await Usuario.create(req.body);
      const { id, nome, email, temDiabete, tipoDeDiabete, usaAContagem } = novoUsuario;
      return res.json({ id, nome, email, temDiabete, tipoDeDiabete, usaAContagem });
  }catch (e) {
    return res.status(400).json({
      errors: e.errors.map(err => err.message)
    });
  }
  }
//index
  async index(req, res){
    try {
      const usuarios = await Usuario.findAll();
      return res.json(usuarios);
    }catch (e) {
      return res.json(null);
    }
  }

  //show
  async show(req, res){
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      return res.json(usuario);
    }catch (e) {
      return res.json(null);
    }
  }

  //update
  async update(req, res){
    try {

      const usuario = await Usuario.findByPk(req.usuarioId);


      if(!usuario) {
        return res.status(400).json({
          errors: ['Usuario nao existe'],
        });
      }

      const novosDados = await usuario.update(req.body);
      const { id, nome, email, temDiabete, tipoDeDiabete, usaAContagem } = novosDados;
      return res.json({ id, nome, email, temDiabete, tipoDeDiabete, usaAContagem });

    }catch (e) {
      return res.status(400).json({
        errors: e.errors.map(err => err.message),
      });
    }
  }


}

export default new UsersController();
