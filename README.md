<p align="center"> <img src="https://img.shields.io/badge/made%20with-typescript-blue" alt="Made with TypeScript"> </p>

# Projeto Estágio - Sistema de Busca de Lojas por CEP

## Descrição do Projeto

Este projeto é um sistema que permite buscar lojas físicas a partir de um CEP fornecido pelo usuário. O sistema utiliza uma API para obter coordenadas geográficas do CEP e, em seguida, calcula a distância até as lojas cadastradas no banco de dados. O objetivo é facilitar a localização de lojas próximas.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript.
- **Express**: Framework para construção de APIs.
- **MongoDB**: Banco de dados NoSQL utilizado para armazenar informações sobre as lojas.
- **Mongoose**: Biblioteca para modelagem de dados em MongoDB.
- **Axios**: Biblioteca para realizar requisições HTTP.
- **Winston**: Biblioteca para logging.

## Estrutura do Projeto

```plaintext
├── src
│   ├── controllers
│   │   └── lojaController.ts  # Controlador para operações de lojas
│   ├── models
│   │   └── loja.ts             # Modelo de dados para lojas
│   ├── routes
│   │   └── index.ts            # Definição de rotas da API
│   ├── services
│   │   ├── geoCodingService.ts  # Serviço para obter coordenadas a partir do CEP
│   │   └── lojaService.ts       # Serviço para manipulação de lojas
│   ├── db
│   │   └── database.ts          # Conexão com o banco de dados
│   ├── utils
│   │   └── AppError.ts          # Classe para manipulação de erros
│   ├── app.ts                   # Arquivo principal do aplicativo
│   └── loggerService.ts         # Serviço de logging
└── package.json                  # Dependências do projeto
```

## Funcionalidades

- **Buscar Lojas por CEP**: O usuário pode buscar lojas próximas a um CEP informado. O sistema verifica se o CEP é válido e retorna as lojas que estão a até 100 km de distância.
- **CRUD Completo**: Adicionar, Listar, Atualizar e Excluir Lojas. Operações completas de CRUD para gerenciar os dados das lojas.
- **Cálculo de Geolocalização**: Utiliza a fórmula de Haversine para calcular a distância entre a localização do usuário e cada loja.

## Como Executar o Projeto

1. Clone o repositório:

   ```bash
   git clone https://github.com/RaiAraujo30/Projeto-Estagio.git
   cd Projeto-Estagio
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

   ```env
   MONGO_URI=<sua_uri_do_mongodb>
   PORT=3000
   ```

4. Inicie o servidor:

   ```bash
   npm start
   ```

## Exemplo de Uso

Abaixo está um exemplo de como buscar lojas a partir de um CEP:

```typescript
import { buscarLojasPorCEP } from './controllers/lojaController';

const cep = '01001-000';
buscarLojasPorCEP(cep);
```

## Contribuição

Sinta-se à vontade para contribuir com o projeto. Para isso, siga as etapas abaixo:

1. Faça um fork deste repositório.
2. Crie uma nova branch (`git checkout -b feature/MinhaFeature`).
3. Realize suas alterações e faça um commit (`git commit -m 'Adicionando nova feature'`).
4. Envie para o repositório remoto (`git push origin feature/MinhaFeature`).
5. Abra um Pull Request.


## Contato

Para mais informações, você pode entrar em contato através do e-mail: rai.araujo.pb@compasso.com.br


