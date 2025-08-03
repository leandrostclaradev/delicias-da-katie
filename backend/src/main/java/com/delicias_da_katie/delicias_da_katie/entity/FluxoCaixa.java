package com.delicias_da_katie.delicias_da_katie.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FluxoCaixa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private BigDecimal valorUnitario;
    private Integer quantidade;
    private BigDecimal valorTotal;
    private LocalDate data;
    private LocalTime hora;
    @Enumerated(EnumType.STRING)
    private TipoMovimento tipo;

    public enum TipoMovimento {
        ENTRADA,
        SAIDA
    }
} 