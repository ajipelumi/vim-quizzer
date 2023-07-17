-- Prepares a MySQL server for the project

-- Drop the database if it exists
DROP DATABASE IF EXISTS quizzer_test_db;

-- Set the password policy
USE sys;
CALL set_password_policy();

-- Create the database
CREATE DATABASE IF NOT EXISTS quizzer_test_db;
CREATE USER IF NOT EXISTS 'quizzer_test'@'localhost' IDENTIFIED BY 'quizzer_test_pwd';
GRANT ALL PRIVILEGES ON `quizzer_test_db`.* TO 'quizzer_test'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'quizzer_test'@'localhost';
FLUSH PRIVILEGES;
