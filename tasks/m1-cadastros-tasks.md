# TASKS — M1: Cadastros (MVP)

**Versão:** 1.0  
**Data:** 2026-04-15  
**Plan de origem:** `plans/m1-cadastros-plan.md`  
**Spec de origem:** `specs/m1-cadastros.md`

> **Legenda de status:** `TODO` | `IN_PROGRESS` | `DONE` | `BLOCKED`

---

## FASE 1 — Infraestrutura

### BE-01 — Setup Spring Boot
**Status:** TODO  
**Complexidade:** M

**O que fazer:**
1. Criar projeto Spring Boot 3.2.x com Maven (groupId: `com.controleentregas`, artifactId: `api`)
2. Adicionar dependências: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-validation`, `postgresql`, `flyway-core`, `lombok`, `mapstruct`, `mapstruct-processor`
3. Criar estrutura de pacotes: `config`, `controller`, `service`, `repository`, `domain.entity`, `domain.enums`, `dto.request`, `dto.response`, `exception`, `mapper`
4. Configurar `application.yml` com datasource PostgreSQL (usar variáveis de ambiente para credenciais), JPA (`ddl-auto: validate`), Flyway
5. Criar `CorsConfig.java` permitindo `http://localhost:5173`
6. Criar `HealthController` com `GET /api/health` retornando `{ "status": "ok" }` para verificação

**Critério de aceite:**
- Aplicação sobe sem erros com banco PostgreSQL disponível
- `GET /api/health` retorna 200

**Arquivos afetados:**
- `backend/` (novo projeto)
- `backend/src/main/resources/application.yml`
- `backend/src/main/java/com/controleentregas/config/CorsConfig.java`
- `backend/src/main/java/com/controleentregas/controller/HealthController.java`

---

### FE-01 — Setup React + Vite
**Status:** TODO  
**Complexidade:** M

**O que fazer:**
1. Criar projeto com `npm create vite@latest frontend -- --template react-ts`
2. Instalar: `axios`, `react-router-dom`, `react-hook-form`, `@hookform/resolvers`, `zod`
3. Criar estrutura de pastas: `src/components/ui/`, `src/pages/cadastros/`, `src/services/`, `src/hooks/`, `src/types/`
4. Criar `src/services/api.ts` com instância axios base (baseURL: `http://localhost:8080/api`)
5. Configurar `react-router-dom` com `BrowserRouter` e rotas base em `src/App.tsx`

**Critério de aceite:**
- `npm run dev` inicia sem erros em `localhost:5173`
- Página raiz renderiza sem erro de console
- Chamada de teste para `/api/health` retorna 200

**Arquivos afetados:**
- `frontend/` (novo projeto)
- `frontend/src/services/api.ts`
- `frontend/src/App.tsx`

---

## FASE 2 — Banco de Dados

### DB-01 — Migration V1: Clientes
**Status:** TODO | **Depende de:** BE-01

**O que fazer:**
Criar `backend/src/main/resources/db/migration/V1__create_clientes.sql`:
```sql
CREATE TABLE clientes (
    id               BIGSERIAL    PRIMARY KEY,
    nome             VARCHAR(255) NOT NULL,
    endereco_completo TEXT        NOT NULL,
    ponto_referencia  VARCHAR(255),
    telefone         VARCHAR(20),
    ativo            BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em        TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em    TIMESTAMP
);
```

**Critério de aceite:** Migration aplicada com sucesso pelo Flyway na inicialização.

---

### DB-02 — Migration V2: Localidades
**Status:** TODO | **Depende de:** BE-01

**O que fazer:**
Criar `V2__create_localidades.sql`:
```sql
CREATE TABLE localidades (
    id              BIGSERIAL    PRIMARY KEY,
    endereco        TEXT         NOT NULL,
    tipo_via        VARCHAR(20)  NOT NULL CHECK (tipo_via IN ('ASFALTADA', 'NAO_ASFALTADA')),
    aptidao_chuva   VARCHAR(15)  NOT NULL CHECK (aptidao_chuva IN ('SIM', 'NAO', 'PARCIALMENTE')),
    observacoes     TEXT,
    criado_em       TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMP
);
```
*(Usar CHECK CONSTRAINT em vez de tipo ENUM para portabilidade de migration)*

**Critério de aceite:** Migration aplicada sem erros.

---

### DB-03 — Migration V3: Motoristas
**Status:** TODO | **Depende de:** BE-01

**O que fazer:**
Criar `V3__create_motoristas.sql`:
```sql
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
```

