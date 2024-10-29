import axios from "axios";
import { obterCoordenadasPorCEP } from "../utils/GeoCoding";

// Jest cria um mock da biblioteca axios, permitindo simular chamadas http
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>; // mockedAxios é uma versão simulada do axios

describe("obterCoordenadasPorCEP", () => {
  it("deve retornar coordenadas ao fornecer um CEP valido", async () => {
    // Simulação da resposta da API ViaCEP com dados completos
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        cep: "55014-490",
        logradouro: "Rua São Rafael",
        complemento: "",
        bairro: "Nova Caruaru",
        localidade: "Caruaru",
        uf: "PE",
        ibge: "2604106",
        gia: "",
        ddd: "81",
        siafi: "2381",
      },
    });

    // Simulação da resposta da API OpenCage com coordenadas de latitude e longitude
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        results: [
          {
            geometry: {
              lat: -8.2833,
              lng: -35.975,
            },
          },
        ],
      },
    });

    const coordenadas = await obterCoordenadasPorCEP("55014-490");
    expect(coordenadas).toEqual({ latitude: -8.2833, longitude: -35.975 });
  });

  it("deve lançar um erro se a API do ViaCEP retornar informações insuficientes", async () => {
    // falta o logradouro -> Retorna erro
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        cep: "55014-490",
        logradouro: "",
        complemento: "",
        bairro: "",
        localidade: "Caruaru",
        uf: "PE",
        ibge: "2604106",
        gia: "",
        ddd: "81",
        siafi: "2381",
      },
    });

    // Espera-se que a função lance um erro específico devido à falta de informações completas no retorno
    await expect(obterCoordenadasPorCEP("55014-490")).rejects.toThrow(
      "Não foi possível encontrar o endereço completo para o CEP informado."
    );
  });
});
