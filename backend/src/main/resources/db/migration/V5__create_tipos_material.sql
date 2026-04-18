CREATE TABLE tipos_material (
    id            BIGSERIAL    PRIMARY KEY,
    nome          VARCHAR(100) NOT NULL,
    descricao     TEXT,
    ativo         BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em     TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP,
    CONSTRAINT uq_tipos_material_nome UNIQUE (nome)
);

CREATE INDEX idx_tipos_material_ativo ON tipos_material (ativo);

-- Seed: tipos de material iniciais (definidos no glossário e spec do projeto)
INSERT INTO tipos_material (nome, descricao) VALUES
    ('Areia média',   'Granulometria média — ideal para reboco e argamassa'),
    ('Areia fina',    'Granulometria fina — acabamento e assentamento de pisos'),
    ('Areia grossa',  'Granulometria grossa — fundações e concreto estrutural'),
    ('Pedra brita 1', 'Brita 1 — concreto convencional'),
    ('Pedra brita 2', 'Brita 2 — concreto de alta resistência');
