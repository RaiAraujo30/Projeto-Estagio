import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express'; 
const options = {
  definition: {
    openapi: '3.0.0',  
    info: {
      title: 'Documentação',
      version: '1.0.0',
      description: 'Esta documentação da API permite explorar e testar endpoints do projeto, que oferece funcionalidades para encontrar lojas próximas a um CEP específico.',
    },
  },
  apis: ['./src/routes/*.ts'], 
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Application): void { 
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
