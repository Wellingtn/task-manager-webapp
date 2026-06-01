CREATE DATABASE IF NOT EXISTS task_manager
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE task_manager;

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  status ENUM('pendente', 'concluida') NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, description, status)
VALUES
  ('Configurar servidor', 'Instalar Node.js, MySQL e dependências.', 'pendente'),
  ('Criar banco de dados', 'Executar o arquivo database.sql no MySQL.', 'concluida'),
  ('Subir aplicação', 'Iniciar backend com PM2 na VM.', 'pendente');
