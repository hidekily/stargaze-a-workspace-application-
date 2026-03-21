import {z} from "zod"
import { FastifyInstance } from 'fastify';
import { FastifyReply } from 'fastify';
import { auth } from "shared/auth";
import {db} from "shared/db"
import { workspace, workspaceInvite, workspaceMember } from "shared/db/schema";


export async function appFastify(app :FastifyInstance, request: FastifyReply){
    const userSendsSchema = z.object({
        workspaceName: z.string(),
        type: z.enum(["social", 'professional']),
        memberLimit: z.number(),
        img: z.string().optional(),
        dayLimit: z.number().optional(),
        userInvLimit: z.number().optional(),
        useCount: z.number().optional(),
        createdAt: z.date()
    })

    app.post('/', async(request, reply) =>{
        const session = await auth.api.getSession({
            headers: request.headers
        }) 

        if(!session){
            return reply.status(400).send({error:'session not found'})
        }

        const workspaceId = crypto.randomUUID()
        const inviteCode = crypto.randomUUID()
        const userId = session?.user.id ?? null
        const role = "admin"

        const response = await userSendsSchema.safeParse(request.body)

        if(!response.success){
            return reply.status(400).send({error: "data not found"})
        }

        const {workspaceName, type, memberLimit, img, dayLimit, userInvLimit, useCount, createdAt} = response.data

        const [newWorkspace] = await db.insert(workspace).values({
            name: workspaceName,
            type: type,
            memberLimit: memberLimit,
            id: workspaceId
        }).returning()

        const [newInvite] = await db.insert(workspaceInvite).values({
            inviteCode: inviteCode,
            workspaceId: newWorkspace.id,
            dayLimit: dayLimit,
            userInvLimit: userInvLimit,
            useCount: useCount,
            createdAt: createdAt
        }).returning()

        const [newUser] = await db.insert(workspaceMember).values({
            userId: userId,
            workspaceId: newWorkspace.id,
            role: role,
        }).returning()

        return reply.status(201).send({data: {newWorkspace, newInvite, newUser}, message: 'data was created'})
    })



    app.get('/', async() =>{

    })

    app.patch('/', async() =>{

    })
}
