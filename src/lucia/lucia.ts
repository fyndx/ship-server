import { lucia } from "lucia";
import { prisma } from "@lucia-auth/adapter-prisma";
import { db } from "../db";

export const auth = lucia({ env: "DEV", adapter: prisma(db) });

export type Auth = typeof auth;
