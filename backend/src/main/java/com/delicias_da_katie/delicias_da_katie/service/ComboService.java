package com.delicias_da_katie.delicias_da_katie.service;

import com.delicias_da_katie.delicias_da_katie.dto.ComboDTO;
import com.delicias_da_katie.delicias_da_katie.entity.Combo;
import com.delicias_da_katie.delicias_da_katie.entity.ItemCombo;
import com.delicias_da_katie.delicias_da_katie.entity.Produto;
import com.delicias_da_katie.delicias_da_katie.repository.ComboRepository;
import com.delicias_da_katie.delicias_da_katie.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComboService {

    @Autowired
    private ComboRepository comboRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<Combo> listarCombos() {
        return comboRepository.findAll();
    }

    public Combo criarCombo(ComboDTO comboDTO) {
        Combo combo = new Combo();
        combo.setNome(comboDTO.getNome());
        combo.setDescricao(comboDTO.getDescricao());
        combo.setValorTotal(comboDTO.getValorTotal());
        combo.setAtivo(comboDTO.getAtivo() != null ? comboDTO.getAtivo() : true);

        // Converter itens do DTO para entidade
        List<ItemCombo> itens = comboDTO.getItens().stream()
                .map(itemDTO -> {
                    Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
                            .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + itemDTO.getProdutoId()));
                    
                    return ItemCombo.builder()
                            .produto(produto)
                            .quantidade(itemDTO.getQuantidade())
                            .valorUnitario(itemDTO.getValorUnitario())
                            .build();
                })
                .collect(Collectors.toList());

        combo.setItens(itens);
        return comboRepository.save(combo);
    }

    public Combo atualizarCombo(Long id, ComboDTO comboDTO) {
        Combo combo = comboRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Combo não encontrado: " + id));

        combo.setNome(comboDTO.getNome());
        combo.setDescricao(comboDTO.getDescricao());
        combo.setValorTotal(comboDTO.getValorTotal());
        if (comboDTO.getAtivo() != null) {
            combo.setAtivo(comboDTO.getAtivo());
        }

        // Limpar itens existentes e adicionar novos
        combo.getItens().clear();
        
        List<ItemCombo> itens = comboDTO.getItens().stream()
                .map(itemDTO -> {
                    Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
                            .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + itemDTO.getProdutoId()));
                    
                    return ItemCombo.builder()
                            .produto(produto)
                            .quantidade(itemDTO.getQuantidade())
                            .valorUnitario(itemDTO.getValorUnitario())
                            .build();
                })
                .collect(Collectors.toList());

        combo.getItens().addAll(itens);
        return comboRepository.save(combo);
    }
} 