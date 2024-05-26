import Sequelize, { Model } from 'sequelize';



export default class Receitas extends Model {

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
        modoPreparo: {
          type: Sequelize.TEXT,
          defaultValue: '',
          validate: {
            len: {
              args: [20, 5000],
              msg: 'Campo nome deve ter entre 20 a 5000 caracteres',
            }
          }
        },
        carboidrato: {
          type: Sequelize.FLOAT,
          defaultValue: 0,
          validate: {
            isFloat: {
              msg: 'Campo carboidrato prcisa ser um numero inteiro ou com ponto flutuante',
            }
          }
        },
        usuarioId: {
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
        modelName: 'Receita',
        tableName: 'receitas',

      }
    );
  }
  static associate(models) {
    //Associacao entre Receitas e Usuario
    this.belongsTo(models.Usuario, {
      foreignKey: 'usuarioId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  );
  return this;
  }
  static associate(models) {
    this.hasMany(models.Ingredientes, { foreignKey: 'receitaId' });
  }

}

