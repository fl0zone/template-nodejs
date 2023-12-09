-- CreateTable
CREATE TABLE "Comments" (
    "comments_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "content_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("comments_id")
);

-- CreateIndex
CREATE INDEX "user_id" ON "Comments"("user_id");

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
