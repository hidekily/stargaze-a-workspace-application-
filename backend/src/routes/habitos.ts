import {z} from "zod"
import { FastifyInstance } from "fastify"
import { db } from "shared/db"
import { auth } from "shared/auth"
import { habitos, habitosTracking } from "shared/db/schema"

export function habitosApi(app: FastifyInstance){
    app.post('/habitos', async(request, reply) => {
        const id = crypto.randomUUID()
        const schema = z.object({
            name: z.string().min(1),
            color: z.enum(["#FFD666" , "#FF6B4A" , "#7BA3FF"])
        })
        
        const session = await auth.api.getSession({
            headers: request.headers
        })

        if(!session){
            return reply.status(400).send({error: "erro ao validar session"})
        }

        const response = schema.safeParse(request.body)

        if(!response.success){
            return reply.status(400).send({error:"erro ao validar a data"})
        }

        const {name, color} = response.data

        const [newHabitos] = await db.insert(habitos).values({
            id: id,
            userId: session.user.id,
            name: name,
            color: color,
        }).returning()

        return reply.status(201).send({data: newHabitos})
    })

    app.post('/tracking/:id', async(request, reply) => {
        const {habitosListId} = request.params as {habitosListId:  string}
        const trackingid = crypto.randomUUID()
        const schema = z.object({
            status: z.enum(["done", "pending", "notDone"]),
        })

        const session = await auth.api.getSession({
            headers: request.headers
        })

        if(!session){
            return reply.status(400).send({error:"erro ao validar a session"})
        }

        const response = schema.safeParse(request.body)

        if(!response.success){
            return reply.status(400).send({error:"erro ao validar a data"})
        }

        const {status} = response.data

        const [newTracking] = await db.insert(habitosTracking).values({
            id: trackingid,
            habitosListId: habitosListId,
            status: status,
            date: new Date(),
        }).returning()

        return reply.status(201).send({data: newTracking})
    })
}