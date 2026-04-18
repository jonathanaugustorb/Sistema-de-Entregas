package com.controleentregas.service;

import com.controleentregas.domain.entity.TipoMaterial;
import com.controleentregas.dto.request.TipoMaterialRequest;
import com.controleentregas.dto.response.PageResponse;
import com.controleentregas.dto.response.TipoMaterialResponse;
import com.controleentregas.exception.ConflitoUnicidadeException;
import com.controleentregas.exception.OperacaoInvalidaException;
import com.controleentregas.exception.RecursoNaoEncontradoException;
import com.controleentregas.repository.TipoMaterialRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TipoMaterialService {

    private final TipoMaterialRepository repository;

    public TipoMaterialService(TipoMaterialRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public PageResponse<TipoMaterialResponse> listar(Boolean incluirInativos, Pageable pageable) {
        Page<TipoMaterial> page = incluirInativos
                ? repository.findAll(pageable)
                : repository.findByAtivo(Boolean.TRUE, pageable);
        return PageResponse.de(page.map(TipoMaterialResponse::de));
    }

    @Transactional(readOnly = true)
    public TipoMaterialResponse buscarPorId(Long id) {
        return TipoMaterialResponse.de(buscarEntidade(id));
    }

    @Transactional
    public TipoMaterialResponse criar(TipoMaterialRequest request) {
        validarNomeUnico(request.nome(), null);
        TipoMaterial tipo = new TipoMaterial();
        aplicarDados(tipo, request);
        return TipoMaterialResponse.de(repository.save(tipo));
    }

    @Transactional
    public TipoMaterialResponse atualizar(Long id, TipoMaterialRequest request) {
        TipoMaterial tipo = buscarEntidade(id);
        validarNomeUnico(request.nome(), id);
        aplicarDados(tipo, request);
        return TipoMaterialResponse.de(repository.save(tipo));
    }

    @Transactional
    public void inativar(Long id) {
        TipoMaterial tipo = buscarEntidade(id);
        if (!Boolean.TRUE.equals(tipo.getAtivo())) {
            throw new OperacaoInvalidaException("Tipo de material já está inativo.");
        }
        tipo.setAtivo(false);
        repository.save(tipo);
    }

    private void validarNomeUnico(String nome, Long idExcluir) {
        boolean existe = (idExcluir == null)
                ? repository.existsByNome(nome)
                : repository.existsByNomeAndIdNot(nome, idExcluir);

        if (existe) {
            throw new ConflitoUnicidadeException(
                    "Já existe um tipo de material com o nome '%s'.".formatted(nome)
            );
        }
    }

    private TipoMaterial buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> RecursoNaoEncontradoException.porId("Tipo de Material", id));
    }

    private void aplicarDados(TipoMaterial tipo, TipoMaterialRequest request) {
        tipo.setNome(request.nome());
        tipo.setDescricao(request.descricao());
    }
}
