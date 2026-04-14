import {z} from "zod"
import { FastifyInstance } from "fastify"
import { db } from "shared/db"
import { auth } from "shared/auth"

export function