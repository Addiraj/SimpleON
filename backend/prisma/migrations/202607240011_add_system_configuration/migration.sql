-- Migration: 11_add_system_configuration
-- CreateTable system_configurations
CREATE TABLE `system_configurations` (
    `id` VARCHAR(191) NOT NULL,
    `configuration_key` VARCHAR(128) NOT NULL,
    `configuration_value` TEXT NOT NULL,
    `value_type` VARCHAR(32) NOT NULL DEFAULT 'STRING',
    `is_public` BOOLEAN NOT NULL DEFAULT false,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `system_configurations_configuration_key_key`(`configuration_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
