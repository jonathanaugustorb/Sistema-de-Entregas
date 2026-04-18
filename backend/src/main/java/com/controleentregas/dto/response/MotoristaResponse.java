package com.controleentregas.dto.response;

import com.controleentregas.domain.entity.Motorista;

import java.time.LocalDateTime;

public record MotoristaResponse(
        Long id,
        String nome,
        String numeroCnh,
        String tipoHabilitacao,
        String veiculoHabitual,
        String contato,
        Boolean ativo,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
    public static MotoristaResponse de(Motorista m) {
        return new MotoristaResponse(
                m.getId(), m.getNome(), m.getNumeroCnh(),
                m.getTipoHabilitacao(), m.getVeiculoHabitual(),
                m.getContato(), m.getAtivo(),
                m.getCriadoEm(), m.getAtualizadoEm()
        );
    }
}
