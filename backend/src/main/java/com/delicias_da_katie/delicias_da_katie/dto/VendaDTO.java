package com.delicias_da_katie.delicias_da_katie.dto;

import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendaDTO {
    private Long id;
    private String cliente;
    private BigDecimal valorTotal;
    private LocalDate dataVenda;
    private LocalTime horaVenda;
    private String status;
    private List<ItemVendaDTO> itens;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ItemVendaDTO {
        private Long id;
        private Integer quantidade;
        private BigDecimal valorUnitario;
        private BigDecimal valorTotal;
        
        @JsonProperty("produto")
        private ProdutoDTO produto;
        
        @JsonProperty("combo")
        private ComboDTO combo;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProdutoDTO {
        private Long id;
        private String nome;
        private BigDecimal valor;
        private String dataVencimento;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ComboDTO {
        private Long id;
        private String nome;
        private String descricao;
        private BigDecimal valorTotal;
        private Boolean ativo;
        private List<ItemComboDTO> itens;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ItemComboDTO {
        private Long id;
        private Integer quantidade;
        private BigDecimal valorUnitario;
        private ProdutoDTO produto;
    }
} 