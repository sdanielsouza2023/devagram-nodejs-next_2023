import type { NextApiResponse, NextApiRequest } from 'next'
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { conectarMongoDB } from '@/middlewares/conectarMongoDB'
import { validarTokenJWT } from '@/middlewares/validarTokenJWT'
import { UsuarioModel } from '@/models/UsuarioModel'
import { politicaCORS } from '@/middlewares/politicaCORS'

const pesquisaEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any[]>) => {
    try {
        if (req.method === 'GET') {
            if (req?.query?.id) {
                const usuariosEncontrado = await UsuarioModel.findById(req?.query?.id)
                if(!usuariosEncontrado){
                    return res.status(400).json({erro: 'Usuario nao encontrado'})
                }
                usuariosEncontrado.senha = null
                return res.status(200).json(usuariosEncontrado)
            } else {
                const { filtro } = req.query
                if (!filtro || filtro.length < 2) {
                    return res.status(400).json({ erro: " Por favor informar pelo menos 2 caracteres" })
                }
                
                const usuariosEncontrado = await UsuarioModel.find({
                    $or: [{ nome: { $regex: filtro, $options: 'i' } },
                    { email: { $regex: filtro, $options: 'i' } }]
                })
                return res.status(200).json(usuariosEncontrado)
            }
        }
        return res.status(405).json({ erro: 'Metodo informado nao e valido' })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ erro: 'Nao foi possivel buscar usuario' + e })
    }
}

export default politicaCORS( validarTokenJWT(conectarMongoDB(pesquisaEndpoint)) )