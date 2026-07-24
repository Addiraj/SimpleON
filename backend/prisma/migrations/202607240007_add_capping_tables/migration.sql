-- Migration: 07_add_capping_tables
-- CreateTable daily_earnings
CREATE TABLE `daily_earnings` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `business_date` DATE NOT NULL,
    `gross_amount` DECIMAL(20, 8) NOT NULL DEFAULT 0.00000000,
    `credited_amount` DECIMAL(20, 8) NOT NULL DEFAULT 0.00000000,
    `capped_amount` DECIMAL(20, 8) NOT NULL DEFAULT 0.00000000,
    `held_amount` DECIMAL(20, 8) NOT NULL DEFAULT 0.00000000,
    `carried_forward_amount` DECIMAL(20, 8) NOT NULL DEFAULT 0.00000000,
    `daily_cap` DECIMAL(20, 8) NOT NULL,
    `timezone` VARCHAR(64) NOT NULL DEFAULT 'UTC',
    `status` ENUM('ACTIVE', 'FINALIZED', 'LOCKED') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `daily_earnings_user_id_business_date_key`(`user_id`, `business_date`),
    INDEX `daily_earnings_user_id_idx`(`user_id`),
    INDEX `daily_earnings_business_date_idx`(`business_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable daily_cappings
CREATE TABLE `daily_cappings` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `level_configuration_id` VARCHAR(191) NOT NULL,
    `business_date` DATE NOT NULL,
    `gross_earning` DECIMAL(20, 8) NOT NULL DEFAULT 0.00000000,
    `allowed_earning` DECIMAL(20, 8) NOT NULL DEFAULT 0.00000000,
    `excess_earning` DECIMAL(20, 8) NOT NULL DEFAULT 0.00000000,
    `handling_type` ENUM('HELD', 'FORFEITED', 'CARRIED_FORWARD') NOT NULL DEFAULT 'HELD',
    `qualified_builder_count` INTEGER NOT NULL DEFAULT 0,
    `completed_cycle_count` INTEGER NOT NULL DEFAULT 0,
    `calculation_snapshot` JSON NULL,
    `finalized_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `daily_cappings_user_id_business_date_key`(`user_id`, `business_date`),
    INDEX `daily_cappings_user_id_idx`(`user_id`),
    INDEX `daily_cappings_business_date_idx`(`business_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKeys
ALTER TABLE `daily_earnings` ADD CONSTRAINT `daily_earnings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `daily_cappings` ADD CONSTRAINT `daily_cappings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `daily_cappings` ADD CONSTRAINT `daily_cappings_level_configuration_id_fkey` FOREIGN KEY (`level_configuration_id`) REFERENCES `level_configurations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
