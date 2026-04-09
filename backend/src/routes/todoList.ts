import {z} from "zod"
import { FastifyInstance } from "fastify"
import { auth } from "shared/auth"
import { db } from "shared/db";
import { todoList } from "shared/db/schema";

export function todoListApi(app: FastifyInstance){
    const todoUserSendsShema = z.object({
        todoName: z.string().min(1),
        itemName: z.string().min(1),
        description: z.string().min(1)
    })

    // esse post aqui cria a todoList
    app.post("/", async(request, reply) =>{
        const date = new Date()
        const doneOrNote = ["done" , "pending"]
        const todoID = crypto.randomUUID()
        const itemId = crypto.randomUUID()

        const session = await auth.api.getSession({
            headers: request.headers
        }) 

        if(!session){ 
            return reply.send({error:"user errado/nao identificado"})
        }

        const response = await todoUserSendsShema.safeParse(request.body)

        if(!response.success){
            return reply.status(400).send({error: "erro ao validar a data"})
        }

        const {todoName, itemName, description} = response.data

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
}