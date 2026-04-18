package com.controleentregas.repository;

import com.controleentregas.domain.entity.TipoMaterial;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TipoMaterialRepository extends JpaRepository<TipoMaterial, Long> {

    Page<TipoMaterial> findByAtivo(Boolean ativo, Pageable pageable);

    boolean existsByNome(String nome);

    boolean existsByNomeAndIdNot(String nome, Long id);
}
