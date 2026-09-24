# API de Super-Heróis — Drizzle ORM + PostgreSQL (Neon) + Render

Projeto de estudo de **Drizzle ORM** com um CRUD completo de super-heróis,
envolvendo **múltiplas tabelas relacionadas**:

- `publishers` (editoras) → 1:N com `superheroes`
- `teams` (equipes) → 1:N com `superheroes`
- `powers` (poderes) → N:N com `superheroes` (via tabela de junção `hero_powers`)
- `superheroes` (super-heróis) — entidade principal

```
publishers ─┐
            ├─< superheroes >─< hero_powers >─ powers
teams ──────┘
```

## Stack

- **Node.js + TypeScript**
- **Express** — camada HTTP
- **Drizzle ORM** — acesso a dados type-safe
- **Neon** (`@neondatabase/serverless`) — Postgres serverless
- **Zod** — validação de entrada
- **drizzle-kit** — migrations

## Arquitetura

```
src/
  db/            → schema, conexão, migrations, seed
  types/         → schemas de validação (Zod)
  services/      → regra de negócio + queries Drizzle
  controllers/   → tradução HTTP <-> service
  routes/        → definição dos endpoints
  middlewares/   → tratamento global de erros
  utils/         → AppError, catchAsync
  app.ts         → configuração do Express
  server.ts      → inicialização do servidor
```

Fluxo de uma requisição: `routes → controller → service → drizzle (db) → Postgres`.
Essa separação em camadas facilita testes, manutenção e é o padrão mais comum
em APIs Node/Express de mercado.

## 1. Rodando localmente

### Pré-requisitos
- Node.js 18+
- Uma conta gratuita no [Neon](https://neon.tech) (ou qualquer Postgres)

### Passo a passo

```bash
# 1. Instale as dependências
npm install

# 2. Copie o .env de exemplo e preencha com a URL do seu banco Neon
cp .env.example .env
# edite o .env e cole sua DATABASE_URL

# 3. Gere e aplique as migrations no banco
npm run db:generate   # gera o SQL em ./drizzle a partir do schema
npm run db:migrate    # aplica as migrations no banco configurado

# 4. (Opcional) Popule o banco com dados de exemplo
npm run db:seed

# 5. Suba o servidor em modo desenvolvimento
npm run dev
```

A API vai estar em `http://localhost:3000`.

> Alternativa rápida para prototipagem: `npm run db:push` aplica o schema
> diretamente no banco sem gerar arquivos de migration (bom para o dia a dia
> de estudos, mas evite em produção — prefira sempre migrations versionadas).

## 2. Criando o banco no Neon

1. Crie uma conta em https://neon.tech e um novo projeto.
2. No dashboard do projeto, copie a **Connection String** (formato
   `postgresql://usuario:senha@ep-xxxx.aws.neon.tech/neondb?sslmode=require`).
3. Cole essa string na variável `DATABASE_URL` do seu `.env`.
4. Rode `npm run db:migrate` para criar as tabelas.

## 3. Publicando no Render

1. Suba este projeto para um repositório no GitHub.
2. No [Render](https://render.com), clique em **New +** → **Blueprint** e
   aponte para o repositório (o arquivo `render.yaml` já está configurado),
   **ou** crie manualmente um **Web Service** com:
   - **Build Command:** `npm install && npm run build && npm run db:migrate`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/health`
3. Em **Environment**, adicione a variável `DATABASE_URL` com a connection
   string do Neon (a mesma do passo anterior — use uma branch/db de produção
   separada da de desenvolvimento, se preferir).
4. Defina `NODE_ENV=production`.
5. Deploy! O Render executa o build (que já roda as migrations) e sobe o
   servidor com `npm start`.

> Dica: o Neon oferece "branches" de banco de dados — é uma boa prática ter
> uma branch para desenvolvimento local e outra para produção (Render).

## 4. Endpoints da API

Base URL: `/api`

| Recurso        | Método | Rota                     | Descrição                              |
|----------------|--------|--------------------------|-----------------------------------------|
| Super-heróis   | GET    | `/superheroes`           | Lista todos, com editora/equipe/poderes |
| Super-heróis   | GET    | `/superheroes/:id`       | Busca um herói por ID                   |
| Super-heróis   | POST   | `/superheroes`           | Cria um herói (aceita `powerIds`)       |
| Super-heróis   | PUT    | `/superheroes/:id`       | Atualiza um herói                       |
| Super-heróis   | DELETE | `/superheroes/:id`       | Remove um herói                         |
| Editoras       | GET/POST/PUT/DELETE | `/publishers` `/publishers/:id` | CRUD de editoras          |
| Equipes        | GET/POST/PUT/DELETE | `/teams` `/teams/:id`           | CRUD de equipes           |
| Poderes        | GET/POST/PUT/DELETE | `/powers` `/powers/:id`         | CRUD de poderes           |

### Exemplo: criar um herói com poderes

```bash
curl -X POST http://localhost:3000/api/superheroes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Diana Prince",
    "alias": "Mulher-Maravilha",
    "powerLevel": 95,
    "publisherId": 2,
    "teamId": 2,
    "powerIds": [1, 2]
  }'
```

A resposta já traz o herói com `publisher`, `team` e `powers` populados —
tudo resolvido pela **query relacional do Drizzle** (`db.query.superheroes.findMany({ with: {...} })`).

## 5. Boas práticas aplicadas

- **Camadas separadas** (routes/controllers/services) para baixo acoplamento.
- **Validação de entrada com Zod** em todos os endpoints.
- **Migrations versionadas** com `drizzle-kit`, nunca alterando o banco na mão.
- **Transações** (`db.transaction`) ao gravar herói + poderes juntos, garantindo
  atomicidade.
- **Foreign keys com `onDelete`** apropriado (`cascade` na tabela de junção,
  `set null` nas referências opcionais de herói).
- **Índices únicos** em colunas de nome/alias para evitar duplicidade.
- **Tratamento de erros centralizado**, incluindo erros de constraint do
  Postgres (unicidade e FK) convertidos em respostas HTTP claras.
- **Segurança básica de HTTP** com `helmet` e `cors`.
- **Health check** (`/health`) para o Render monitorar o serviço.
- Variáveis sensíveis fora do código-fonte (`.env`, nunca commitado).
