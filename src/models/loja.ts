import mongoose, { Document, Schema, Model } from 'mongoose';
import { salvarCoordenadasMiddleware } from '../middlewares/lojaMiddleware';

// Validar o cep com 8 digitos
const validarCEP = (cep: string): boolean => {
    const cepLimpo = cep.replace(/\D/g, "");
    return /^[0-9]{8}$/.test(cepLimpo);
};

// Interface para definir os atributos da Loja
export interface ILoja extends Document {
    nome: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    latitude: number;
    longitude: number;
    __v?: number;   
}

const LojaSchema: Schema = new Schema({
    nome: {
        type: String,
        required: true,
    },
    rua: {
        type: String,
        required: true,
    },
    numero: {
        type: String,
        required: true,
    },
    bairro: {
        type: String,
        required: true,
    },
    cidade: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        required: true,
    },
    cep: {
        type: String,
        required: true,
        validate: {
            validator: validarCEP,
            message: 'CEP inválido. Deve conter 8 dígitos numéricos.',
        },
    },
    latitude: {
        type: Number,
        
    },
    longitude: {
        type: Number,
        
    },
});

LojaSchema.pre('save', salvarCoordenadasMiddleware);

export const Loja: Model<ILoja> = mongoose.model<ILoja>('Loja', LojaSchema);


