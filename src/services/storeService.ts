import { getCoordinatesByZipCode } from "../utils/GeoCoding";
import { Store  } from "../models/Store";
import logger from "../utils/logger";
import calculateDistance  from "../utils/Haversine";

export const storeService  = {
  async findStoresByZipCode(cep: string): Promise<any> {
    try {
      // Verificar se o CEP é válido
      const validatedZipCode  = validateZipCode(cep);
      if (!validatedZipCode) {
        logger.info(`CEP inválido: ${cep}`);
        return "CEP inválido, deve possuir 8 digitos numéricos.";
      }

      const coordinates  = await getCoordinatesByZipCode(cep);
      if (!coordinates) {
        logger.info(`Coordenadas não encontradas para o CEP: ${cep}`);
        return "Coordenadas não encontradas para o CEP informado.";
      }

      const stores  = await Store.find();

      if (!stores || stores.length === 0) {
        logger.info("Nenhuma loja encontrada no banco de dados.");
        return "Nenhuma loja disponível no banco de dados.";
      }

      logger.info(`Buscando lojas em um raio de 100km para o cep informado`);
      const nearbyStores  = filterStoresByProximity(stores, coordinates, 100);

      if (nearbyStores .length === 0) {
        logger.info(`Nenhuma loja encontrada próxima ao CEP: ${cep}`);
        return "Nenhuma loja encontrada próxima ao CEP informado.";
      }

      logger.info(
        `${nearbyStores .length} loja(s) encontrada(s) próxima(s) ao CEP: ${cep}`
      );
      return nearbyStores ;
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

function validateZipCode(cep: string): boolean {
  return /^\d{5}-?\d{3}$/.test(cep);
}

function filterStoresByProximity(
  stores: any[],
  coordinates: { latitude: number; longitude: number },
  radius: number
) {
  const { latitude: lat1, longitude: lon1 } = coordinates;

  return stores
    .reduce((nearby, store) => {
      if (store.latitude && store.longitude) {
        const distance  = calculateDistance(
          lat1,
          lon1,
          store.latitude,
          store.longitude
        );
        if (distance  <= radius) {
          const { _id, __v, ...storeWithoutIdAndV } = store.toObject();
          nearby.push({ ...storeWithoutIdAndV, distance });
        }
      }
      return nearby;
    }, [])
    .sort(
      (a: { distance: number }, b: { distance: number }) =>
        a.distance - b.distance
    );
}
