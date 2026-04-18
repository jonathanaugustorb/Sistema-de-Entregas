package com.controleentregas.dto.request;

import com.controleentregas.domain.enums.StatusOperacional;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record VeiculoRequest(

        @NotBlank(message = "Identificação é obrigatória")
        @Size(max = 100, message = "Identificação deve ter no máximo 100 caracteres")
        String identificacao,

        @NotNull(message = "Capacidade máxima é obrigatória")
        @DecimalMin(value = "0.01", message = "Capacidade máxima deve ser maior que zero")
        BigDecimal capacidadeMaxima,

        @Size(max = 100, message = "Tipo de carroceria deve ter no máximo 100 caracteres")
        String tipoCarroceria,

        @NotNull(message = "Status operacional é obrigatório")
        StatusOperacional statusOperacional
) {}
