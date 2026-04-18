# SPEC — M1: Cadastros (MVP)

**Versão:** 1.0  
**Data:** 2026-04-15  
**Origem dos requisitos:** RF01–RF04, RF15 + implícito RF05 (TipoMaterial)  
**Stack:** React + Spring Boot + PostgreSQL  
**Autenticação:** NÃO inclusa nesta fase

---

## 1. Entidades e Schema de Banco

### 1.1 `clientes`

```sql
CREATE TABLE clientes (
    id               BIGSERIAL PRIMARY KEY,
    nome             VARCHAR(255) NOT NULL,
    endereco_completo TEXT        NOT NULL,
    ponto_referencia  VARCHAR(255),
    telefone         VARCHAR(20),
    ativo            BOOLEAN     NOT NULL DEFAULT TRUE,
    criado_em        TIMESTAMP   NOT NULL DEFAULT NOW(),
    atualizado_em    TIMESTAMP
);
```

**Regras:**
- `nome`: obrigatório, mínimo 2 caracteres, máximo 255
- `endereco_completo`: obrigatório, mínimo 5 caracteres
- `telefone`: opcional, formato livre (validação básica de tamanho: 8–20 caracteres se preenchido)
- Inativação: PATCH `/api/clientes/{id}/inativar` — seta `ativo = false`
- Listagem padrão: somente ativos (parâmetro `incluirInativos=true` para incluir inativos)

---

### 1.2 `localidades`

```sql
CREATE TYPE tipo_via AS ENUM ('ASFALTADA', 'NAO_ASFALTADA');
CREATE TYPE aptidao_chuva AS ENUM ('SIM', 'NAO', 'PARCIALMENTE');

CREATE TABLE localidades (
    id              BIGSERIAL      PRIMARY KEY,
    endereco        TEXT           NOT NULL,
    tipo_via        tipo_via       NOT NULL,
    aptidao_chuva   aptidao_chuva  NOT NULL,
    observacoes     TEXT,
    criado_em       TIMESTAMP      NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMP
);
```

**Regras:**
- `endereco`: obrigatório, mínimo 5 caracteres
- `tipo_via`: obrigatório, enum: `ASFALTADA` | `NAO_ASFALTADA`
- `aptidao_chuva`: obrigatório, enum: `SIM` | `NAO` | `PARCIALMENTE`
- `observacoes`: opcional, texto livre
- Não há soft delete em localidades nesta fase (sem histórico de entregas ainda)
- **Nota:** quando M2 (Agendamento) for implementado, localidades vinculadas a entregas não poderão ser excluídas fisicamente. Registrado para revisão no início do M2.

---

### 1.3 `motoristas`

```sql
CREATE TABLE motoristas (
    id               BIGSERIAL    PRIMARY KEY,
    nome             VARCHAR(255) NOT NULL,
    numero_cnh       VARCHAR(11)  NOT NULL UNIQUE,
    tipo_habilitacao VARCHAR(5)   NOT NULL,
    veiculo_habitual VARCHAR(100),
    contato          VARCHAR(20),
    ativo            BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em        TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em    TIMESTAMP
);
```

**Regras:**
- `nome`: obrigatório, mínimo 2 caracteres
- `numero_cnh`: obrigatório, único no sistema, 11 dígitos numéricos
- `tipo_habilitacao`: obrigatório, valores aceitos: A, B, C, D, E, AB, AC, AD, AE (CNH brasileira)
- `veiculo_habitual`: opcional, texto livre
- `contato`: opcional
- Inativação: PATCH `/api/motoristas/{id}/inativar`

---

### 1.4 `veiculos`

```sql
CREATE TYPE status_operacional AS ENUM ('ATIVO', 'INATIVO', 'MANUTENCAO');

CREATE TABLE veiculos (
    id                  BIGSERIAL          PRIMARY KEY,
    identificacao       VARCHAR(100)       NOT NULL UNIQUE,
    capacidade_maxima   NUMERIC(10, 2)     NOT NULL,
    tipo_carroceria     VARCHAR(100),
    status_operacional  status_operacional  NOT NULL DEFAULT 'ATIVO',
    criado_em           TIMESTAMP          NOT NULL DEFAULT NOW(),
    atualizado_em       TIMESTAMP
);
```

**Regras:**
- `identificacao`: obrigatório, único (ex: placa ou apelido interno)
- `capacidade_maxima`: obrigatório, maior que 0 (unidade: toneladas ou m³ — a definir com o usuário, usar campo livre por ora)
- `tipo_carroceria`: opcional
- `status_operacional`: enum obrigatório, padrão ATIVO
- Alteração de status: PUT `/api/veiculos/{id}` (atualiza todos os campos)

---

### 1.5 `tipos_material`

```sql
CREATE TABLE tipos_material (
    id            BIGSERIAL    PRIMARY KEY,
    nome          VARCHAR(100) NOT NULL UNIQUE,
    descricao     TEXT,
    ativo         BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em     TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP
);
```

**Regras:**
- `nome`: obrigatório, único
- Exemplos de dados iniciais: "Areia média", "Areia fina", "Areia grossa", "Pedra brita 1", "Pedra brita 2"
- Inativação: PATCH `/api/tipos-material/{id}/inativar`

---

## 2. Contratos de API (OpenAPI resumido)

