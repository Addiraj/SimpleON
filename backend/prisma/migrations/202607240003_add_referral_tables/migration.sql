-- Migration: 03_add_referral_tables
-- CreateTable user_levels
CREATE TABLE `user_levels` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `level_configuration_id` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `activated_at` DATETIME(3) NULL,
    `completed_at` DATETIME(3) NULL,
    `configuration_snapshot` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `user_levels_user_id_idx`(`user_id`),
    INDEX `user_levels_level_configuration_id_idx`(`level_configuration_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable referral_relations
CREATE TABLE `referral_relations` (
    `id` VARCHAR(191) NOT NULL,
    `sponsor_user_id` VARCHAR(191) NOT NULL,
    `referred_user_id` VARCHAR(191) NOT NULL,
    `depth` INTEGER NOT NULL DEFAULT 1,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `referral_relations_sponsor_user_id_referred_user_id_key`(`sponsor_user_id`, `referred_user_id`),
    INDEX `referral_relations_sponsor_user_id_idx`(`sponsor_user_id`),
    INDEX `referral_relations_referred_user_id_idx`(`referred_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKeys
ALTER TABLE `user_levels` ADD CONSTRAINT `user_levels_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `user_levels` ADD CONSTRAINT `user_levels_level_configuration_id_fkey` FOREIGN KEY (`level_configuration_id`) REFERENCES `level_configurations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `referral_relations` ADD CONSTRAINT `referral_relations_sponsor_user_id_fkey` FOREIGN KEY (`sponsor_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `referral_relations` ADD CONSTRAINT `referral_relations_referred_user_id_fkey` FOREIGN KEY (`referred_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
