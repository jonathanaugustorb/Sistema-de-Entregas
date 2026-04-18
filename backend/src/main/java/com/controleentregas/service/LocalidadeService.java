package com.controleentregas.service;

import com.controleentregas.domain.entity.Localidade;
import com.controleentregas.dto.request.LocalidadeRequest;
import com.controleentregas.dto.response.LocalidadeResponse;
import com.controleentregas.dto.response.PageResponse;
import com.controleentregas.exception.RecursoNaoEncontradoException;
import com.controleentregas.repository.LocalidadeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LocalidadeService {

    private final LocalidadeRepository repository;

    public LocalidadeService(LocalidadeRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public PageResponse<LocalidadeResponse> listar(String busca, Pageable pageable) {
        Page<Localidade> page = (busca != null && !busca.isBlank())
                ? repository.findByEnderecoContainingIgnoreCase(busca, pageable)
                : repository.findAll(pageable);
        return PageResponse.de(page.map(LocalidadeResponse::de));
    }

    @Transactional(readOnly = true)
    public LocalidadeResponse buscarPorId(Long id) {
        return LocalidadeResponse.de(buscarEntidade(id));
    }

    @Transactional
    public LocalidadeResponse criar(LocalidadeRequest request) {
        Localidade localidade = new Localidade();
        aplicarDados(localidade, request);
        return LocalidadeResponse.de(repository.save(localidade));
    }

    @Transactional
    public LocalidadeResponse atualizar(Long id, LocalidadeRequest request) {
        Localidade localidade = buscarEntidade(id);
        aplicarDados(localidade, request);
        return LocalidadeResponse.de(repository.save(localidade));
    }

    @Transactional
    public void excluir(Long id) {
        Localidade localidade = buscarEntidade(id);
        repository.delete(localidade);
    }

    private Localidade buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> RecursoNaoEncontradoException.porId("Localidade", id));
    }

    private void aplicarDados(Localidade localidade, LocalidadeRequest request) {
        localidade.setEndereco(request.endereco());
        localidade.setTipoVia(request.tipoVia());
        localidade.setAptidaoChuva(request.aptidaoChuva());
        localidade.setObservacoes(request.observacoes());
    }
}
