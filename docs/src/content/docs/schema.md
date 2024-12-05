---
title: Schema
section: "Getting Started"
---

## Schema

Schema refers to your DynamoDB Table Schema. We support:
- Multi-Table Schema Design
- Single Table Schema Design
- Zod and Superstruct for Schema Design
- [Coming soon] BYOL for schema validation

## Why Schema?

Hey what? a schema for a No-SQL database? That is an anti-pattern, so why?

The reason to use a No-SQL database is the flexibility of it to store data in a schema-less way. But, it is not a good idea to store data without a schema. A schema is a blueprint of your data. We in the real world often store multiple schemas in a single table to take advantage of this NoSQL / document-based database.

## How to define a Schema?

You can define a schema in two ways - using Zod or Superstruct.

---
Zod | Superstruct
---

## Errors 