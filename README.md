# Customer Segmentation & Tagging Tool — Backend

A Node.js + TypeScript GraphQL API that lets merchants filter Shopify customers by purchase behaviour and apply bulk tags. The data layer is fully mocked — no real Shopify store is required.

The companion React frontend lives at [frontEnd_assignment](https://github.com/sagarxjadhav/frontEnd_assignment).

---

## Prerequisites

- Node.js 18+
- npm 9+

---

## Setup & run

```bash
# 1. Clone the repo
git clone https://github.com/sagarxjadhav/customer-tagging-api.git
cd customer-tagging-api

# 2. Install all workspace dependencies
npm install

# 3. Create your env file
cp .env.example .env
# .env.example contains:  PORT=4000  NODE_ENV=development

# 4. Start the API in development mode
npm run dev
```

You should see:
```
API running at http://localhost:4000
GraphQL at http://localhost:4000/graphql
```

Verify with:
```
GET http://localhost:4000/health  →  { "status": "ok" }
```

---

## Starting both services together

The frontend must be running alongside this API. Clone both repos into the same parent folder:

```
parent/
├── Backend/    ← this repo
└── Frontend/   ← https://github.com/sagarxjadhav/frontEnd_assignment
```

Then from the **Backend** root:

```bash
npm run dev:all
```

This uses `concurrently` to start the API on port 4000 and the Vite frontend on port 5173 in a single terminal.

Or run them in two separate terminals:

```bash
# Terminal 1 — API
cd Backend && npm run dev

# Terminal 2 — Frontend
cd Frontend && npm run dev
```

---

## How to run tests

```bash
npm test --workspace=apps/api
```

The test suite covers `filterService` (8 tests) and `tagService` (6 tests). Both test real business logic — no snapshot tests.

---

## Project structure

```
/
├── apps/
│   └── api/
│       └── src/
│           ├── index.ts               Server entry point
│           ├── types.ts               Shared TypeScript interfaces
│           ├── schema/
│           │   └── typeDefs.ts        GraphQL schema
│           ├── resolvers/
│           │   ├── queryResolvers.ts  filterCustomers, getTagHistory
│           │   └── mutationResolvers.ts  applyCustomerTag
│           ├── services/
│           │   ├── filterService.ts   Filter logic (amount, orders, date)
│           │   └── tagService.ts      Tag add/remove candidate logic
│           ├── data/
│           │   ├── customerRepository.ts  In-memory data access
│           │   └── fixtureLoader.ts       Loads customers.json at startup
│           └── history/
│               └── historyStore.ts    In-memory history of tag operations
└── fixtures/
    └── customers.json                 55 generated customers (faker)
```

### Architecture decisions

Resolvers are intentionally thin — they delegate to services (business logic) and the data layer (reads/writes). This makes the services independently testable without Apollo or Express in scope.

---

## GraphQL API

Full query/mutation reference in [API.md](./API.md).

**Queries**
- `filterCustomers(criteria: FilterInput!): [Customer!]!` — filter by spend, orders, recency (AND logic, max 50 results)
- `getTagHistory: [HistoryEntry!]!` — list of past tag operations this session

**Mutations**
- `applyCustomerTag(input: TagOperationInput!): TagOperationResult!` — add or remove a tag from all filtered customers; supports `dryRun: true` for preview without data change

---

## Decisions & trade-offs

### 1. Single `applyCustomerTag` mutation instead of separate `tagsAdd` / `tagsRemove`

The brief mentions separate Shopify-style `tagsAdd` and `tagsRemove` mutations. A single mutation with a `TagAction` enum reduces duplication — both operations share identical input shape (criteria + tag + dryRun) and result shape. The trade-off is slightly less Shopify-idiomatic naming, which is called out in the frontend README assumptions.

### 2. Strictly-greater-than filter semantics

All numeric filters use `>` (strictly greater than), not `>=`. This matches Shopify's "more than X" wording and avoids the common ambiguity of "at least X" vs "more than X". Tests explicitly cover the boundary case.

### 3. In-memory data, in-memory history

The customer list loads from `fixtures/customers.json` at startup and mutations are applied to the in-memory array. History is stored in a module-level array. Both reset on server restart. This is the appropriate scope for the time-box; a SQLite persistence layer is noted as a stretch goal.

---

## What's incomplete

- **Persistence** — History and tag mutations reset on server restart. A SQLite or JSON-file persistence layer would fix this.
- **Pagination** — `filterCustomers` returns at most 50 results. Cursor-based pagination would be needed for large stores.
- **Text search** — The brief mentions a `search` query string on the customers query. The current implementation only supports numeric criteria filters.

## What I'd do with another day

1. Add cursor pagination to `filterCustomers` with a `PageInfo` type
2. Persist tag history to a JSON file or SQLite
3. Add integration-level resolver tests (currently only service-layer tests exist)
