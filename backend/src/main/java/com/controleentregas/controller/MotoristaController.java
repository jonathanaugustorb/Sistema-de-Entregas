package com.controleentregas.controller;

import com.controleentregas.dto.request.MotoristaRequest;
import com.controleentregas.dto.response.MotoristaResponse;
import com.controleentregas.dto.response.PageResponse;
import com.controleentregas.service.MotoristaService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/motoristas")
public class MotoristaController {

    private final MotoristaService service;

    public MotoristaController(MotoristaService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<MotoristaResponse> listar(
            @RequestParam(defaultValue = "false") Boolean incluirInativos,
            @RequestParam(required = false) String busca,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        var pageable = PageRequest.of(page, size, Sort.by("nome").ascending());
        return service.listar(incluirInativos, busca, pageable);
    }

    @GetMapping("/{id}")
    public MotoristaResponse buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MotoristaResponse criar(@Valid @RequestBody MotoristaRequest request) {
        return service.criar(request);
    }

    @PutMapping("/{id}")
    public MotoristaResponse atualizar(@PathVariable Long id,
                                       @Valid @RequestBody MotoristaRequest request) {
        return service.atualizar(id, request);
    }

    @PatchMapping("/{id}/inativar")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        service.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