### 2.1 Clientes

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/clientes` | Listar clientes (paginado; `?incluirInativos=true`) |
| GET | `/api/clientes/{id}` | Buscar cliente por ID |
| POST | `/api/clientes` | Criar cliente |
| PUT | `/api/clientes/{id}` | Atualizar cliente |
| PATCH | `/api/clientes/{id}/inativar` | Inativar cliente (RF15) |

**DTO Request (POST/PUT):**
```json
{
  "nome": "João da Silva",
  "enderecoCompleto": "Rua das Pedras, 123, Bairro Central, Mogi das Cruzes - SP",
  "pontoReferencia": "Próximo à padaria Pão Quente",
  "telefone": "11987654321"
}
```

**DTO Response:**
```json
{
  "id": 1,
  "nome": "João da Silva",
  "enderecoCompleto": "Rua das Pedras, 123...",
  "pontoReferencia": "Próximo à padaria Pão Quente",
  "telefone": "11987654321",
  "ativo": true,
  "criadoEm": "2025-03-01T10:00:00"
}
```

---

### 2.2 Localidades

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/localidades` | Listar (paginado) |
| GET | `/api/localidades/{id}` | Buscar por ID |
| POST | `/api/localidades` | Criar |
| PUT | `/api/localidades/{id}` | Atualizar |
| DELETE | `/api/localidades/{id}` | Excluir (físico — sem histórico nesta fase) |

**DTO Request:**
```json
{
  "endereco": "Estrada do Pinheirinho, Km 5, Suzano - SP",
  "tipoVia": "NAO_ASFALTADA",
  "aptidaoChuva": "PARCIALMENTE",
  "observacoes": "Portão azul, entrar pela rua de trás"
}
```

**DTO Response:**
```json
{
  "id": 1,
  "endereco": "Estrada do Pinheirinho, Km 5...",
  "tipoVia": "NAO_ASFALTADA",
  "aptidaoChuva": "PARCIALMENTE",
  "observacoes": "Portão azul...",
  "criadoEm": "2025-03-01T10:00:00"
}
```

---

### 2.3 Motoristas

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/motoristas` | Listar (paginado; `?incluirInativos=true`) |
| GET | `/api/motoristas/{id}` | Buscar por ID |
| POST | `/api/motoristas` | Criar |
| PUT | `/api/motoristas/{id}` | Atualizar |
| PATCH | `/api/motoristas/{id}/inativar` | Inativar motorista |

**DTO Request:**
```json
{
  "nome": "Carlos Oliveira",
  "numeroCnh": "12345678901",
  "tipoHabilitacao": "C",
  "veiculoHabitual": "Caminhão Toco Branco",
  "contato": "11976543210"
}
```

---

### 2.4 Veículos

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/veiculos` | Listar (paginado; `?status=ATIVO`) |
| GET | `/api/veiculos/{id}` | Buscar por ID |
| POST | `/api/veiculos` | Criar |
| PUT | `/api/veiculos/{id}` | Atualizar (inclui status) |

**DTO Request:**
```json
{
  "identificacao": "ABC-1234",
  "capacidadeMaxima": 8.5,
  "tipoCarroceria": "Caçamba basculante",
  "statusOperacional": "ATIVO"
}
```

---

### 2.5 Tipos de Material

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/tipos-material` | Listar (paginado; `?incluirInativos=true`) |
| GET | `/api/tipos-material/{id}` | Buscar por ID |
| POST | `/api/tipos-material` | Criar |
| PUT | `/api/tipos-material/{id}` | Atualizar |
| PATCH | `/api/tipos-material/{id}/inativar` | Inativar |

**DTO Request:**
```json
{
  "nome": "Areia média",
  "descricao": "Areia de granulometria média, ideal para reboco e argamassa"
}
```

---

## 3. Erros Esperados

| Código HTTP | `code` | Situação |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Campo obrigatório ausente ou formato inválido |
| 404 | `RECURSO_NAO_ENCONTRADO` | ID não existe |
| 409 | `CONFLITO_UNICIDADE` | CNH duplicada, identificação de veículo duplicada, nome de tipo material duplicado |
| 422 | `OPERACAO_INVALIDA` | Tentar inativar cliente já inativo |

---

## 4. Frontend — Telas do M1

| Tela | Rota | Descrição |
|---|---|---|
| Lista de Clientes | `/cadastros/clientes` | Tabela paginada com filtro por nome e status |
| Formulário Cliente | `/cadastros/clientes/novo` e `/cadastros/clientes/{id}/editar` | Criar e editar |
| Lista de Localidades | `/cadastros/localidades` | Tabela com filtro por endereço e tipo de via |
| Formulário Localidade | `/cadastros/localidades/novo` e `/{id}/editar` | Criar e editar |
| Lista de Motoristas | `/cadastros/motoristas` | Tabela com filtro por nome e status |
| Formulário Motorista | `/cadastros/motoristas/novo` e `/{id}/editar` | Criar e editar |
| Lista de Veículos | `/cadastros/veiculos` | Tabela com filtro por status operacional |
| Formulário Veículo | `/cadastros/veiculos/novo` e `/{id}/editar` | Criar e editar |
| Lista de Tipos de Material | `/cadastros/tipos-material` | Tabela com filtro por nome |
| Formulário Tipo Material | `/cadastros/tipos-material/novo` e `/{id}/editar` | Criar e editar |

**Componentes comuns:**
- `<DataTable>` — tabela paginada genérica
- `<FormField>` — campo de formulário com label e erro
- `<StatusBadge>` — badge colorido para status/ativo
- `<ConfirmDialog>` — confirmação antes de inativar

---

## 5. Seed de Dados Iniciais (Flyway)

Tipos de Material pré-cadastrados:
- Areia média
- Areia fina
- Areia grossa
- Pedra brita 1
- Pedra brita 2
