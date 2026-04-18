package com.controleentregas.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record MotoristaRequest(

        @NotBlank(message = "Nome é obrigatório")
        @Size(min = 2, max = 255, message = "Nome deve ter entre 2 e 255 caracteres")
        String nome,

        @NotBlank(message = "Número da CNH é obrigatório")
        @Pattern(regexp = "\\d{11}", message = "CNH deve conter exatamente 11 dígitos numéricos")
        String numeroCnh,

        @NotBlank(message = "Tipo de habilitação é obrigatório")
        @Pattern(regexp = "^(A|B|C|D|E|AB|AC|AD|AE)$",
                 message = "Tipo de habilitação inválido. Valores aceitos: A, B, C, D, E, AB, AC, AD, AE")
        String tipoHabilitacao,

        @Size(max = 100, message = "Veículo habitual deve ter no máximo 100 caracteres")
        String veiculoHabitual,

        @Size(max = 20, message = "Contato deve ter no máximo 20 caracteres")
        String contato
) {}
