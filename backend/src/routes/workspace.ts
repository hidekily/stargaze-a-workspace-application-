import {z} from "zod"
import { FastifyInstance } from 'fastify';
import { FastifyReply } from 'fastify';
import { auth } from "shared/auth";
import {db} from "shared/db"
import { request } from 'http';


export async function appFastify(app :FastifyInstance, request: FastifyReply){
    const userSendsSchema = z.object({
        workspaceName: z.string(),
        type: z.enum(["social", 'professional']),
        memberLimit: z.number(),
        img: z.string().optional(),
        dayLimit: z.number().optional(),
        userInvLimit: z.number().optional()
    })



    app.post('/', async(request, reply) =>{
        const session = await auth.api.getSession({
            headers: request.headers
        }) 

        const workspaceId = crypto.randomUUID()
        const inviteCode = crypto.randomUUID()
        const userId = session?.user.id
        const role = "admin"

        const response = await userSendsSchema.safeParse(request.body)

        if(!response.success){
            return reply.status(400).send({error: "data not found"})
        }
    })

    app.get('/', async() =>{

    })

    app.patch('/', async() =>{

    })
}
