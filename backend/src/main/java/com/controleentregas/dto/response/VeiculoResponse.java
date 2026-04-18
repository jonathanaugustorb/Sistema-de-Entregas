package com.controleentregas.dto.response;

import com.controleentregas.domain.entity.Veiculo;
import com.controleentregas.domain.enums.StatusOperacional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record VeiculoResponse(
        Long id,
        String identificacao,
        BigDecimal capacidadeMaxima,
        String tipoCarroceria,
        StatusOperacional statusOperacional,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
    public static VeiculoResponse de(Veiculo v) {
        return new VeiculoResponse(
                v.getId(), v.getIdentificacao(), v.getCapacidadeMaxima(),
                v.getTipoCarroceria(), v.getStatusOperacional(),
                v.getCriadoEm(), v.getAtualizadoEm()
        );
    }
}
