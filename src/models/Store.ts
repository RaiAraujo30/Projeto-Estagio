import mongoose, { Document, Schema, Model } from 'mongoose';
import { saveCoordinatesMiddleware } from '../middlewares/storeMiddleware';

// Validar o cep com 8 digitos
const validateZipCode = (cep: string): boolean => {
    const cleanZipCode  = cep.replace(/\D/g, "");
    return /^[0-9]{8}$/.test(cleanZipCode);
};

// Interface para definir os atributos da Loja
export interface IStore extends Document {
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

const StoreSchema: Schema = new Schema({
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
            validator: validateZipCode,
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

StoreSchema.pre('save', saveCoordinatesMiddleware);

export const Store: Model<IStore> = mongoose.model<IStore>('Store', StoreSchema);


