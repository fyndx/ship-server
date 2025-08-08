# AI Coding Agent innstructions – Universal Starter (Server)

## 📌 Tech Stack
- **Framework**: [Elysia](https://elysiajs.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **RPC Layer**: [oRPC](https://orpc.dev/) – lightweight, type-safe RPC between server and client
- **Authentication**: [better-auth](https://better-auth.vercel.app/)

---

## 1. General Rules
- Always **use TypeScript** with strict typing.
- Keep imports **absolute** from `src/` using path aliases.
- Always return **typed responses** from RPC handlers and API routes.

---

## 2. Elysia Guidelines
- Group related routes in a single Elysia plugin file inside `src/routes/`.
- When adding middleware:
  - Use `app.use()` for global middleware.
  - Use plugin-scoped middleware for route-specific logic.

## 3. Prisma Guidelines
- Never write raw SQL unless necessary; use Prisma Client for all DB operations.
- Use select or include to fetch only required fields — avoid findMany() without filters unless needed.

Example:

```typescript
import { prisma } from '@/src/lib/db';

export const userService = {
  create: (data: { name: string; email: string }) =>
    prisma.user.create({ data }),

  findByEmail: (email: string) =>
    prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true }
    }),
};
```

## 4. oRPC Guidelines
- Use typed inputs/outputs for every RPC method.
- Group related RPCs into a single file and export from index.ts