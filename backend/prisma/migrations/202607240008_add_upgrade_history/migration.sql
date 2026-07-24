-- Migration: 08_add_upgrade_history
-- CreateTable upgrade_histories
CREATE TABLE `upgrade_histories` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `from_level_id` VARCHAR(191) NULL,
    `to_level_id` VARCHAR(191) NOT NULL,
    `upgrade_type` ENUM('AUTOMATIC', 'MANUAL', 'PAID') NOT NULL,
    `status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `amount` DECIMAL(20, 8) NOT NULL,
    `eligibility_snapshot` JSON NULL,
    `transaction_id` VARCHAR(191) NULL,
    `idempotency_key` VARCHAR(255) NULL,
    `upgraded_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `upgrade_histories_idempotency_key_key`(`idempotency_key`),
    INDEX `upgrade_histories_user_id_idx`(`user_id`),
    INDEX `upgrade_histories_to_level_id_idx`(`to_level_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKeys
ALTER TABLE `upgrade_histories` ADD CONSTRAINT `upgrade_histories_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `upgrade_histories` ADD CONSTRAINT `upgrade_histories_from_level_id_fkey` FOREIGN KEY (`from_level_id`) REFERENCES `level_configurations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `upgrade_histories` ADD CONSTRAINT `upgrade_histories_to_level_id_fkey` FOREIGN KEY (`to_level_id`) REFERENCES `level_configurations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `upgrade_histories` ADD CONSTRAINT `upgrade_histories_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
