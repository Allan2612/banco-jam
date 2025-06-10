/*
  Warnings:

  - You are about to drop the `SinpeAlias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `SinpeAlias` DROP FOREIGN KEY `SinpeAlias_accountId_fkey`;

-- AlterTable
ALTER TABLE `Account` ADD COLUMN `phone` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `SinpeAlias`;
