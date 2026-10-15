import { FastifyInstance } from 'fastify'
import { WebSocket } from '@fastify/websocket'
import { auth } from 'shared/auth'

export async function registerWebsocket(app: FastifyInstance) {   
    app.get('/:workspaceId', {
        websocket: true, 
        preValidation: async(request, reply) => {
            const session = await auth.api.getSession({headers: request.headers})

            if(!session){ 
                return reply.status(401).send({error: 'user invalido'})
            }
        }
    }, (socket, request) => {
        socket.on('message', (msg) => socket.send(msg.toString()))
    })
}