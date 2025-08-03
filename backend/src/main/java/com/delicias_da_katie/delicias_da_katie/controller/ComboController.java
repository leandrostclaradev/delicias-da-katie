package com.delicias_da_katie.delicias_da_katie.controller;

import com.delicias_da_katie.delicias_da_katie.dto.ComboDTO;
import com.delicias_da_katie.delicias_da_katie.entity.Combo;
import com.delicias_da_katie.delicias_da_katie.repository.ComboRepository;
import com.delicias_da_katie.delicias_da_katie.service.ComboService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/combos")
@CrossOrigin(origins = "*")
public class ComboController {

    @Autowired
    private ComboRepository comboRepository;

    @Autowired
    private ComboService comboService;

    @GetMapping
    public List<Combo> listarCombos() {
        return comboService.listarCombos();
    }

    @PostMapping
    public Combo criarCombo(@RequestBody ComboDTO comboDTO) {
        return comboService.criarCombo(comboDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Combo> buscarCombo(@PathVariable Long id) {
        return comboRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Combo> atualizarCombo(@PathVariable Long id, @RequestBody ComboDTO comboDTO) {
        try {
            Combo combo = comboService.atualizarCombo(id, comboDTO);
            return ResponseEntity.ok(combo);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarCombo(@PathVariable Long id) {
        return comboRepository.findById(id)
                .map(combo -> {
                    comboRepository.delete(combo);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Combo> alterarStatus(@PathVariable Long id, @RequestBody StatusRequest request) {
        return comboRepository.findById(id)
                .map(combo -> {
                    combo.setAtivo(request.getAtivo());
                    return ResponseEntity.ok(comboRepository.save(combo));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    public static class StatusRequest {
        private Boolean ativo;
        
        public Boolean getAtivo() {
            return ativo;
        }
        
        public void setAtivo(Boolean ativo) {
            this.ativo = ativo;
        }
    }
} 