package com.controleentregas.service;

import com.controleentregas.domain.entity.Motorista;
import com.controleentregas.dto.request.MotoristaRequest;
import com.controleentregas.dto.response.MotoristaResponse;
import com.controleentregas.dto.response.PageResponse;
import com.controleentregas.exception.ConflitoUnicidadeException;
import com.controleentregas.exception.OperacaoInvalidaException;
import com.controleentregas.exception.RecursoNaoEncontradoException;
import com.controleentregas.repository.MotoristaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MotoristaService {

    private final MotoristaRepository repository;

    public MotoristaService(MotoristaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public PageResponse<MotoristaResponse> listar(Boolean incluirInativos, String busca, Pageable pageable) {
        Page<Motorista> page;

        if (busca != null && !busca.isBlank()) {
            page = incluirInativos
                    ? repository.findByNomeContainingIgnoreCase(busca, pageable)
                    : repository.findByNomeContainingIgnoreCaseAndAtivo(busca, Boolean.TRUE, pageable);
        } else {
            page = incluirInativos
                    ? repository.findAll(pageable)
                    : repository.findByAtivo(Boolean.TRUE, pageable);
        }

        return PageResponse.de(page.map(MotoristaResponse::de));
    }

    @Transactional(readOnly = true)
    public MotoristaResponse buscarPorId(Long id) {
        return MotoristaResponse.de(buscarEntidade(id));
    }

    @Transactional
    public MotoristaResponse criar(MotoristaRequest request) {
        validarCnhUnica(request.numeroCnh(), null);
        Motorista motorista = new Motorista();
        aplicarDados(motorista, request);
        return MotoristaResponse.de(repository.save(motorista));
    }

    @Transactional
    public MotoristaResponse atualizar(Long id, MotoristaRequest request) {
        Motorista motorista = buscarEntidade(id);
        validarCnhUnica(request.numeroCnh(), id);
        aplicarDados(motorista, request);
        return MotoristaResponse.de(repository.save(motorista));
    }

    @Transactional
    public void inativar(Long id) {
        Motorista motorista = buscarEntidade(id);
        if (!Boolean.TRUE.equals(motorista.getAtivo())) {
            throw new OperacaoInvalidaException("Motorista já está inativo.");
        }
        motorista.setAtivo(false);
        repository.save(motorista);
    }

    private void validarCnhUnica(String numeroCnh, Long idExcluir) {
        boolean existe = (idExcluir == null)
                ? repository.existsByNumeroCnh(numeroCnh)
                : repository.existsByNumeroCnhAndIdNot(numeroCnh, idExcluir);

        if (existe) {
            throw new ConflitoUnicidadeException(
                    "Já existe um motorista cadastrado com a CNH %s.".formatted(numeroCnh)
            );
        }
    }

    private Motorista buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> RecursoNaoEncontradoException.porId("Motorista", id));
    }

    private void aplicarDados(Motorista motorista, MotoristaRequest request) {
        motorista.setNome(request.nome());
        motorista.setNumeroCnh(request.numeroCnh());
        motorista.setTipoHabilitacao(request.tipoHabilitacao());
        motorista.setVeiculoHabitual(request.veiculoHabitual());
        motorista.setContato(request.contato());
    }
}
