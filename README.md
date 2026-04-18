# Sistema de Controle de Entregas

Projeto acadêmico desenvolvido para a disciplina de Engenharia de Software — **UMC (Universidade de Mogi das Cruzes), 2025**.

Sistema web para gerenciamento de entregas de materiais de construção, com controle de clientes, motoristas, veículos, localidades e tipos de material.

---

## Tecnologias

### Backend
| Tecnologia | Versão |
|---|---|
| Java | 21 |
| Spring Boot | 3.3.5 |
| Spring Data JPA | — |
| Spring Validation | — |
| PostgreSQL | 18+ |
| Flyway | — |
| Maven | 3.9+ |

### Frontend
| Tecnologia | Versão |
|---|---|
| React | 18+ |
| TypeScript | 5+ |
| Vite | 8+ |
| React Router | v7 |
| React Hook Form | — |
| Zod | v4 |
| Axios | — |
| Lucide React | — |

---

## Estrutura do Projeto

```
├── backend/                  # API REST — Spring Boot
│   └── src/main/java/com/controleentregas/
│       ├── config/           # CORS, configurações globais
│       ├── controller/       # Endpoints REST
│       ├── domain/           # Entidades JPA
│       ├── dto/              # Request / Response DTOs
│       ├── exception/        # Tratamento global de erros
│       ├── repository/       # Spring Data Repositories
│       └── service/          # Regras de negócio
│
├── frontend/                 # SPA — React + TypeScript
│   └── src/
│       ├── components/       # Componentes reutilizáveis (DataTable, Toast, etc.)
│       ├── pages/            # Páginas por módulo (cadastros/)
│       ├── services/         # Clientes HTTP (Axios)
│       ├── types/            # Tipagens TypeScript
│       └── hooks/            # Custom hooks
│
├── diagramas/                # Diagramas UML (.drawio)
├── docs/                     # Documentação do projeto
└── specs/                    # Especificações e requisitos
```

---

## Módulos Implementados

- **Clientes** — CRUD completo com busca e inativação
- **Localidades** — CRUD completo (cidade/estado/CEP)
- **Motoristas** — CRUD completo com CNH e validações
- **Veículos** — CRUD completo com placa e capacidade
- **Tipos de Material** — CRUD completo

---

## Pré-requisitos

- Java 21+
- Maven 3.9+
- Node.js 18+
- PostgreSQL 15+

---

## Configuração do Banco de Dados

1. Crie o banco de dados no PostgreSQL:

```sql
CREATE DATABASE controle_entregas;
```

2. As credenciais padrão estão em `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/controle_entregas
    username: postgres
    password: 2020
```

> As tabelas são criadas automaticamente pelo **Flyway** na primeira execução.

---

## Como Executar

### Backend

```bash
cd backend
mvn spring-boot:run
```

A API estará disponível em: `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

> O Vite possui proxy configurado: requisições para `/api` são redirecionadas automaticamente para `localhost:8080`.

---

## Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/clientes` | Listar clientes (paginado) |
| POST | `/api/clientes` | Cadastrar cliente |
| PUT | `/api/clientes/{id}` | Editar cliente |
| PATCH | `/api/clientes/{id}/inativar` | Inativar cliente |
| GET | `/api/localidades` | Listar localidades |
| POST | `/api/localidades` | Cadastrar localidade |
| PUT | `/api/localidades/{id}` | Editar localidade |
| PATCH | `/api/localidades/{id}/inativar` | Inativar localidade |
| GET | `/api/motoristas` | Listar motoristas |
| POST | `/api/motoristas` | Cadastrar motorista |
| PUT | `/api/motoristas/{id}` | Editar motorista |
| PATCH | `/api/motoristas/{id}/inativar` | Inativar motorista |
| GET | `/api/veiculos` | Listar veículos |
| POST | `/api/veiculos` | Cadastrar veículo |
| PUT | `/api/veiculos/{id}` | Editar veículo |
| PATCH | `/api/veiculos/{id}/inativar` | Inativar veículo |
| GET | `/api/tipos-material` | Listar tipos de material |
| POST | `/api/tipos-material` | Cadastrar tipo de material |
| PUT | `/api/tipos-material/{id}` | Editar tipo de material |
| PATCH | `/api/tipos-material/{id}/inativar` | Inativar tipo de material |
| GET | `/api/health` | Health check da API |

---

## Autor

**Jonathan Augusto**
Curso de Engenharia de Software — UMC, Mogi das Cruzes/SP
