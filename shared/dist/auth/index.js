import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    trustedOrigins: ['http://localhost:3000'],
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ['google', 'figma', "github"]
        }
    },
    advanced: {
        crossSubDomainCookies: {
            enabled: false,
        },
        defaultCookieAttributes: {
            secure: true,
        },
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
        figma: {
            clientId: process.env.FIGMA_CLIENT_ID,
            clientSecret: process.env.FIGMA_CLIENT_SECRET,
        },
    }
});
