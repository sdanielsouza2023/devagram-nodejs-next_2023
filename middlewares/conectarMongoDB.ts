import type{ NextApiRequest, NextApiResponse, NextApiHandler} from "next";
import mongoose from "mongoose";
import type {RespostaPadraoMsg} from "../types/RespostaPadraoMsg";

export const conectarMongoDB = (handler : NextApiHandler) =>
    async(req:NextApiRequest, 
          res : NextApiResponse<RespostaPadraoMsg>) => {
        // verificar se o banco ja esta conectado, se estiver seguir 
        //para o endpoint ou proximo middleware
        if(mongoose.connections[0].readyState){
            return handler(req, res)
        }

        // Não esta conectado vamos conectar
        // Obter a variavel de ambiente preenchida do Env

        const{DB_CONEXAO_STRING} = process.env // aqui está pegando a strings
        // se a env estiver vazia aborta o uso do sistema e avisa o programador
        if(!DB_CONEXAO_STRING){
            return res.status(500).json({erro: 'ENV de configuração do banco, não informada'})
        }
        mongoose.connection.on('connected', () => console.log('Banco de dados conectado'))
        mongoose.connection.on('error', erro => console.log(`Ocorreu erro ao conectar no banco : ${erro}`))
        await mongoose.connect(DB_CONEXAO_STRING) // aqui que de fato está acontecendo a conexao ao banco de dados
        
        // agora posso seguir para o endpoint
        //no  banco

        return handler(req, res)
        ///Requisição do Cliente --> Middleware conectarMongoDB --> Manipulador (Handler) --> Resposta do Servidor

    }


