package com.delicias_da_katie.delicias_da_katie.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComboDTO {
    private Long id;
    private String nome;
    private String descricao;
    private BigDecimal valorTotal;
    private Boolean ativo;
    private List<ItemComboDTO> itens;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ItemComboDTO {
        private Long produtoId;
        private Integer quantidade;
        private BigDecimal valorUnitario;
    }
} 