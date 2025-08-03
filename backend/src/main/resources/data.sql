-- Dados iniciais para teste
-- Senha: 123456 (criptografada com BCrypt)

INSERT INTO usuario (nome, email, senha, cargo) VALUES 
('Administrador', 'admin@confeitaria.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ADMIN');