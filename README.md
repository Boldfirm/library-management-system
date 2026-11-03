# Library Management System

A production-ready NestJS backend application connected to a Neon Serverless PostgreSQL database using Prisma ORM.

---

## Schema Decisions

### Referencing Genre via Foreign Key vs. Embedding
In this architecture, `Book` references `Genre` using a `genreId` foreign key (`@relation(fields: [genreId], references: [id])`) rather than embedding genre data inside each book record:

1. **Normalization and Data Integrity:** Relational databases like PostgreSQL enforce consistency through normalization. Maintaining genres in a dedicated table guarantees consistent naming and unique slug generation across the entire book catalog.
2. **Preventing Update Anomalies:** Modifying a genre name, slug, or metadata requires updating a single record in the `Genre` table rather than executing bulk, error-prone updates across thousands of embedded records.
3. **Optimized Indexing and Queries:** Foreign keys and indexed foreign key columns allow rapid relation lookups, query filtering by genre, and clean cascading rules without denormalized data bloat.
4. **Prisma vs. Document Databases (Stretch):** In document-oriented databases (e.g., MongoDB), denormalized embedded documents optimize read performance for unstructured access patterns. In relational modeling with Prisma and PostgreSQL, structured relational tables with foreign keys and typed joins (`include: { genre: true }`) eliminate data anomalies while preserving complete compile-time type safety.

---

## Setup & Local Development

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL or Neon Serverless PostgreSQL connection string

### 2. Environment Configuration
Copy the sample environment file and insert your database credentials:
```bash
cp .env.example .env
