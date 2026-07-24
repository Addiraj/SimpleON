-- Migration: 04_add_matrix_tables
-- CreateTable matrix_cycles
CREATE TABLE `matrix_cycles` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `level_configuration_id` VARCHAR(191) NOT NULL,
    `cycle_number` INTEGER NOT NULL DEFAULT 1,
    `total_positions` INTEGER NOT NULL DEFAULT 5,
    `filled_positions` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `previous_cycle_id` VARCHAR(191) NULL,
    `next_cycle_id` VARCHAR(191) NULL,
    `configuration_snapshot` JSON NULL,
    `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `matrix_cycles_user_id_level_configuration_id_cycle_number_key`(`user_id`, `level_configuration_id`, `cycle_number`),
    INDEX `matrix_cycles_user_id_idx`(`user_id`),
    INDEX `matrix_cycles_level_configuration_id_idx`(`level_configuration_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable matrix_positions
CREATE TABLE `matrix_positions` (
    `id` VARCHAR(191) NOT NULL,
    `matrix_cycle_id` VARCHAR(191) NOT NULL,
    `position_number` INTEGER NOT NULL,
    `member_user_id` VARCHAR(191) NOT NULL,
    `sponsor_user_id` VARCHAR(191) NOT NULL,
    `placement_source` ENUM('DIRECT', 'SPILLOVER', 'RECYCLE') NOT NULL DEFAULT 'DIRECT',
    `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
    `placed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `matrix_positions_matrix_cycle_id_position_number_key`(`matrix_cycle_id`, `position_number`),
    INDEX `matrix_positions_matrix_cycle_id_idx`(`matrix_cycle_id`),
    INDEX `matrix_positions_member_user_id_idx`(`member_user_id`),
    INDEX `matrix_positions_sponsor_user_id_idx`(`sponsor_user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKeys
ALTER TABLE `matrix_cycles` ADD CONSTRAINT `matrix_cycles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `matrix_cycles` ADD CONSTRAINT `matrix_cycles_level_configuration_id_fkey` FOREIGN KEY (`level_configuration_id`) REFERENCES `level_configurations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `matrix_cycles` ADD CONSTRAINT `matrix_cycles_previous_cycle_id_fkey` FOREIGN KEY (`previous_cycle_id`) REFERENCES `matrix_cycles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `matrix_positions` ADD CONSTRAINT `matrix_positions_matrix_cycle_id_fkey` FOREIGN KEY (`matrix_cycle_id`) REFERENCES `matrix_cycles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `matrix_positions` ADD CONSTRAINT `matrix_positions_member_user_id_fkey` FOREIGN KEY (`member_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `matrix_positions` ADD CONSTRAINT `matrix_positions_sponsor_user_id_fkey` FOREIGN KEY (`sponsor_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
