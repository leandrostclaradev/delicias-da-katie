package com.delicias_da_katie.delicias_da_katie.config;

import com.delicias_da_katie.delicias_da_katie.entity.Usuario;
import com.delicias_da_katie.delicias_da_katie.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== INICIANDO VERIFICAÇÃO DO BANCO ===");
        
        // Verificar se já existe um usuário administrador
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail("admin@confeitaria.com");
        
        if (usuarioExistente.isPresent()) {
            System.out.println("ℹ️  Usuário administrador já existe no banco!");
            Usuario admin = usuarioExistente.get();
            System.out.println("ID: " + admin.getId());
            System.out.println("Nome: " + admin.getNome());
            System.out.println("Email: " + admin.getEmail());
            System.out.println("Senha hash: " + admin.getSenha());
            System.out.println("Cargo: " + admin.getCargo());
            
            // Testar se a senha 123456 funciona
            boolean senhaValida = passwordEncoder.matches("123456", admin.getSenha());
            System.out.println("Senha '123456' é válida: " + senhaValida);
        } else {
            String senhaCriptografada = passwordEncoder.encode("123456");
            System.out.println("=== CRIANDO USUÁRIO ADMINISTRADOR ===");
            System.out.println("Email: admin@confeitaria.com");
            System.out.println("Senha: 123456");
            System.out.println("Senha criptografada: " + senhaCriptografada);
            
            Usuario admin = Usuario.builder()
                    .nome("Administrador")
                    .email("admin@confeitaria.com")
                    .senha(senhaCriptografada)
                    .cargo(Usuario.Cargo.ADMIN)
                    .build();
            
            Usuario adminSalvo = usuarioRepository.save(admin);
            System.out.println("✅ Usuário administrador criado com sucesso!");
            System.out.println("ID do usuário criado: " + adminSalvo.getId());
            System.out.println("=== FIM DA CRIAÇÃO ===");
        }
        
        System.out.println("=== FIM DA VERIFICAÇÃO DO BANCO ===");
    }
}