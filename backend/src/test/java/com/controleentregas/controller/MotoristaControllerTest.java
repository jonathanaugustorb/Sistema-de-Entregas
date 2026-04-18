package com.controleentregas.controller;

import com.controleentregas.dto.request.MotoristaRequest;
import com.controleentregas.dto.response.MotoristaResponse;
import com.controleentregas.dto.response.PageResponse;
import com.controleentregas.exception.ConflitoUnicidadeException;
import com.controleentregas.exception.GlobalExceptionHandler;
import com.controleentregas.service.MotoristaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MotoristaController.class)
@Import(GlobalExceptionHandler.class)
@DisplayName("MotoristaController — testes de integração HTTP")
class MotoristaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MotoristaService service;

    private MotoristaResponse motoristaResponse() {
        return new MotoristaResponse(1L, "Carlos Oliveira",
                "12345678901", "C", "Caminhão Toco", "11999991111",
                true, LocalDateTime.now(), null);
    }

    @Test
    @DisplayName("GET /api/motoristas — deve retornar lista paginada")
    void listar_retornaListaPaginada() throws Exception {
        var page = new PageResponse<>(List.of(motoristaResponse()), 1L, 1, 0, 10);
        when(service.listar(anyBoolean(), any(), any())).thenReturn(page);

        mockMvc.perform(get("/api/motoristas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].numeroCnh").value("12345678901"));
    }

    @Test
    @DisplayName("POST /api/motoristas — deve retornar 409 com CNH duplicada")
    void criar_cnhDuplicada_retorna409() throws Exception {
        MotoristaRequest request = new MotoristaRequest(
                "Novo Motorista", "12345678901", "C", null, null
        );
        when(service.criar(any()))
                .thenThrow(new ConflitoUnicidadeException("CNH 12345678901 já cadastrada."));

        mockMvc.perform(post("/api/motoristas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("CONFLITO_UNICIDADE"));
    }

    @Test
    @DisplayName("POST /api/motoristas — deve retornar 400 com CNH formato inválido")
    void criar_cnhFormatoInvalido_retorna400() throws Exception {
        String body = """
                {
                  "nome": "Motorista Teste",
                  "numeroCnh": "123",
                  "tipoHabilitacao": "C"
                }
                """;

        mockMvc.perform(post("/api/motoristas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
    }

    @Test
    @DisplayName("POST /api/motoristas — deve retornar 400 com habilitação inválida")
    void criar_habilitacaoInvalida_retorna400() throws Exception {
        String body = """
                {
                  "nome": "Motorista Teste",
                  "numeroCnh": "12345678901",
                  "tipoHabilitacao": "Z"
                }
                """;

        mockMvc.perform(post("/api/motoristas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
    }
}
