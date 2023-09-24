import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";

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
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
