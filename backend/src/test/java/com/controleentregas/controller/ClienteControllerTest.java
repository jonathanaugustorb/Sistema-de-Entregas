package com.controleentregas.controller;

import com.controleentregas.dto.request.ClienteRequest;
import com.controleentregas.dto.response.ClienteResponse;
import com.controleentregas.dto.response.PageResponse;
import com.controleentregas.exception.GlobalExceptionHandler;
import com.controleentregas.exception.OperacaoInvalidaException;
import com.controleentregas.exception.RecursoNaoEncontradoException;
import com.controleentregas.service.ClienteService;
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

@WebMvcTest(ClienteController.class)
@Import(GlobalExceptionHandler.class)
@DisplayName("ClienteController — testes de integração HTTP")
class ClienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ClienteService service;

    private ClienteResponse clienteResponse() {
        return new ClienteResponse(1L, "João da Silva",
                "Rua das Pedras, 123, Mogi das Cruzes - SP",
                "Próximo à padaria", "11987654321",
                true, LocalDateTime.now(), null);
    }

    @Test
    @DisplayName("GET /api/clientes — deve retornar página de clientes")
    void listar_retornaPaginaDeClientes() throws Exception {
        var page = new PageResponse<>(List.of(clienteResponse()), 1L, 1, 0, 10);
        when(service.listar(anyBoolean(), any(), any())).thenReturn(page);

        mockMvc.perform(get("/api/clientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.content[0].nome").value("João da Silva"));
    }

    @Test
    @DisplayName("GET /api/clientes/{id} — deve retornar cliente por id")
    void buscarPorId_clienteExistente_retorna200() throws Exception {
        when(service.buscarPorId(1L)).thenReturn(clienteResponse());

        mockMvc.perform(get("/api/clientes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nome").value("João da Silva"))
                .andExpect(jsonPath("$.ativo").value(true));
    }

    @Test
    @DisplayName("GET /api/clientes/{id} — deve retornar 404 quando não encontrado")
    void buscarPorId_naoEncontrado_retorna404() throws Exception {
        when(service.buscarPorId(99L))
                .thenThrow(RecursoNaoEncontradoException.porId("Cliente", 99L));

        mockMvc.perform(get("/api/clientes/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("RECURSO_NAO_ENCONTRADO"));
    }

    @Test
    @DisplayName("POST /api/clientes — deve criar cliente e retornar 201")
    void criar_requestValido_retorna201() throws Exception {
        ClienteRequest request = new ClienteRequest(
                "Maria Oliveira", "Estrada do Rio, 45, Suzano - SP",
                null, "11976543210"
        );
        when(service.criar(any(ClienteRequest.class))).thenReturn(clienteResponse());

        mockMvc.perform(post("/api/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("João da Silva"));
    }

    @Test
    @DisplayName("POST /api/clientes — deve retornar 400 com nome vazio")
    void criar_nomeVazio_retorna400ComDetalhes() throws Exception {
        String body = """
                {
                  "nome": "",
                  "enderecoCompleto": "Rua válida, 123"
                }
                """;

        mockMvc.perform(post("/api/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.details").isArray());
    }

    @Test
    @DisplayName("POST /api/clientes — deve retornar 400 sem endereço")
    void criar_semEndereco_retorna400() throws Exception {
        String body = """
                {
                  "nome": "Cliente Teste"
                }
                """;

        mockMvc.perform(post("/api/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
    }

    @Test
    @DisplayName("PATCH /api/clientes/{id}/inativar — deve retornar 204")
    void inativar_clienteAtivo_retorna204() throws Exception {
        doNothing().when(service).inativar(1L);

        mockMvc.perform(patch("/api/clientes/1/inativar"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("PATCH /api/clientes/{id}/inativar — deve retornar 422 se já inativo")
    void inativar_jaInativo_retorna422() throws Exception {
        doThrow(new OperacaoInvalidaException("Cliente já está inativo."))
                .when(service).inativar(1L);

        mockMvc.perform(patch("/api/clientes/1/inativar"))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.code").value("OPERACAO_INVALIDA"));
    }
}
