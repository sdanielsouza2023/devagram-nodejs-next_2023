import mongoose, {Schema, mongo} from "mongoose";

const PublicacaoSchema = new Schema({
    idUsuario :  {type: String, required : true},
    descricao : {type: String, required: true},
    foto : {type: String, required: true},
    data : {type: Date, required : true},

    comentarios : {type : Array, required :  true, default: []},
    likes : {type : Array, required: true , default: []},

})
export const PublicacaoModel = mongoose.models.publicacaoes ||
 mongoose.model('publicacaoes', PublicacaoSchema);
 console.log(PublicacaoModel , PublicacaoSchema)
/*export const PublicacaoModel = (mongoose.models.publicacoes || 
    mongoose.model('publicacaoes' , PublicacaoSchema))*/

