/*
  Warnings:

  - You are about to drop the `Node` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Node";

-- CreateTable
CREATE TABLE "public"."nodes" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "nodes_pkey" PRIMARY KEY ("id")
);
