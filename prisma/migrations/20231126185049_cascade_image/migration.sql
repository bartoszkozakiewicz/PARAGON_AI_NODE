-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_shopId_fkey";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shopping"("id") ON DELETE CASCADE ON UPDATE CASCADE;
