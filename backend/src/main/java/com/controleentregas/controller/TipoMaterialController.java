package com.controleentregas.controller;

import com.controleentregas.dto.request.TipoMaterialRequest;
import com.controleentregas.dto.response.PageResponse;
import com.controleentregas.dto.response.TipoMaterialResponse;
import com.controleentregas.service.TipoMaterialService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tipos-material")
public class TipoMaterialController {

    private final TipoMaterialService service;

    public TipoMaterialController(TipoMaterialService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<TipoMaterialResponse> listar(
            @RequestParam(defaultValue = "false") Boolean incluirInativos,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        var pageable = PageRequest.of(page, size, Sort.by("nome").ascending());
        return service.listar(incluirInativos, pageable);
    }

    @GetMapping("/{id}")
    public TipoMaterialResponse buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TipoMaterialResponse criar(@Valid @RequestBody TipoMaterialRequest request) {
        return service.criar(request);
    }

    @PutMapping("/{id}")
    public TipoMaterialResponse atualizar(@PathVariable Long id,
                                          @Valid @RequestBody TipoMaterialRequest request) {
        return service.atualizar(id, request);
    }

    @PatchMapping("/{id}/inativar")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        service.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
