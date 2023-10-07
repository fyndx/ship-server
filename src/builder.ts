import SchemaBuilder from "@pothos/core";
import type PrismaTypes from "../prisma/pothos/generated";
import PrismaPlugin from "@pothos/plugin-prisma";
import PrismaUtilsPlugin from "@pothos/plugin-prisma-utils";
import { db } from "./db";
import { DateTimeResolver } from "graphql-scalars";

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
  };
}

export const builder = new SchemaBuilder<ISchemaBuilder>({
  plugins: [PrismaPlugin, PrismaUtilsPlugin],
  prisma: {
    client: db,
  },
});

builder.queryType();
builder.mutationType();

builder.addScalarType("DateTime", DateTimeResolver, {});
