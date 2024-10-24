import express from 'express';
import * as lojaController from '../controllers/lojaController';

const router = express.Router();

// Rota do desafio 
router.get('/lojas/buscar/:cep', lojaController.buscarLojasPorCEP);

// Rotas do CRUD
router.get('/lojas', lojaController.listarLojas);
router.get('/lojas/:id', lojaController.buscarLojaPorId);
router.delete('/lojas/:id', lojaController.excluirLoja);
router.delete('/lojas', lojaController.excluirTodasLojas);
router.post('/lojas', lojaController.criarLoja);
router.patch('/lojas/:id', lojaController.atualizarLoja);

//a rota fica 127.0.0.1:3000/api/lojas/...

export default router;
