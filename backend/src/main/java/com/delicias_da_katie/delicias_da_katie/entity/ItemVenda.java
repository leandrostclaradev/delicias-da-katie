package com.delicias_da_katie.delicias_da_katie.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemVenda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    private Produto produto;
    
    @ManyToOne(fetch = FetchType.EAGER)
    private Combo combo;
    
    private Integer quantidade;
    private BigDecimal valorUnitario;
    
    // Método para determinar o tipo do item
    public String getTipo() {
        if (produto != null) {
            return "produto";
        } else if (combo != null) {
            return "combo";
        }
        return "desconhecido";
    }
    
    // Método para obter o nome do item
    public String getNome() {
        if (produto != null) {
            return produto.getNome();
        } else if (combo != null) {
            return combo.getNome();
        }
        return "Item desconhecido";
    }
} 