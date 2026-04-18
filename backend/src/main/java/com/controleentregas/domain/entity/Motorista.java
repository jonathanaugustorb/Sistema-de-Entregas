package com.controleentregas.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "motoristas",
        uniqueConstraints = @UniqueConstraint(name = "uq_motoristas_cnh", columnNames = "numero_cnh"))
public class Motorista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String nome;

    @Column(name = "numero_cnh", nullable = false, length = 11)
    private String numeroCnh;

    @Column(name = "tipo_habilitacao", nullable = false, length = 5)
    private String tipoHabilitacao;

    @Column(name = "veiculo_habitual", length = 100)
    private String veiculoHabitual;

    @Column(length = 20)
    private String contato;

    @Column(nullable = false)
    private Boolean ativo = true;

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

    public Motorista() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getNumeroCnh() { return numeroCnh; }
    public void setNumeroCnh(String numeroCnh) { this.numeroCnh = numeroCnh; }

    public String getTipoHabilitacao() { return tipoHabilitacao; }
    public void setTipoHabilitacao(String tipoHabilitacao) { this.tipoHabilitacao = tipoHabilitacao; }

    public String getVeiculoHabitual() { return veiculoHabitual; }
    public void setVeiculoHabitual(String veiculoHabitual) { this.veiculoHabitual = veiculoHabitual; }

    public String getContato() { return contato; }
    public void setContato(String contato) { this.contato = contato; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
}
