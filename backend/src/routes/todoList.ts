import {z} from "zod"
import { FastifyInstance } from "fastify"
import { auth } from "shared/auth"
import { db } from "shared/db";
import { todoItems, todoList } from "shared/db/schema";
import { eq } from "drizzle-orm";
import { session } from "shared/db/schema";

export function todoListApi(app: FastifyInstance){
    const listSchema = z.object({
        todoName: z.string().min(1),
        description: z.string().min(1)
    })

    const itemSchema = z.object({
        itemName: z.string().min(1),
    })

    // esse post aqui cria a todoList
    app.post("/list", async(request, reply) =>{
        const date = new Date()
        const todoID = crypto.randomUUID()

        const session = await auth.api.getSession({
            headers: request.headers
        }) 

        if(!session){ 
            return reply.send({error:"user errado/nao identificado"})
        }

        const response = await listSchema.safeParse(request.body)

        if(!response.success){
            return reply.status(400).send({error: "erro ao validar a data"})
        }

        const {todoName, description} = response.data

        const [newTodoList] = await db.insert(todoList).values({
            id: todoID,
            userId: session.user.id,
            description: description,
            date: date,
            listName: todoName
        }).returning()

        return reply.status(201).send({data: newTodoList, message: "todo list criada"})
    })

    // esse aqui cria um item da todoList
    app.post('/item/:id', async(request, reply) =>{
        const { id } = request.params as {id: string}
        const itemId = crypto.randomUUID()
        
        const session = await auth.api.getSession({
            headers: request.headers
        }) 

        if(!session) {
            return reply.send({error:"errro ao validar a session"})
        }

        const response = itemSchema.safeParse(request.body)

        if(!response.success){
            return reply.status(400).send({error:"erro a validar os dados"})
        }

        const {itemName} = response.data

        const [newTodoListItem] = await db.insert(todoItems).values({
            id: itemId,
            doneOrNot: "pending",
            itemName: itemName,
            todoId: id,
        }).returning()

        return reply.status(201).send({data: newTodoListItem, message: "item created"})
    })

    app.get('/by-ids', async(request, reply) => {
        const session = await auth.api.getSession({
            headers: request.headers
        })

        if(!session) {
            return reply.send({error: "erro na session"})
        }

        const lists = await db.select()
        .from(todoList)
        .where(eq(todoList, todoList.userId))

        return reply.send(lists)
    })
}