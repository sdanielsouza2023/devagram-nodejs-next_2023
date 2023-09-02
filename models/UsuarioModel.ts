import mongoose, {Schema} from "mongoose"
const UsuarioSchema = new Schema( 
    {
        nome: {type:String , required : true},
        email:{type: String, required : true },
        senha: {type: String, required : true},
        avatar: {type : String, required: false},
        seguidores: {type : Number, default: 0},
        seguindo : {type : Number, default:0},
        publicacoes:  {type: Number, default:0},
    })

export const UsuarioModel = (mongoose.models.usuarios || 
    //models: Nesse contexto, models se refere ao objeto onde o Mongoose mantém um registro de todos os modelos que foram definidos. O trecho mongoose.models.usuarios verifica se um modelo chamado "usuarios" já existe
    mongoose.model("usuarios", UsuarioSchema))
   // model: Aqui, model (singular) é uma função fornecida pelo Mongoose para criar um novo modelo com base em um esquema definido.



