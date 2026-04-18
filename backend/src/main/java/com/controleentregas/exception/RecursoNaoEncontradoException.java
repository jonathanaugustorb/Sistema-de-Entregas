package com.controleentregas.exception;

public class RecursoNaoEncontradoException extends RuntimeException {

    public RecursoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }

    public static RecursoNaoEncontradoException porId(String recurso, Long id) {
        return new RecursoNaoEncontradoException(
                "%s com id %d não encontrado.".formatted(recurso, id)
        );
    }
}
