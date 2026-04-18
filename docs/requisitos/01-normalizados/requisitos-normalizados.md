# Requisitos Normalizados — Sistema de Controle de Entregas

**Versão:** 1.0  
**Data:** 2026-04-15  
**Origem:** `sistema_controle_entregas_jonathan_umc.docx` + `sistema_entregas_objetivos_requisitos_jonathan_umc.docx`  
**Status:** Rascunho — aguarda validação pelo responsável

---

## 1. Requisitos Funcionais

### RF01 — Cadastro de Cliente
- **O quê:** Cadastrar clientes com nome, endereço completo, ponto de referência, telefone e situação (ativo/inativo).
- **Regra de negócio:** Inativação não exclui histórico; novos agendamentos são bloqueados para cliente inativo.
- **Ator:** Administrador
- **Origem:** Doc2 §5 RF01, RF15

---

### RF02 — Cadastro de Localidade de Entrega
- **O quê:** Cadastrar localidades com endereço, tipo de via (asfaltada/não asfaltada) e aptidão para entrega em dias de chuva (Sim / Não / Parcialmente).
- **Regra de negócio:** Campo "aptidão chuva" deve ser exibido como alerta antes do início do deslocamento do motorista.
- **Ator:** Administrador
- **Origem:** Doc2 §5 RF02; Doc1 §3.2

---

### RF03 — Cadastro de Motorista
- **O quê:** Cadastrar motoristas com nome, número de CNH, tipo de habilitação, veículo habitual, contato e situação (ativo/inativo).
- **Ator:** Administrador
- **Origem:** Doc2 §5 RF03; Doc1 §3.5

---

### RF04 — Cadastro de Veículo
- **O quê:** Cadastrar veículos com identificação, capacidade máxima de carga, tipo de carroceria e situação operacional.
- **Regra de negócio:** Capacidade máxima é usada como base para RF07.
- **Ator:** Administrador
- **Origem:** Doc2 §5 RF04

---

### RF05 — Registro de Nova Entrega
- **O quê:** Registrar entrega informando cliente, localidade, tipo de material, quantidade, data e hora agendadas, motorista responsável e veículo designado.
- **Regra de negócio:** Status inicial = "Agendada".
- **Ator:** Administrador, Operador
- **Origem:** Doc2 §5 RF05

---

### RF06 — Distância e Tempo Estimado
- **O quê:** Registrar distância estimada (km) e tempo estimado de deslocamento, com campos editáveis pelo operador.
- **Nota:** Integração com APIs de mapa = **fora do escopo v1** (campos manuais).
- **Ator:** Administrador, Operador
- **Origem:** Doc2 §5 RF06

---

### RF07 — Controle de Capacidade de Veículo
- **O quê:** Alertar quando a carga de uma entrega ultrapassar a capacidade máxima do veículo designado.
- **Regra de negócio:** ⚠️ **DECISÃO PENDENTE DP-002** — alerta apenas ou bloqueio? Ver `decisoes-pendentes.md`.
- **Ator:** Sistema (automático)
- **Origem:** Doc2 §5 RF07; Doc1 §2 (Capacidade dos veículos)

---

### RF08 — Controle de Status da Entrega
- **O quê:** Controlar e exibir o status da entrega nas situações: Agendada, Em andamento, Concluída, Não realizada, Cancelada.
- **Regra de negócio:** Transições permitidas definidas no ciclo de vida (ver constitution.md §6).
- **Ator:** Sistema, Operador, Administrador
- **Origem:** Doc2 §5 RF08

---

### RF09 — Finalização de Entrega pelo Operador
- **O quê:** Operador registra hora de conclusão, observações e imagens comprobatórias.
- **Regra de negócio:** Interface deve ser responsiva (uso mobile em campo). Upload de foto obrigatório ou facultativo? Ver DP-003.
- **Ator:** Operador
- **Origem:** Doc2 §5 RF09; Doc1 §3.6

---

### RF10 — Registro de Não Realização
- **O quê:** Registrar motivo quando entrega não for realizada. Motivos: acesso bloqueado, cliente ausente, condição do terreno, problema no veículo, outros.
- **Regra de negócio:** Campo "motivo" é **obrigatório**.
- **Ator:** Operador
- **Origem:** Doc2 §5 RF10; Doc1 §3.6

---

### RF11 — Calendário de Entregas
- **O quê:** Exibir calendário com visão diária, semanal e mensal de todas as entregas agendadas, com identificação de motorista e status.
- **Ator:** Administrador
- **Origem:** Doc2 §5 RF11; Doc1 §3.3

---

### RF12 — Alertas Visuais de Pendência
- **O quê:** Emitir alertas visuais para: entregas do dia não iniciadas, entregas com atraso e agendamentos sem motorista definido.
- **Ator:** Sistema (automático), visível para Administrador
- **Origem:** Doc2 §5 RF12; Doc1 §3.3

---

### RF13 — Volume de Entregas por Motorista por Dia
- **O quê:** Exibir carga de cada motorista no dia para distribuição equilibrada da agenda.
- **Ator:** Administrador
- **Origem:** Doc2 §5 RF13; Doc1 §3.5

---

