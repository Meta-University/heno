-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "assignee_lockUser_id" INTEGER,
ADD COLUMN     "description_lockUser_id" INTEGER,
ADD COLUMN     "due_date_lockUser_id" INTEGER,
ADD COLUMN     "status_lockUser_id" INTEGER,
ADD COLUMN     "title_lockUser_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_title_lockUser_id_fkey" FOREIGN KEY ("title_lockUser_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_description_lockUser_id_fkey" FOREIGN KEY ("description_lockUser_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_status_lockUser_id_fkey" FOREIGN KEY ("status_lockUser_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_due_date_lockUser_id_fkey" FOREIGN KEY ("due_date_lockUser_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignee_lockUser_id_fkey" FOREIGN KEY ("assignee_lockUser_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
