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
          defaultValue: '',
          validate: {
            isFloat: {
              msg: 'Campo quantidade prcisa ser um numero inteiro ou com ponto flutuante',
            }
          }
        },
        carboidratoPorGrama: {
          type: Sequelize.FLOAT,
          defaultValue: 0,
          validate: {
            isFloat: {
              msg: 'Campo carboidrato prcisa ser um numero inteiro ou com ponto flutuante',
            }
          }
        },
        receitaId: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          validate: {
            isInt: {
              msg: 'Campo usuario id prcisa ser um numero inteiro',
            }
          }
        },
      },
      {
        sequelize,
        modelName: 'Ingredientes',
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