### RF14 — Remanejamento de Entrega pelo Administrador
- **O quê:** Administrador pode editar motorista, veículo, data e horário de entrega ainda não concluída, com registro da alteração.
- **Regra de negócio:** Histórico de remanejamentos deve ser preservado (auditoria).
- **Ator:** Administrador
- **Origem:** Doc2 §5 RF14; Doc1 §3.3

---

### RF15 — Inativação de Cliente
- **O quê:** Administrador inativa cliente, bloqueando novos agendamentos mas preservando histórico.
- **Ator:** Administrador
- **Origem:** Doc2 §5 RF15; Doc1 §3.4

---

### RF16 — Histórico de Entregas
- **O quê:** Consulta e filtro de histórico por cliente, motorista e período.
- **Ator:** Administrador
- **Origem:** Doc2 §5 RF16

---

### RF17 — Armazenamento de Imagens
- **O quê:** Imagens vinculadas à entrega concluída, com data, hora e identificação do motorista no upload.
- **Regra de negócio:** ⚠️ **DECISÃO PENDENTE DP-003** — limite de tamanho/quantidade por entrega não definido.
- **Ator:** Operador
- **Origem:** Doc2 §5 RF17; Doc1 §2 (Registro fotográfico)

---

### RF18 — Observações por Entrega
- **O quê:** Campo de texto livre por entrega, editável pelo Operador (finalização) e pelo Administrador (revisão).
- **Ator:** Operador, Administrador
- **Origem:** Doc2 §5 RF18; Doc1 §2 (Observações da entrega)

---

### RF19 — Relatórios Básicos
- **O quê:** Relatórios de entregas realizadas, pendentes, canceladas; por motorista, por cliente e por período.
- **Regra de negócio:** ⚠️ **DECISÃO PENDENTE DP-004** — formato de exportação (PDF, planilha?) não definido.
- **Ator:** Administrador
- **Origem:** Doc2 §5 RF19

---

### RF20 — Auditoria de Ações
- **O quê:** Registrar todas as ações relevantes com data, hora e usuário responsável.
- **Ator:** Sistema (automático)
- **Origem:** Doc2 §5 RF20

---

## 2. Requisitos Não Funcionais

| Código | Descrição | Origem |
|---|---|---|
| RNF01 | Interface do operador responsiva (mobile) | Doc2 §6 |
| RNF02 | Interface simples, poucos passos, linguagem clara | Doc2 §6 |
| RNF03 | Autenticação por usuário/senha, 2 perfis: Admin e Operador | Doc2 §6 |
| RNF04 | Admin: acesso total | Doc2 §6 |
| RNF05 | Operador: acesso restrito (inserção, finalização, campos simples) | Doc2 §6 |
| RNF06 | ⚠️ **DP-001** Banco: PostgreSQL (Doc2) vs Oracle (mandato). Ver decisoes-pendentes.md | Doc2 §6 |
| RNF07 | Tempo de resposta compatível com uso mobile em campo | Doc2 §6 |
| RNF08 | Arquitetura em camadas (interface / lógica / persistência) | Doc2 §6 |
| RNF09 | Mensagens de erro compreensíveis ao operador, sem exposição técnica | Doc2 §6 |
| RNF10 | Linguagem da interface = vocabulário da empresa (Entrega, Motorista, Terreno com chuva) | Doc2 §6 |
| RNF11 | Múltiplos motoristas com sessões simultâneas; cada um vê apenas suas entregas do dia | Doc2 §6 |
| RNF12 | Arquitetura modular para manutenção e expansão | Doc2 §6 |

---

## 3. Requisitos Operacionais

| # | Requisito | Origem |
|---|---|---|
| RO01 | Motorista acessa pelo celular em campo para finalizar entregas (foto + observações) | Doc2 §7 |
| RO02 | Fluxo de finalização: mínimo de etapas | Doc2 §7 |
| RO03 | Painel do Admin: visão consolidada (todos motoristas, veículos, entregas do dia) em uma tela | Doc2 §7 |
| RO04 | Sistema indica claramente entregas em terrenos com restrição de acesso em dias de chuva antes do deslocamento | Doc2 §7 |
| RO05 | Ao designar veículo: exibir capacidade disponível vs. carga prevista | Doc2 §7 |
| RO06 | Não realização exige campo obrigatório de motivo | Doc2 §7 |
| RO07 | Inativação de cliente bloqueia novos agendamentos, preserva histórico | Doc2 §7 |
| RO08 | Operações críticas funcionam em conexão mobile comum (sem alta velocidade) | Doc2 §7 |
| RO09 | Acesso via navegador (rede local e internet) | Doc2 §7 |

---

## 4. Módulos Sugeridos (organização acadêmica)

| Módulo | Conteúdo |
|---|---|
| M1 — Cadastros | Clientes, localidades, motoristas, veículos, tipos de material, usuários |
| M2 — Agendamento | Registro de entregas, motorista/veículo, data/hora, distância/tempo |
| M3 — Execução e Status | Acompanhamento de status, finalização pelo motorista, não realização |
| M4 — Agenda e Calendário | Calendário, alertas, visão consolidada por motorista/veículo |
| M5 — Histórico e Evidências | Consulta por cliente/motorista/período, fotos, observações, rastreabilidade |
| M6 — Relatórios | Realizadas, pendentes, canceladas, produtividade, visão gerencial |
