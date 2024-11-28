# Simulador de Sistema Bancário - NestJS

# Descrição do Projeto

Esta aplicação é um backend desenvolvido em [NestJS](https://nestjs.com/) que simula o funcionamento de um sistema bancário, aplicando conceitos de **Domain-Driven Design (DDD)**. O sistema gerencia clientes, contas bancárias e movimentações financeiras, oferecendo uma arquitetura modular, escalável e orientada ao domínio do problema.

---

# Estrutura do Projeto

O projeto segue uma organização baseada em camadas usando **Domain Driven Design**, **Clean Architecture** e aplicando princípios **S.O.L.I.D**:

### **Domínio**

- **Entidades**: Modelagem dos objetos principais do sistema (ex.: Cliente, ContaBancaria).
- **Agregados**: A ContaBancaria encapsula todas as movimentações financeiras relacionadas.
- **Serviços de Domínio**: Regras como "não permitir saldo negativo" e "transferência entre contas ativas" são aplicadas aqui.
- **Repositórios (interfaces)**: Definem contratos para manipulação de dados.

### **Aplicação**

- **Casos de Uso**: Implementação dos serviços de aplicação que orquestram as ações do sistema, como criação de cliente ou realização de movimentações.

### **Infraestrutura**

- **Banco de Dados**: Implementação dos repositórios utilizando o ORM Sequelize com um banco relacional (PostgreSQL/MySQL).
- **Controladores**: Definem os endpoints da API e direcionam as requisições para os casos de uso.
- **Comunicação Externa**: Configuração para integrações externas, se necessário.

---

# Estruturação do domínio

### **Entidades**:

- **Cliente**: Representa o cliente no sistema, com informações pessoais e contas relacionadas.

    - _Atributos_:
        - `cpf`: CPF do cliente, único no sistema.
        - `nome`: Nome completo do cliente.
        - `dataNascimento`: Data de nascimento do cliente.
        - `contas`: Numeros das contas relacionadas ao cliente.
        - `senha`: Senha do cliente cadastrado

    **Exemplo de DTO**:

    ```json
    {
        "cpf": "00000000000",
        "nome": "Eduardo Xavier",
        "dataNascimento": "2000-05-12T03:00:00.000Z",
        "contas": [3, 4],
        "senha": "senha criptografada"
    }
    ```

- **MovimentacaoFinanceira**: Representa as movimentacoes financeirass do sistema contendo as contas de destino origem valor e data.

    - _Atributos_:
        - `id`: Id da movimentação financeira único no sistema.
        - `data`: Data da movimentação financeira.
        - `tipoMovimentacao`: Tipo de movimentação financeira (DEPOSITO, TRANSFERENCIA, SAQUE).
        - `numeroContaOrigem`: Numero da conta de origem.
        - `numeroContaDestino`: Numero da conta de destino.

    **Exemplo de DTO**:

    ```json
    {
        "id": "4cfbe396-54dd-4fe1-9982-97346c1f6889",
        "valor": 700,
        "data": "2024-11-27T21:48:46.596Z",
        "tipoMovimentacao": "TRANSFERENCIA",
        "numeroContaOrigem": 1,
        "numeroContaDestino": 2
    }
    ```

### **Agregado**: A ContaBancaria encapsula todas as movimentações financeiras relacionadas.

- **Conta**: Representa a conta bancária do cliente, com informações sobre saldo, status e movimentações financeiras.

    - _Atributos_:
        - `numeroConta`: Número único da conta.
        - `saldo`: Saldo atual da conta.
        - `status`: Status da conta (ATIVA ou INATIVA).
        - `clienteId`: Identificador único do cliente dono da conta.
        - `movimentacaoFinanceira`: Lista de movimentações financeiras associadas à conta.

    **Exemplo de DTO**:

    ```json
    {
        "numeroConta": 2,
        "saldo": 700.0,
        "status": "ATIVA",
        "clienteId": "00000000000",
        "movimentacaoFinanceira": [
            {
                "id": "4cfbe396-54dd-4fe1-9982-97346c1f6889",
                "valor": 700,
                "data": "2024-11-27T21:48:46.596Z",
                "tipoMovimentacao": "TRANSFERENCIA",
                "numeroContaOrigem": 1,
                "numeroContaDestino": 2
            }
        ]
    }
    ```

---

# Estruturação de tabelas em banco

Este documento descreve a estruturação das tabelas no banco de dados para o modelo de clientes e contas bancárias, com base no código fornecido.

## Tabelas

### Tabela **cliente**

A tabela `cliente` armazena informações relacionadas aos clientes do sistema, incluindo dados pessoais como CPF, nome, data de nascimento e senha.

| Coluna            | Tipo           | Propriedades           |
| ----------------- | -------------- | ---------------------- |
| `cpf`             | `VARCHAR(255)` | PK, Not Null           |
| `nome`            | `VARCHAR(255)` | Not Null               |
| `data_nascimento` | `DATE`         | Not Null               |
| `senha`           | `VARCHAR(255)` | Not Null               |
| `created_at`      | `TIMESTAMP`    | Timestamps, Automático |
| `updated_at`      | `TIMESTAMP`    | Timestamps, Automático |

#### Descrição

- **cpf**: Identificador único do cliente no sistema (Chave Primária).
- **nome**: Nome completo do cliente.
- **data_nascimento**: Data de nascimento do cliente.
- **senha**: Senha criptografada do cliente.
- **created_at**: Data de criação do registro.
- **updated_at**: Data da última atualização do registro.
---

### Tabela **conta_bancaria**

A tabela `conta_bancaria` armazena informações sobre as contas bancárias dos clientes, incluindo saldo, status e movimentações financeiras associadas.

| Coluna               | Tipo                       | Propriedades                          |
| -------------------- | -------------------------- | ------------------------------------- |
| `numero_conta`       | `INTEGER`                  | PK, Auto Increment, Not Null          |
| `cliente_id`         | `VARCHAR(255)`             | FK para `ClienteModel`, Not Null      |
| `saldo`              | `DECIMAL(10,2)`            | Not Null                              |
| `status`             | `ENUM('ATIVA', 'INATIVA')` | Not Null                              |
| `json_movimentacoes` | `JSONB`                    | Not Null (Histórico de movimentações) |
| `created_at`         | `TIMESTAMP`                | Timestamps, Automático                |
| `updated_at`         | `TIMESTAMP`                | Timestamps, Automático                |

#### Descrição

- **numero_conta**: Identificador único da conta bancária (Chave Primária).
- **cliente_id**: Referência ao cliente associado à conta bancária. Este campo é uma chave estrangeira que faz referência à coluna `cpf` da tabela `cliente`.
- **saldo**: Saldo atual da conta bancária. Inicialmente é 0 e pode ser modificado com transações financeiras.
- **status**: Status da conta bancária, representado por um valor ENUM que pode ser `ATIVA` ou `INATIVA`.
- **json_movimentacoes**: Armazena as movimentações financeiras da conta em formato JSONB. Esse campo contém um array de objetos JSON, cada um representando uma movimentação financeira realizada na conta.
- **created_at**: Data de criação do registro.
- **updated_at**: Data da última atualização do registro.

### Tabela **log**

A tabela `log` armazena os logs de todas as execuções de endpoints da aplicação, registrando os parâmetros de entrada, saida e erros caso existam. Essa tabela pode ser utilizada para ter um controle de todos os processos executados no sistema, incluindo as movimentações entre contas, retornando as props da movimentação e o resultado da execução.

| Coluna               | Tipo                       | Propriedades                          |
| -------------------- | -------------------------- | ------------------------------------- |
| `id`                 | `UUID`                     | PK, Not Null                          |
| `process`            | `VARCHAR(255)`             | Not Null                              |
| `log`                | `VARCHAR(255)`             | Not Null                              |
| `props`              | `VARCHAR(255)`             | Not Null                              |
| `result`             | `VARCHAR(255)`             | Not Null                              |
| `type`               | `string`                   | Timestamps, Automático                |
| `created_at`         | `TIMESTAMP`                | Timestamps, Automático                |
| `updated_at`         | `TIMESTAMP`                | Timestamps, Automático                |

#### Descrição

- **id**: Identificador único do log (Chave Primária).
- **process**: Processo executado nesse log (buscarConta, efetuarDeposito, efetuarSaque...).
- **log**: Log retornado do processo, execução com sucesso ou falha.
- **props**: Parâmetros de entrada do processo.
- **result**: Resultado do processo, podendo ser também um erro retornado.
- **type**: Tipo do log(error,log,warn...).
- **created_at**: Data de criação do registro.
- **updated_at**: Data da última atualização do registro.
  
---

# Instruções de Instalação e Execução

### **Pré-requisitos**

- [Node.js](https://nodejs.org/) v18+
- [Nest CLI](https://docs.nestjs.com/cli/overview) instalado globalmente.
- Banco de dados relacional (PostgreSQL/MySQL).

## **Passos para Instalação Nativamente**

### Passo 1: Clonar o repositório

Clone este repositório para sua máquina local:

```bash
git clone https://github.com/eDusVx/dd-bank.git
```

### Passo 2: Entrar na pasta

```bash
cd dd-bank
```

### Passo 3: Efetuar instalação das dependências

```bash
npm install
```

### Passo 4: Configurar variaveis de amibente criando um arquivo .env na raiz do projeto por exemplo:

```bash
APP_PORT=3000 # Porta de subida da aplicação
DB_USERNAME='postgres' # Username do banco de dados postgreesl
DB_PASSWORD='postgres' # Senha do banco de dados postgreesl
DB_DATABASE='postgres' # Database do banco de dados postgreesl
DB_HOST='localhost' # Host do banco de dados postgreesl
DB_PORT=5432 # Porta do banco de dados postgreesl
DB_LOGGING='false' # Variavel que ativa/desativa logs do sequelize
JWT_TOKEN='TOKEN' # Jwt token que deve ser gerado previamente e inserido aqui

```

### Passo 5: Iniciar projeto

```bash
npm run start:dev
```

### A aplicação subirá no endereço `http://localhost:{APP_PORT}/dd-bank`

## **Passos para Instalação Via Docker**

### Passo 1: Clonar o repositório

```bash
git clone https://github.com/eDusVx/dd-bank.git
```

### Passo 2: Entrar na pasta

```bash
cd dd-bank
```

### Passo 3: Configurar variaveis de amibente criando um arquivo .env na raiz do projeto por exemplo(No caso do docker o banco não precisa ser previamente criado, os dados inseridos no env serão os dados de criação da instancia do pg via docker):

```bash
APP_PORT=3000 # Porta de subida da aplicação
DB_USERNAME='postgres' # Username do banco de dados postgreesl
DB_PASSWORD='postgres' # Senha do banco de dados postgreesl
DB_DATABASE='postgres' # Database do banco de dados postgreesl
DB_HOST='localhost' # Host do banco de dados postgreesl
DB_PORT=5432 # Porta do banco de dados postgreesl
DB_LOGGING='false' # Variavel que ativa/desativa logs do sequelize
JWT_TOKEN='TOKEN' # Jwt token que deve ser gerado previamente e inserido aqui

```

### Passo 4: Com o docker rodando, basta executar o comando `docker-compose up --build` e ele subirá uma instancia do pg juntamente da aplicação nestJs já funcional

```bash
docker-compose up --build
```

### A aplicação subirá no endereço `http://localhost:{APP_PORT}/dd-bank`

---

# Funcionalidades

## Testes Unitários

Os testes unitários do projeto podem ser executados com os seguintes comandos:

```bash
npm run test         # Executa os testes unitários
npm run test:cov     # Executa os testes com cobertura de código
```

## Endpoints

### Após subir a aplicação o basepath padrão da aplicação será:

`http://localhost:{APP_PORT}/dd-bank`

## **Documentação via swagger**

### Para acessar a documentação mais detalhada das rotas e tipos de retorno/entrada em cada rota acesse a documentação do swagger no endereço:

`http://localhost:{APP_PORT}/dd-bank/docs`

## Postman Collection

### Se preferir importar a coleção do Postman com os exemplos, basta baixar e importar no endereço:

[![Baixar coleção do Postman](https://img.shields.io/badge/Download-Postman%20Collection-blue)](https://downgit.github.io/#/home?url=https://github.com/eDusVx/dd-bank/blob/main/postman/collection.json)


### **Clientes**

- **Atributos**: Nome completo, CPF (único e validado), Data de Nascimento.
- **Endpoints**:
    - `POST {BASEPATH}/clientes`: Criação de cliente.
    - `GET {BASEPATH}/clientes/:id`: Obter informações detalhadas de um cliente, incluindo contas associadas.
    - `POST {BASEPATH}/clientes/login`: Efetuar login de um cliente

### **Contas Bancárias**

- **Atributos**: Número da conta (gerado automaticamente), saldo inicial (padrão: zero), status (ativa/inativa).
- **Endpoints**:
    - `POST {BASEPATH}/contas`: Criar conta vinculada a um cliente.
    - `PATCH {BASEPATH}/contas/:id`: Atualizar status (ativa/inativa).
    - `GET {BASEPATH}/contas/:id`: Obter informações detalhadas, incluindo movimentações.

### **Movimentações Financeiras**

- **Tipos de Movimentação**: Depósito, Saque, Transferência entre contas.
- **Regras de Negócio**:
    - Saldo da conta não pode ser negativo.
    - Transferências são permitidas apenas entre contas ativas.
    - Registro detalhado de cada movimentação (data/hora, tipo, valor, contas envolvidas).
- **Endpoints**:
    - `POST {BASEPATH}/movimentacoes/deposito`: Realizar depósito.
    - `POST {BASEPATH}/movimentacoes/saque`: Realizar saque.
    - `POST {BASEPATH}/movimentacoes/transferencia`: Realizar transferência.
---
