-- Migration: 10_add_audit_and_idempotency
-- CreateTable audit_logs
CREATE TABLE `audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `admin_user_id` VARCHAR(191) NULL,
    `action` VARCHAR(128) NOT NULL,
    `entity_type` VARCHAR(128) NOT NULL,
    `entity_id` VARCHAR(255) NULL,
    `old_values` JSON NULL,
    `new_values` JSON NULL,
    `ip_address` VARCHAR(64) NULL,
    `user_agent` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_action_idx`(`action`),
    INDEX `audit_logs_entity_type_idx`(`entity_type`),
    INDEX `audit_logs_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable idempotency_keys
CREATE TABLE `idempotency_keys` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `operation` VARCHAR(128) NOT NULL,
    `request_hash` VARCHAR(255) NOT NULL,
    `response_data` JSON NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `idempotency_keys_key_key`(`key`),
    INDEX `idempotency_keys_key_idx`(`key`),
    INDEX `idempotency_keys_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKeys
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_admin_user_id_fkey` FOREIGN KEY (`admin_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `idempotency_keys` ADD CONSTRAINT `idempotency_keys_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
