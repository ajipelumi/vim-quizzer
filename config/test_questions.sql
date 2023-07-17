-- Dump Vim Questions into MySQL

-- Use the database
USE quizzer_test_db;

-- Drop the tables if they exist
DROP TABLE IF EXISTS `questions`;
DROP TABLE IF EXISTS `incorrect_answers`;

-- Create the tables
CREATE TABLE `questions` (
    `id` varchar(60) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `question` varchar(255) NOT NULL,
    `correct_answer` varchar(128) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `incorrect_answers` (
    `id` varchar(60) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `question_id` varchar(60) NOT NULL,
    `incorrect_answer` varchar(128) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `incorrect_answers_question_id_foreign` (`question_id`),
    CONSTRAINT `incorrect_answers_question_id_foreign` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `questions` WRITE, `incorrect_answers` WRITE;

-- Insert Questions
INSERT INTO `questions` (`id`, `created_at`, `updated_at`, `question`, `correct_answer`)
VALUES
    ('05b0b99c-f10e-4e3a-88d1-b3187d6998ee', '2023-07-07 00:00', '2023-07-07 00:00', 'What command is used to save and exit Vim?', ':wq'),
    ('1721b75c-e0b2-46ae-8dd2-f86b62fb46e6', '2023-07-07 00:00', '2023-07-07 00:00', 'What command is used to exit Vim without saving?', ':q!'),
    ('14e2f358-f8fb-419c-8e8f-0017f971d82d', '2023-07-07 00:00', '2023-07-07 00:00', 'What command is used to exit Vim?', ':q');

-- Insert the incorrect answers
INSERT INTO incorrect_answers (`id`, `created_at`, `updated_at`, `question_id`, `incorrect_answer`)
VALUES
    ('5e061866-d4ad-4aa7-befe-2bf5f8698e29', '2023-07-07 00:00', '2023-07-07 00:00', '05b0b99c-f10e-4e3a-88d1-b3187d6998ee', ':w'),
    ('660c9bbd-76c4-454f-b9a4-87efab0e948f', '2023-07-07 00:00', '2023-07-07 00:00', '05b0b99c-f10e-4e3a-88d1-b3187d6998ee', ':e'),
    ('6a1ea750-b16f-4814-ad7e-9f25e3843f53', '2023-07-07 00:00', '2023-07-07 00:00', '05b0b99c-f10e-4e3a-88d1-b3187d6998ee', ':x'),
    ('712ffb97-b0eb-42f9-8cb9-69548882ab5d', '2023-07-07 00:00', '2023-07-07 00:00', '1721b75c-e0b2-46ae-8dd2-f86b62fb46e6', ':q'),
    ('79ff14a4-1888-4cd3-8a31-230fa34bfa00', '2023-07-07 00:00', '2023-07-07 00:00', '1721b75c-e0b2-46ae-8dd2-f86b62fb46e6', ':e'),
    ('94f16095-5ce6-4bec-8114-d1f3fa6f2b16', '2023-07-07 00:00', '2023-07-07 00:00', '1721b75c-e0b2-46ae-8dd2-f86b62fb46e6', ':w'),
    ('a5e4fa5a-2a0d-4c7c-b824-d318409e11e8', '2023-07-07 00:00', '2023-07-07 00:00', '14e2f358-f8fb-419c-8e8f-0017f971d82d', ':wq'),
    ('b11616e0-fa23-4939-bd3f-0e178de3530b', '2023-07-07 00:00', '2023-07-07 00:00', '14e2f358-f8fb-419c-8e8f-0017f971d82d', ':x'),
    ('c49639ab-d287-40ec-8a31-76b493cd9a3a', '2023-07-07 00:00', '2023-07-07 00:00', '14e2f358-f8fb-419c-8e8f-0017f971d82d', ':q!');

UNLOCK TABLES;

-- sudo mysql -u quizzer_test -p < test_questions.sql
