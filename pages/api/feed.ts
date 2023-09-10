import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
import { PublicacaoModel } from "@/models/PublicacaoModel";

const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any > ) => {
    try{
        if (req.method === 'GET'){
            if(req?.query?.id) {
                console.log("Console chegou aqui",req?.query?.id)
                const usuario = await UsuarioModel.findById(req?.query?.id)
                if (!usuario) {
                    return res.status(400).json({ erro: "Usuario nao encontrado" })
                }
                const publicacoes = await PublicacaoModel
                    .find({ idUsuario: usuario._id })
                    .sort({ data: -1 })
                return res.status(200).json(publicacoes)
            }
        }
        return res.status(405).json({ erro: "Metodo informado nao e valido" })
    }catch(e){
        console.log(e)
    }
   return res.status(400).json({ erro: "Nao fui possivel obter o feed" })
}
export default validarTokenJWT(conectarMongoDB(feedEndpoint))

