import { IStore  } from "../models/Store";
import { getCoordinatesByZipCode  } from "../utils/GeoCoding";

// Middleware para buscar e salvar latitude e longitude ao salvar uma nova loja
export const saveCoordinatesMiddleware = async function (
  this: IStore,
  next: Function
) {
  const store  = this as unknown as IStore;

  if (!store.latitude || !store.longitude) {
    try {
      const { latitude, longitude } = await getCoordinatesByZipCode(store.cep);

      if (latitude && longitude) {
        store.latitude = latitude;
        store.longitude = longitude;
      } else {
        throw new Error("Coordenadas não encontradas para o CEP fornecido.");
      }
    } catch (error) {
      console.error(
        `Erro ao buscar coordenadas para o CEP ${store.cep}:`,
        error
      );
      return next(new Error("Não foi possível obter as coordenadas da loja."));
    }
  }
  next();
};
