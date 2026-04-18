CREATE TABLE localidades (
    id              BIGSERIAL   PRIMARY KEY,
    endereco        TEXT        NOT NULL,
    tipo_via        VARCHAR(20) NOT NULL
        CONSTRAINT ck_localidades_tipo_via
            CHECK (tipo_via IN ('ASFALTADA', 'NAO_ASFALTADA')),
    aptidao_chuva   VARCHAR(15) NOT NULL
        CONSTRAINT ck_localidades_aptidao_chuva
            CHECK (aptidao_chuva IN ('SIM', 'NAO', 'PARCIALMENTE')),
    observacoes     TEXT,
    criado_em       TIMESTAMP   NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMP
);

CREATE INDEX idx_localidades_tipo_via ON localidades (tipo_via);
