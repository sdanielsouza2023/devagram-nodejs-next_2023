import type { NextApiResponse } from 'next'
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import nc from 'next-connect'
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB' // conectar no banco
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { PublicacaoModel } from '@/models/PublicacaoModel'
import { UsuarioModel } from '@/models/UsuarioModel'

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
        try {
            //  nosso usuario esta no req.query
            const {userId} = req.query
            const usuario = await UsuarioModel.findById(userId)

            if(!usuario){
                return res.status(400).json({erro:'Usuario nao encontrado'})
            }
            if(!req || !req.body){
                return res.status(400).json({erro: 'Parametros de entrada nao informados'})
            }
            const { descricao, file } = req?.body
            if (!descricao || descricao.length < 2) {
                return res.status(400).json({ erro: 'Descricao nao e valida' })
            }
            if (!req.file || !req.file.originalname) {
                return res.status(400).json({ erro: 'imagem e obrigatoria' })
            }
            const imagem = await uploadImagemCosmic(req)
            const publicacao = {
                idUsuario : usuario._id,
                descricao,
                foto: imagem.media.url,
                data: new Date()
            }

            await PublicacaoModel.create(publicacao)
            return res.status(200).json({ msg: 'Publicacao criada com sucesso' })
        } catch (error) {
            return res.status(400).json({ erro: 'Erro ao cadastrar publicacao' })
        }

    })
/*Conectar no banco de dados*/
/*tem q esta logado*/
export const config = {
    api: {
        bodyParser: false
    }
}
export default validarTokenJWT(conectarMongoDB(handler))
