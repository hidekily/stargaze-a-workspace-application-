import { FastifyInstance } from "fastify";
import { auth } from "shared/auth";
import { db } from "shared/db";
import { desc, eq, sum } from "drizzle-orm";
import { financas } from "shared/db/schema";

export function financaSummaryApi(app: FastifyInstance){
    app.get('/', async(request, reply) => {
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
        .where()

        const last3ItemsFromFinanca = await db
        .select()
        .from(financas)
        .where(eq(financas.userId, session.user.id))
        .orderBy(desc(financas.createdAt))
        .limit(3)
    })
}