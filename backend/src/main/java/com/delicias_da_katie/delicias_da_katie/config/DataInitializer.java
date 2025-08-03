package com.delicias_da_katie.delicias_da_katie.config;

import com.delicias_da_katie.delicias_da_katie.entity.Usuario;
import com.delicias_da_katie.delicias_da_katie.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Verificar se já existe um usuário administrador
        if (!usuarioRepository.findByEmail("admin@confeitaria.com").isPresent()) {
            String senhaCriptografada = passwordEncoder.encode("123456");
            System.out.println("=== INICIALIZAÇÃO DO BANCO ===");
            System.out.println("Criando usuário administrador...");
            System.out.println("Email: admin@confeitaria.com");
            System.out.println("Senha: 123456");
            System.out.println("Senha criptografada: " + senhaCriptografada);
            
            Usuario admin = Usuario.builder()
                    .nome("Administrador")
                    .email("admin@confeitaria.com")
                    .senha(senhaCriptografada)
                    .cargo(Usuario.Cargo.ADMIN)
                    .build();
            
            usuarioRepository.save(admin);
            System.out.println("✅ Usuário administrador criado com sucesso!");
            System.out.println("=== FIM DA INICIALIZAÇÃO ===");
        } else {
            System.out.println("ℹ️  Usuário administrador já existe no banco!");
        }
    }
}