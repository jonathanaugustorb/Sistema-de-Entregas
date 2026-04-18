package com.controleentregas.service;

import com.controleentregas.domain.entity.Motorista;
import com.controleentregas.dto.request.MotoristaRequest;
import com.controleentregas.dto.response.MotoristaResponse;
import com.controleentregas.exception.ConflitoUnicidadeException;
import com.controleentregas.exception.OperacaoInvalidaException;
import com.controleentregas.repository.MotoristaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("MotoristaService — testes unitários")
class MotoristaServiceTest {

    @Mock
    private MotoristaRepository repository;

    @InjectMocks
    private MotoristaService service;

    private Motorista motorista;

    @BeforeEach
    void setUp() {
        motorista = new Motorista();
        motorista.setId(1L);
        motorista.setNome("Carlos Oliveira");
        motorista.setNumeroCnh("12345678901");
        motorista.setTipoHabilitacao("C");
        motorista.setAtivo(true);
    }

    @Test
    @DisplayName("criar — deve lançar exceção quando CNH já cadastrada")
    void criar_cnhDuplicada_lancaExcecao() {
        MotoristaRequest request = new MotoristaRequest(
                "Novo Motorista", "12345678901", "C", null, null
        );
        when(repository.existsByNumeroCnh("12345678901")).thenReturn(true);

        assertThatThrownBy(() -> service.criar(request))
                .isInstanceOf(ConflitoUnicidadeException.class)
                .hasMessageContaining("12345678901");

        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("criar — deve persistir motorista com CNH nova")
    void criar_cnhNova_persisteMotorista() {
        MotoristaRequest request = new MotoristaRequest(
                "Roberto Santos", "98765432109", "D", "Truck Vermelho", "11999991234"
        );
        when(repository.existsByNumeroCnh("98765432109")).thenReturn(false);
        when(repository.save(any(Motorista.class))).thenAnswer(inv -> {
            Motorista m = inv.getArgument(0);
            m.setId(2L);
            return m;
        });

        MotoristaResponse response = service.criar(request);

        assertThat(response.nome()).isEqualTo("Roberto Santos");
        assertThat(response.numeroCnh()).isEqualTo("98765432109");
        assertThat(response.ativo()).isTrue();
    }

    @Test
    @DisplayName("inativar — deve lançar exceção se já inativo")
    void inativar_jaInativo_lancaExcecao() {
        motorista.setAtivo(false);
        when(repository.findById(1L)).thenReturn(Optional.of(motorista));

        assertThatThrownBy(() -> service.inativar(1L))
                .isInstanceOf(OperacaoInvalidaException.class);
    }

    @Test
    @DisplayName("atualizar — deve rejeitar CNH duplicada de outro motorista")
    void atualizar_cnhDuplicadaOutroMotorista_lancaExcecao() {
        MotoristaRequest request = new MotoristaRequest(
                "Carlos Oliveira", "99999999999", "C", null, null
        );
        when(repository.findById(1L)).thenReturn(Optional.of(motorista));
        when(repository.existsByNumeroCnhAndIdNot("99999999999", 1L)).thenReturn(true);

        assertThatThrownBy(() -> service.atualizar(1L, request))
                .isInstanceOf(ConflitoUnicidadeException.class);
    }
}
