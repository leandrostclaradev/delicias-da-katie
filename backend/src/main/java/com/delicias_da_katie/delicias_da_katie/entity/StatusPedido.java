package com.delicias_da_katie.delicias_da_katie.entity;

public enum StatusPedido {
    PENDENTE("Pendente"),
    EM_PREPARO("Em Preparo"),
    PRONTO("Pronto"),
    ENTREGUE("Entregue"),
    CANCELADO("Cancelado");

    private final String descricao;

    StatusPedido(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}