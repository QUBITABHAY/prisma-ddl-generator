# prisma-ddl-generator

Generate SQL DDL from a Prisma schema using Prisma DMMF. Supports MySQL, MariaDB, PostgreSQL, and SQLite.

## Install

Local project (as a dev tool):

```bash
npm i @qubitabhay/prisma-ddl-generator
```

Or clone this repo and use via `npm link`:

```bash
npm link
```

## CLI Usage

```bash
npx ddlgen --dialect <mysql|postgres|sqlite|mariadb> --schema ./schema.prisma --out output.sql
```

- `--dialect` / `-d`: Target SQL dialect (default: mysql)
- `--schema`  / `-s`: Path to Prisma schema (default: ./schema.prisma)
- `--out`     / `-o`: Output file (default: output.<dialect>.sql)

Examples:

```bash
# MySQL (MariaDB uses the same output)
npx ddlgen -d mysql -s schema.prisma -o schema.mysql.sql

# PostgreSQL
npx ddlgen -d postgres -s schema.prisma -o schema.postgres.sql

# SQLite
npx ddlgen -d sqlite -s schema.prisma -o schema.sqlite.sql
```

## Library Usage

```js
import { prismaToSQL, genSQL } from 'prisma-ddl-generator';
import { getDMMF } from '@prisma/internals';
import fs from 'fs';

// From a Prisma schema file
const sql = await prismaToSQL({ schemaPath: './schema.prisma', dialect: 'postgres' });
console.log(sql);

// Or from a DMMF you already have
const schema = fs.readFileSync('./schema.prisma', 'utf8');
const dmmf = await getDMMF({ datamodel: schema });
const sql2 = genSQL(dmmf, 'mysql');
```

## Notes
- Enums are emitted as:
  - PostgreSQL: `CREATE TYPE ... AS ENUM (...)` and used by columns
  - MySQL/MariaDB: inline `ENUM('A','B',...)`
  - SQLite: stored as `VARCHAR(...)` (SQLite has no native enums)
- Foreign keys are inferred from `*Id` fields (heuristic). For perfect fidelity, extend to use relation metadata in DMMF.
- Defaults: `now()` becomes `CURRENT_TIMESTAMP(3)` for MySQL/Postgres and `CURRENT_TIMESTAMP` for SQLite. Primitive defaults are inlined.

## License
MIT
