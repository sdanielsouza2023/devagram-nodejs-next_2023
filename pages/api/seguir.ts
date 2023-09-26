import type {NextApiRequest, NextApiResponse} from 'next'
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg' 
import { validarTokenJWT } from '@/middlewares/validarTokenJWT'
import { conectarMongoDB } from '@/middlewares/conectarMongoDB'
import { UsuarioModel } from '@/models/UsuarioModel'
import {SeguidorModel} from '@/models/SeguirdorModel'
import { politicaCORS } from '@/middlewares/politicaCORS'

console.log( "00000000000000000000000000000000000000"+ SeguidorModel)

const endpointSeguir =
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>)=>{
    try{
        if(req.method === 'PUT'){
            // como ele sabe q user e  de quem esta logadno e id e q quem quero seguir
            // req salva meus dados 
            const {userId, id} = req?.query
            console.log("ID de quem esta logado: " + userId)
            console.log("ID de quem vai ser seguido: " + id)
            console.log("Console.log chegou ate aqui " + id)
            const usuarioLogado = await UsuarioModel.findById(userId)  
            console.log("Console.log chegou ate aqui " + id)
            console.log("console.log chegou ate aqui usuario logado "  +  userId)
            if(!usuarioLogado){
                return res.status(400).json({erro:"Usuário Logado não encontrado" })
            }
            console.log("Console.log chegou ate aqui, usuario logado " + usuarioLogado)
            const usuarioASerSeguido = await UsuarioModel.findById(id)
            console.log("console.log chegou ate aqui usuario a ser seguido " + usuarioASerSeguido)
            if(!usuarioASerSeguido){
                return res.status(400).json({erro: "Usuário a ser seguido não encontrado"})
            }

            console.log("---------------------------------------------------------------- BUG MISERÁVEL")
            // usuario logado e q quem esta usando a conta no momento no caso eu 
            // usuario A Ser Seguido e a pessoa na qual eu quero seguir, passando o id dela 
            // acredito q esses dados como id da pessoa q quero seguir e o meu ainda nao esta sendo salvo no banco entao esta retornando vazio 
            // acredito eu q seja isso!!!
            const euJaSigoEsseUsuario = await SeguidorModel
                .find({usuarioId: usuarioLogado._id , usuarioSeguidoId : usuarioASerSeguido._id})
                console.log({usuarioId: usuarioLogado._id , usuarioSeguidoId : usuarioASerSeguido._id})
            console.log("o BUG ESTA AQUI ENCONTREI O DANADO")
            console.log(euJaSigoEsseUsuario)
            console.log("euJaSigoEsseUsuario" + euJaSigoEsseUsuario)
            console.log("por esta retornando vazio !!!!" + euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0)
            if(euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0){
                euJaSigoEsseUsuario.forEach(async(e: any) => await SeguidorModel.findByIdAndDelete({_id: e._id}))
                usuarioLogado.seguindo--
                await UsuarioModel.findByIdAndUpdate({_id :usuarioLogado._id}, usuarioLogado)
                usuarioASerSeguido.seguidores--
                await UsuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id},usuarioASerSeguido )
                return res.status(200).json({msg : "Deixou de seguir o usuario com sucesso"})
            }else{
                const seguidor = {
                    usuarioId : usuarioLogado._id, // passando o id do usuario logado
                    usuarioSeguidoId :  usuarioASerSeguido._id // passando o idadedo usuario que quero seguir
                }
                await SeguidorModel.create(seguidor)

                usuarioLogado.seguindo++
                await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado)
                usuarioASerSeguido.seguidores++
                await UsuarioModel.findByIdAndUpdate({_id: usuarioASerSeguido._id}, usuarioASerSeguido)

                // estou passando meu id aqui para que no campo seguindo seja contado mais +1 toda vez que eu sigo uma pessoa?
                // para que ele saiba onde tem que se contado 
                
                return res.status(200).json({msg : 'Usuario seguido com sucesso'})
            }
        }   
        return res.status(405).json({erro: 'Metodo informado nao existe'})
    }catch(e){
        console.log(e)
        return res.status(500).json({ erro: "Não foi possível seguir/desseguir o usuário informado" });
    }
}
export default politicaCORS(validarTokenJWT(conectarMongoDB(endpointSeguir)) ) 

// por que precisa validar o token????