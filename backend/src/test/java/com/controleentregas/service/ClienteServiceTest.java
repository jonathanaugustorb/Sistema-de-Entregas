package com.controleentregas.service;

import com.controleentregas.domain.entity.Cliente;
import com.controleentregas.dto.request.ClienteRequest;
import com.controleentregas.dto.response.ClienteResponse;
import com.controleentregas.exception.OperacaoInvalidaException;
import com.controleentregas.exception.RecursoNaoEncontradoException;
import com.controleentregas.repository.ClienteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ClienteService — testes unitários")
class ClienteServiceTest {

    @Mock
    private ClienteRepository repository;

    @InjectMocks
    private ClienteService service;

    private Cliente clienteAtivo;

    @BeforeEach
    void setUp() {
        clienteAtivo = new Cliente();
        clienteAtivo.setId(1L);
        clienteAtivo.setNome("João da Silva");
        clienteAtivo.setEnderecoCompleto("Rua das Pedras, 123, Mogi das Cruzes - SP");
        clienteAtivo.setTelefone("11987654321");
        clienteAtivo.setAtivo(true);
    }

    @Test
    @DisplayName("buscarPorId — deve retornar cliente existente")
    void buscarPorId_clienteExistente_retornaResponse() {
        when(repository.findById(1L)).thenReturn(Optional.of(clienteAtivo));

        ClienteResponse response = service.buscarPorId(1L);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.nome()).isEqualTo("João da Silva");
        assertThat(response.ativo()).isTrue();
    }

    @Test
    @DisplayName("buscarPorId — deve lançar exceção quando não encontrado")
    void buscarPorId_naoEncontrado_lancaExcecao() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.buscarPorId(99L))
                .isInstanceOf(RecursoNaoEncontradoException.class)
                .hasMessageContaining("99");
    }

    @Test
    @DisplayName("criar — deve persistir e retornar cliente com dados corretos")
    void criar_requestValido_retornaResponseCriado() {
        ClienteRequest request = new ClienteRequest(
                "Maria Oliveira", "Estrada do Rio, 45, Suzano - SP",
                "Portão amarelo", "11976543210"
        );

        when(repository.save(any(Cliente.class))).thenAnswer(inv -> {
            Cliente c = inv.getArgument(0);
            c.setId(2L);
            return c;
        });

        ClienteResponse response = service.criar(request);

        assertThat(response.nome()).isEqualTo("Maria Oliveira");
        assertThat(response.ativo()).isTrue();
        verify(repository, times(1)).save(any(Cliente.class));
    }

    @Test
    @DisplayName("inativar — deve setar ativo=false em cliente ativo")
    void inativar_clienteAtivo_setaInativo() {
        when(repository.findById(1L)).thenReturn(Optional.of(clienteAtivo));
        when(repository.save(any(Cliente.class))).thenReturn(clienteAtivo);

        service.inativar(1L);

        assertThat(clienteAtivo.getAtivo()).isFalse();
        verify(repository).save(clienteAtivo);
    }

    @Test
    @DisplayName("inativar — deve lançar exceção se cliente já estiver inativo")
    void inativar_clienteJaInativo_lancaExcecao() {
        clienteAtivo.setAtivo(false);
        when(repository.findById(1L)).thenReturn(Optional.of(clienteAtivo));

        assertThatThrownBy(() -> service.inativar(1L))
                .isInstanceOf(OperacaoInvalidaException.class)
                .hasMessageContaining("já está inativo");

        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("atualizar — deve aplicar novos dados ao cliente")
    void atualizar_requestValido_retornaResponseAtualizado() {
        ClienteRequest request = new ClienteRequest(
                "João Silva Atualizado", "Nova Rua, 999, Mogi", null, null
        );

        when(repository.findById(1L)).thenReturn(Optional.of(clienteAtivo));
        when(repository.save(any(Cliente.class))).thenAnswer(inv -> inv.getArgument(0));

        ClienteResponse response = service.atualizar(1L, request);

        assertThat(response.nome()).isEqualTo("João Silva Atualizado");
        assertThat(response.enderecoCompleto()).isEqualTo("Nova Rua, 999, Mogi");
    }
}
