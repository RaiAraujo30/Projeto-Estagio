import express from 'express';
import * as storeController from '../controllers/storeController';

const router = express.Router();

/**
 * @swagger
 * /api/lojas/buscar/{cep}:
 *   get:
 *     summary: Busca lojas próximas a um CEP em um raio de 100km
 *     parameters:
 *       - in: path
 *         name: cep
 *         required: true
 *         schema:
 *           type: string
 *         description: O CEP para buscar as lojas próximas
 *     responses:
 *       200:
 *         description: Lista de lojas próximas ao CEP
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nenhuma loja encontrada para o CEP fornecido
 */
router.get('/lojas/buscar/:cep', storeController.findStoresByCEP);

/**
 * @swagger
 * /api/lojas:
 *   get:
 *     summary: Lista todas as lojas
 *     responses:
 *       200:
 *         description: Lista de todas as lojas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/lojas', storeController.listStores);

/**
 * @swagger
 * /api/lojas/{id}:
 *   get:
 *     summary: Busca uma loja pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Indique o ID da loja
 *     responses:
 *       200:
 *         description: Dados da loja encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Loja não encontrada
 */
router.get('/lojas/:id', storeController.getStoreById);

/**
 * @swagger
 * /api/lojas/{id}:
 *   delete:
 *     summary: Exclui uma loja pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID da loja
 *     responses:
 *       200:
 *         description: Loja excluída com sucesso
 *       404:
 *         description: Loja não encontrada
 */
router.delete('/lojas/:id', storeController.deleteStore);

/**
 * @swagger
 * /api/lojas:
 *   delete:
 *     summary: Exclui todas as lojas
 *     responses:
 *       200:
 *         description: Todas as lojas foram excluídas
 */
router.delete('/lojas', storeController.deleteAllStores);

/**
 * @swagger
 * /api/lojas:
 *   post:
 *     summary: Cria uma nova loja
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome da loja
 *               rua:
 *                 type: string
 *                 description: Nome da rua onde a loja está localizada
 *               numero:
 *                 type: string
 *                 description: Número do endereço da loja
 *               bairro:
 *                 type: string
 *                 description: Bairro onde a loja está localizada
 *               cidade:
 *                 type: string
 *                 description: Cidade onde a loja está localizada
 *               estado:
 *                 type: string
 *                 description: Estado onde a loja está localizada
 *               cep:
 *                 type: string
 *                 description: Código postal (CEP) da loja
 *               latitude:
 *                 type: number
 *                 format: float
 *                 description: Latitude da localização da loja
 *               longitude:
 *                 type: number
 *                 format: float
 *                 description: Longitude da localização da loja
 *     responses:
 *       201:
 *         description: Loja criada com sucesso
 *       400:
 *         description: Erro de validação dos dados
 */
router.post('/lojas', storeController.createStore);

/**
 * @swagger
 * /api/lojas/{id}:
 *   patch:
 *     summary: Atualiza os dados de uma loja pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID da loja
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               
 *     responses:
 *       200:
 *         description: Loja atualizada com sucesso
 *       404:
 *         description: Loja não encontrada
 */
router.patch('/lojas/:id', storeController.updateStore);

export default router;
