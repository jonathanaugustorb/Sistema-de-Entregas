package com.controleentregas.repository;

import com.controleentregas.domain.entity.Motorista;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MotoristaRepository extends JpaRepository<Motorista, Long> {

    Page<Motorista> findByAtivo(Boolean ativo, Pageable pageable);

    Page<Motorista> findByNomeContainingIgnoreCaseAndAtivo(String nome, Boolean ativo, Pageable pageable);

    Page<Motorista> findByNomeContainingIgnoreCase(String nome, Pageable pageable);

    boolean existsByNumeroCnh(String numeroCnh);

    boolean existsByNumeroCnhAndIdNot(String numeroCnh, Long id);
}
