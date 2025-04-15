import dotenv from 'dotenv';

dotenv.config();

import './src/database';

import express from 'express';
import cors from 'cors';

import homeRoutes from './src/routes/homeRoutes';
import userRoutes from './src/routes/userRoutes ';
import tokenRoutes from './src/routes/tokenRoutes';
import ingrendientesRoutes from './src/routes/ingredientesRoutes'
import receitasRoutes from './src/routes/receitasRoutes';


class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    const corsOptions = {
      origin: ['http://localhost:8082'],
      methods: 'GET,PUT,POST,DELETE',
      allowedHeaders: ['Content-Type', 'Authorization'],
    };
    this.app.use(cors(corsOptions));
    this.app.use(express.urlencoded({ extended: true}));
    this.app.use(express.json());

  }

  routes() {
    this.app.use('/', homeRoutes);
    this.app.use('/users/', userRoutes);
    this.app.use('/tokens/', tokenRoutes);
    this.app.use('/ingredientes/', ingrendientesRoutes);
    this.app.use('/receitas/', receitasRoutes);


  }
}

export default new App().app;
