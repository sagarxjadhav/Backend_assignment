# Customer Segmentation & Tagging Tool

A backend GraphQL API for segmenting Shopify customers and applying bulk tags based on purchase behavior.

## Stack

- Node.js + TypeScript (strict mode)
- Apollo Server + Express
- GraphQL
- Jest for testing

## Structure

```
apps/
  api/        Node.js GraphQL server
fixtures/
  customers.json   Mock customer data (55 customers)
```

## Setup

```bash
npm install
npm run dev        # starts API on http://localhost:4000/graphql
```

## Running Tests

```bash
cd apps/api
npm test
```

## Decisions & Trade-offs

- **In-memory data store**: Customer data and tag history are kept in memory. Simple and sufficient for the assignment scope; a real app would use a database.
- **Mocked Shopify API**: Instead of real Shopify integration, we use a static fixture generated with `@faker-js/faker`. This keeps the focus on schema design and resolver logic.
- **AND logic for filters**: Multiple filter criteria are combined with AND — most useful for the "find high-value customers" use case.
- **Dry-run on mutations**: The `applyCustomerTag` mutation supports a `dryRun` flag that previews affected customers without committing changes.

## What's Incomplete

- No pagination (results capped at 50)
- Tag history is not persisted across server restarts
- No real Shopify Admin API integration

## What I'd Do With Another Day

- Add pagination with cursor-based navigation
- Persist history to SQLite
- Add codegen for TypeScript types from the GraphQL schema
- Add E2E test with Playwright for the full tagging flow
