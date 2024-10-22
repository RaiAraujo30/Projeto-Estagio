import { Loja, ILoja } from '../models/loja';
import logger from '../services/loggerService';


export const lojaService = {

  async excluirTodasLojas(): Promise<{ deletedCount?: number }> {
    return await Loja.deleteMany({});
  },

  
}