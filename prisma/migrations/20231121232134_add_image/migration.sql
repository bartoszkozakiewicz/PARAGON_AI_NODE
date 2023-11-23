-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "shopId" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_shopId_key" ON "Image"("shopId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shopping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
