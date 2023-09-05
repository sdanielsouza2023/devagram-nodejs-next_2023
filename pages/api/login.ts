/**
 *  ausência da palavra-chave type antes de import indica que você está importando a função propriamente dita, não o tipo.
 */
//console.log("Teste Zero ")
import type { NextApiRequest, NextApiResponse } from 'next'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'
import { LoginResposta } from '@/types/loginResposta'
import { UsuarioModel } from '../../models/UsuarioModel'

const endpointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg | LoginResposta>
    /*
    NextApiRequest e NextApiResponse são importados do módulo 'next'. 
    Esses tipos são usados para definir os objetos de requisição e resposta esperados para sua rota de API.
    */
) => {



    //console.log(`${req} FIM`)
    //console.log(`${res} FIM RES`)




    const { MINHA_CHAVE_JWT } = process.env






    if (!MINHA_CHAVE_JWT) {
        return res.status(500).json({ erro: 'Env jwt nao informada' })
    }

    //console.log("test")

    //console.log(MINHA_CHAVE_JWT, "BOOAAA")
    if (req.method === 'POST') {
        const { email, senha } = req.body


        const usuarioEncontrados = await UsuarioModel.find({ email: email })
        //const usuarioComMesmoEmail = await UsuarioModel.find({email : usuario.email})
        if (usuarioEncontrados && usuarioEncontrados.length > 0) {
            const usuarioEncontrado = usuarioEncontrados[0]

            const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha)

            if (senhaCorreta) {
                const token = jwt.sign({ _id: usuarioEncontrado._id }, MINHA_CHAVE_JWT)

                return res.status(200).json({
                    nome: usuarioEncontrado.nome,
                    email: usuarioEncontrado.email,
                    token
                })
            } else {
                return res.status(400).json({ erro: 'Usuario ou senha não encontrados' })
            }

        }
    }



}

export default conectarMongoDB(endpointLogin)
//console.log("FIIIIM Teste")

    //console.log(usuarioEncontrados , '::::: usuario Encontrado')
    //console.log("testando segundo teste")




/**
 * Corpo da Requisição (HTTP Request Body): O corpo da requisição é uma parte da mensagem HTTP que contém os dados que você deseja enviar para o servidor. Esses dados podem estar em diferentes formatos, como JSON, texto simples ou binários, e são usados para transmitir informações específicas para a operação que você está realizando (por exemplo, envio de dados de formulário, criação de recursos, etc.).
 *
 */





    //console.log(usuarioEncontrado)




    // console.log("testando  terceiro teste")






/*códigos de status HTTP (como 200, 400, 405) é uma prática padrão em muitos frameworks web, incluindo o Next.js. Os códigos de status HTTP são usados para indicar o resultado de uma requisição HTTP, fornecendo informações sobre se a requisição foi bem-sucedida, teve algum erro ou se precisa ser tratada de uma maneira específica.*/

    //Se as credenciais não corresponderem, uma resposta de status 400 é enviada com uma mensagem de erro indicando que o usuário ou senha não foram encontrados.


/*
    O código de status HTTP "400 Bad Request" indica que o servidor não conseguiu entender ou processar a requisição do cliente, devido a um formato inválido ou conteúdo malformado na requisição. Esse código é usado quando os dados da requisição não estão de acordo com o que o servidor espera ou quando algo está errado com a requisição em si.
*/

    //return res.status(405).json({erro : 'Metodo informado não é valido'})
    //é usado para indicar que o método HTTP especificado na requisição não é permitido para o recurso solicitado