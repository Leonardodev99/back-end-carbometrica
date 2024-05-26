import Ingredientes from "../models/Ingredientes";
import Receitas from "../models/Receitas";

class IngredientesController {

  async store(req, res) {

    try {
      /*const ingrediente = await Ingredientes.create(req.body);
      return res.json(ingrediente);*/
      const { ingredientes } = req.body;

      const ingredientesCriados = await Ingredientes.bulkCreate(ingredientes);
      return res.json({
        message: 'Ingredientes criados com sucesso!',
        ingredientes: ingredientesCriados
      });

    } catch (e) {
      console.log(e);
      /*return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });*/
      if (e.errors) {
        // Se o erro for do Sequelize
        console.error(e);
        return res.status(400).json({
          errors: e.errors.map((err) => err.message),
        });
    }else {
      // Se for erro padrão do MySQL
      console.error(e);
      return res.status(500).json({
        errors: [e.message], // Usar e.message
      });
    }
  }
  }
  async index(req, res){

    try {

      const ingredientes = await Ingredientes.findAll();
      return res.json(ingredientes);

    } catch (e) {
      console.log(e);
      return res.json(null);

    }
  }

  async show(req, res) {

    try {
      const { id } = req.params;
      if(!id) {
        return res.status(400).json({
          errors: ['Faltando ID'],
        });
      }
      const ingrediente = await Ingredientes.findByPk(id);
      if(!ingrediente) {
        return res.status(400).json({
          errors: ['Ingrediente inexistente!'],
        });
      }
      return res.json(ingrediente);

    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });

    }
  }

  async update(req, res) {

    try {
      const { id } = req.params;
      if(!id) {
        return res.status(400).json({
          errors: ['Faltando ID'],
        });
      }
      const ingrediente = await Ingredientes.findByPk(id);
      if(!ingrediente) {
        return res.status(400).json({
          errors: ['Ingrediente inexistente!'],
        });
      }

      const ingredienteAtualizado = await ingrediente.update(req.body);
      return res.json(ingredienteAtualizado);

    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });

    }
  }

  async delete(req, res){

    try {
      const { id } = req.params;
      if(!id) {
        return res.status(400).json({
          errors: ['Faltando ID'],
        });
      }
      const ingrediente = await Ingredientes.findByPk(id);
      if(!ingrediente) {
        return res.status(400).json({
          errors: ['Ingrediente inexistente!'],
        });
      }

      await ingrediente.destroy();
      return res.json('Ingrediente deletado com sucesso');


    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });

    }
  }

}

export default new IngredientesController();
