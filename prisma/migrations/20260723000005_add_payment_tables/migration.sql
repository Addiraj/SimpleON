-- Migration: 05_add_payment_tables
-- CreateTable payment_intents
CREATE TABLE `payment_intents` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `level_configuration_id` VARCHAR(191) NULL,
    `payment_reference` VARCHAR(128) NOT NULL,
    `payment_type` ENUM('JOIN', 'UPGRADE', 'RETOPUP') NOT NULL,
    `expected_amount` DECIMAL(20, 8) NOT NULL,
    `token_address` VARCHAR(255) NULL,
    `receiver_address` VARCHAR(255) NULL,
    `network_id` VARCHAR(64) NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'CONFIRMED', 'FAILED', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `expires_at` DATETIME(3) NOT NULL,
    `metadata` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_intents_payment_reference_key`(`payment_reference`),
    INDEX `payment_intents_user_id_idx`(`user_id`),
    INDEX `payment_intents_payment_reference_idx`(`payment_reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable payment_verifications
CREATE TABLE `payment_verifications` (
    `id` VARCHAR(191) NOT NULL,
    `payment_intent_id` VARCHAR(191) NOT NULL,
    `transaction_hash` VARCHAR(255) NOT NULL,
    `from_address` VARCHAR(255) NOT NULL,
    `to_address` VARCHAR(255) NOT NULL,
    `token_address` VARCHAR(255) NULL,
    `network_id` VARCHAR(64) NULL,
    `block_number` BIGINT NULL,
    `confirmed_amount` DECIMAL(20, 8) NOT NULL,
    `confirmation_count` INTEGER NOT NULL DEFAULT 1,
    `status` ENUM('PENDING', 'CONFIRMED', 'REJECTED', 'FAILED') NOT NULL DEFAULT 'CONFIRMED',
    `failure_reason` TEXT NULL,
    `raw_receipt` JSON NULL,
    `verified_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_verifications_transaction_hash_key`(`transaction_hash`),
    INDEX `payment_verifications_payment_intent_id_idx`(`payment_intent_id`),
    INDEX `payment_verifications_transaction_hash_idx`(`transaction_hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKeys
ALTER TABLE `payment_intents` ADD CONSTRAINT `payment_intents_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `payment_intents` ADD CONSTRAINT `payment_intents_level_configuration_id_fkey` FOREIGN KEY (`level_configuration_id`) REFERENCES `level_configurations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `payment_verifications` ADD CONSTRAINT `payment_verifications_payment_intent_id_fkey` FOREIGN KEY (`payment_intent_id`) REFERENCES `payment_intents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
