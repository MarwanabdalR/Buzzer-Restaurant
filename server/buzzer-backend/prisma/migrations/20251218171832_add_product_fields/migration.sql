-- AlterTable
ALTER TABLE `product` ADD COLUMN `discountPercent` DOUBLE NULL,
    ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `originalPrice` DECIMAL(10, 2) NULL,
    ADD COLUMN `restaurantId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `Restaurant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
