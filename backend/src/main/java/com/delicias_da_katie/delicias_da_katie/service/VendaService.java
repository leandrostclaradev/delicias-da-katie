package com.delicias_da_katie.delicias_da_katie.service;

import com.delicias_da_katie.delicias_da_katie.dto.VendaDTO;
import com.delicias_da_katie.delicias_da_katie.entity.Venda;
import com.delicias_da_katie.delicias_da_katie.entity.ItemVenda;
import com.delicias_da_katie.delicias_da_katie.entity.ItemCombo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VendaService {

    public VendaDTO converterParaDTO(Venda venda) {
        return VendaDTO.builder()
                .id(venda.getId())
                .cliente(venda.getCliente())
                .valorTotal(venda.getValorTotal())
                .dataVenda(venda.getDataVenda())
                .horaVenda(venda.getHoraVenda())
                .status(venda.getStatus().name())
                .itens(venda.getItens().stream()
                        .map(this::converterItemParaDTO)
                        .collect(Collectors.toList()))
                .build();
    }

    public List<VendaDTO> converterListaParaDTO(List<Venda> vendas) {
        return vendas.stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    private VendaDTO.ItemVendaDTO converterItemParaDTO(ItemVenda item) {
        VendaDTO.ItemVendaDTO itemDTO = VendaDTO.ItemVendaDTO.builder()
                .id(item.getId())
                .quantidade(item.getQuantidade())
                .valorUnitario(item.getValorUnitario())
                .valorTotal(item.getValorUnitario().multiply(new java.math.BigDecimal(item.getQuantidade())))
                .build();

        if (item.getProduto() != null) {
            itemDTO.setProduto(VendaDTO.ProdutoDTO.builder()
                    .id(item.getProduto().getId())
                    .nome(item.getProduto().getNome())
                    .valor(item.getProduto().getValor())
                    .dataVencimento(item.getProduto().getDataVencimento() != null ? 
                            item.getProduto().getDataVencimento().toString() : null)
                    .build());
        }

        if (item.getCombo() != null) {
            itemDTO.setCombo(VendaDTO.ComboDTO.builder()
                    .id(item.getCombo().getId())
                    .nome(item.getCombo().getNome())
                    .descricao(item.getCombo().getDescricao())
                    .valorTotal(item.getCombo().getValorTotal())
                    .ativo(item.getCombo().getAtivo())
                    .itens(item.getCombo().getItens().stream()
                            .map(this::converterItemComboParaDTO)
                            .collect(Collectors.toList()))
                    .build());
        }

        return itemDTO;
    }

    private VendaDTO.ItemComboDTO converterItemComboParaDTO(ItemCombo itemCombo) {
        return VendaDTO.ItemComboDTO.builder()
                .id(itemCombo.getId())
                .quantidade(itemCombo.getQuantidade())
                .valorUnitario(itemCombo.getValorUnitario())
                .produto(VendaDTO.ProdutoDTO.builder()
                        .id(itemCombo.getProduto().getId())
                        .nome(itemCombo.getProduto().getNome())
                        .valor(itemCombo.getProduto().getValor())
                        .dataVencimento(itemCombo.getProduto().getDataVencimento() != null ? 
                                itemCombo.getProduto().getDataVencimento().toString() : null)
                        .build())
                .build();
    }
} 