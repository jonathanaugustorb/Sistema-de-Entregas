CREATE TABLE motoristas (
    id               BIGSERIAL    PRIMARY KEY,
    nome             VARCHAR(255) NOT NULL,
    numero_cnh       VARCHAR(11)  NOT NULL,
    tipo_habilitacao VARCHAR(5)   NOT NULL,
    veiculo_habitual VARCHAR(100),
    contato          VARCHAR(20),
    ativo            BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em        TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em    TIMESTAMP,
    CONSTRAINT uq_motoristas_cnh UNIQUE (numero_cnh)
);

CREATE INDEX idx_motoristas_nome  ON motoristas (nome);
CREATE INDEX idx_motoristas_ativo ON motoristas (ativo);
