import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins"
import { admin } from "better-auth/plugins"
import {prismaAdapter} from "@better-auth/prisma-adapter";
import {db} from "@/prisma/db";

const prisma = db.orm

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: process.env.NEXT_PUBLIC_SITE_URL,
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        username({ immutableUsername: true}),
        admin()
    ]
});