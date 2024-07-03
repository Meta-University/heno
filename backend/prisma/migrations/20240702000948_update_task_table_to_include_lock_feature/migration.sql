/*
  Warnings:

  - You are about to drop the column `is_updating` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "is_updating",
ADD COLUMN     "assignee_is_updating" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "assignee_lockTimestamp" TIMESTAMP(3),
ADD COLUMN     "description_is_updating" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "description_lockTimestamp" TIMESTAMP(3),
ADD COLUMN     "due_date_is_updating" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "due_date_lockTimestamp" TIMESTAMP(3),
ADD COLUMN     "status_is_updating" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status_lockTimestamp" TIMESTAMP(3),
ADD COLUMN     "title_is_updating" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title_lockTimestamp" TIMESTAMP(3);
