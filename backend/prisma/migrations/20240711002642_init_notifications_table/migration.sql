-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('TASK_EDIT', 'COMMENT');

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "user_id" INTEGER NOT NULL,
    "task_id" INTEGER,
    "comment_id" INTEGER,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
