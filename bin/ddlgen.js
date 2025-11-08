#!/usr/bin/env node
import { prismaToSQL } from '../index.js';
import fs from 'fs';

function parseArgs(argv){
  const args = { dialect: 'mysql', schema: './schema.prisma', out: null };
  for (let i=2;i<argv.length;i++) {
    const a = argv[i];
    if (a === '--dialect' || a === '-d') args.dialect = argv[++i];
    else if (a === '--schema' || a === '-s') args.schema = argv[++i];
    else if (a === '--out' || a === '-o') args.out = argv[++i];
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function help(){
  console.log(`Prisma DDL Generator\n\nUsage: ddlgen [options]\n\nOptions:\n  -d, --dialect <mysql|postgres|sqlite|mariadb>  Target SQL dialect (default mysql)\n  -s, --schema <path>                            Path to Prisma schema file (default ./schema.prisma)\n  -o, --out <file>                               Output file path (default output.<dialect>.sql)\n  -h, --help                                     Show help\n\nExamples:\n  ddlgen -d postgres -s prisma/schema.prisma\n  ddlgen --dialect sqlite --out schema.sqlite.sql\n`);
}

async function run(){
  const args = parseArgs(process.argv);
  if (args.help){ help(); return; }
  const sql = await prismaToSQL({ schemaPath: args.schema, dialect: args.dialect });
  const outFile = args.out || `output.${args.dialect}.sql`;
  fs.writeFileSync(outFile, sql);
  console.log(`Written ${outFile}`);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
