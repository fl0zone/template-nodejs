/*
  Warnings:

  - Added the required column `User_id` to the `Gallery` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Gallery" DROP CONSTRAINT "Gallery_User_role_fkey";

-- AlterTable
ALTER TABLE "Gallery" ADD COLUMN     "User_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "UserRole" SET DEFAULT 'NormalProfile';

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
