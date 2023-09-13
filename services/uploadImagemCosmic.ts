import { createBucketClient } from "@cosmicjs/sdk"
import multer from "multer"
const {
    BUCKET_SLUG,
    READ_KEY,
    WRITE_KEY,
} = process.env
const bucketDevagram = createBucketClient({
    bucketSlug: BUCKET_SLUG as string,
    readKey: READ_KEY as string,
    writeKey: WRITE_KEY as string,
})
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const uploadImagemCosmic = async (req: any) => {
    if (req?.file?.originalname) {
        if (!req.file.originalname.includes(".png") &&
            !req.file.originalname.includes(".jpg") &&
            !req.file.originalname.includes(".jpeg")
        ) {
            throw new Error("Extensao da imagem invalida")
        }
        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer,
        }
        if (req.url && req.url.includes("publicacao")) {
            return await bucketDevagram.media.insertOne({
                media: media_object,
                folder: "publicacao",
            })
        } else if (req.url && (req.url.includes("usuario") || req.url.includes("cadastro"))) {
            return await bucketDevagram.media.insertOne({
                media: media_object,
                folder: "avatar",
            })
        }
    }


}
const deleteImageCosmic = async (url: string) => {

    const photos = await bucketDevagram.media.find({
      folder: "avatar"
    }).props(['id', 'url']);
  
    // Buscando as imagens da pasta avatar e recebendo apenas os id e url de cada imagem.
    //Isso retorna uma JSON com uma propriedade media que contém um array com as informações das fotos em formato de JSON
  
  
    let idPhoto = "" // Declara uma variável para guardar o id
  
    photos?.media?.map((photo : any) => { // .map percorre todo o array media e a cada elemento dentro desse array chamamos temporariamente de photo
  
      if(photo.url === url){ // Caso a url da photo seja igual a url que está armazenada no usuario.avatar que recebemos como parametro então a variável pra guardar o id recebe o id desse elemento
  
        idPhoto = photo.id;
      }
    });
  
    if(idPhoto !== ""){ // Caso a variável idPhoto seja diferente de aspas vazias significa que existe um ID dentro dessa variaável e então podemos usar o deleteOne passando esse ID
  
      await bucketDevagram.media.deleteOne(idPhoto);
    }
  }

export { upload, deleteImageCosmic, uploadImagemCosmic }