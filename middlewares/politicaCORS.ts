import type { NextApiRequest,NextApiResponse,NextApiHandler } from "next";
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMsg'
import NextCors from "nextjs-cors";

export const politicaCORS = async (hander:  NextApiHandler) =>{
    async (req:NextApiRequest, res:NextApiResponse) => {
        try{
            await NextCors(req, res,{  
                origin: '#',
                methods : ['GET','POST','PUT'],
                optionsSucessStatus : 200,
            })
            return hander(req, res)
        }catch(e){
            console.log('Erro ao tratar a politica de Cors', e)
            res.status(500).json({erro: 'Ocorreu erro ao tratar a politica de CORS'})
        }
    }
}