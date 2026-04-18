# Mapa Mestre de Requisitos — Sistema de Controle de Entregas

**Versão:** 1.0  
**Data:** 2026-04-15

Este mapa consolida a rastreabilidade entre os documentos-fonte e os requisitos normalizados, e aponta conflitos e lacunas identificados.

---

## 1. Cobertura por Área de Negócio

| Área | RFs cobertos | Decisões Pendentes | Status |
|---|---|---|---|
| Cadastros base | RF01–RF04 | DP-001 (stack) | Aguarda DP-001 |
| Entrega (ciclo de vida) | RF05, RF08, RF09, RF10, RF14 | DP-002, DP-006 | Aguarda DPs |
| Evidências e observações | RF09, RF17, RF18 | DP-003 | Aguarda DP-003 |
| Agenda / Calendário | RF11, RF12, RF13 | — | Pronto para spec |
| Capacidade de veículo | RF07 | DP-002 | Aguarda DP-002 |
| Distância/tempo | RF06 | — | Pronto para spec |
| Histórico e rastreabilidade | RF16, RF20 | — | Pronto para spec |
| Relatórios | RF19 | DP-004 | Aguarda DP-004 |
| Acesso e perfis | RNF03–RNF05 | — | Pronto para spec |
| Auditoria | RF20 | — | Pronto para spec |
| Offline/conexão | RO08 | DP-005 | Aguarda DP-005 |

---

## 2. Conflitos Detectados

| ID | Tipo | Documentos em conflito | Decisão |
|---|---|---|---|
| DP-001 | Stack tecnológica | Doc2 Premissa 5 vs. mandato de governança | ⏳ Pendente |

---

## 3. Lacunas (requisitos implícitos não documentados)

| Lacuna | Impacto | RF relacionado |
|---|---|---|
| Tipos de material não catalogados (areia média, fina, grossa, pedra...) | Cadastro de "Tipo de Material" precisa ser definido | RF05 |
| Campos obrigatórios vs. opcionais por entidade não definidos | Validação frontend/backend indefinida | Todos RFs de cadastro |
| Regra de transição de status explícita não documentada | Lógica de negócio no backend | RF08 |
| SLA de alerta (quanto tempo antes da hora agendada alertar?) | RF12 incompleto | RF12 |
| Política de retenção de fotos (prazo, storage) | RF17 incompleto | RF17 |
| Formato/campos dos relatórios não detalhados | RF19 incompleto | RF19 |

---

## 4. Matriz de Rastreabilidade Requisito → Módulo

| Requisito | Módulo | Pronto para Spec? |
|---|---|---|
| RF01 | M1 — Cadastros | Sim (após DP-001) |
| RF02 | M1 — Cadastros | Sim (após DP-001) |
| RF03 | M1 — Cadastros | Sim (após DP-001) |
| RF04 | M1 — Cadastros | Sim (após DP-001) |
| RF05 | M2 — Agendamento | Sim (após DP-001) |
| RF06 | M2 — Agendamento | Sim (após DP-001) |
| RF07 | M2 — Agendamento | Não (aguarda DP-002) |
| RF08 | M3 — Execução | Sim (após DP-001) |
| RF09 | M3 — Execução | Não (aguarda DP-003) |
| RF10 | M3 — Execução | Sim (após DP-001) |
| RF11 | M4 — Agenda | Sim (após DP-001) |
| RF12 | M4 — Agenda | Parcial (lacuna de SLA) |
| RF13 | M4 — Agenda | Sim (após DP-001) |
| RF14 | M3 — Execução | Sim (após DP-001) |
| RF15 | M1 — Cadastros | Sim (após DP-001) |
| RF16 | M5 — Histórico | Sim (após DP-001) |
| RF17 | M5 — Histórico | Não (aguarda DP-003) |
| RF18 | M3 / M5 | Sim (após DP-001) |
| RF19 | M6 — Relatórios | Não (aguarda DP-004) |
| RF20 | Transversal | Sim (após DP-001) |

---

## 5. Próximos Passos (após resolução das DPs)

1. **Resolver DP-001** → define arquitetura e viabiliza todos os outros itens.
2. Resolver DP-002, DP-003, DP-005, DP-006.
3. Gerar SPEC por módulo (M1 → M6), na sequência do Spec Kit.
4. Gerar PLAN a partir das specs.
5. Gerar TASKS.
6. Iniciar implementação apenas após tasks aprovadas.
