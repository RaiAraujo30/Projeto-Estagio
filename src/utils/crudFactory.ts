import { Request, Response, NextFunction } from "express";
import { Model, Document } from "mongoose";
import catchAsync from "../middlewares/catchAsync";
import AppError from "./AppError";

export const deleteOne = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("Nenhum documento encontrado com esse ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

export const createOne = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

export const updateOne = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("Nenhum documento encontrado com esse ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

export const getOne = <T extends Document>(
  Model: Model<T>,
  populateOptions?: any
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("Nenhum documento encontrado com esse ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

export const getAll = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const docs = await Model.find();
    res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs,
    });
  });

export const deleteAll = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await Model.deleteMany({});

    if (result.deletedCount === 0) {
      return next(new AppError("Nenhum documento encontrado", 404));
    }

    res.status(200).json({
      status: "success",
      message: `${result.deletedCount} documentos foram excluidos.`,
    });
  });
