import { FastifyInstance } from 'fastify'
import multipart from '@fastify/multipart'
import { PutObjectCommand} from '@aws-sdk/client-s3'
import { r2 } from '../lib/r2'

export async function imgUpload(app: FastifyInstance, ){
    app.register(multipart)

    app.post('/', async(request, reply) => {
        const file = await request.file() // faz um import flexivel de um file
        const fileBytes = await file?.toBuffer() // pega o bytes do nosso file
        const extension = file?.filename.split('.').pop() 
        // se o user mandar file.png o split separa em ["file", "png"] e o pop pega o ultimo item de um array, ent...
        const key = `workspaces/${crypto.randomUUID()}.${extension}`

        if(!file){
            return reply.status(400).send({error: "o arquivo nao eh valido ou nao foi lido corretamente"})
        }

        const r2Upload = new PutObjectCommand({
            Body: fileBytes,
            Key: key, 
            ContentType: file.mimetype,
            Bucket: `${process.env.R2_BUCKET_NAME}` 
            // o workspaces eh opcional, pq dps eu vou fzr um upload de img p perfil. Ent n quero bagunca no cloudFlare dps
        })

        await r2.send(r2Upload)
        const url = `${process.env.R2_PUBLIC_URL}/${key}`
        return reply.send({url})
    })
}
