import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next"
import type {RespostaPadraoMsg} from "../../types/RespostaPadraoMsg"
import type {CadastroRequisicao} from "../../types/CadastroRequisicao"
import  {UsuarioModel} from "../../models/UsuarioModel"
import { conectarMongoDB } from "@/middlewares/conectarMongoDB"
import bcrypt from 'bcrypt'
import { upload, uploadImagemCosmic } from "@/services/uploadImagemCosmic"
import nc from "next-connect"

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
            await UsuarioModel.create(usuarioAserSalvo)
            return res.status(200).json({msg: "Usuário cadastrado com sucesso"})
        } catch (error) {
            console.log(error)
            return res.status(500).json({msg: "Usuário cadastrado com sucesso"})
        }
    }
)
export const config = {
    api:{
        bodyParser: false,
    }
}
export default conectarMongoDB(handler)
/*async(req: NextApiRequest, res:NextApiResponse<RespostaPadraoMsg>) => {
    if(req.method === "POST"){
        const usuario = req.body as CadastroRequisicao
        // transformar o req.body nos tipos fornecidos do cadastrorequisicao
        if(!usuario.nome|| usuario.nome.length < 2){
            // se nao informar o nome e se for menor que 2 caracteres nome invalido
            return res.status(400).json({erro: "Nome Invalido"})
        }
        if(!usuario.email || usuario.email.length < 5  
            // se nao informar o email e se for menor que 5 caracteres nome invalido
            || !usuario.email.includes("@") 
            || !usuario.email.includes(".")){
             return res.status(400).json({erro: "Email invalido"})            
        }
        if(!usuario.senha || usuario.senha.length < 4){
            return res.status(400).json({erro:"A senha informada invalida"})
            // se nao informar o senha e se for menor que 5 caracteres nome invalido
        }
        // validacao se ja existe usuario com o mesmo email
        const usuarioComMesmoEmail = await UsuarioModel.find({email : usuario.email})
        if(usuarioComMesmoEmail && usuarioComMesmoEmail.length > 0){
            return res.status(400).json({erro: "Ja existe uma conta com o email informado"})  
        }
     
        const keysenha = await bcrypt.hash(usuario.senha, 10)
        // salvar no banco de dados 
        const usuarioAserSalvo ={
            nome: usuario.nome,
            email: usuario.email,
            senha: keysenha,
            avatar: imagem?.media?.url
        }
        await UsuarioModel.create(usuarioAserSalvo)

        return res.status(200).json({msg:"Usuario criado com sucesso"})
    }
    return res.status(405).json({erro: "Metodo Informado nao e valido"})
}*/





