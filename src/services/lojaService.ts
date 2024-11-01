import { obterCoordenadasPorCEP } from "../utils/GeoCoding";
import { Loja, ILoja } from "../models/loja";
import logger from "../utils/logger";
import calcularDistancia  from "../utils/Haversine";

export const lojaService = {
  async buscarLojasPorCEP(cep: string): Promise<any> {
    try {
      // Verificar se o CEP é válido
      if (!/^\d{5}-?\d{3}$/.test(cep)) {
        logger.info(`CEP inválido: ${cep}`);
        return "CEP inválido. Verifique o formato do CEP.";
      }

      const coordenadas = await obterCoordenadasPorCEP(cep);
      if (!coordenadas) {
        logger.info(`Coordenadas não encontradas para o CEP: ${cep}`);
        return "Coordenadas não encontradas para o CEP informado.";
      }

      const { latitude: lat1, longitude: lon1 } = coordenadas;

      const lojas = await Loja.find();

      if (!lojas || lojas.length === 0) {
        logger.info("Nenhuma loja encontrada no banco de dados.");
        return "Nenhuma loja disponível no banco de dados.";
      }

      const lojasProximas = lojas
        .map((loja) => {
          if (!loja.latitude || !loja.longitude) {
            return null; // se por acaso não houver long e lat na loja ela é ignorada
          }

          const distancia = calcularDistancia(
            lat1,
            lon1,
            loja.latitude,
            loja.longitude
          );
          const { _id, __v, ...lojaSemIdEV } = loja.toObject();
          return { ...lojaSemIdEV, distancia }; // adiciona distancia ao objeto loja
        })
        .filter((loja): loja is NonNullable<typeof loja> => loja !== null) // Filtra lojas não nulas
        .filter((loja) => loja.distancia <= 100)
        .sort((a, b) => a.distancia - b.distancia);

      if (lojasProximas.length === 0) {
        logger.info(`Nenhuma loja encontrada próxima ao CEP: ${cep}`);
        return "Nenhuma loja encontrada próxima ao CEP informado.";
      }

      logger.info(
        `${lojasProximas.length} loja(s) encontrada(s) próxima(s) ao CEP: ${cep}`
      );
      return lojasProximas;
    } catch (error: any) {
      logger.error(
        `Erro ao buscar lojas por CEP: ${cep}. Detalhes: ${
          error.message || error
        }`
      );
      return `Erro ao buscar lojas por CEP. Por favor, tente novamente.`;
    }
  },
};
