package com.controleentregas.domain.entity;

import com.controleentregas.domain.enums.AptidaoChuva;
import com.controleentregas.domain.enums.TipoVia;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "localidades")
public class Localidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String endereco;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_via", nullable = false, length = 20)
    private TipoVia tipoVia;

    @Enumerated(EnumType.STRING)
    @Column(name = "aptidao_chuva", nullable = false, length = 15)
    private AptidaoChuva aptidaoChuva;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @PrePersist
    protected void onCreate() {
        this.criadoEm = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }

    public Localidade() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public TipoVia getTipoVia() { return tipoVia; }
    public void setTipoVia(TipoVia tipoVia) { this.tipoVia = tipoVia; }

    public AptidaoChuva getAptidaoChuva() { return aptidaoChuva; }
    public void setAptidaoChuva(AptidaoChuva aptidaoChuva) { this.aptidaoChuva = aptidaoChuva; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
}
