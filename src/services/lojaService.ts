import { obterCoordenadasPorCEP } from "../utils/GeoCoding";
import { Loja } from "../models/loja";
import logger from "../utils/logger";
import calcularDistancia  from "../utils/Haversine";

export const lojaService = {
  async buscarLojasPorCEP(cep: string): Promise<any> {
    try {
      // Verificar se o CEP é válido
      const cepValidado = validarCEP(cep);
      if (!cepValidado) {
        logger.info(`CEP inválido: ${cep}`);
        return "CEP inválido, deve possuir 8 digitos numéricos.";
      }

      const coordenadas = await obterCoordenadasPorCEP(cep);
      if (!coordenadas) {
        logger.info(`Coordenadas não encontradas para o CEP: ${cep}`);
        return "Coordenadas não encontradas para o CEP informado.";
      }

      const lojas = await Loja.find();
      
      if (!lojas || lojas.length === 0) {
        logger.info("Nenhuma loja encontrada no banco de dados.");
        return "Nenhuma loja disponível no banco de dados.";
      }
      
      logger.info(`Buscando lojas em um raio de 100km para o cep informado`);
      const lojasProximas = filtrarLojasPorProximidade(lojas, coordenadas, 100);

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


function validarCEP(cep: string): boolean {
  return /^\d{5}-?\d{3}$/.test(cep);
}

function filtrarLojasPorProximidade(
  lojas: any[],
  coordenadas: { latitude: number; longitude: number },
  raio: number
) {
  const { latitude: lat1, longitude: lon1 } = coordenadas;

  return lojas
    .reduce((proximas, loja) => {
      if (loja.latitude && loja.longitude) {
        const distancia = calcularDistancia(lat1, lon1, loja.latitude, loja.longitude);
        if (distancia <= raio) {
          const { _id, __v, ...lojaSemIdEV } = loja.toObject();
          proximas.push({ ...lojaSemIdEV, distancia });
        }
      }
      return proximas;
    }, [])
    .sort((a: { distancia: number; }, b: { distancia: number; }) => a.distancia - b.distancia);
}
