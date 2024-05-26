import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

export default class Usuario extends Model {
  static init(sequelize) {
    super.init({
      //VALIDANDO OS CAMPOS

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
      email: {
        type: Sequelize.STRING,
        defaultValue: '',
        unique: {
          msg: 'Email ja existe'
        },
        validate: {
          isEmail: {
            msg: 'Email invalido',
          }
        }
      },
      password_hash: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      temDiabete: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3],
            msg: 'Campo tem diabete deve conter 3 caracteres',
          }
        }
      }
      ,
      tipoDeDiabete: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        validate: {
          isIn: {
            args: [[1, 2]],
            msg: 'Campo tipo de diabete deve ser 1 ou 2',
          }
        }
      },
      usaAContagem: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3],
            msg: 'Campo usa contagem de carboidrato deve conter 3 caracteres',
          }
        }
      },
      password: {
        type: Sequelize.VIRTUAL,
        defaultValue: '',
        validate: {
          len: {
            args: [8, 20],
            msg: 'Campo senha deve conter 8 a 20 caracteres',
        }
        }
      },

    }, {
      sequelize,
      modelName:'Usuario'
    });

    this.addHook('beforeSave', async usuario => {
      if(usuario.password) {
        usuario.password_hash = await bcrypt.hash(usuario.password, 8);
      }

    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Receitas, { foreignKey: 'usuarioId' });
  }

  passwordIsValid(password) {
    return bcrypt.compare(password, this.password_hash)
  }
}
