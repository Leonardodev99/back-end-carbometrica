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
  async quantidadeSegura(req, res) {

    try {
      const { id } = req.params;
      if(!id) {
        return res.status(404).json({
          errors: ['ID nao encontrado!'],
        })
      }
      const receita = await Receitas.findByPk(id);
      if(!receita) {
        return res.status(404).json({
          errors: ['Receita nao encontrada!'],
        })
      }
      const { nivelGlicose, sensibilidadeInsulina } = req.body;
      const { limiteGlicose } = 180; // Valor fictício em mg/dL
      const { carboidratoDaReceita } = await Receitas.findOne({
        where: { id },
        attributes: ['carboidrato']
      });


      const doseInsulina = sensibilidadeInsulina * (nivelGlicose - limiteGlicose);
      console.log(carboidratoDaReceita);
      const quantidadeSegura = doseInsulina / carboidratoDaReceita.carboidrato;
      return  res.status(201).json({ message: 'Para nao passar mal deves comer!',
       quantidadeSegura, message: '/g' });

    } catch(e) {
      console.log(e);
      if (e.errors) {
        return res.status(400).json({
          error: e.errors.map((err) => err.message),
        });
      } else {
        // Caso não tenha a propriedade `errors`, mande uma mensagem genérica:
        return res.status(400).json({
          error: 'Ocorreu um erro ao calcular a quantidade segura.'
        });
      }
    }
  }

 /* async delete(req, res) {
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

  }*/
}

export default new ReceitasController();
