package com.delicias_da_katie.delicias_da_katie.repository;

import com.delicias_da_katie.delicias_da_katie.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {} 