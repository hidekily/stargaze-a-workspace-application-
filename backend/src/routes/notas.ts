import {z} from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from 'shared/db'
import { auth } from 'shared/auth'
import  {notas} from "shared/db/schema"
import { eq } from 'drizzle-orm'


export function notasApi(app: FastifyInstance){
    app.post("/", async(request, reply) => {
        const id = crypto.randomUUID()
        const date = new Date()

        const schema = z.object({
            name: z.string().min(2),
            content: z.string().min(1),
        })

        const session = await auth.api.getSession({
            headers: request.headers
        })

        if(!session){
            return reply.status(400).send({error: "erro ao validar a session"})
        }

        const response = await schema.safeParse(request.body)

        if(!response.success){
            return reply.status(400).send({error: "erro ao validar a data"})
        }

        const {name, content} = response.data

        const [newNota] = await db.insert(notas).values({
            id: id,
            name: name, 
            content: content,
            userId: session.user.id,
            createdAt: date
        }).returning()

        return reply.status(201).send({data: newNota})
    })

    app.get("/", async(request, reply) => {
        const session = await auth.api.getSession({
            headers: request.headers
        })

        if(!session){
            return reply.send({error:"erro ao validar session"})
        }

        const getNotas = await db.select()
        .from(notas)
        .where(eq(notas.userId, session.user.id))

        return reply.send(getNotas)
    })

    app.patch('/:id', async(request, reply) =>{
        const {id} = request.params as {id: string}

        const schema = z.object({
            content: z.string().min(1)
        })

        const response = schema.safeParse(request.body)

        if(!response.success){
            return reply.status(400).send({error:"erro ao validar o conteudo"})
        }

        const {content} = response.data

        const updateNota = await db
        .update(notas)
        .set({content})
        .where(eq(notas.id, String(id)))
        .returning()

        return reply.send(updateNota)
    })
}