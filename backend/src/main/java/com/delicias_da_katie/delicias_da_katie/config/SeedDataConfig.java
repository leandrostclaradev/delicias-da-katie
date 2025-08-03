package com.delicias_da_katie.delicias_da_katie.config;

import com.delicias_da_katie.delicias_da_katie.entity.Usuario;
import com.delicias_da_katie.delicias_da_katie.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class SeedDataConfig {
    
    @Bean
    CommandLineRunner initDatabase(UsuarioRepository usuarioRepo) {
        return args -> {
            // Criar usuário admin padrão se não existir
            if (!usuarioRepo.findByEmail("admin@confeitaria.com").isPresent()) {
                usuarioRepo.save(Usuario.builder()
                        .nome("Administrador")
                        .email("admin@confeitaria.com")
                        .senha(new BCryptPasswordEncoder().encode("123456"))
                        .cargo(Usuario.Cargo.ADMIN)
                        .build());
            }
        };
    }
} 