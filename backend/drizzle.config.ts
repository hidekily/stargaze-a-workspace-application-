import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: ['.env.local', '.env'] })

export default defineConfig({
  out: './drizzle',
  schema: [
    '../shared/src/db/schema/betterAuth.ts',
    '../shared/src/db/schema/personal.ts',
    '../shared/src/db/schema/workspace.ts'
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})