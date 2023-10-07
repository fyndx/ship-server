import { builder } from "../builder";
import { db } from "../db";

builder.prismaObject("users", {
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email", { nullable: true }),
  }),
});

builder.queryField("User", (t) =>
  t.prismaField({
    type: "users",
    nullable: true,
    resolve: (query, root, args, ctx) => {
      if (!ctx.user) {
        return null;
      }

      return db.users.findUnique({
        ...query,
        where: {
          id: ctx.user.id,
        },
      });
    },
  })
);

const CreateUser = builder.inputType("CreateUser", {
  fields: (t) => ({
    username: t.string(),
    password: t.string(),
  }),
});

builder.mutationField("createUser", (t) =>
  t.prismaField({
    type: "users",
    args: {
      input: t.arg({
        type: CreateUser,
        required: true,
      }),
    },
    resolve: async (query, _, { input }) => {
      const createUser = await db.$transaction(async (prisma) => {
        const user = await db.users.create({
          data: {
            email: input.username,
            encrypted_password: input.password,
          },
        });
        const identity = db.identities.create({
          data: {
            user_id: user.id,
            id: user.id,
            provider: "email",
            email: user.email,
            identity_data: {
              sub: user.id,
              email: user.email,
            },
          },
        });
        return { user, identity };
      });

      // TODO: add audit log

      return createUser.user;
    },
  })
);
