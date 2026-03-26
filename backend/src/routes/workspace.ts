import {z} from "zod"
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { auth } from "shared/auth";
import {db} from "shared/db"
import {workspace, workspaceInvite, workspaceMember } from "shared/db/schema";
import { and, eq} from "drizzle-orm";


export async function workspaceAPI(app :FastifyInstance, OPTIONS: FastifyPluginOptions){
    const userSendsSchema = z.object({
        workspaceName: z.string(),
        type: z.enum(["social", 'professional']),
        memberLimit: z.number(),
        img: z.string().optional(),
        dayLimit: z.number().optional(),
        userInvLimit: z.number().optional(),
        useCount: z.number().optional(),
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
        const userId = session.user.id
        const role = "admin"

        const response = await userSendsSchema.safeParse(request.body)

        if(!response.success){
            return reply.status(400).send({error: "data not found"})
        }

        const {workspaceName, type, memberLimit, img, dayLimit, userInvLimit, useCount} = response.data

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
            createdAt: new Date()
        }).returning()

        const [newUser] = await db.insert(workspaceMember).values({
            userId: userId,
            workspaceId: newWorkspace.id,
            role: role,
        }).returning()

        return reply.status(201).send({data: {newWorkspace, newInvite, newUser}, message: 'data was created'})
    })

    app.get('/by-ids', async(request, reply) =>{
        const session = await auth.api.getSession({
            headers: request.headers
        }) 

        if(!session){
            return reply.status(400).send({error:"erro"})
        }
        const {type} = request.query as {type: "social" | "professional"}

        const workspaces = await db
        .select()
        .from(workspace)
        .innerJoin(workspaceMember, eq(workspace.id , workspaceMember.workspaceId))
        .where(and(
            eq(workspace.type, type),
            eq(workspaceMember.userId , session.user.id)
        ))

        return reply.send(workspaces)
    })

    app.patch('/:id', async(request, reply) =>{
        const {id} = request.params as {id: string}

        const schema = z.object({
            workspaceName: z.string().optional(),
            memberLimit: z.number().optional(),
            img: z.string().optional(),
            dayLimit: z.number().optional(),
            userInvLimit: z.number().optional(),
            role: z.enum(["admin", "manager", "member"]).optional()
        })

        const schemaResult = schema.safeParse(request.body)

        if(!schemaResult.success){
            return reply.status(400).send({error: ""})
        }

        const {workspaceName, memberLimit, img, dayLimit, userInvLimit, role} = schemaResult.data

        if(workspaceName || memberLimit || img){ 
            const resWorkspace = await db
            .update(workspace)
            .set({name: schemaResult.data.workspaceName, memberLimit, img})
            .where(eq(workspace.id, String(id)))
        }

        if(role){
            const resWorkspaceMember = await db 
            .update(workspaceMember)
            .set({role})
            .where(eq(workspaceMember.workspaceId, String(id)))
        }
        
        if(dayLimit ||  userInvLimit){ //inv
            const resInv = await db
            .update(workspaceInvite)
            .set({dayLimit, userInvLimit})
            .where(eq(workspaceInvite.workspaceId, String(id)))
        }


        return reply.status(201).send()
    })

    app.delete('/:id', async(request, reply) =>{
        const {id} = request.params as {id: string}

        const idParamsSchema = z.object({
            id: z.string().uuid()
        })

        const res = idParamsSchema.safeParse({id})

        if(!res.success){
            return reply.status(400).send({error:"erro ao identificar o workspace"})
        }

        await db.delete(workspace).where(eq(workspace.id, String(id))) 

        return reply.status(201).send({data: res, message: "workspace deleted"})
    })
}
