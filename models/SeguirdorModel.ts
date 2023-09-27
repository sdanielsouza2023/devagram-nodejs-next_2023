import mongoose, {Schema} from "mongoose";

const SeguidorSchema = new Schema({
        // quem segue
        usuarioId : {type :  String, required: true},
        // quem esta sendo seguido
        usuarioSeguidoId : {type : String, required: true},
    })


<<<<<<< HEAD:models/seguirdorModel.ts
export const SeguidorModel = (mongoose.models.seguidores || mongoose.model("seguidores", SeguidorSchema))
=======
export const SeguidorModel = mongoose.models.seguidores || mongoose.model("seguidores", SeguidorSchema)
>>>>>>> 41eadfa710ab939379a3c67f5c96525a8436f845:models/SeguirdorModel.ts
