CREATE TABLE veiculos (
    id                 BIGSERIAL      PRIMARY KEY,
    identificacao      VARCHAR(100)   NOT NULL,
    capacidade_maxima  NUMERIC(10, 2) NOT NULL,
    tipo_carroceria    VARCHAR(100),
    status_operacional VARCHAR(20)    NOT NULL DEFAULT 'ATIVO'
        CONSTRAINT ck_veiculos_status
            CHECK (status_operacional IN ('ATIVO', 'INATIVO', 'MANUTENCAO')),
    criado_em          TIMESTAMP      NOT NULL DEFAULT NOW(),
    atualizado_em      TIMESTAMP,
    CONSTRAINT uq_veiculos_identificacao UNIQUE (identificacao),
    CONSTRAINT ck_veiculos_capacidade    CHECK (capacidade_maxima > 0)
);

CREATE INDEX idx_veiculos_status ON veiculos (status_operacional);
