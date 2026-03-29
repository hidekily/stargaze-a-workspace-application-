import { pgTable, text, timestamp, boolean, index, integer, pgEnum, unique, } from "drizzle-orm/pg-core";
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});
export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => new Date())
        .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
}, (table) => [index("session_user_id_idx").on(table.userId)]);
export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => [index("account_user_id_idx").on(table.userId)]);
export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
}, (table) => [index("verification_identifier_idx").on(table.identifier)]);
// aqui acaba o schema do better-auth
// aqui comeca os schemas para as funcoes do workspace (sim eu gerei c IA n vou gastar 20min escrevendo schema)
// pq a IA gera delete cascade? ☠️
// era p ser cascade mesmo pqp 
export const workspaceType = pgEnum("workspace_type", ["social", "professional"]);
export const workspaceRole = pgEnum("workspace_role", ["admin", "manager", "member"]);
export const workspace = pgTable("workspace", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    img: text("img"),
    type: workspaceType("type").notNull(),
    memberLimit: integer("member_limit").default(10).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const workspaceMember = pgTable("workspace_member", {
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    workspaceId: text("workspace_id")
        .notNull()
        .references(() => workspace.id, { onDelete: "cascade" }),
    role: workspaceRole("role").default("member").notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (table) => [
    unique("workspace_member_unique").on(table.userId, table.workspaceId),
    index("workspace_member_user_idx").on(table.userId),
    index("workspace_member_workspace_idx").on(table.workspaceId),
]);
export const workspaceInvite = pgTable("workspace_invite", {
    inviteCode: text("invite_code").primaryKey(),
    workspaceId: text("workspace_id")
        .notNull()
        .references(() => workspace.id, { onDelete: "cascade" }),
    dayLimit: integer("day_limit"),
    userInvLimit: integer("user_inv_limit"),
    useCount: integer("use_count").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    index("workspace_invite_workspace_idx").on(table.workspaceId),
]);
