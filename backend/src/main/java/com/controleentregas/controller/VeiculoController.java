package com.controleentregas.controller;

import com.controleentregas.domain.enums.StatusOperacional;
import com.controleentregas.dto.request.VeiculoRequest;
import com.controleentregas.dto.response.PageResponse;
import com.controleentregas.dto.response.VeiculoResponse;
import com.controleentregas.service.VeiculoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/veiculos")
public class VeiculoController {

    private final VeiculoService service;

    public VeiculoController(VeiculoService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<VeiculoResponse> listar(
            @RequestParam(required = false) StatusOperacional status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        var pageable = PageRequest.of(page, size, Sort.by("identificacao").ascending());
        return service.listar(status, pageable);
    }

    @GetMapping("/{id}")
    public VeiculoResponse buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VeiculoResponse criar(@Valid @RequestBody VeiculoRequest request) {
        return service.criar(request);
    }

    @PutMapping("/{id}")
    public VeiculoResponse atualizar(@PathVariable Long id,
                                     @Valid @RequestBody VeiculoRequest request) {
        return service.atualizar(id, request);
    }
}
