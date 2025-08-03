package com.delicias_da_katie.delicias_da_katie.controller;

import com.delicias_da_katie.delicias_da_katie.dto.VendaDTO;
import com.delicias_da_katie.delicias_da_katie.entity.Venda;
import com.delicias_da_katie.delicias_da_katie.entity.ItemVenda;
import com.delicias_da_katie.delicias_da_katie.entity.Produto;
import com.delicias_da_katie.delicias_da_katie.entity.Combo;
import com.delicias_da_katie.delicias_da_katie.entity.StatusPedido;
import com.delicias_da_katie.delicias_da_katie.repository.VendaRepository;
import com.delicias_da_katie.delicias_da_katie.repository.ProdutoRepository;
import com.delicias_da_katie.delicias_da_katie.repository.ComboRepository;
import com.delicias_da_katie.delicias_da_katie.service.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vendas")
@CrossOrigin(origins = "*")
public class VendaController {

    private static final Logger logger = LoggerFactory.getLogger(VendaController.class);

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ComboRepository comboRepository;

    @Autowired
    private VendaService vendaService;

    @GetMapping
    public List<VendaDTO> listarVendas() {
        List<Venda> vendas = vendaRepository.findAll();
        logger.info("Listando {} vendas", vendas.size());
        
        // Log detalhado dos itens de cada venda
        for (Venda venda : vendas) {
            logger.info("Venda #{} - Cliente: {}, Itens: {}", venda.getId(), venda.getCliente(), venda.getItens().size());
            for (ItemVenda item : venda.getItens()) {
                if (item.getProduto() != null) {
                    logger.info("  - Item produto: {}x {} (R$ {})", 
                        item.getQuantidade(), item.getProduto().getNome(), item.getValorUnitario());
                } else if (item.getCombo() != null) {
                    logger.info("  - Item combo: {}x {} (R$ {}) - {} itens no combo", 
                        item.getQuantidade(), item.getCombo().getNome(), item.getValorUnitario(), 
                        item.getCombo().getItens().size());
                } else {
                    logger.warn("  - Item sem produto nem combo: {}", item);
                }
            }
        }
        
        return vendaService.converterListaParaDTO(vendas);
    }

    @GetMapping("/status/{status}")
    public List<VendaDTO> listarVendasPorStatus(@PathVariable String status) {
        StatusPedido statusPedido = StatusPedido.valueOf(status.toUpperCase());
        List<Venda> vendas = vendaRepository.findAll().stream()
                .filter(venda -> venda.getStatus() == statusPedido)
                .collect(Collectors.toList());
        return vendaService.converterListaParaDTO(vendas);
    }

    @GetMapping("/buscar")
    public List<VendaDTO> buscarVendas(@RequestParam String termo) {
        List<Venda> vendas = vendaRepository.findAll().stream()
                .filter(venda -> 
                    venda.getCliente().toLowerCase().contains(termo.toLowerCase()) ||
                    venda.getId().toString().contains(termo))
                .collect(Collectors.toList());
        return vendaService.converterListaParaDTO(vendas);
    }

