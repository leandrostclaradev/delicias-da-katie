package com.delicias_da_katie.delicias_da_katie.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemEncomenda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Produto produto;
    private Integer quantidade;
    private BigDecimal valorUnitario;
} 