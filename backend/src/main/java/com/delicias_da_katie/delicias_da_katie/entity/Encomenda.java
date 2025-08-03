package com.delicias_da_katie.delicias_da_katie.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Encomenda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String cliente;
    private String descricao;
    private LocalDate dataEntrega;
    private BigDecimal valor;
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatusPedido status = StatusPedido.PENDENTE;
    @OneToMany(cascade = CascadeType.ALL)
    @Builder.Default
    private List<ItemEncomenda> itens = new java.util.ArrayList<>();
} 