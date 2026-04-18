# Decisões Pendentes — Sistema de Controle de Entregas

**Última atualização:** 2026-04-15  
**Responsável pela resolução:** Jonathan (UMC)

> ⛔ Nenhuma implementação pode prosseguir nos itens abaixo até que as decisões sejam registradas aqui como **RESOLVIDA**.

---

## DP-001 — Conflito de Stack Tecnológica

**Prioridade:** CRÍTICA — bloqueia todo início de implementação

**Conflito identificado:**

| Fonte | Stack |
|---|---|
| Mandato de governança (contexto do agente) | Angular + .NET Core 3.1 + Oracle/PLSQL |
| Documento 2 (`sistema_entregas_objetivos_requisitos_jonathan_umc.docx`), §1 Premissa 5 | React + Java + PostgreSQL |

**Impacto:** Toda a arquitetura do sistema (frontend, backend, banco de dados, contratos de API, procedures) depende desta decisão.

**Perguntas para resolução:**
1. Qual stack foi definida pelo professor/disciplina para este projeto?
2. A Premissa 5 do documento é uma orientação acadêmica geral ou uma decisão firme?
3. O mandato Angular + .NET + Oracle é uma exigência de infraestrutura da empresa-cliente ou contexto de outro projeto?

**Status:** ✅ RESOLVIDA — 2026-04-15  
**Decisão:** React (frontend) + Spring Boot/Java (backend) + PostgreSQL (banco de dados)  
**Decidido por:** Jonathan  
**Registrado por:** Agente de Governança  
**Referência no documento:** Doc2 §1 Premissa 5

---

## DP-002 — Comportamento ao Exceder Capacidade do Veículo (RF07)

**Prioridade:** ALTA

**Conflito / Ambiguidade:**  
O RF07 diz "alertar quando a carga ultrapassar a capacidade máxima". O documento não especifica se o sistema deve:
- (a) Apenas alertar visualmente, permitindo prosseguir
- (b) Bloquear o agendamento até que a carga seja ajustada

**Impacto:** Regra de negócio na camada de validação (frontend + backend). Afeta UX do operador.

**Perguntas para resolução:**
1. A empresa prefere alertar e permitir que o responsável decida, ou bloquear automaticamente?
2. Apenas o Administrador pode confirmar apesar do alerta, ou qualquer operador pode?

**Status:** ⏳ PENDENTE  
**Decisão:** _(a preencher)_  
**Referência no documento:** Doc2 §5 RF07; Doc1 §2 (Capacidade dos veículos)

---

## DP-003 — Limite de Fotos por Entrega (RF09/RF17)

**Prioridade:** MÉDIA

**Ambiguidade:**  
Os documentos indicam upload de imagens comprobatórias, mas não definem:
- Quantidade máxima de fotos por entrega
- Tamanho máximo por arquivo
- Formatos aceitos (JPG, PNG, outros?)
- Obrigatoriedade do upload para finalizar a entrega

**Impacto:** Afeta armazenamento, contrato da API de upload, validação frontend e backend.

**Perguntas para resolução (Doc2 §8, pergunta 5):**
1. As fotos devem ser tiradas obrigatoriamente no momento da entrega ou podem ser enviadas depois?
2. Há limite de tamanho ou quantidade por entrega?
3. O upload é obrigatório para marcar como "Concluída"?

**Status:** ⏳ PENDENTE  
**Decisão:** _(a preencher)_  
**Referência no documento:** Doc2 §5 RF09/RF17; Doc2 §8 pergunta 5

---

## DP-004 — Formato de Exportação dos Relatórios (RF19)

**Prioridade:** BAIXA (pode ser resolvida em sprint posterior)

**Ambiguidade:**  
RF19 define relatórios básicos, mas não especifica formato de exportação.

**Perguntas para resolução (Doc2 §8, pergunta 10):**
1. Os relatórios precisam ser exportados como PDF, planilha (Excel/CSV) ou apenas visualizados na tela?
2. Relatórios impressos são necessários?

**Status:** ⏳ PENDENTE  
**Decisão:** _(a preencher)_  
**Referência no documento:** Doc2 §5 RF19; Doc2 §8 pergunta 10

---

## DP-005 — Modo Offline para Motoristas

**Prioridade:** ALTA

**Ambiguidade:**  
Doc1 §3.1 sugere "registro offline com sincronização posterior". Doc2 RNF08 diz "operações críticas funcionam em conexão mobile comum". Há contradição parcial: offline real vs. conexão lenta.

**Perguntas para resolução (Doc2 §8, pergunta 4):**
1. As rotas de entrega têm acesso à internet (mesmo que lento)?
2. É necessário modo offline verdadeiro (service worker / PWA / app nativo) ou apenas otimização para conexões lentas?

**Status:** ⏳ PENDENTE  
**Decisão:** _(a preencher)_  
**Referência no documento:** Doc1 §3.1; Doc2 §8 pergunta 4; Doc2 RNF08

---

## DP-006 — Cancelamento de Entrega: quem pode cancelar?

**Prioridade:** MÉDIA

**Ambiguidade:**  
O escopo menciona status "Cancelada" mas não define quem pode cancelar (só Admin ou também Operador) nem em quais fases é permitido.

**Perguntas para resolução (Doc2 §8, pergunta 9):**
1. Apenas o Administrador pode cancelar uma entrega?
2. O motorista pode cancelar em campo?
3. É possível cancelar uma entrega "Em andamento"?

**Status:** ⏳ PENDENTE  
**Decisão:** _(a preencher)_  
**Referência no documento:** Doc2 §8 pergunta 9

---

## DP-007 — Perguntas em Aberto do Documento Original (Doc2 §8)

As perguntas abaixo foram listadas no documento original e ainda não foram respondidas. Cada uma pode gerar novas decisões pendentes ao ser respondida.

| # | Pergunta |
|---|---|
| Q1 | Quantos motoristas em operação simultânea? Volume máximo de entregas/dia? |
| Q2 | Como é feito hoje o agendamento: telefone, WhatsApp ou balcão? |
| Q3 | Motorista tem smartphone próprio ou a empresa fornece? |
| Q4 | → Ver DP-005 |
| Q5 | → Ver DP-003 |
| Q6 | O sistema de vendas possui API ou exportação para integração futura? |
| Q7 | Controlar quilometragem real por veículo para manutenção preventiva? (escopo futuro?) |
| Q8 | Necessidade de assinatura digital ou confirmação do cliente no ato da entrega? |
| Q9 | → Ver DP-006 |
| Q10 | → Ver DP-004 |

**Status:** ⏳ PENDENTE (todas)  
**Referência:** Doc2 §8

---

## Histórico de Resoluções

| DP | Data | Decisão |
|---|---|---|
| DP-001 Stack | 2026-04-15 | React + Spring Boot + PostgreSQL |
