package com.controleentregas.dto.request;

import com.controleentregas.domain.enums.AptidaoChuva;
import com.controleentregas.domain.enums.TipoVia;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LocalidadeRequest(

        @NotBlank(message = "Endereço é obrigatório")
        @Size(min = 5, message = "Endereço deve ter pelo menos 5 caracteres")
        String endereco,

        @NotNull(message = "Tipo de via é obrigatório")
        TipoVia tipoVia,

        @NotNull(message = "Aptidão para chuva é obrigatória")
        AptidaoChuva aptidaoChuva,

        String observacoes
) {}
