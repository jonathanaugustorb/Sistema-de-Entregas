package com.controleentregas.repository;

import com.controleentregas.domain.entity.Localidade;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocalidadeRepository extends JpaRepository<Localidade, Long> {

    Page<Localidade> findByEnderecoContainingIgnoreCase(String endereco, Pageable pageable);
}
