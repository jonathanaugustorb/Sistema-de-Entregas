package com.controleentregas.dto.response;

import com.controleentregas.domain.entity.TipoMaterial;

import java.time.LocalDateTime;

public record TipoMaterialResponse(
        Long id,
        String nome,
        String descricao,
        Boolean ativo,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
    public static TipoMaterialResponse de(TipoMaterial t) {
        return new TipoMaterialResponse(
                t.getId(), t.getNome(), t.getDescricao(),
                t.getAtivo(), t.getCriadoEm(), t.getAtualizadoEm()
        );
    }
}
