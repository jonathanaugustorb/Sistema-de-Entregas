package com.controleentregas.repository;

import com.controleentregas.domain.entity.Veiculo;
import com.controleentregas.domain.enums.StatusOperacional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {

    Page<Veiculo> findByStatusOperacional(StatusOperacional status, Pageable pageable);

    boolean existsByIdentificacao(String identificacao);

    boolean existsByIdentificacaoAndIdNot(String identificacao, Long id);
}
