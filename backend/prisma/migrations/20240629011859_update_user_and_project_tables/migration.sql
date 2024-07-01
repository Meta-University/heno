-- CreateTable
CREATE TABLE "_TeamMembersProjects" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TeamMembersProjects_AB_unique" ON "_TeamMembersProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamMembersProjects_B_index" ON "_TeamMembersProjects"("B");

-- AddForeignKey
ALTER TABLE "_TeamMembersProjects" ADD CONSTRAINT "_TeamMembersProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamMembersProjects" ADD CONSTRAINT "_TeamMembersProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
