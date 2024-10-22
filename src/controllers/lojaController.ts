import { Request, Response } from "express";
import { lojaService } from "../services/lojaService";
import * as factory from './crudFactory';
import catchAsync from "../utils/catchAsync";
import { Loja } from '../models/loja';


export const criarLoja = factory.createOne(Loja);
export const listarLojas = factory.getAll(Loja);
export const buscarLojaPorId = factory.getOne(Loja);
export const excluirLoja = factory.deleteOne(Loja);
export const excluirTodasLojas = factory.deleteAll(Loja);
export const atualizarLoja = factory.updateOne(Loja);

