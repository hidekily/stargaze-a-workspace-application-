import { FastifyInstance } from "fastify"
import { auth } from "shared/auth"
import { db } from "shared/db"
import { desc, eq, sum, and, lt, gte } from "drizzle-orm"
import { financas } from "shared/db/schema"

export function financaSummaryApi(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return reply.status(401).send({ error: "erro ao validar session" })
    }

    const agora = new Date()
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1)
    const proxMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 1)

    const ganhoResult = await db
      .select({ total: sum(financas.valor) })
      .from(financas)
      .where(and(
        eq(financas.userId, session.user.id),
        eq(financas.tipo, "ganho"),
        gte(financas.createdAt, inicioMes),
        lt(financas.createdAt, proxMes)
      ))

    const gastoResult = await db
      .select({ total: sum(financas.valor) })
      .from(financas)
      .where(and(
        eq(financas.userId, session.user.id),
        eq(financas.tipo, "gasto"),
        gte(financas.createdAt, inicioMes),
        lt(financas.createdAt, proxMes)
      ))

    const ultimas3 = await db
      .select()
      .from(financas)
      .where(eq(financas.userId, session.user.id))
      .orderBy(desc(financas.createdAt))
      .limit(3)

    const ganho = Number(ganhoResult[0]?.total ?? 0)
    const gasto = Number(gastoResult[0]?.total ?? 0)
    const saldo = ganho - gasto

    return reply.status(200).send({
      saldo,
      ganho,
      gasto,
      ultimas3
    })
  })
}