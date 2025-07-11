import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { auth } from "@/src/lib/auth";
import { OpenAPI } from "./lib/open-api";

const app = new Elysia()
	.use(
		swagger({
			documentation: {
				components: await OpenAPI.components,
				paths: await OpenAPI.getPaths(),
				tags: [{ name: "App", description: "General endpoints" }],
			},
		}),
	)
	.use(
		cors({
			origin: ["http://localhost:8081", /^https:\/\/.*\.expo\.app$/],
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.mount(auth.handler)
	.get("/", () => "Hello Elysia", {
		detail: {
			tags: ["App"],
		},
	})
	.get(
		"/health",
		() => {
			return {
				uptime: process.uptime(),
				message: "OK",
				timestamp: Date.now(),
			};
		},
		{
			detail: {
				tags: ["App"],
				description: "Health check endpoint",
				summary: "Health Check",
			},
		},
	)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
