package com.controleentregas.service;

import com.controleentregas.domain.entity.Cliente;
import com.controleentregas.dto.request.ClienteRequest;
import com.controleentregas.dto.response.ClienteResponse;
import com.controleentregas.dto.response.PageResponse;
import com.controleentregas.exception.OperacaoInvalidaException;
import com.controleentregas.exception.RecursoNaoEncontradoException;
import com.controleentregas.repository.ClienteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public PageResponse<ClienteResponse> listar(Boolean incluirInativos, String busca, Pageable pageable) {
        Page<Cliente> page;

        if (busca != null && !busca.isBlank()) {
            page = incluirInativos
                    ? repository.findByNomeContainingIgnoreCase(busca, pageable)
                    : repository.findByNomeContainingIgnoreCaseAndAtivo(busca, Boolean.TRUE, pageable);
        } else {
            page = incluirInativos
                    ? repository.findAll(pageable)
                    : repository.findByAtivo(Boolean.TRUE, pageable);
        }

        return PageResponse.de(page.map(ClienteResponse::de));
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscarPorId(Long id) {
        return ClienteResponse.de(buscarEntidade(id));
    }

    @Transactional
    public ClienteResponse criar(ClienteRequest request) {
        Cliente cliente = new Cliente();
        aplicarDados(cliente, request);
        return ClienteResponse.de(repository.save(cliente));
    }

    @Transactional
    public ClienteResponse atualizar(Long id, ClienteRequest request) {
        Cliente cliente = buscarEntidade(id);
        aplicarDados(cliente, request);
        return ClienteResponse.de(repository.save(cliente));
    }

    @Transactional
    public void inativar(Long id) {
        Cliente cliente = buscarEntidade(id);
        if (!Boolean.TRUE.equals(cliente.getAtivo())) {
            throw new OperacaoInvalidaException(
                    "Cliente já está inativo. Nenhuma alteração realizada."
            );
        }
        cliente.setAtivo(false);
        repository.save(cliente);
    }

    private Cliente buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> RecursoNaoEncontradoException.porId("Cliente", id));
    }

    private void aplicarDados(Cliente cliente, ClienteRequest request) {
        cliente.setNome(request.nome());
        cliente.setEnderecoCompleto(request.enderecoCompleto());
        cliente.setPontoReferencia(request.pontoReferencia());
        cliente.setTelefone(request.telefone());
    }
}
