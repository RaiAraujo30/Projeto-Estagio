import { Request, Response, NextFunction } from "express";
import { lojaService } from "../services/lojaService";
import { Loja } from "../models/loja";
import * as factory from "../utils/crudFactory";
import AppError from "../utils/AppError";

export const criarLoja = factory.createOne(Loja);
export const listarLojas = factory.getAll(Loja);
export const buscarLojaPorId = factory.getOne(Loja);
export const excluirLoja = factory.deleteOne(Loja);
export const excluirTodasLojas = factory.deleteAll(Loja);
export const atualizarLoja = factory.updateOne(Loja);

export const buscarLojasPorCEP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lojasProximas = await lojaService.buscarLojasPorCEP(req.params.cep);

    // buscarlojascep retorna um erro em string caso o CEP seja inválido
    if (typeof lojasProximas === "string") {
      return next(new AppError(lojasProximas, 400)); // passamos o erro parao middleware de tratamento
    }

    res.status(200).json({
      status: "success",
      results: lojasProximas.length,
      data: lojasProximas,
    });
  } catch (error: any) {
    next(error); // passamos o erro parao middleware de tratamento
  }
};
