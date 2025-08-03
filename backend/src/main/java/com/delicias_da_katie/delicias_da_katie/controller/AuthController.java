package com.delicias_da_katie.delicias_da_katie.controller;

import com.delicias_da_katie.delicias_da_katie.entity.Usuario;
import com.delicias_da_katie.delicias_da_katie.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String senha = loginRequest.get("senha");

        System.out.println("Tentativa de login - Email: " + email);
        System.out.println("Senha fornecida: " + senha);

        return usuarioRepository.findByEmail(email)
                .map(usuario -> {
                    System.out.println("Usuário encontrado: " + usuario.getNome());
                    System.out.println("Senha armazenada: " + usuario.getSenha());
                    
                    boolean senhaCorreta = passwordEncoder.matches(senha, usuario.getSenha());
                    System.out.println("Senha está correta: " + senhaCorreta);
                    
                    if (senhaCorreta) {
                        Map<String, Object> response = new HashMap<>();
                        response.put("token", "fake-jwt-token-" + usuario.getId());
                        response.put("user", usuario);
                        return ResponseEntity.ok(response);
                    } else {
                        return ResponseEntity.status(401).body(Collections.singletonMap("message", "Credenciais inválidas"));
                    }
                })
                .orElse(ResponseEntity.status(401).body(Collections.singletonMap("message", "Credenciais inválidas")));
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return usuarioRepository.findByEmail("admin@confeitaria.com")
                .map(usuario -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("usuario", usuario.getNome());
                    response.put("email", usuario.getEmail());
                    response.put("senha_hash", usuario.getSenha());
                    response.put("senha_123456_valida", passwordEncoder.matches("123456", usuario.getSenha()));
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.ok(Collections.singletonMap("message", "Usuário não encontrado")));
    }
} 