# Glossário — Sistema de Controle de Entregas

**Versão:** 1.0  
**Data:** 2026-04-15  
**Propósito:** Eliminar ambiguidades entre documentos, specs, código e protótipo. Todos os termos abaixo têm significado preciso e único neste projeto.

---

## Termos do Negócio

### Administrador
**Definição:** Perfil de usuário com acesso total ao sistema.  
**Pode:** Cadastrar, editar, inativar qualquer entidade; remanejar entregas; visualizar todos os relatórios.  
**Não pode:** Nada está bloqueado para este perfil.  
**Sinônimos aceitos no sistema:** "Admin"  
**Sinônimos NÃO usar:** "gerente", "gestor", "supervisor"

---

### Agendamento
**Definição:** Ato de registrar uma entrega futura com data, hora, motorista e veículo definidos.  
**Status resultante:** "Agendada"  
**Escopo:** M2 — fora do MVP atual.  
**Não confundir com:** "reserva", "pedido"

---

### Aptidão para Chuva
**Definição:** Indicação se uma localidade de entrega é acessível em dias de chuva.  
**Valores possíveis:**
- `SIM` — via acessível normalmente mesmo com chuva
- `NÃO` — via inacessível em dias de chuva
- `PARCIALMENTE` — acesso depende da intensidade da chuva ou trecho específico  
**Campo no banco:** `aptidao_chuva` (tabela `localidades`)  
**Origem:** Doc1 §2 e §3.2; RF02

---

### Areia
**Definição:** Tipo de material comercializado pela empresa, disponível em granulometrias distintas.  
**Subtipos conhecidos:** Areia média, areia fina, areia grossa.  
**Registrado em:** tabela `tipos_material`  
**Não confundir com:** "insumo", "produto"

---

### Cancelada (Entrega)
**Definição:** Status de uma entrega que foi anulada antes da conclusão.  
**Escopo:** M3 — fora do MVP atual.  
**Decisão pendente:** DP-006 — quem pode cancelar.

---

### Capacidade Máxima
**Definição:** Limite de carga que um veículo pode transportar em uma única viagem.  
**Campo no banco:** `capacidade_maxima` (tabela `veiculos`)  
**Unidade:** A definir — atualmente campo numérico livre. Ver DP pendente sobre unidade (toneladas vs. m³).  
**Uso:** Base do alerta de sobrecarga (RF07 — escopo M2).

---

### Cliente
**Definição:** Pessoa física ou jurídica que realiza compras na empresa e recebe entregas.  
**Campos principais:** nome, endereço completo, ponto de referência, telefone, ativo.  
**Inativação:** Preserva histórico; bloqueia novos agendamentos.  
**Não confundir com:** Localidade (o cliente tem um endereço, mas a localidade de entrega pode ser diferente).  
**Origem:** RF01, RF15

---

### CNH (Carteira Nacional de Habilitação)
**Definição:** Documento de habilitação do motorista no Brasil.  
**Número:** 11 dígitos numéricos, único por motorista no sistema.  
**Categorias aceitas:** A, B, C, D, E, AB, AC, AD, AE  
**Campo no banco:** `numero_cnh` (tabela `motoristas`)

---

### Concluída (Entrega)
**Definição:** Status de uma entrega que foi realizada com sucesso pelo motorista.  
**Requer:** Registro de hora de conclusão, observações e foto comprobatória.  
**Escopo:** M3 — fora do MVP atual.

---

### Entrega
**Definição:** Registro central do sistema. Representa o ato de transportar material de construção do estoque da empresa até a localidade do cliente.  
**Ciclo de vida:** Agendada → Em andamento → Concluída | Não realizada | Cancelada  
**Escopo:** M2/M3 — fora do MVP atual.

---

### Identificação do Veículo
**Definição:** Código único que identifica o veículo no sistema. Pode ser a placa oficial ou um apelido interno de operação.  
**Campo no banco:** `identificacao` (tabela `veiculos`)  
**Exemplo:** "ABC-1234", "Caminhão Toco Velho", "Truck 02"

---

### Inativo
**Definição:** Estado de um registro que foi desativado e não pode ser usado em novas operações, mas mantém seu histórico preservado.  
**Entidades com inativação:** Cliente, Motorista, TipoMaterial  
**Campo no banco:** `ativo = false`  
**Diferença de Excluído:** Inativo preserva dados; excluído remove definitivamente.

---

### Localidade
**Definição:** Local físico de entrega cadastrado no sistema. Pode estar vinculada a um ou mais clientes em entregas futuras, mas é cadastrada de forma independente.  
**Campos principais:** endereço, tipo de via, aptidão para chuva, observações.  
**Não confundir com:** Endereço do cliente (o campo `enderecoCompleto` do cliente é para contato; a localidade é o destino operacional da entrega).  
**Origem:** RF02

