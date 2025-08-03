package com.delicias_da_katie.delicias_da_katie.controller;

import com.delicias_da_katie.delicias_da_katie.entity.Encomenda;
import com.delicias_da_katie.delicias_da_katie.entity.ItemEncomenda;
import com.delicias_da_katie.delicias_da_katie.entity.Produto;
import com.delicias_da_katie.delicias_da_katie.entity.StatusPedido;
import com.delicias_da_katie.delicias_da_katie.repository.EncomendaRepository;
import com.delicias_da_katie.delicias_da_katie.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/encomendas")
@CrossOrigin(origins = "*")
public class EncomendaController {

    private static final Logger logger = LoggerFactory.getLogger(EncomendaController.class);

    @Autowired
    private EncomendaRepository encomendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @GetMapping
    public List<Encomenda> listarEncomendas() {
        return encomendaRepository.findAll();
    }

    @GetMapping("/status/{status}")
    public List<Encomenda> listarEncomendasPorStatus(@PathVariable String status) {
        StatusPedido statusPedido = StatusPedido.valueOf(status.toUpperCase());
        return encomendaRepository.findAll().stream()
                .filter(encomenda -> encomenda.getStatus() == statusPedido)
                .collect(Collectors.toList());
    }

    @GetMapping("/buscar")
    public List<Encomenda> buscarEncomendas(@RequestParam String termo) {
        return encomendaRepository.findAll().stream()
                .filter(encomenda -> 
                    encomenda.getCliente().toLowerCase().contains(termo.toLowerCase()) ||
                    encomenda.getId().toString().contains(termo))
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> criarEncomenda(@RequestBody Map<String, Object> encomendaRequest) {
        try {
            logger.info("Recebendo requisição para criar encomenda: {}", encomendaRequest);
            
            String cliente = (String) encomendaRequest.get("cliente");
            String descricao = (String) encomendaRequest.get("descricao");
            String dataEntrega = (String) encomendaRequest.get("dataEntrega");
            Double valor = ((Number) encomendaRequest.get("valor")).doubleValue();
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> itensData = (List<Map<String, Object>>) encomendaRequest.get("itens");

            logger.info("Dados da encomenda - Cliente: {}, Descrição: {}, DataEntrega: {}, Valor: {}, Itens: {}", 
                       cliente, descricao, dataEntrega, valor, itensData != null ? itensData.size() : 0);

            Encomenda encomenda = Encomenda.builder()
                    .cliente(cliente)
                    .descricao(descricao)
                    .dataEntrega(java.time.LocalDate.parse(dataEntrega))
                    .valor(new java.math.BigDecimal(valor))
                    .status(StatusPedido.PENDENTE)
                    .build();

            // Processar itens da encomenda
            if (itensData != null && !itensData.isEmpty()) {
                for (Map<String, Object> itemData : itensData) {
                    Long produtoId = ((Number) itemData.get("produtoId")).longValue();
                    Integer quantidade = ((Number) itemData.get("quantidade")).intValue();
                    Double valorUnitario = ((Number) itemData.get("valorUnitario")).doubleValue();

                    logger.info("Processando item - ProdutoId: {}, Quantidade: {}, ValorUnitario: {}", 
                               produtoId, quantidade, valorUnitario);

                    Produto produto = produtoRepository.findById(produtoId).orElse(null);
                    if (produto != null) {
                        ItemEncomenda item = ItemEncomenda.builder()
                                .produto(produto)
                                .quantidade(quantidade)
                                .valorUnitario(new java.math.BigDecimal(valorUnitario))
                                .build();
                        encomenda.getItens().add(item);
                        logger.info("Item adicionado: {}x {}", quantidade, produto.getNome());
                    } else {
                        logger.warn("Produto não encontrado com ID: {}", produtoId);
                    }
                }
            }

            Encomenda encomendaSalva = encomendaRepository.save(encomenda);
            logger.info("Encomenda criada com sucesso. ID: {}", encomendaSalva.getId());
            
            return ResponseEntity.ok(encomendaSalva);
        } catch (Exception e) {
            logger.error("Erro ao criar encomenda", e);
            Map<String, String> errorResponse = new java.util.HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Encomenda> atualizarStatus(@PathVariable Long id, @RequestBody Map<String, String> statusRequest) {
        return encomendaRepository.findById(id)
                .map(encomenda -> {
                    StatusPedido novoStatus = StatusPedido.valueOf(statusRequest.get("status").toUpperCase());
                    encomenda.setStatus(novoStatus);
                    return ResponseEntity.ok(encomendaRepository.save(encomenda));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Encomenda> buscarEncomenda(@PathVariable Long id) {
        return encomendaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Encomenda> atualizarEncomenda(@PathVariable Long id, @RequestBody Encomenda encomenda) {
        return encomendaRepository.findById(id)
                .map(existingEncomenda -> {
                    encomenda.setId(id);
                    return ResponseEntity.ok(encomendaRepository.save(encomenda));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarEncomenda(@PathVariable Long id) {
        return encomendaRepository.findById(id)
                .map(encomenda -> {
                    encomendaRepository.delete(encomenda);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 