import type { NextApiRequest, NextApiResponse } from 'next'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '@/middlewares/conectarMongoDB'
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { UsuarioModel } from '../../models/UsuarioModel'

const usuarioEndpoint =  async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {
    //return res.status(200).json('Usuario autenticado com sucesso')
    try {
        const { userId } = req?.query
        const usuario = await UsuarioModel.findById(userId)
        console.log("console.log chegou ate aqui",userId)
        usuario.senha = null
        return res.status(200).json(usuario)
    } catch (e) {
        console.log(e)
        return res.status(400).json({ erro: "Nao foi possivel opter dados do usuario" })
    }
}


export default validarTokenJWT(conectarMongoDB(usuarioEndpoint))
