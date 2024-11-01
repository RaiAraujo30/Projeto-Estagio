import { ILoja } from '../models/loja'; 
import { obterCoordenadasPorCEP } from '../utils/GeoCoding';

// Middleware para buscar e salvar latitude e longitude ao salvar uma nova loja
export const salvarCoordenadasMiddleware = async function (this: ILoja, next: Function) {
    const loja = this as unknown as ILoja;

    if (!loja.latitude || !loja.longitude) {
        try {
            const { latitude, longitude } = await obterCoordenadasPorCEP(loja.cep);

            if (latitude && longitude) {
                loja.latitude = latitude;
                loja.longitude = longitude;
            } else {
                throw new Error("Coordenadas não encontradas para o CEP fornecido.");
            }
        } catch (error) {
            console.error(`Erro ao buscar coordenadas para o CEP ${loja.cep}:`, error);
            return next(new Error("Não foi possível obter as coordenadas da loja."));
        }
    }
    next();
};
