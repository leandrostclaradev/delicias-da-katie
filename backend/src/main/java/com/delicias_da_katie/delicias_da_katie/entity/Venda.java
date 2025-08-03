package com.delicias_da_katie.delicias_da_katie.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String cliente;
    @OneToMany(cascade = CascadeType.ALL)
    @Builder.Default
    private List<ItemVenda> itens = new java.util.ArrayList<>();
    private BigDecimal valorTotal;
    private LocalDate dataVenda;
    private LocalTime horaVenda;
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatusPedido status = StatusPedido.PENDENTE;
} 