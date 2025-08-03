package com.delicias_da_katie.delicias_da_katie.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Combo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @JsonProperty("nome")
    private String nome;
    
    @JsonProperty("descricao")
    private String descricao;
    
    @JsonProperty("valorTotal")
    private BigDecimal valorTotal;
    
    @JsonProperty("ativo")
    private Boolean ativo;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonProperty("itens")
    @Builder.Default
    private List<ItemCombo> itens = new java.util.ArrayList<>();
} 