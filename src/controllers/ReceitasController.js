import Receitas from '../models/Receitas';

import Ingredientes from '../models/Ingredientes';


class ReceitasController {

  async store(req, res) {

    try{

      const { nome, modoPreparo, ingredientes } = req.body;
      const usuarioId = req.usuarioId;

      // Validar usuarioId
      if (!usuarioId || usuarioId <= 0) {
        return res.status(401).json({
          errors: ['Usuário não autenticado ou ID inválido'],
        });
      }
      // Validar ingredientes
      if (!ingredientes || !Array.isArray(ingredientes) || ingredientes.length === 0) {
        return res.status(400).json({
          errors: ['A lista de ingredientes é obrigatória e não pode estar vazia'],
        });
      }

      for (const ingrediente of ingredientes) {
        if (
          !ingrediente.nome ||
          !ingrediente.quantidade ||
          ingrediente.carboidrato === undefined ||
          isNaN(parseFloat(ingrediente.quantidade)) ||
          isNaN(parseFloat(ingrediente.carboidrato))
        ) {
          return res.status(400).json({
            errors: ['Todos os ingredientes devem ter nome, quantidade e carboidrato válidos'],
          });
        }
      }

      const novaReceita = await Receitas.create({
        nome,
        modoPreparo,
        usuarioId
      });


          for (const ingrediente of ingredientes) {
            await Ingredientes.create({
              nome: ingrediente.nome,
              quantidade: parseFloat(ingrediente.quantidade),
              carboidratoPorGrama: parseFloat(ingrediente.carboidrato),
              receitaId: novaReceita.id
            });
          }


          const carboidratoTotal = await ReceitasController.calcularCarboidratoTotal(novaReceita.id);

          // Atualize a receita com o carboidrato total
          await novaReceita.update({ carboidrato: carboidratoTotal });



          return res.status(201).json(novaReceita);



    } catch (e) {
      console.error('Erro ao criar receita:', e);
      if (e.name === 'SequelizeValidationError') {
        return res.status(400).json({
          errors: e.errors.map((err) => err.message),
        });
      }
      if (e.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
          errors: ['Usuário ou receita associada inválida'],
        });
      }
      return res.status(500).json({
        errors: ['Erro ao criar a receita'],
      });

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

    return carboidratoTotal || 0; // Retorna 0 se não houver ingredientes
  }

  async index(req, res) {
    try {
      const receitas = await Receitas.findAll({
        attributes: ['nome', 'carboidrato'],
      });
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

    }
  }

  async show(req, res) {

    try {
      const { nome } = req.params;
      if(!nome) {
        return res.status(400).json({
          errors: ['Faltando o nome da receita'],
        });
      }
      const receita = await Receitas.findOne({

        attributes: ['modoPreparo'],
      });
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
  async minhasReceitas(req, res) {
    try {
      // Obter o ID do usuário logado
      const usuarioId = req.usuarioId;

      // Encontrar as receitas do usuário
      const receitas = await Receitas.findAll({
        where: { usuarioId },
        attributes: ['nome', 'carboidrato'],

      });

      // Se não houver receitas, enviar uma mensagem apropriada
      if (receitas.length === 0) {
        return res.status(200).json({ message: 'Você não possui nenhuma receita cadastrada.' });
      }

      return res.json(receitas);

    } catch (e) {
      console.error(e);
      return res.status(500).json({
        errors: ['Erro ao buscar suas receitas.'],
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          errors: ['Faltando ID'],
        });
      }
      const receita = await Receitas.findByPk(id);
      if (!receita) {
        return res.status(404).json({
          errors: ['Receita inexistente!'],
        });
      }

      // Atualize a receita com os novos dados
      await receita.update(req.body);

      return res.json(receita);
    } catch (e) {
      console.log(e);
      if (e.errors) {
        console.log(e.errors);
        console.error(e);
        return res.status(400).json({
          errors: e.errors.map((err) => err.message),
        });
      } else {
        console.log(e.errors);
        console.error(e);
        return res.status(500).json({
          errors: ['Erro ao atualizar a receita.'],
        });
      }
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
      const receita = await Receitas.findByPk(id, {
        attributes: ['carboidrato'],
      });

      if(!receita) {
        return res.status(404).json({
          errors: ['Receita nao encontrada!'],
        })
      }

      const { nivelGlicose, sensibilidadeInsulina } = req.body;
      const limiteGlicose  = 180; // Valor fictício em mg/dL

      const carboidratoDaReceita = receita.carboidrato;
      if(carboidratoDaReceita === undefined) {
        return res.status(404).json({
          errors: ['A receita não possui informação de carboidrato.'],
        })
      }


      const doseInsulina =  (nivelGlicose - limiteGlicose)/sensibilidadeInsulina;

      const doseInsulinaAjustada = Math.max(doseInsulina, 0);

      const quantidadeSegura = carboidratoDaReceita > 0 ? doseInsulinaAjustada / carboidratoDaReceita : 0;

      return  res.status(201).json({
        message: 'Para nao passar mal deves comer!',
        quantidadeSegura: quantidadeSegura, });

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


}

export default new ReceitasController();