**Critério de aceite:** Migration aplicada; UNIQUE constraint na CNH.

---

### DB-04 — Migration V4: Veículos
**Status:** TODO | **Depende de:** BE-01

**O que fazer:**
Criar `V4__create_veiculos.sql`:
```sql
CREATE TABLE veiculos (
    id                 BIGSERIAL      PRIMARY KEY,
    identificacao      VARCHAR(100)   NOT NULL,
    capacidade_maxima  NUMERIC(10, 2) NOT NULL,
    tipo_carroceria    VARCHAR(100),
    status_operacional VARCHAR(20)    NOT NULL DEFAULT 'ATIVO'
        CHECK (status_operacional IN ('ATIVO', 'INATIVO', 'MANUTENCAO')),
    criado_em          TIMESTAMP      NOT NULL DEFAULT NOW(),
    atualizado_em      TIMESTAMP,
    CONSTRAINT uq_veiculos_identificacao UNIQUE (identificacao),
    CONSTRAINT ck_veiculos_capacidade CHECK (capacidade_maxima > 0)
);
```

**Critério de aceite:** Migration aplicada; UNIQUE em identificação e CHECK em capacidade.

---

### DB-05 — Migration V5: Tipos de Material + Seed
**Status:** TODO | **Depende de:** BE-01

**O que fazer:**
Criar `V5__create_tipos_material.sql`:
```sql
CREATE TABLE tipos_material (
    id            BIGSERIAL    PRIMARY KEY,
    nome          VARCHAR(100) NOT NULL,
    descricao     TEXT,
    ativo         BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em     TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP,
    CONSTRAINT uq_tipos_material_nome UNIQUE (nome)
);

INSERT INTO tipos_material (nome, descricao) VALUES
    ('Areia média',   'Granulometria média — reboco, argamassa'),
    ('Areia fina',    'Granulometria fina — acabamento e assentamento de pisos'),
    ('Areia grossa',  'Granulometria grossa — fundações e concreto estrutural'),
    ('Pedra brita 1', 'Brita 1 — concreto convencional'),
    ('Pedra brita 2', 'Brita 2 — concreto de alta resistência');
```

**Critério de aceite:** 5 registros inseridos com seed.

---

## FASE 3 — Backend

### BE-07 — Global Exception Handler *(fazer antes das entidades)*
**Status:** TODO | **Depende de:** BE-01

**O que fazer:**
1. Criar `exception/RecursoNaoEncontradoException.java` (extends `RuntimeException`)
2. Criar `exception/ConflitoUnicidadeException.java`
3. Criar `exception/OperacaoInvalidaException.java`
4. Criar `dto/response/ErroResponse.java` com campos: `code`, `message`, `details` (lista de `{field, message}`)
5. Criar `exception/GlobalExceptionHandler.java` com `@RestControllerAdvice`:
   - `RecursoNaoEncontradoException` → 404 + `RECURSO_NAO_ENCONTRADO`
   - `ConflitoUnicidadeException` → 409 + `CONFLITO_UNICIDADE`
   - `OperacaoInvalidaException` → 422 + `OPERACAO_INVALIDA`
   - `MethodArgumentNotValidException` → 400 + `VALIDATION_ERROR` + lista de campos

**Critério de aceite:** Chamada para ID inexistente retorna `{ "code": "RECURSO_NAO_ENCONTRADO", "message": "...", "details": [] }` com HTTP 404.

---

### BE-02 — CRUD Clientes
**Status:** TODO | **Depende de:** DB-01, BE-07

**O que fazer:**
1. `domain/entity/Cliente.java` — `@Entity @Table("clientes")` com todos os campos, `@PreUpdate` para `atualizadoEm`
2. `repository/ClienteRepository.java` — `JpaRepository<Cliente, Long>` + método `Page<Cliente> findByAtivo(boolean ativo, Pageable pageable)`
3. `dto/request/ClienteRequest.java` — campos com `@NotBlank`, `@Size`, validações
4. `dto/response/ClienteResponse.java` — todos os campos do response
5. `mapper/ClienteMapper.java` — MapStruct: `toResponse(Cliente)`, `toEntity(ClienteRequest)`, `updateEntity(ClienteRequest, @MappingTarget Cliente)`
6. `service/ClienteService.java`:
   - `listar(boolean incluirInativos, Pageable)` → `Page<ClienteResponse>`
   - `buscarPorId(Long)` → `ClienteResponse` ou lança `RecursoNaoEncontradoException`
   - `criar(ClienteRequest)` → `ClienteResponse`
   - `atualizar(Long, ClienteRequest)` → `ClienteResponse`
   - `inativar(Long)` → void (lança `OperacaoInvalidaException` se já inativo)
