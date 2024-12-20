import express, { Application } from "express";
import dotenv from "dotenv";
import routes from "./routes";
import connectDB from "./db/database";
import logger from "./utils/logger";
import errorController from "./middlewares/errorController"; 
import { setupSwagger } from "./config/swaggerConfig";

//Carrega variáveis do .env
dotenv.config();

connectDB();

const app: Application = express();
const port: string | number = process.env.PORT || 3000;

setupSwagger(app);
// Middleware para parsing de JSON
app.use(express.json());

app.use("/api", routes);

app.use(errorController);

app.listen(port, () => {
  logger.info(`Servidor rodando na porta ${port}`);
});

export default app;
