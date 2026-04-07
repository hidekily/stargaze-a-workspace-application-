import { relations } from "drizzle-orm";
import {
  pgTable, text, timestamp, boolean, index, 
  serial, integer, decimal, pgEnum, unique,
} from "drizzle-orm/pg-core";

import {user} from "./betterAuth"
export const doneOrNotEnums = pgEnum("doneOrNoteEnumList", ["done", "pending"])

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