7. `controller/ClienteController.java` — 5 endpoints conforme spec

**Critério de aceite:**
- `POST /api/clientes` com nome vazio retorna 400 + `VALIDATION_ERROR`
- `GET /api/clientes/999` retorna 404 + `RECURSO_NAO_ENCONTRADO`
- `PATCH /api/clientes/1/inativar` seta ativo=false no banco

---

### BE-03 — CRUD Localidades
**Status:** TODO | **Depende de:** DB-02, BE-07

**O que fazer:** Estrutura idêntica ao BE-02 adaptada para Localidade.
- Enums Java: `TipoVia` (ASFALTADA, NAO_ASFALTADA), `AptidaoChuva` (SIM, NAO, PARCIALMENTE)
- Sem soft delete: endpoint DELETE físico
- Service: `listar(Pageable)`, `buscarPorId`, `criar`, `atualizar`, `excluir`

**Critério de aceite:** CRUD completo funcionando; enum inválido retorna 400.

---

### BE-04 — CRUD Motoristas
**Status:** TODO | **Depende de:** DB-03, BE-07

**O que fazer:** Estrutura idêntica ao BE-02 para Motorista.
- Validar CNH único: capturar `DataIntegrityViolationException` e converter para `ConflitoUnicidadeException`
- Validação `numeroCnh`: `@Pattern(regexp = "\\d{11}")` — exatamente 11 dígitos numéricos
- Validação `tipoHabilitacao`: `@Pattern(regexp = "^(A|B|C|D|E|AB|AC|AD|AE)$")` — valores válidos da CNH brasileira
- Inativação com verificação de status atual

**Critério de aceite:** CNH duplicada retorna 409 + `CONFLITO_UNICIDADE`.

---

### BE-05 — CRUD Veículos
**Status:** TODO | **Depende de:** DB-04, BE-07

**O que fazer:** Estrutura idêntica para Veiculo.
- Enum Java: `StatusOperacional` (ATIVO, INATIVO, MANUTENCAO)
- Validar identificação única
- `capacidadeMaxima`: `@DecimalMin(value = "0.01")`
- Sem endpoint de inativação separado — usar PUT com `statusOperacional`

**Critério de aceite:** `capacidadeMaxima = 0` retorna 400; identificação duplicada retorna 409.

---

### BE-06 — CRUD Tipos de Material
**Status:** TODO | **Depende de:** DB-05, BE-07

**O que fazer:** Estrutura idêntica ao BE-02 para TipoMaterial.
- Nome único: capturar constraint violation → 409
- Inativação com verificação de status atual

**Critério de aceite:** Nome duplicado retorna 409.

---

## FASE 4 — Frontend

### FE-02 — Serviço de API (axios)
**Status:** TODO | **Depende de:** FE-01

**O que fazer:**
1. Completar `src/services/api.ts`:
   - Instância axios com `baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api'`
   - Response interceptor: em caso de erro, extrair `code`, `message`, `details` do body e relançar como `ApiError`
2. Criar `src/types/api.ts` com tipos: `ApiError`, `PageResponse<T>`, `ErroResponse`
3. Criar serviços individuais:
   - `src/services/clienteService.ts` — funções: `listar`, `buscarPorId`, `criar`, `atualizar`, `inativar`
   - Repetir para `localidadeService.ts`, `motoristaService.ts`, `veiculoService.ts`, `tipoMaterialService.ts`

**Critério de aceite:** Erro 404 da API é capturado e o campo `message` é acessível no catch.

---

### FE-03 — Componentes Base
**Status:** TODO | **Depende de:** FE-01

**O que fazer:**
1. `src/components/ui/DataTable.tsx` — tabela genérica com props: `columns`, `data`, `loading`, paginação
2. `src/components/ui/FormField.tsx` — label + input + mensagem de erro (integra com react-hook-form)
3. `src/components/ui/StatusBadge.tsx` — badge colorido: verde (ativo/ATIVO), vermelho (inativo/INATIVO), amarelo (MANUTENCAO/PARCIALMENTE)
4. `src/components/ui/ConfirmDialog.tsx` — modal de confirmação com mensagem e botões Confirmar/Cancelar

**Critério de aceite:** Componentes renderizam sem erro com props mínimas.

---

### FE-09 — Layout e Navegação
**Status:** TODO | **Depende de:** FE-01

