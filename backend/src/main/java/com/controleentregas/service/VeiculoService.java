package com.controleentregas.service;

import com.controleentregas.domain.entity.Veiculo;
import com.controleentregas.domain.enums.StatusOperacional;
import com.controleentregas.dto.request.VeiculoRequest;
import com.controleentregas.dto.response.PageResponse;
import com.controleentregas.dto.response.VeiculoResponse;
import com.controleentregas.exception.ConflitoUnicidadeException;
import com.controleentregas.exception.RecursoNaoEncontradoException;
import com.controleentregas.repository.VeiculoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VeiculoService {

    private final VeiculoRepository repository;

    public VeiculoService(VeiculoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public PageResponse<VeiculoResponse> listar(StatusOperacional status, Pageable pageable) {
        Page<Veiculo> page = (status != null)
                ? repository.findByStatusOperacional(status, pageable)
                : repository.findAll(pageable);
        return PageResponse.de(page.map(VeiculoResponse::de));
    }

    @Transactional(readOnly = true)
    public VeiculoResponse buscarPorId(Long id) {
        return VeiculoResponse.de(buscarEntidade(id));
    }

    @Transactional
    public VeiculoResponse criar(VeiculoRequest request) {
        validarIdentificacaoUnica(request.identificacao(), null);
        Veiculo veiculo = new Veiculo();
        aplicarDados(veiculo, request);
        return VeiculoResponse.de(repository.save(veiculo));
    }

    @Transactional
    public VeiculoResponse atualizar(Long id, VeiculoRequest request) {
        Veiculo veiculo = buscarEntidade(id);
        validarIdentificacaoUnica(request.identificacao(), id);
        aplicarDados(veiculo, request);
        return VeiculoResponse.de(repository.save(veiculo));
    }

    private void validarIdentificacaoUnica(String identificacao, Long idExcluir) {
        boolean existe = (idExcluir == null)
                ? repository.existsByIdentificacao(identificacao)
                : repository.existsByIdentificacaoAndIdNot(identificacao, idExcluir);

        if (existe) {
            throw new ConflitoUnicidadeException(
                    "Já existe um veículo cadastrado com a identificação '%s'.".formatted(identificacao)
            );
        }
    }

    private Veiculo buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> RecursoNaoEncontradoException.porId("Veículo", id));
    }

    private void aplicarDados(Veiculo veiculo, VeiculoRequest request) {
        veiculo.setIdentificacao(request.identificacao());
        veiculo.setCapacidadeMaxima(request.capacidadeMaxima());
        veiculo.setTipoCarroceria(request.tipoCarroceria());
        veiculo.setStatusOperacional(request.statusOperacional());
    }
}
