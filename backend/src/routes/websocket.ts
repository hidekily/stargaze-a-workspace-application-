import websocket from 'fastify'

export async function registerWebsocket(app: websocket.FastifyInstance) {   
    app.register(websocket)

    app.register(websocket, {prefix: '/ws'})
    // vou fazer o websockets para mensagem em tempo real 
}