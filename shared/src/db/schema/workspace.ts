import { relations } from "drizzle-orm";
import {
  pgTable, text, timestamp, boolean, index,
  serial, integer, decimal, pgEnum, unique,
} from "drizzle-orm/pg-core";

import { user } from './betterAuth'

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

export const workspaceMember = pgTable(
  "workspace_member",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    role: workspaceRole("role").default("member").notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    unique("workspace_member_unique").on(table.userId, table.workspaceId),
    index("workspace_member_user_idx").on(table.userId),
    index("workspace_member_workspace_idx").on(table.workspaceId),
  ]
);

export const workspaceInvite = pgTable(
  "workspace_invite",
  {
    inviteCode: text("invite_code").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    dayLimit: integer("day_limit"),
    userInvLimit: integer("user_inv_limit"),
    useCount: integer("use_count").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("workspace_invite_workspace_idx").on(table.workspaceId),
  ]
);