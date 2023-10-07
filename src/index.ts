import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { schema } from "./schema";
import { createYoga } from "graphql-yoga";

const yoga = createYoga({ schema });

const app = new Elysia()
  .use(swagger())
  .get("/", () => "Hello Elysia")
  .get("/health", ({}) => {
    return {
      uptime: process.uptime(),
      message: "OK",
      timestamp: Date.now(),
    };
  })
  .get("/graphql", async ({ request }) => yoga.fetch(request))
  .post("/graphql", async ({ request }) => yoga.fetch(request), {
    type: "none",
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
