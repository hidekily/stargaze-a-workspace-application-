import type { FastifyInstance } from 'fastify'
import type { WebSocket } from 'ws'
import { z } from 'zod'
import { and, eq } from 'drizzle-orm'
import { auth } from 'shared/auth'
import { db } from 'shared/db'
import { workspaceMember } from 'shared/db/schema'

const rooms = new Map<string, Set<WebSocket>>()

const messageSchema = z.object({ content: z.string().min(1).max(2000) })

export async function registerWebsocket(app: FastifyInstance) {
  app.get('/:workspaceId', {
    websocket: true,
    preValidation: async (request, reply) => {
      const session = await auth.api.getSession({ 
        headers: request.headers 
      })

      if (!session){ 
        return reply.status(401).send({ error: 'user invalido' })
      }

      const { workspaceId } = request.params as { workspaceId: string }
      
      const [member] = await db.select().from(workspaceMember)
        .where(and(
          eq(workspaceMember.workspaceId, workspaceId),
          eq(workspaceMember.userId, session.user.id)
        ))

      if (!member) return reply.status(403).send({ error: 'nao eh membro' })
    }
  }, (socket, request) => {
    const { workspaceId } = request.params as { workspaceId: string }

    if (!rooms.has(workspaceId)) rooms.set(workspaceId, new Set())
    const room = rooms.get(workspaceId)!
    room.add(socket)

    socket.on('message', (msg: string) => {
      let parsed
      try {
        parsed = messageSchema.safeParse(JSON.parse(msg.toString()))
      } catch {
        return
      }
      if (!parsed.success) return

      const payload = JSON.stringify({ content: parsed.data.content })
      for (const client of room) {
        if (client.readyState === 1) client.send(payload)
      }
    })

    socket.on('close', () => {
      room.delete(socket)
      if (room.size === 0) rooms.delete(workspaceId)
    })
  })
}