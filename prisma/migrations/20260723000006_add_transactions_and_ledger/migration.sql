-- Migration: 06_add_transactions_and_ledger
-- CreateTable transactions
CREATE TABLE `transactions` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `payment_intent_id` VARCHAR(191) NULL,
    `transaction_type` ENUM('PLAN_JOIN', 'MATRIX_REWARD', 'REFERRAL_REWARD', 'UPGRADE', 'RETOPUP', 'CAPPING', 'DEPOSIT', 'WITHDRAWAL', 'REVERSAL') NOT NULL,
    `amount` DECIMAL(20, 8) NOT NULL,
    `currency` VARCHAR(32) NOT NULL DEFAULT 'USDT',
    `blockchain_transaction_hash` VARCHAR(255) NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REVERSED') NOT NULL DEFAULT 'PENDING',
    `description` TEXT NULL,
    `metadata` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `completed_at` DATETIME(3) NULL,

    UNIQUE INDEX `transactions_blockchain_transaction_hash_key`(`blockchain_transaction_hash`),
    INDEX `transactions_user_id_idx`(`user_id`),
    INDEX `transactions_status_idx`(`status`),
    INDEX `transactions_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable wallet_ledgers
CREATE TABLE `wallet_ledgers` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `transaction_id` VARCHAR(191) NULL,
    `entry_type` ENUM('PLAN_JOIN', 'MATRIX_REWARD', 'REFERRAL_REWARD', 'RETOPUP_DEBIT', 'UPGRADE_DEBIT', 'CAPPED_INCOME', 'HELD_INCOME', 'RELEASED_INCOME', 'DEPOSIT', 'WITHDRAWAL', 'REVERSAL', 'ADMIN_ADJUSTMENT') NOT NULL,
    `direction` ENUM('CREDIT', 'DEBIT') NOT NULL,
    `amount` DECIMAL(20, 8) NOT NULL,
    `available_amount` DECIMAL(20, 8) NOT NULL DEFAULT 0.00000000,
    `locked_amount` DECIMAL(20, 8) NOT NULL DEFAULT 0.00000000,
    `pending_amount` DECIMAL(20, 8) NOT NULL DEFAULT 0.00000000,
    `status` ENUM('PENDING', 'AVAILABLE', 'LOCKED', 'COMPLETED', 'REVERSED', 'FAILED') NOT NULL DEFAULT 'AVAILABLE',
    `idempotency_key` VARCHAR(255) NOT NULL,
    `source_type` VARCHAR(128) NULL,
    `source_id` VARCHAR(255) NULL,
    `metadata` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `wallet_ledgers_idempotency_key_key`(`idempotency_key`),
    INDEX `wallet_ledgers_user_id_idx`(`user_id`),
    INDEX `wallet_ledgers_transaction_id_idx`(`transaction_id`),
    INDEX `wallet_ledgers_idempotency_key_idx`(`idempotency_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKeys
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_payment_intent_id_fkey` FOREIGN KEY (`payment_intent_id`) REFERENCES `payment_intents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `wallet_ledgers` ADD CONSTRAINT `wallet_ledgers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `wallet_ledgers` ADD CONSTRAINT `wallet_ledgers_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
