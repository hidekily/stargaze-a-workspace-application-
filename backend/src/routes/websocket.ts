import websocket from 'fastify'
import fastify from 'fastify'

export async function registerWebsocket(app: websocket.FastifyInstance) {   
    const fastify = require('fastify')
    const websocket = require('@fastify/websocket')

    fastify.register(websocket, { prefix: '/ws' })

    
}   