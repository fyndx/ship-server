import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";
import { prisma } from "@/src/lib/db";

export const auth = betterAuth({
	plugins: [expo(), openAPI()],
	trustedOrigins: [
		"universalstarter://",
		"universalstarter://*",
		"localhost:8081",
	],
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		cookiePrefix: "universal-starter",
		crossSubDomainCookies: {
			enabled: true,
			domain: "localhost",
		},
	},
});
