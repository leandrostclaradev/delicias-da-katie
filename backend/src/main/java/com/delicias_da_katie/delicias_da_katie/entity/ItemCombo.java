package com.delicias_da_katie.delicias_da_katie.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemCombo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JsonProperty("produto")
    private Produto produto;
    
    @JsonProperty("quantidade")
    private Integer quantidade;
    
    @JsonProperty("valorUnitario")
    private BigDecimal valorUnitario;
}