package com.controleentregas.domain.entity;

import com.controleentregas.domain.enums.StatusOperacional;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "veiculos",
        uniqueConstraints = @UniqueConstraint(name = "uq_veiculos_identificacao", columnNames = "identificacao"))
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String identificacao;

    @Column(name = "capacidade_maxima", nullable = false, precision = 10, scale = 2)
    private BigDecimal capacidadeMaxima;

    @Column(name = "tipo_carroceria", length = 100)
    private String tipoCarroceria;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_operacional", nullable = false, length = 20)
    private StatusOperacional statusOperacional = StatusOperacional.ATIVO;

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

    public Veiculo() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIdentificacao() { return identificacao; }
    public void setIdentificacao(String identificacao) { this.identificacao = identificacao; }

    public BigDecimal getCapacidadeMaxima() { return capacidadeMaxima; }
    public void setCapacidadeMaxima(BigDecimal capacidadeMaxima) { this.capacidadeMaxima = capacidadeMaxima; }

    public String getTipoCarroceria() { return tipoCarroceria; }
    public void setTipoCarroceria(String tipoCarroceria) { this.tipoCarroceria = tipoCarroceria; }

    public StatusOperacional getStatusOperacional() { return statusOperacional; }
    public void setStatusOperacional(StatusOperacional statusOperacional) { this.statusOperacional = statusOperacional; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
}