    @PostMapping
    public ResponseEntity<?> criarVenda(@RequestBody Map<String, Object> vendaRequest) {
        try {
            logger.info("Recebendo requisição para criar venda: {}", vendaRequest);
            
            String cliente = (String) vendaRequest.get("cliente");
            Double valorTotal = ((Number) vendaRequest.get("valorTotal")).doubleValue();
            String data = (String) vendaRequest.get("data");
            String hora = (String) vendaRequest.get("hora");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> itensData = (List<Map<String, Object>>) vendaRequest.get("itens");

            logger.info("Dados da venda - Cliente: {}, Valor: {}, Data: {}, Hora: {}, Itens: {}", 
                       cliente, valorTotal, data, hora, itensData != null ? itensData.size() : 0);

            Venda venda = Venda.builder()
                    .cliente(cliente)
                    .valorTotal(new java.math.BigDecimal(valorTotal))
                    .dataVenda(java.time.LocalDate.parse(data))
                    .horaVenda(java.time.LocalTime.parse(hora))
                    .status(StatusPedido.PENDENTE)
                    .build();

            // Processar itens da venda
            if (itensData != null && !itensData.isEmpty()) {
                for (Map<String, Object> itemData : itensData) {
                    Integer quantidade = ((Number) itemData.get("quantidade")).intValue();
                    Double valorUnitario = ((Number) itemData.get("valorUnitario")).doubleValue();

                    // Verificar se é produto ou combo
                    Long produtoId = null;
                    Long comboId = null;
                    
                    if (itemData.get("produtoId") != null) {
                        produtoId = ((Number) itemData.get("produtoId")).longValue();
                    }
                    
                    if (itemData.get("comboId") != null) {
                        comboId = ((Number) itemData.get("comboId")).longValue();
                    }

                    logger.info("Processando item - ProdutoId: {}, ComboId: {}, Quantidade: {}, ValorUnitario: {}", 
                               produtoId, comboId, quantidade, valorUnitario);

                    ItemVenda item = null;
                    
                    if (produtoId != null) {
                        // Item é um produto
                        Produto produto = produtoRepository.findById(produtoId).orElse(null);
                        if (produto != null) {
                            item = ItemVenda.builder()
                                    .produto(produto)
                                    .quantidade(quantidade)
                                    .valorUnitario(new java.math.BigDecimal(valorUnitario))
                                    .build();
                            logger.info("Item produto adicionado: {}x {}", quantidade, produto.getNome());
                        } else {
                            logger.warn("Produto não encontrado com ID: {}", produtoId);
                        }
                    } else if (comboId != null) {
                        // Item é um combo
                        Combo combo = comboRepository.findById(comboId).orElse(null);
                        if (combo != null) {
                            item = ItemVenda.builder()
                                    .combo(combo)
                                    .quantidade(quantidade)
                                    .valorUnitario(new java.math.BigDecimal(valorUnitario))
                                    .build();
                            logger.info("Item combo adicionado: {}x {} ({} itens no combo)", 
                                      quantidade, combo.getNome(), combo.getItens().size());
                        } else {
                            logger.warn("Combo não encontrado com ID: {}", comboId);
                        }
                    }
                    
                    if (item != null) {
                        venda.getItens().add(item);
                    }
                }
            }

            Venda vendaSalva = vendaRepository.save(venda);
            logger.info("Venda criada com sucesso. ID: {}", vendaSalva.getId());
            
            return ResponseEntity.ok(vendaService.converterParaDTO(vendaSalva));
        } catch (Exception e) {
            logger.error("Erro ao criar venda", e);
            Map<String, String> errorResponse = new java.util.HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<VendaDTO> atualizarStatus(@PathVariable Long id, @RequestBody Map<String, String> statusRequest) {
        return vendaRepository.findById(id)
                .map(venda -> {
                    StatusPedido novoStatus = StatusPedido.valueOf(statusRequest.get("status").toUpperCase());
                    venda.setStatus(novoStatus);
                    Venda vendaAtualizada = vendaRepository.save(venda);
                    return ResponseEntity.ok(vendaService.converterParaDTO(vendaAtualizada));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendaDTO> buscarVenda(@PathVariable Long id) {
        return vendaRepository.findById(id)
                .map(venda -> ResponseEntity.ok(vendaService.converterParaDTO(venda)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<VendaDTO> atualizarVenda(@PathVariable Long id, @RequestBody Venda venda) {
        return vendaRepository.findById(id)
                .map(existingVenda -> {
                    venda.setId(id);
                    Venda vendaAtualizada = vendaRepository.save(venda);
                    return ResponseEntity.ok(vendaService.converterParaDTO(vendaAtualizada));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarVenda(@PathVariable Long id) {
        return vendaRepository.findById(id)
                .map(venda -> {
                    vendaRepository.delete(venda);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/teste-serializacao")
    public ResponseEntity<?> testeSerializacao() {
        try {
            List<Venda> vendas = vendaRepository.findAll();
            logger.info("=== TESTE DE SERIALIZAÇÃO ===");
            
            for (Venda venda : vendas) {
                logger.info("Venda #{} - Cliente: {}", venda.getId(), venda.getCliente());
                
                for (ItemVenda item : venda.getItens()) {
                    logger.info("  Item ID: {}", item.getId());
                    logger.info("  Quantidade: {}", item.getQuantidade());
                    logger.info("  Valor Unitário: {}", item.getValorUnitario());
                    
                    if (item.getProduto() != null) {
                        logger.info("  Tipo: PRODUTO");
                        logger.info("  Nome do produto: {}", item.getProduto().getNome());
                        logger.info("  Valor do produto: {}", item.getProduto().getValor());
                    } else if (item.getCombo() != null) {
                        logger.info("  Tipo: COMBO");
                        logger.info("  Nome do combo: {}", item.getCombo().getNome());
                        logger.info("  Descrição do combo: {}", item.getCombo().getDescricao());
                        logger.info("  Valor total do combo: {}", item.getCombo().getValorTotal());
                        logger.info("  Quantidade de itens no combo: {}", item.getCombo().getItens().size());
                        
                        for (com.delicias_da_katie.delicias_da_katie.entity.ItemCombo comboItem : item.getCombo().getItens()) {
                            logger.info("    - {}x {} (R$ {})", 
                                comboItem.getQuantidade(), 
                                comboItem.getProduto().getNome(), 
                                comboItem.getValorUnitario());
                        }
                    } else {
                        logger.warn("  Item sem produto nem combo!");
                    }
                    logger.info("  ---");
                }
            }
            
            Map<String, String> response = new java.util.HashMap<>();
            response.put("message", "Logs de serialização gerados");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Erro no teste de serialização", e);
            Map<String, String> errorResponse = new java.util.HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
} 