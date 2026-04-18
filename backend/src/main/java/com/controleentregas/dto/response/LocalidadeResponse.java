package com.controleentregas.dto.response;

import com.controleentregas.domain.entity.Localidade;
import com.controleentregas.domain.enums.AptidaoChuva;
import com.controleentregas.domain.enums.TipoVia;

import java.time.LocalDateTime;

public record LocalidadeResponse(
        Long id,
        String endereco,
        TipoVia tipoVia,
        AptidaoChuva aptidaoChuva,
        String observacoes,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
    public static LocalidadeResponse de(Localidade l) {
        return new LocalidadeResponse(
                l.getId(), l.getEndereco(), l.getTipoVia(),
                l.getAptidaoChuva(), l.getObservacoes(),
                l.getCriadoEm(), l.getAtualizadoEm()
        );
    }
}
