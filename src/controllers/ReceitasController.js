import Receitas from '../models/Receitas';

import Ingredientes from '../models/Ingredientes';


class ReceitasController {

  async store(req, res) {

    try{

      const { nome, modoPreparo, ingredientes, usuarioId } = req.body;

      const novaReceita = await Receitas.create({
        nome,
        modoPreparo,
        usuarioId
      });


          for (const ingrediente of ingredientes) {
            await Ingredientes.create({
              nome: ingrediente.nome,
              quantidade: parseFloat(ingrediente.quantidade),
              carboidratoPorGrama: parseFloat(ingrediente.carboidratoPorGrama),
              receitaId: novaReceita.id
            });
          }

          //const carboidratoTotal = await this.calcularCarboidratoTotal(novaReceita.id);
          const carboidratoTotal = await ReceitasController.calcularCarboidratoTotal(novaReceita.id);

          // Atualize a receita com o carboidrato total
          await novaReceita.update({ carboidrato: carboidratoTotal });



      return res.json(novaReceita);



    } catch (e) {
      console.log(e);
      if (e.errors) {
        console.error(e)
        return res.status(400).json({
          errors: e.errors.map((err) => err.message),
        });
      }  else {
        console.error(e)
        return res.status(500).json({
          errors: ['Erro ao criar a receita.'],
        });
      }

    }

  }

  static async calcularCarboidratoTotal(receitaId) {
    const ingredientes = await Ingredientes.findAll({
      where: { receitaId },
      attributes: ['carboidratoPorGrama', 'quantidade']
    });

    let carboidratoTotal = 0;
    for(const ingrediente of ingredientes) {
      carboidratoTotal += parseFloat(ingrediente.carboidratoPorGrama)*parseFloat(ingrediente.quantidade);
    }

    return carboidratoTotal;
  }

  async index(req, res) {
    try {
      const receitas = await Receitas.findAll();
      return res.json(receitas);

    } catch (e) {
      console.log(e);
      if (e.errors) {
        console.log(e.errors);
        console.error(e)
        return res.status(400).json({
          errors: e.errors.map((err) => err.message),
        });
      }  else {
        console.log(e.errors);
        console.error(e)
        return res.status(500).json({
          errors: ['Erro ao buscar receitas.'],
        });
      }
      //return res.status(500).json('Erro ao buscar receitas');
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
      const receita = await Receitas.findByPk(id);
      if(!receita) {
        return res.status(404).json({
          errors: ['Receita inexistente!'],
        });
      }
      return res.json(receita);

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
      const receita = await Receitas.findByPk(id);
      if(!receita) {
        return res.status(404).json({
          errors: ['Receita inexistente!'],
        });
      }

      const receitaAtualizada = await Receitas.update(req.body);
      return res.json(receitaAtualizada);

    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }

  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      if(!id) {
        return res.status(400).json({
          errors: ['Faltando ID'],
        });
      }
      const receita = await Receitas.findByPk(id);
      if(!receita) {
        return res.status(400).json({
          errors: ['Receita inexistente!'],
        });
      }

      await receita.destroy();
      return res.json('Receita deletada com sucesso!');

    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }

  }
}

export default new ReceitasController();
