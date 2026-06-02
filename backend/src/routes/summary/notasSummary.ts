import { FastifyInstance } from "fastify"
import { auth } from "shared/auth"
import { db } from "shared/db"
import { desc, eq } from "drizzle-orm"
import { notas } from "shared/db/schema"

export function notasSummaryApi(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return reply.status(401).send({ error: "erro ao validar session" })
    }

    const ultimas3Notas = await db
      .select()
      .from(notas)
      .where(eq(notas.userId, session.user.id))
      .orderBy(desc(notas.createdAt))
      .limit(3)

    const ultimas3 = ultimas3Notas.map((n) => ({
      id: n.id,
      notasName: n.notasName,
      preview: (n.content ?? "").slice(0, 100),
      createdAt: n.createdAt
    }))

    return reply.status(200).send({ ultimas3 })
  })
}