import { FastifyInstance } from "fastify"
import { auth } from "shared/auth"
import { db } from "shared/db"
import { desc, eq, count, and } from "drizzle-orm"
import { todoList, todoItems } from "shared/db/schema"

export function todoListSummaryApi(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return reply.status(401).send({ error: "erro ao validar session" })
    }

    const totalResult = await db
      .select({ total: count() })
      .from(todoItems)
      .innerJoin(todoList, eq(todoItems.todoId, todoList.id))
      .where(eq(todoList.userId, session.user.id))

    const doneResult = await db
      .select({ total: count() })
      .from(todoItems)
      .innerJoin(todoList, eq(todoItems.todoId, todoList.id))
      .where(and(
        eq(todoList.userId, session.user.id),
        eq(todoItems.doneOrNot, "done")
      ))

    const total = Number(totalResult[0]?.total ?? 0)
    const done = Number(doneResult[0]?.total ?? 0)

    const ultimoItem = await db
      .select({ todoId: todoItems.todoId })
      .from(todoItems)
      .innerJoin(todoList, eq(todoItems.todoId, todoList.id))
      .where(eq(todoList.userId, session.user.id))
      .orderBy(desc(todoItems.createdAt))
      .limit(1)

    let ultimas3: any[] = []
    let listaAtivaNome: string | null = null

    if (ultimoItem[0]) {
      const listaAtivaId = ultimoItem[0].todoId

      const lista = await db
        .select({ listName: todoList.listName })
        .from(todoList)
        .where(eq(todoList.id, listaAtivaId))
        .limit(1)
      
      listaAtivaNome = lista[0]?.listName ?? null

      ultimas3 = await db
        .select()
        .from(todoItems)
        .where(eq(todoItems.todoId, listaAtivaId))
        .orderBy(desc(todoItems.createdAt))
        .limit(3)
    }

    return reply.status(200).send({
      total,
      done,
      listaAtivaNome,
      ultimas3
    })
  })
}