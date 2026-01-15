-- CreateTable
CREATE TABLE `AbsensiGuru` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guruId` INTEGER NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuruPengganti` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `absensiId` INTEGER NOT NULL,
    `jadwalId` INTEGER NOT NULL,
    `guruAsliId` INTEGER NOT NULL,
    `guruPenggantiId` INTEGER NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `catatan` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AbsensiGuru` ADD CONSTRAINT `AbsensiGuru_guruId_fkey` FOREIGN KEY (`guruId`) REFERENCES `Guru`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuruPengganti` ADD CONSTRAINT `GuruPengganti_absensiId_fkey` FOREIGN KEY (`absensiId`) REFERENCES `AbsensiGuru`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuruPengganti` ADD CONSTRAINT `GuruPengganti_jadwalId_fkey` FOREIGN KEY (`jadwalId`) REFERENCES `Jadwal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuruPengganti` ADD CONSTRAINT `GuruPengganti_guruAsliId_fkey` FOREIGN KEY (`guruAsliId`) REFERENCES `Guru`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuruPengganti` ADD CONSTRAINT `GuruPengganti_guruPenggantiId_fkey` FOREIGN KEY (`guruPenggantiId`) REFERENCES `Guru`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
