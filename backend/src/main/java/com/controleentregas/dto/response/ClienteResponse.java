package com.controleentregas.dto.response;

import com.controleentregas.domain.entity.Cliente;

import java.time.LocalDateTime;

public record ClienteResponse(
        Long id,
        String nome,
        String enderecoCompleto,
        String pontoReferencia,
        String telefone,
        Boolean ativo,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
    public static ClienteResponse de(Cliente c) {
        return new ClienteResponse(
                c.getId(), c.getNome(), c.getEnderecoCompleto(),
                c.getPontoReferencia(), c.getTelefone(), c.getAtivo(),
                c.getCriadoEm(), c.getAtualizadoEm()
        );
    }
}
