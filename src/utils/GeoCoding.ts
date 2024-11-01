import axios, { AxiosResponse } from "axios";
import logger from "./logger";
import AppError from "./AppError";
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

async function buscarEnderecoViaCep(cep: string): Promise<ViaCepResponse> {
  const { data }: AxiosResponse<ViaCepResponse> = await axios.get(
    `https://viacep.com.br/ws/${cep}/json/`
  );

  if (!data.logradouro || !data.localidade || !data.uf) {
    logger.warn(`Informações insuficientes retornadas para o CEP: ${cep}`);
    throw new AppError(
      "Não foi possível encontrar o endereço completo para o CEP informado.",
      400
    );
  }

  return data;
}

async function buscarCoordenadas(endereco: string): Promise<GeocodingResponse> {
  const { data }: AxiosResponse<GeocodingResponse> = await axios.get(
    "https://api.opencagedata.com/geocode/v1/json",
    {
      params: {
        q: endereco,
        key: API_KEY,
        countrycode: "br",
        limit: 1,
      },
    }
  );

  return data;
}
export async function obterCoordenadasPorCEP(
  cep: string
): Promise<Coordenadas> {
  try {
    const dados = await buscarEnderecoViaCep(cep);
    const enderecoCompleto = `${dados.logradouro}, ${dados.bairro}, ${dados.localidade}, ${dados.uf}, Brasil`;

    logger.info(`Buscando coordenadas para o endereço: ${enderecoCompleto}`);
    let response = await buscarCoordenadas(enderecoCompleto);

    if (response.results.length === 0) {
      const enderecoSimplificado = `${dados.bairro}, ${dados.localidade}, ${dados.uf}, Brasil`;
      logger.warn(
        `Nenhuma coordenada exata encontrada, tentando busca com cidade e bairro: ${enderecoSimplificado}`
      );

      response = await buscarCoordenadas(enderecoSimplificado);

      if (response.results.length === 0) {
        logger.error(
          `Nenhuma coordenada encontrada para o endereço simplificado: ${enderecoSimplificado}`
        );
        throw new AppError(
          "Nenhuma coordenada encontrada para o endereço informado.",
          404
        );
      }
    }

    const { lat, lng } = response.results[0].geometry;
    return { latitude: lat, longitude: lng };
  } catch (error: any) {
    if (error instanceof AppError) throw error;

    logger.error(
      `Erro ao obter coordenadas para o CEP: ${cep} - ${error.message}`
    );
    throw new AppError(
      "Falha ao obter coordenadas. Por favor, tente novamente.",
      500
    );
  }
}