---

### Motorista
**Definição:** Profissional responsável por executar as entregas. Possui CNH e está vinculado a um veículo habitual.  
**Campos principais:** nome, CNH, tipo de habilitação, veículo habitual, contato, ativo.  
**Origem:** RF03

---

### Não Realizada (Entrega)
**Definição:** Status de uma entrega em que o motorista chegou ao destino mas não pôde concluir a entrega.  
**Motivos possíveis:** acesso bloqueado, cliente ausente, condição do terreno, problema no veículo, outros.  
**Escopo:** M3 — fora do MVP atual.

---

### Operador
**Definição:** Perfil de usuário de nível básico. Inclui motoristas e atendentes.  
**Pode:** Inserir e finalizar entregas; registrar fotos e observações; editar hora e observações.  
**Não pode:** Inativar clientes; remanejar entregas; alterar dados operacionais críticos.  
**Escopo de autenticação:** Fora do MVP atual.

---

### Pedra
**Definição:** Tipo de material comercializado pela empresa (brita).  
**Subtipos conhecidos:** Pedra brita 1, Pedra brita 2.  
**Registrado em:** tabela `tipos_material`

---

### Ponto de Referência
**Definição:** Descrição textual que ajuda a localizar o endereço do cliente.  
**Exemplos:** "Próximo à padaria Pão Quente", "Casa de portão verde"  
**Campo no banco:** `ponto_referencia` (tabela `clientes`)  
**Obrigatoriedade:** Opcional

---

### Status Operacional (Veículo)
**Definição:** Estado operacional atual do veículo.  
**Valores possíveis:**
- `ATIVO` — veículo disponível para agendamento de entregas
- `INATIVO` — veículo desativado permanentemente ou temporariamente
- `MANUTENCAO` — veículo em manutenção, indisponível temporariamente  
**Diferença de Motorista:** Motorista usa `ativo` (boolean); veículo usa `status_operacional` (enum de 3 valores) por ter o estado de manutenção.

---

### Tipo de Material
**Definição:** Categoria de material de construção disponível para entrega.  
**Exemplos:** Areia média, areia fina, areia grossa, pedra brita 1, pedra brita 2.  
**Campo no banco:** tabela `tipos_material`  
**Origem:** Implícito em RF05

---

### Tipo de Via
**Definição:** Classificação da via de acesso à localidade de entrega.  
**Valores possíveis:**
- `ASFALTADA` — via com pavimentação asfáltica
- `NAO_ASFALTADA` — via de terra, cascalho ou sem pavimentação  
**Relevância operacional:** Vias não asfaltadas requerem atenção especial em dias de chuva e com veículos pesados.  
**Campo no banco:** `tipo_via` (tabela `localidades`)

---

### Tipo de Habilitação
**Definição:** Categoria da CNH que define quais veículos o motorista está habilitado a conduzir.  
**Valores aceitos no sistema:** A, B, C, D, E, AB, AC, AD, AE  
**Relevância:** Veículos pesados de carga exigem categoria C, D ou E.

---

### Veículo
**Definição:** Caminhão ou veículo de carga utilizado para realizar as entregas.  
**Campos principais:** identificação, capacidade máxima de carga, tipo de carroceria, status operacional.  
**Origem:** RF04

---

## Termos Técnicos do Sistema

### Soft Delete
**Definição:** Estratégia de "exclusão" que apenas marca o registro como inativo (`ativo = false`), sem remover fisicamente do banco.  
**Usado em:** clientes, motoristas, tipos_material  
**Não usado em (M1):** localidades (DELETE físico)

---

### Inativação
**Definição:** Operação de soft delete. No sistema, equivale a `PATCH /{entidade}/{id}/inativar`.  
**Diferença de atualização:** A inativação não altera outros campos — apenas seta `ativo = false`.  
**Irreversibilidade:** A reativação não está no escopo do MVP. Se necessária no futuro, será implementada via novo endpoint.

---

### Seed
**Definição:** Dados iniciais inseridos via migration no banco de dados na primeira execução do sistema.  
**Conteúdo no M1:** 5 tipos de material pré-cadastrados (areia média, areia fina, areia grossa, pedra brita 1, pedra brita 2).

---

### Migration
**Definição:** Script SQL versionado (via Flyway) que aplica alterações no schema do banco de dados.  
**Nomenclatura:** `V{número}__{descricao}.sql`  
**Regra:** Nunca alterar uma migration já aplicada em produção.
