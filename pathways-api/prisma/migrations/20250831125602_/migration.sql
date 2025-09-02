/*
  Warnings:

  - Added the required column `fromNodeId` to the `edges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pathwayId` to the `edges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toNodeId` to the `edges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pathwayId` to the `nodes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."edges" ADD COLUMN     "fromNodeId" TEXT NOT NULL,
ADD COLUMN     "pathwayId" TEXT NOT NULL,
ADD COLUMN     "toNodeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."nodes" ADD COLUMN     "pathwayId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."pathways" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pathways_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."edges" ADD CONSTRAINT "edges_pathwayId_fkey" FOREIGN KEY ("pathwayId") REFERENCES "public"."pathways"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."edges" ADD CONSTRAINT "edges_fromNodeId_fkey" FOREIGN KEY ("fromNodeId") REFERENCES "public"."nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."edges" ADD CONSTRAINT "edges_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "public"."nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."nodes" ADD CONSTRAINT "nodes_pathwayId_fkey" FOREIGN KEY ("pathwayId") REFERENCES "public"."pathways"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
