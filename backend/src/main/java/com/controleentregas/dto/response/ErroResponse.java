package com.controleentregas.dto.response;

import java.util.List;

public record ErroResponse(
        String code,
        String message,
        List<ErroDetalhe> details
) {
    public record ErroDetalhe(String field, String message) {}

    public static ErroResponse simples(String code, String message) {
        return new ErroResponse(code, message, List.of());
    }
}
