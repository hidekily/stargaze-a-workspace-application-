import { One, relations } from "drizzle-orm";
import {
  pgTable, text, timestamp, boolean, index, 
  serial, integer, decimal, pgEnum, unique,
} from "drizzle-orm/pg-core";

import {user} from "./betterAuth"

//enums
export const doneOrNotEnums = pgEnum("doneOrNoteEnumList", ["done", "pending"])
export const habitosEnum = pgEnum("habitosEnum", ["done",  "pending", "notDone"])
export const categoriasEnum = pgEnum("categorias", ["despesa fixa", "lazer", "escola", "assinaturas", "investimentos", "trabalho", "freelance", "outros"])
export const tipoEnum = pgEnum("tipo", ["gasto", "ganho"])
export const color = pgEnum("colors" ,["#FFD666", "#FF6B4A", "#7BA3FF"]) // pending - not done - done

// todo
export const todoList = pgTable("personalTodoList", {
    id: text("id").primaryKey(),
    userId: text("userId")
    .notNull()
    .references(() => user.id, {onDelete: "cascade"}),
    listName: text("listName").notNull(),
    date: timestamp().defaultNow().notNull(),
    description: text("description"),
})

export const todoItems = pgTable("todoItems",{
    id: text("id").primaryKey(),
    todoId: text("todoList_id")
    .notNull()
    .references(() => todoList.id, {onDelete: 'cascade'}),
    itemName: text("item").notNull(),
    doneOrNot: doneOrNotEnums("doneOrNotEnum").default("pending").notNull()
})
// 

// notas 
export const notas = pgTable("notas", {
    id: text("id").primaryKey(),
    userId: text("userId")
    .references(() => user.id, {onDelete: "cascade"}),
    name: text("name").notNull(),
    content: text("content").default(""),
    createdAt: timestamp().defaultNow().notNull(),
})
// 

// habitos
export const habitos = pgTable("habitos", {
    id: text("id").primaryKey(),
    userId: text("userId")
    .references(() => user.id, {onDelete: "cascade"}),
    name: text("name").notNull(),
    color: text("color").notNull(),
})

export const habitosTracking = pgTable("tracking", {
    id: text("id").primaryKey(),
    habitosListId: text("habitosRef")
    .references(() => habitos.id, {onDelete: "cascade"}),
    status: habitosEnum().default("pending"),
    date: timestamp().defaultNow()
})
// 

//financas items etc
export const financas = pgTable("financas", {
    id: text("id").primaryKey(),
    userId: text("userId")
    .references(() => user.id, {onDelete: 'cascade'}),
    name: text("name").notNull(),
    tipo: tipoEnum().notNull(),
    valor: decimal().notNull(),
    categorias: categoriasEnum().notNull()
})
//