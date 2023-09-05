import type { NextApiRequest } from 'next'
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import nc from 'next-connect'
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB' // conectar no banco
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { error } from 'console'
const handler = nc()
    .use(upload.single('file'))
    .post(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
        try {
            if(!req || !req.body){
                return res.status(400).json({erro: 'Parametros de entrada nao informados'})
            }
            const { descricao, file } = req?.body
            if (!descricao || descricao.length < 2) {
                return res.status(400).json({ erro: 'Descricao nao e valida' })
            }
            if (!req.file) {
                return res.status(400).json({ erro: 'imagem e obrigatoria' })
            }
            return res.status(200).json({ msg: 'Publicacao esta valida' })
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
