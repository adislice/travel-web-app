-- CreateTable
CREATE TABLE `jenis_kendaraan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `jumlah_seat` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paket_wisata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `fasilitas` TEXT NOT NULL,
    `foto` JSON NOT NULL,
    `jam_keberangkatan` TIME(0) NOT NULL,
    `lama_perjalanan` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paket_wisata_tempat_wisata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paket_wisata_id` INTEGER NOT NULL,
    `tempat_wisata_id` INTEGER NOT NULL,

    INDEX `paket_wisata_id`(`paket_wisata_id`),
    INDEX `tempat_wisata_id`(`tempat_wisata_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pemesanan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode_pemesanan` VARCHAR(25) NOT NULL,
    `user_id` INTEGER NULL,
    `produk_id` INTEGER NOT NULL,
    `promo_id` INTEGER NULL,
    `total_bayar` DOUBLE NULL,
    `status` ENUM('DIPROSES', 'PENDING', 'SELESAI', 'DIBATALKAN') NULL,
    `batas_bayar` DATETIME(0) NULL,
    `tanggal_bayar` DATETIME(0) NULL,
    `metode_bayar` VARCHAR(255) NULL,
    `payment_url` TEXT NULL,
    `tanggal_keberangkatan` DATE NOT NULL,
    `lokasi_jemput_lat` VARCHAR(255) NULL,
    `lokasi_jemput_lng` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produk` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `harga` DOUBLE NULL,
    `jenis_kendaraan_id` INTEGER NULL,
    `paket_wisata_id` INTEGER NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `jenis_kendaraan_id`(`jenis_kendaraan_id`),
    INDEX `paket_wisata_id`(`paket_wisata_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `kode` VARCHAR(15) NOT NULL,
    `persen` INTEGER NOT NULL,
    `min_pembelian` DOUBLE NULL,
    `max_potongan` DOUBLE NULL,
    `tanggal_mulai` DATE NOT NULL,
    `tanggal_akhir` DATE NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tempat_wisata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `foto` JSON NOT NULL,
    `latitude` VARCHAR(255) NOT NULL,
    `longitude` VARCHAR(255) NOT NULL,
    `kota` VARCHAR(255) NOT NULL,
    `provinsi` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `no_telp` VARCHAR(16) NOT NULL,
    `profile_picture` TEXT NULL,
    `role` ENUM('CUSTOMER', 'ADMIN', 'SOPIR') NOT NULL,
    `password` VARCHAR(255) NOT NULL DEFAULT '',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `paket_wisata_tempat_wisata` ADD CONSTRAINT `paket_wisata_tempat_wisata_ibfk_1` FOREIGN KEY (`paket_wisata_id`) REFERENCES `paket_wisata`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `paket_wisata_tempat_wisata` ADD CONSTRAINT `paket_wisata_tempat_wisata_ibfk_2` FOREIGN KEY (`tempat_wisata_id`) REFERENCES `tempat_wisata`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `produk` ADD CONSTRAINT `produk_ibfk_1` FOREIGN KEY (`jenis_kendaraan_id`) REFERENCES `jenis_kendaraan`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `produk` ADD CONSTRAINT `produk_ibfk_2` FOREIGN KEY (`paket_wisata_id`) REFERENCES `paket_wisata`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

