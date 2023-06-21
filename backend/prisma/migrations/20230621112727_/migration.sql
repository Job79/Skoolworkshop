-- DropForeignKey
ALTER TABLE `Calendar` DROP FOREIGN KEY `Calendar_workshopId_fkey`;

-- AddForeignKey
ALTER TABLE `Calendar` ADD CONSTRAINT `Calendar_workshopId_fkey` FOREIGN KEY (`workshopId`) REFERENCES `Workshop`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
