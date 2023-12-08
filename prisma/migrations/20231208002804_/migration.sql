-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "UserName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "externalAuthProviderid" TEXT NOT NULL,
    "ExternalAuthProviderType" TEXT NOT NULL,
    "ProfilePictureURL" TEXT NOT NULL,
    "ExternalAccessToken" TEXT NOT NULL,
    "UserRole" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gallery" (
    "id" SERIAL NOT NULL,
    "imgName" TEXT NOT NULL,
    "ImageUrl" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "User_role" TEXT NOT NULL,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donations" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "concurrency" TEXT NOT NULL,
    "paypament_status" TEXT NOT NULL,
    "paypament_method" TEXT NOT NULL,
    "stripe_charge_id" TEXT NOT NULL,
    "User_id" INTEGER NOT NULL,
    "operationdate" TIMESTAMP(3) NOT NULL,
    "timeofoperation" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "User_UserRole_key" ON "User"("UserRole");

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_User_role_fkey" FOREIGN KEY ("User_role") REFERENCES "User"("UserRole") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donations" ADD CONSTRAINT "Donations_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
