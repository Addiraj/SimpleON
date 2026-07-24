-- Migration: 01_init_users_and_levels
-- Create level_configurations table
CREATE TABLE `level_configurations` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `slug` VARCHAR(128) NOT NULL,
    `level_order` INTEGER NOT NULL,
    `joining_amount` DECIMAL(20, 8) NOT NULL,
    `upgrade_amount` DECIMAL(20, 8) NOT NULL,
    `matrix_size` INTEGER NOT NULL DEFAULT 5,
    `income_per_position` DECIMAL(20, 8) NOT NULL,
    `cycle_reward` DECIMAL(20, 8) NOT NULL,
    `retopup_amount` DECIMAL(20, 8) NOT NULL,
    `daily_cap` DECIMAL(20, 8) NOT NULL,
    `required_direct_referrals` INTEGER NOT NULL DEFAULT 0,
    `required_qualified_builders` INTEGER NOT NULL DEFAULT 0,
    `auto_upgrade_enabled` BOOLEAN NOT NULL DEFAULT true,
    `retopup_enabled` BOOLEAN NOT NULL DEFAULT true,
    `status` ENUM('ACTIVE', 'INACTIVE', 'DEPRECATED') NOT NULL DEFAULT 'ACTIVE',
    `version` INTEGER NOT NULL DEFAULT 1,
    `effective_from` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `effective_to` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `level_configurations_name_version_key`(`name`, `version`),
    UNIQUE INDEX `level_configurations_slug_version_key`(`slug`, `version`),
    UNIQUE INDEX `level_configurations_level_order_version_key`(`level_order`, `version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create users table
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `wallet_address` VARCHAR(255) NOT NULL,
    `referral_code` VARCHAR(64) NOT NULL,
    `sponsor_id` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `status` ENUM('PENDING', 'ACTIVE', 'SUSPENDED', 'BLOCKED') NOT NULL DEFAULT 'PENDING',
    `current_level_id` VARCHAR(191) NULL,
    `display_name` VARCHAR(128) NULL,
    `email` VARCHAR(255) NULL,
    `joined_at` DATETIME(3) NULL,
    `last_login_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `users_wallet_address_key`(`wallet_address`),
    UNIQUE INDEX `users_referral_code_key`(`referral_code`),
    INDEX `users_wallet_address_idx`(`wallet_address`),
    INDEX `users_referral_code_idx`(`referral_code`),
    INDEX `users_sponsor_id_idx`(`sponsor_id`),
    INDEX `users_current_level_id_idx`(`current_level_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKeys
ALTER TABLE `users` ADD CONSTRAINT `users_sponsor_id_fkey` FOREIGN KEY (`sponsor_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `users` ADD CONSTRAINT `users_current_level_id_fkey` FOREIGN KEY (`current_level_id`) REFERENCES `level_configurations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
