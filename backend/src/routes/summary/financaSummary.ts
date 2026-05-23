import { FastifyInstance } from "fastify";
import { auth } from "shared/auth";
import { db } from "shared/db";
import { desc, eq, sum, and, lt, gte } from "drizzle-orm";
import { financas } from "shared/db/schema";

export function financaSummaryApi(app: FastifyInstance){
    app.get('/', async(request, reply) => {
        
        const agora = new Date()

        const ano = agora.getFullYear()
        const mes = agora.getMonth()

        const inicioMes = new Date(ano, mes, 1)
        const proxMes = new Date(ano, mes + 1, 1)

        const session = await auth.api.getSession({
            headers: request.headers
        })

        if(!session){
            return reply.status(400).send({error: "erro ao validar session"})
        }

        const filterDataFinanca = await db
        .select({
            ganho: sum(...),
            gasto: sum(...)
        })
        .from(financas)
        .where(and(eq(financas.userId, session.user.id), gte(financas.createdAt, inicioMes), lt(financas.createdAt, proxMes)))

        const last3ItemsFromFinanca = await db
        .select()
        .from(financas)
        .where(eq(financas.userId, session.user.id))
        .orderBy(desc(financas.createdAt))
        .limit(3)
    })
}