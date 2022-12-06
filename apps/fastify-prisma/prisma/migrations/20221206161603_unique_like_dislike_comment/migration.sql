/*
  Warnings:

  - A unique constraint covering the columns `[userId,blogId]` on the table `Dislike` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,blogId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Dislike_userId_blogId_key" ON "Dislike"("userId", "blogId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_blogId_key" ON "Like"("userId", "blogId");
