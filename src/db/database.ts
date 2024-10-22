import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../services/loggerService';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    logger.info('Conectado ao MongoDB');
  } catch (error) {
    logger.error('Erro ao conectar ao MongoDB:', (error as Error).message || error);
    process.exit(1); // Vai finalizar em caso de erro
  }
};

export default connectDB;
