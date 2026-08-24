import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins"
import { admin } from "better-auth/plugins"
import {prismaAdapter} from "@better-auth/prisma-adapter";
import {PrismaClient} from "@/prisma/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({adapter});


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: process.env.NEXT_PUBLIC_SITE_URL,
    emailAndPassword: {
        enabled: true,
    },
    onAPIError: {
        errorURL: "/auth/error"
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    plugins: [
        username({ immutableUsername: true}),
        admin()
    ],
    trustedOrigins: [
        "http://localhost:3000"
    ],
    accountLinking: {
        enabled: true,
        trustedProviders: ["google", "github", "email-password"], // or async (request) => ["google", "github"]
        allowDifferentEmails: false
    }
});