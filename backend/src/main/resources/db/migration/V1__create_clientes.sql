CREATE TABLE clientes (
    id                BIGSERIAL    PRIMARY KEY,
    nome              VARCHAR(255) NOT NULL,
    endereco_completo TEXT         NOT NULL,
    ponto_referencia  VARCHAR(255),
    telefone          VARCHAR(20),
    ativo             BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em         TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em     TIMESTAMP
);

CREATE INDEX idx_clientes_nome  ON clientes (nome);
CREATE INDEX idx_clientes_ativo ON clientes (ativo);
