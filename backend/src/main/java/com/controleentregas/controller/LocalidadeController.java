package com.controleentregas.controller;

import com.controleentregas.dto.request.LocalidadeRequest;
import com.controleentregas.dto.response.LocalidadeResponse;
import com.controleentregas.dto.response.PageResponse;
import com.controleentregas.service.LocalidadeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/localidades")
public class LocalidadeController {

    private final LocalidadeService service;

    public LocalidadeController(LocalidadeService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<LocalidadeResponse> listar(
            @RequestParam(required = false) String busca,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        var pageable = PageRequest.of(page, size, Sort.by("endereco").ascending());
        return service.listar(busca, pageable);
    }

    @GetMapping("/{id}")
    public LocalidadeResponse buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LocalidadeResponse criar(@Valid @RequestBody LocalidadeRequest request) {
        return service.criar(request);
    }

    @PutMapping("/{id}")
    public LocalidadeResponse atualizar(@PathVariable Long id,
                                        @Valid @RequestBody LocalidadeRequest request) {
        return service.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
