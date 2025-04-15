import Sequelize, { Model} from 'sequelize';

export default class Ingredientes extends Model {
  static init(sequelize){
    super.init({
        nome: {
          type: Sequelize.STRING,
          defaultValue: '',
          validate: {
            len: {
              args: [3, 255],
              msg: 'Campo nome deve ter entre 3 a 255 caracteres',
            }
          }
        },
        quantidade: {
          type: Sequelize.FLOAT,
          defaultValue: 0,
          validate: {
            isFloat: {
              msg: 'Campo quantidade prcisa ser um numero inteiro ou com ponto flutuante',
            },
            min: {
              args: [0],
              msg: 'Campo quantidade não pode ser negativo',
            },
          }
        },
        carboidratoPorGrama: {
          type: Sequelize.FLOAT,
          defaultValue: 0,
          validate: {
            isFloat: {
              msg: 'Campo carboidrato precisa ser um numero inteiro ou com ponto flutuante',
            },
            min: {
              args: [0],
              msg: 'Campo carboidrato não pode ser negativo',
            },
          }
        },
        receitaId: {
          type: Sequelize.INTEGER,
          allowNull: false, // Torna obrigatório
          validate: {
            notNull: {
              msg: 'Campo receitaId é obrigatório',
            },
            isInt: {
              msg: 'Campo receitaId precisa ser um número inteiro',
            },
            min: {
              args: [1],
              msg: 'Campo receitaId deve ser maior que 0',
            },
          },
        },
      },
      {
        sequelize,
        modelName: 'Ingrediente',
        tableName: 'ingredientes',
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.Receitas, {
      foreignKey: 'receitaId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

  );

    return this;
  }
}
