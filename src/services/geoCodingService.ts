import axios from "axios";
import logger from "./loggerService";
import AppError from "../utils/AppError";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.OPENCAGE_API_KEY;

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

interface GeocodingResponse {
  results: {
    geometry: {
      lat: number;
      lng: number;
    };
  }[];
}

interface Coordenadas {
  latitude: number;
  longitude: number;
}

export async function obterCoordenadasPorCEP(
  cep: string
): Promise<Coordenadas> {
  try {
    const respostaViaCEP = await axios.get<ViaCepResponse>(
      `https://viacep.com.br/ws/${cep}/json/`
    );
    const dados = respostaViaCEP.data;

    // EXEMPLO: 
    // cep: '55014-490',
    // logradouro: 'Rua São Rafael',
    // complemento: '',
    // unidade: '',
    // bairro: 'Nova Caruaru',
    // localidade: 'Caruaru',
    // uf: 'PE',
    // estado: 'Pernambuco',
    // regiao: 'Nordeste',
    // ibge: '2604106',
    // gia: '',
    // ddd: '81',
    // siafi: '2381'

    if (!dados.ibge) {
      logger.warn(`CEP informado não contém o código IBGE: ${cep}`);
      throw new AppError(
        "O CEP informado não contém o código IBGE. Verifique se o CEP é válido.",
        400
      );
    }

    const endereco = `${dados.logradouro}, ${dados.bairro}, ${dados.localidade} - ${dados.uf} CEP: ${dados.cep}`;
    logger.info(`Buscando lojas próximas ao endereço: ${endereco}`);

    const response = await axios.get<GeocodingResponse>(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          q: dados.ibge, // q = query
          key: API_KEY,
          countrycode: "br",
          limit: 1, // Limitar a 1 resultado
        },
      }
    );

    if (response.data.results.length === 0) {
      logger.error(`Nenhuma coordenada encontrada para o CEP: ${cep}`);
      throw new AppError(
        "Nenhuma coordenada encontrada para o CEP informado.",
        404
      );
    }

    const { lat, lng } = response.data.results[0].geometry;
    return { latitude: lat, longitude: lng };
  } catch (error: any) {
    
    if (error instanceof AppError) {
      throw error; 
    }

    throw new AppError(
      "Falha ao obter coordenadas. Por favor, tente novamente mais tarde.",
      500
    );
  }
}