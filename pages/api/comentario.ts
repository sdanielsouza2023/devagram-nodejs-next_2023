import type {NextApiRequest, NextApiResponse} from 'next'
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg'
import { validarTokenJWT } from '@/middlewares/validarTokenJWT'
import { conectarMongoDB } from '@/middlewares/conectarMongoDB'
import { UsuarioModel } from '@/models/UsuarioModel'
import usuario from './usuario'
import { PublicacaoModel } from '@/models/PublicacaoModel'
import { politicaCORS } from '@/middlewares/politicaCORS'

const comentarioEndpoint = async (
    req: NextApiRequest, 
    res:NextApiResponse<RespostaPadraoMsg>) =>{
    try{
        if(req.method === 'PUT'){
            const {userId, id} = req.query
            const usuarioLogado = await UsuarioModel.findById(userId)

            if(!usuarioLogado){
                return res.status(400).json({erro: 'Usuario nao encontrado'})
            }

            const publicacao = await PublicacaoModel.findById(id)
            if(!publicacao){
                return res.status(400).json({erro: 'Publicacao nao encontrada'})
            }

            if(!req.body || !req.body.comentario || req.body.comentario.length < 2){
              return res.status(400).json({erro: 'Comentario nao e valido'})
            }
            const comentario = { 
                usuarioId :  usuarioLogado._id,
                nome : usuarioLogado.nome,
                comentario: req.body.comentario
            } 

            publicacao.comentarios.push(comentario)
            await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id},publicacao)
            return res.status(200).json({msg : 'Comentario Adcionando com sucesso'})

             
            //quais dados sao necessario para realizar a operacao???
            //onde ele estarao??? 
            // id do usuario - vem do query 
            // id da publicao vem de onde??
            // comentario - vem do body
        }
        // qual metodo http vamos utilizar ??
        // quais dados sao necessarios para
        return res.status(405).json({erro: 'Metodo informado nao e valido'})
    }catch(e){
        console.log(e)
        return res.status(500).json({erro: 'Ocorreu erro ao adicionar comentario'})
    }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(comentarioEndpoint))) 