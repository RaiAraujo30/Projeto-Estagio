import express from 'express';
import * as lojaController from '../controllers/lojaController';

const router = express.Router();



// Rotas do CRUD
router.get('/lojas', lojaController.listarLojas);
router.get('/lojas/:id', lojaController.buscarLojaPorId);
router.delete('/lojas/:id', lojaController.excluirLoja);
router.delete('/lojas', lojaController.excluirTodasLojas);
router.post('/lojas', lojaController.criarLoja);
router.put('/lojas/:id', lojaController.atualizarLoja);

//a rota fica .../api/lojas/

export default router;
