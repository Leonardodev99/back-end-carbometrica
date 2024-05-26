import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import Usuario from '../models/Usuario';
import Ingredientes from '../models/Ingredientes';
import Receitas from '../models/Receitas'


const models = [Usuario, Receitas, Ingredientes];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));
