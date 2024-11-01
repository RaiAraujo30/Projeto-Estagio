import { Request, Response, NextFunction } from "express";
import { storeService } from "../services/storeService";
import { Store } from "../models/Store";
import * as factory from "../utils/crudFactory";
import AppError from "../utils/AppError";

export const createStore = factory.createOne(Store);
export const listStores = factory.getAll(Store);
export const getStoreById = factory.getOne(Store);
export const deleteStore = factory.deleteOne(Store);
export const deleteAllStores = factory.deleteAll(Store);
export const updateStore = factory.updateOne(Store);

export const findStoresByCEP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const nearbyStores = await storeService.findStoresByZipCode(req.params.cep);

    // buscarlojascep retorna um erro em string caso o CEP seja inválido
    if (typeof nearbyStores === "string") {
      return next(new AppError(nearbyStores, 400)); // passamos o erro para o middleware de tratamento
    }

    res.status(200).json({
      status: "success",
      results: nearbyStores.length,
      data: nearbyStores,
    });
  } catch (error: any) {
    next(error); // passamos o erro parao middleware de tratamento
  }
};
