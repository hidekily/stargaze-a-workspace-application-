import {z} from "zod"
import { FastifyInstance } from "fastify"
import { db } from "shared/db"
import { auth } from "shared/auth"
import { financas } from "shared/db/schema"
import { eq } from "drizzle-orm"

export function financasApi(app:FastifyInstance){
    app.post('/', async(request, reply) => {
        const id = crypto.randomUUID()
        const schema = z.object({
            name: z.string().min(1),
            tipo: z.enum(["gasto", "ganho"]),
            valor: z.string(),
            categorias: z.enum(["despesa fixa", "lazer", "escola", "assinaturas", "investimentos", "trabalho", "freelance", "outros"])
        })

        const session = await auth.api.getSession({
            headers: request.headers
        })

        if(!session){
            return reply.status(400).send({error:"erro ao validar a session"})
        }

        const response = await schema.safeParse(request.body)

        if(!response.success){
            return reply.status(400).send({error:"erro ao validar a data"})
        }

        const {name, tipo, valor, categorias} = response.data

        const [newFinanca] = await db.insert(financas).values({
            id: id,
            name: name,
            tipo: tipo,
            valor: valor,
            categorias: categorias,
            userId: session.user.id
        }).returning()

        return reply.status(201).send({data: newFinanca})
    })

    app.get('/', async(request, reply) => {
        const session = await auth.api.getSession({
            headers: request.headers
        })

        if(!session){
            return reply.status(400).send({error:"erro ao validar a session"})
        }

        const getFinanca = await db
        .select()
        .from(financas)
        .where(eq(financas.userId, session.user.id))

        return reply.send(getFinanca)
    })

    app.patch("/:id", async(request, reply) => {
        const {id} = request.params as {id: string}

        const schema = z.object({
            name: z.string().min(1).optional(),
            tipo: z.enum(["gasto", "ganho"]).optional(),
            valor: z.string().optional(),
            categorias: z.enum(["despesa fixa", "lazer", "escola", "assinaturas", "investimentos", "trabalho", "freelance", "outros"]).optional()
        })

        const session = await auth.api.getSession({
            headers: request.headers
        })

        if(!session){
            return reply.status(400).send({error: "erro ao validar a session"})
        }

        const response = schema.safeParse(request.body)

        if(!response.success){
            return reply.status(400).send({error:"erro ao validar a data"})
        }

        const {name, tipo, valor, categorias} = response.data

        const updateFinanca = await db
        .update(financas)
        .set({
            ...(name && {name}),
            ...(tipo && {tipo}),
            ...(valor && {valor}),
            ...(categorias && {categorias})
        })
        .where(eq(financas.id, String(id)))
        .returning()

        return reply.send(updateFinanca)
    })

    app.delete("/:id", async(request, reply) => {
        const {id} = request.params as {id: string}

        await db.delete(financas).where(eq(financas.id,String(id)))
    })
}