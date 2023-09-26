import type { NextApiRequest,NextApiResponse,NextApiHandler } from "next";
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMsg'
import NextCors from "nextjs-cors";

export const politicaCORS =  (handler:  NextApiHandler) => async (req:NextApiRequest, res:NextApiResponse) => {
        try{
            await NextCors(req, res,{  
                origin: '*',
                methods : ['GET','POST','PUT'],
                optionsSuccessStatus : 200,   
            })
            return handler(req, res)
        }catch(e){
            console.log('Erro ao tratar a politica de Cors', e)
            return res.status(500).json({erro: 'Ocorreu erro ao tratar a politica de CORS'})
        }
    }
