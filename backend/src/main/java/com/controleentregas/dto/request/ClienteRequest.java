package com.controleentregas.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClienteRequest(

        @NotBlank(message = "Nome é obrigatório")
        @Size(min = 2, max = 255, message = "Nome deve ter entre 2 e 255 caracteres")
        String nome,

        @NotBlank(message = "Endereço completo é obrigatório")
        @Size(min = 5, message = "Endereço deve ter pelo menos 5 caracteres")
        String enderecoCompleto,

        String pontoReferencia,

        @Size(min = 8, max = 20, message = "Telefone deve ter entre 8 e 20 caracteres")
        String telefone
) {}
