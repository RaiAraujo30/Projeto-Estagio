import { obterCoordenadasPorCEP} from "./geoCodingService";
import { Loja, ILoja } from "../models/loja";
import logger from "../services/loggerService";

export const lojaService = {
  async excluirTodasLojas(): Promise<{ deletedCount?: number }> {
    return await Loja.deleteMany({});
  },

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

          const distancia = calcularDistancia(lat1, lon1, loja.latitude, loja.longitude);
          return { ...loja.toObject(), distancia }; // adiciona distancia ao objeto loja

        })
        .filter((loja): loja is NonNullable<typeof loja> => loja !== null) // Filtra lojas não nulas
        .filter((loja) => loja.distancia <= 100)
        .sort((a, b) => a.distancia - b.distancia); 
  
      if (lojasProximas.length === 0) {
        logger.info(`Nenhuma loja encontrada próxima ao CEP: ${cep}`);
        return "Nenhuma loja encontrada próxima ao CEP informado.";
      }
  
      logger.info(`${lojasProximas.length} loja(s) encontrada(s) próxima(s) ao CEP: ${cep}`);
      return lojasProximas;
    } catch (error: any) {

      logger.error(`Erro ao buscar lojas por CEP: ${cep}. Detalhes: ${error.message || error}`);
      return `Erro ao buscar lojas por CEP. Por favor, tente novamente.`;
    }
  }

};

// formula de Haversine
function calcularDistancia(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; //raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; //distância em km
}
