package com.controleentregas.exception;

import com.controleentregas.dto.response.ErroResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErroResponse handleRecursoNaoEncontrado(RecursoNaoEncontradoException ex) {
        return ErroResponse.simples("RECURSO_NAO_ENCONTRADO", ex.getMessage());
    }

    @ExceptionHandler(ConflitoUnicidadeException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErroResponse handleConflitoUnicidade(ConflitoUnicidadeException ex) {
        return ErroResponse.simples("CONFLITO_UNICIDADE", ex.getMessage());
    }

    @ExceptionHandler(OperacaoInvalidaException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErroResponse handleOperacaoInvalida(OperacaoInvalidaException ex) {
        return ErroResponse.simples("OPERACAO_INVALIDA", ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErroResponse handleValidacao(MethodArgumentNotValidException ex) {
        List<ErroResponse.ErroDetalhe> detalhes = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getField)
                .distinct()
                .map(field -> {
                    String msg = ex.getBindingResult().getFieldErrors(field).stream()
                            .findFirst()
                            .map(FieldError::getDefaultMessage)
                            .orElse("Valor inválido");
                    return new ErroResponse.ErroDetalhe(field, msg);
                })
                .toList();

        return new ErroResponse("VALIDATION_ERROR", "Dados inválidos. Verifique os campos informados.", detalhes);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErroResponse handleIntegridade(DataIntegrityViolationException ex) {
        return ErroResponse.simples("CONFLITO_UNICIDADE",
                "Já existe um registro com os dados informados. Verifique campos únicos como CNH ou identificação do veículo.");
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErroResponse handleGenerico(Exception ex) {
        return ErroResponse.simples("ERRO_INTERNO", "Ocorreu um erro inesperado. Tente novamente.");
    }
}
