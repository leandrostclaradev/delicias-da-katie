package com.delicias_da_katie.delicias_da_katie.controller;

import com.delicias_da_katie.delicias_da_katie.entity.FluxoCaixa;
import com.delicias_da_katie.delicias_da_katie.repository.FluxoCaixaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fluxo-caixa")
@CrossOrigin(origins = "*")
public class FluxoCaixaController {

    @Autowired
    private FluxoCaixaRepository fluxoCaixaRepository;

    @GetMapping
    public List<FluxoCaixa> listarFluxoCaixa() {
        return fluxoCaixaRepository.findAll();
    }

    @PostMapping
    public FluxoCaixa criarFluxoCaixa(@RequestBody FluxoCaixa fluxoCaixa) {
        return fluxoCaixaRepository.save(fluxoCaixa);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FluxoCaixa> buscarFluxoCaixa(@PathVariable Long id) {
        return fluxoCaixaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<FluxoCaixa> atualizarFluxoCaixa(@PathVariable Long id, @RequestBody FluxoCaixa fluxoCaixa) {
        return fluxoCaixaRepository.findById(id)
                .map(existingFluxoCaixa -> {
                    fluxoCaixa.setId(id);
                    return ResponseEntity.ok(fluxoCaixaRepository.save(fluxoCaixa));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarFluxoCaixa(@PathVariable Long id) {
        return fluxoCaixaRepository.findById(id)
                .map(fluxoCaixa -> {
                    fluxoCaixaRepository.delete(fluxoCaixa);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 