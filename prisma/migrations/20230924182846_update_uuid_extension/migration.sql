-- AlterTable
ALTER TABLE "auth"."users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
