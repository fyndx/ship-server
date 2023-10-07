import { builder } from "../builder";
import { auth } from "../lucia/lucia";
import { LuciaError } from "lucia";

class AuthResult {
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}

builder.objectType(AuthResult, {
  name: "AuthResult",
  fields: (t) => ({
    token: t.exposeString("token"),
  }),
});

const AuthWithUsernameInput = builder.inputType("AuthWithUsernameInput", {
  fields: (t) => ({
    username: t.string({ required: true }),
    password: t.string({ required: true }),
  }),
});

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    username: t.exposeString("username", { nullable: true }),
  }),
});

builder.objectType(LuciaError, {
  name: "LuciaError",
  fields: (t) => ({
    message: t.exposeString("message"),
    name: t.exposeString("name"),
    detail: t.exposeString("detail"),
  }),
});

builder.queryField("user", (t) =>
  t.prismaField({
    type: "User",
    errors: {},
    resolve: async (query, root, args, ctx) => {
      const authRequest = auth.handleRequest({
        request: ctx.request,
        setCookie: (cookie) => {},
      });

      const session = await authRequest.validateBearerToken();

      console.log({ session });
      if (!session) {
        throw new LuciaError("REQUEST_UNAUTHORIZED");
      }

      return {
        username: session?.user?.username,
        id: session?.user?.userId,
      };
    },
  })
);

builder.mutationField("register", (t) =>
  t.field({
    type: AuthResult,
    errors: {},
    args: {
      input: t.arg({ type: AuthWithUsernameInput, required: true }),
    },
    resolve: async (root, args) => {
      try {
        const user = await auth.createUser({
          key: {
            password: args.input.password,
            providerId: "username",
            providerUserId: args.input.username.toLowerCase(),
          },
          attributes: {
            username: args.input.username,
          },
        });
        const session = await auth.createSession({
          userId: user.userId,
          attributes: {},
        });

        return {
          token: session.sessionId,
        };
      } catch (error) {
        console.log({ error });
        throw new Error("failed to create user");
      }
    },
  })
);

builder.mutationField("login", (t) =>
  t.field({
    type: AuthResult,
    errors: {},
    args: {
      input: t.arg({ type: AuthWithUsernameInput, required: true }),
    },
    resolve: async (root, args) => {
      const key = await auth.useKey(
        "username",
        args.input.username.toLowerCase(),
        args.input.password
      );
      const session = await auth.createSession({
        userId: key.userId,
        attributes: {},
      });
      return {
        token: session.sessionId,
      };
    },
  })
);
