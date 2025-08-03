package com.delicias_da_katie.delicias_da_katie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Estrutura: entities, repositories, services, controllers, config, security, seed
// Seed data será carregado ao iniciar a aplicação
@SpringBootApplication
public class DeliciasDaKatieApplication {

	public static void main(String[] args) {
		SpringApplication.run(DeliciasDaKatieApplication.class, args);
	}

}
