-- Prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS quizzer_dev_db;
CREATE USER IF NOT EXISTS 'quizzer_dev'@'localhost' IDENTIFIED BY 'quizzer_dev_pwd';
GRANT ALL PRIVILEGES ON `quizzer_dev_db`.* TO 'quizzer_dev'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'quizzer_dev'@'localhost';
FLUSH PRIVILEGES;