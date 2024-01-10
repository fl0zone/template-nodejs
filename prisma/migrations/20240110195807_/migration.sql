/*
  Warnings:

  - You are about to drop the column `ExternalAccessToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ExternalAuthProviderType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ProfilePictureURL` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `externalAuthProviderid` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "ExternalAccessToken",
DROP COLUMN "ExternalAuthProviderType",
DROP COLUMN "ProfilePictureURL",
DROP COLUMN "externalAuthProviderid";

-- CreateTable
CREATE TABLE "FacebookUser" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "externalAuthProviderid" TEXT NOT NULL,
    "ExternalAuthProviderType" TEXT NOT NULL,
    "ProfilePictureURL" TEXT NOT NULL,
    "ExternalAccessToken" TEXT,

    CONSTRAINT "FacebookUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleUser" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "externalAuthProviderid" TEXT NOT NULL,
    "ExternalAuthProviderType" TEXT NOT NULL,
    "ProfilePictureURL" TEXT NOT NULL,
    "ExternalAccessToken" TEXT,

    CONSTRAINT "GoogleUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FacebookUser_userId_key" ON "FacebookUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleUser_userId_key" ON "GoogleUser"("userId");

-- AddForeignKey
ALTER TABLE "FacebookUser" ADD CONSTRAINT "FacebookUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleUser" ADD CONSTRAINT "GoogleUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
