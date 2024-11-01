import { Request, Response, NextFunction } from "express";
import { Model, Document } from "mongoose";
import AppError from "../utils/AppError";
import { deleteOne, createOne, updateOne, getOne, getAll, deleteAll } from "./crudFactory";

describe("CRUD Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  const ModelMock: Partial<Model<Document>> = {};

  beforeEach(() => {
    req = { params: { id: "123" }, body: { name: "Test" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("deve deletar um documento com deleteOne", async () => {
    ModelMock.findByIdAndDelete = jest.fn().mockResolvedValue({});

    await deleteOne(ModelMock as Model<Document>)(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({ status: "success", data: null });
  });

  it("deve retornar erro se o documento não for encontrado com deleteOne", async () => {
    ModelMock.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    await deleteOne(ModelMock as Model<Document>)(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });

  it("deve criar um documento com createOne", async () => {
    ModelMock.create = jest.fn().mockResolvedValue(req.body);

    await createOne(ModelMock as Model<Document>)(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ status: "success", data: req.body });
  });

  it("deve atualizar um documento com updateOne", async () => {
    ModelMock.findByIdAndUpdate = jest.fn().mockResolvedValue(req.body);

    await updateOne(ModelMock as Model<Document>)(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: "success", data: req.body });
  });

  it("deve retornar erro se o documento não for encontrado com updateOne", async () => {
    ModelMock.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    await updateOne(ModelMock as Model<Document>)(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });


  it("deve retornar todos os documentos com getAll", async () => {
    ModelMock.find = jest.fn().mockResolvedValue([req.body]);

    await getAll(ModelMock as Model<Document>)(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: "success", results: 1, data: [req.body] });
  });

  it("deve deletar todos os documentos com deleteAll", async () => {
    ModelMock.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 1 });

    await deleteAll(ModelMock as Model<Document>)(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: "success", message: "1 documents were deleted." });
  });

  it("deve retornar erro se nenhum documento for deletado com deleteAll", async () => {
    ModelMock.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 0 });

    await deleteAll(ModelMock as Model<Document>)(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });
});
