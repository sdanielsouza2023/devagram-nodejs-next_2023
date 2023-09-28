import type { NextApiRequest, NextApiResponse } from 'next'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '@/middlewares/conectarMongoDB'
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { UsuarioModel } from '../../models/UsuarioModel'
import {upload, uploadImagemCosmic , deleteImageCosmic } from '../../services/uploadImagemCosmic'
import nc from 'next-connect'
import { politicaCORS } from '@/middlewares/politicaCORS'
const axios = require('axios');

const handler = nc()
.use(upload.single('file'))
.put(async(req: any, res: NextApiResponse<RespostaPadraoMsg>) =>{
    try{
        const {userId} = req?.query
        const usuario =  await UsuarioModel.findById(userId)
        console.log("Console chegou ate aqui ", usuario)

        if(!usuario){
            return res.status(400).json({erro: "Usuario nao encontrado"})
        }
        const {nome} = req.body
        if(nome && nome.length > 2){
           usuario.nome = nome
           // na propriedade nome mude o nome
        }
        await deleteImageCosmic(usuario.avatar)
        const {file} = req
         if(file && file.originalname){
            const imagem = await uploadImagemCosmic(req)
            if(imagem && imagem.media &&  imagem.media.url){   
                 usuario.avatar = imagem.media.url
            }
         }
         await UsuarioModel.findByIdAndUpdate({_id : usuario._id}, usuario)

         res.status(200).json({msg: "Dados atulalizados com sucesso"})
    }catch(e){
        return res.status(500).json({erro:"Erro ao atualizar os dados"})
    }
})
.get(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {
    //return res.status(200).json('Usuario autenticado com sucesso')
    try {
        const { userId } = req?.query
        const usuario = await UsuarioModel.findById(userId)
        usuario.senha = null
        return res.status(200).json(usuario)
    } catch (e) {
        console.log(e) 
    }
})

export const config = {
    api: {
        bodyParser: false
    }
}
export default politicaCORS(validarTokenJWT(conectarMongoDB(handler))) 
