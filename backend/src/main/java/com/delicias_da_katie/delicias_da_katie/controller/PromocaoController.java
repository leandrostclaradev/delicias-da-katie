package com.delicias_da_katie.delicias_da_katie.controller;

import com.delicias_da_katie.delicias_da_katie.entity.ItemPromocional;
import com.delicias_da_katie.delicias_da_katie.repository.ItemPromocionalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promocoes")
@CrossOrigin(origins = "*")
public class PromocaoController {

    @Autowired
    private ItemPromocionalRepository itemPromocionalRepository;

    @GetMapping
    public List<ItemPromocional> listarPromocoes() {
        return itemPromocionalRepository.findAll();
    }

    @PostMapping
    public ItemPromocional criarPromocao(@RequestBody ItemPromocional promocao) {
        return itemPromocionalRepository.save(promocao);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemPromocional> buscarPromocao(@PathVariable Long id) {
        return itemPromocionalRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemPromocional> atualizarPromocao(@PathVariable Long id, @RequestBody ItemPromocional promocao) {
        return itemPromocionalRepository.findById(id)
                .map(existingPromocao -> {
                    promocao.setId(id);
                    return ResponseEntity.ok(itemPromocionalRepository.save(promocao));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarPromocao(@PathVariable Long id) {
        return itemPromocionalRepository.findById(id)
                .map(promocao -> {
                    itemPromocionalRepository.delete(promocao);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 