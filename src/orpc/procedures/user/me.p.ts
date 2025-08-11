import { z } from "zod";
import { baseMiddleware } from "../../middleware";
import { requireAuth } from "../../middleware/auth.middleware";

export const meProcedure = baseMiddleware
	.use(requireAuth)
	.route({ method: "GET", path: "/user/me" })
	.output(
		z.object({
			id: z.string(),
			email: z.string(),
			name: z.string().nullable(),
		}),
	)
	.handler(({ context }) => {
		console.log(context);
		const user = context.user;
		if (!user) {
			// Should be unreachable because of requireAuth, but keeps types narrow
			throw new Error("Unauthenticated");
		}
		return {
			id: user.id,
			email: user.email,
			name: user.name ?? null,
		};
	});