**O que fazer:**
1. `src/components/AppLayout.tsx` — layout com sidebar (links para cada entidade de cadastro) e área de conteúdo
2. Configurar rotas em `App.tsx`:
   - `/` → redirecionar para `/cadastros/clientes`
   - `/cadastros/clientes`, `/cadastros/clientes/novo`, `/cadastros/clientes/:id/editar`
   - Repetir para localidades, motoristas, veiculos, tipos-material

**Critério de aceite:** Navegação entre todas as seções funciona sem recarregar a página.

---

### FE-04 — Telas de Clientes
**Status:** TODO | **Depende de:** BE-02, FE-02, FE-03

**O que fazer:**
1. `src/pages/cadastros/clientes/ClientesPage.tsx`:
   - Tabela paginada com colunas: Nome, Telefone, Status (badge), Ações (Editar, Inativar)
   - Filtro por nome (input de busca) e toggle "Mostrar inativos"
   - Botão "Novo Cliente" → navega para formulário
   - Ação Inativar abre `ConfirmDialog` antes de chamar API
2. `src/pages/cadastros/clientes/ClienteFormPage.tsx`:
   - Formulário com todos os campos (`nome`, `enderecoCompleto`, `pontoReferencia`, `telefone`)
   - Validação client-side com `zod` espelhando regras do backend:
     - `nome`: obrigatório, mín. 2 chars
     - `enderecoCompleto`: obrigatório, mín. 5 chars
     - `telefone`: opcional, se preenchido 8–20 chars
   - Em modo edição: pré-preencher formulário com dados do cliente
   - Submit chama `criar` ou `atualizar` conforme o caso
   - Em caso de erro da API: exibir mensagem de erro legível

**Critério de aceite:**
- Formulário com nome vazio exibe erro antes de chamar API
- Inativação pede confirmação e atualiza a lista

---

### FE-05 — Telas de Localidades
**Status:** TODO | **Depende de:** BE-03, FE-02, FE-03

**O que fazer:** Estrutura análoga ao FE-04.
- Tabela: Endereço, Tipo de Via (badge), Aptidão Chuva (badge), Ações (Editar, Excluir)
- Formulário: `endereco`, `tipoVia` (select), `aptidaoChuva` (select), `observacoes` (textarea)
- Ação Excluir (DELETE físico) com `ConfirmDialog`

---

### FE-06 — Telas de Motoristas
**Status:** TODO | **Depende de:** BE-04, FE-02, FE-03

**O que fazer:** Análogo ao FE-04.
- Tabela: Nome, CNH, Habilitação, Status, Ações
- Formulário: `nome`, `numeroCnh` (máscara 11 dígitos), `tipoHabilitacao` (select com opções A–E, AB, AC, AD, AE), `veiculoHabitual`, `contato`

---

### FE-07 — Telas de Veículos
**Status:** TODO | **Depende de:** BE-05, FE-02, FE-03

**O que fazer:** Análogo.
- Tabela: Identificação, Capacidade Máxima, Carroceria, Status Operacional (badge), Ações
- Formulário: `identificacao`, `capacidadeMaxima` (número), `tipoCarroceria`, `statusOperacional` (select)

---

### FE-08 — Telas de Tipos de Material
**Status:** TODO | **Depende de:** BE-06, FE-02, FE-03

**O que fazer:** Análogo ao FE-04.
- Tabela: Nome, Descrição, Status, Ações
- Formulário: `nome`, `descricao` (textarea)

---

## Resumo de tasks por status

| ID | Descrição | Status |
|---|---|---|
| BE-01 | Setup Spring Boot | TODO |
| FE-01 | Setup React + Vite | TODO |
| DB-01 | Migration clientes | TODO |
| DB-02 | Migration localidades | TODO |
| DB-03 | Migration motoristas | TODO |
| DB-04 | Migration veiculos | TODO |
| DB-05 | Migration tipos_material + seed | TODO |
| BE-07 | Global Exception Handler | TODO |
| BE-02 | CRUD Clientes | TODO |
| BE-03 | CRUD Localidades | TODO |
| BE-04 | CRUD Motoristas | TODO |
| BE-05 | CRUD Veículos | TODO |
| BE-06 | CRUD Tipos de Material | TODO |
| FE-02 | Serviço de API (axios) | TODO |
| FE-03 | Componentes base | TODO |
| FE-09 | Layout e navegação | TODO |
| FE-04 | Telas Clientes | TODO |
| FE-05 | Telas Localidades | TODO |
| FE-06 | Telas Motoristas | TODO |
| FE-07 | Telas Veículos | TODO |
| FE-08 | Telas Tipos de Material | TODO |
