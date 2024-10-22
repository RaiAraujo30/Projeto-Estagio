import express, { Application } from 'express';
import dotenv from 'dotenv';

import connectDB from './db/database';
import logger from './services/loggerService';

//Carrega variáveis do .env
dotenv.config();

connectDB();

const app: Application = express();
const port: string | number = process.env.PORT || 3000;

// Middleware para parsing de JSON
app.use(express.json());


app.listen(port, () => {
  logger.info(`Servidor rodando na porta ${port}`);
});

export default app;
