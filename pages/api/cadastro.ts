import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next"
import type {RespostaPadraoMsg} from "../../types/RespostaPadraoMsg"
import type {CadastroRequisicao} from "../../types/CadastroRequisicao"
import  {UsuarioModel} from "../../models/UsuarioModel"
import { conectarMongoDB } from "@/middlewares/conectarMongoDB"
import bcrypt from 'bcrypt'
import { upload, uploadImagemCosmic } from "@/services/uploadImagemCosmic"
import nc from "next-connect"
import { politicaCORS } from "@/middlewares/politicaCORS"

const handler = nc()
.use(upload.single("file"))   
.post(
    async (req:NextApiRequest, res:NextApiResponse<RespostaPadraoMsg>) =>{
        try {
            const usuario = req.body as CadastroRequisicao

            if(!usuario.nome || usuario.nome.length < 2){
                return res.status(400).json({erro:"Nome inválido"})
            }
            if(
                !usuario.email || 
                usuario.email.length < 5 || 
                !usuario.email.includes("@")|| 
                !usuario.email.includes(".")){
                    return res.status(400).json({erro:  "Email inválido"})
            }
            if(!usuario.senha || usuario.senha.length < 4){
                return res.status(400).json({erro: "Senha invalida"})
            }
            
            const usuarioComMesmoEmail = await UsuarioModel.find({
                email : usuario.email
            })
            if(usuarioComMesmoEmail && usuarioComMesmoEmail.length > 0){
                return res.status(400).json({erro: "Ja existe uma conta com o email informado"})
            }
            const imagem = await uploadImagemCosmic(req)
            const  keysenha = await bcrypt.hash(usuario.senha, 10)

            const usuarioAserSalvo = {
                nome: usuario.nome,
                email: usuario.email,
                senha: keysenha,
                avatar: imagem?.media?.url
                
            }
            console.log(usuarioAserSalvo.avatar)
            await UsuarioModel.create(usuarioAserSalvo)
            return res.status(200).json({msg: "Usuário cadastrado com sucesso"})
        } catch (error) {
            console.log(error)
            return res.status(500).json({msg: "Erro desconhecido"})
        }
    }
)
export const config = {
    api:{
        bodyParser: false,
    }
}
export default politicaCORS(conectarMongoDB(handler))



