import SchemaBuilder from "@pothos/core";
import type PrismaTypes from "../prisma/pothos/generated";
import PrismaPlugin from "@pothos/plugin-prisma";
import PrismaUtilsPlugin from "@pothos/plugin-prisma-utils";
import { db } from "./db";
import { DateTimeResolver } from "graphql-scalars";
import PothosErrorsPlugin from "@pothos/plugin-errors";

interface ISchemaBuilder {
  PrismaTypes: PrismaTypes;
  Scalars: {
    ID: {
      Output: number | string;
      Input: string;
    };
    DateTime: {
      Output: Date;
      Input: Date;
    };
  };
  Context: {
    user?: {
      id: string;
    };
    request: Request;
  };
}

export const builder = new SchemaBuilder<ISchemaBuilder>({
  plugins: [PothosErrorsPlugin, PrismaPlugin, PrismaUtilsPlugin],
  prisma: {
    client: db,
  },
  errorOptions: {
    defaultTypes: [Error],
  },
});

builder.objectType(Error, {
  name: "Error",
  fields: (t) => ({
    message: t.exposeString("message"),
  }),
});

builder.queryType();
builder.mutationType();

builder.addScalarType("DateTime", DateTimeResolver, {});
