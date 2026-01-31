declare module "better-sqlite3" {
  type Row = { name: string };

  export default class Database {
    constructor(filename: string);
    exec(sql: string): unknown;
    prepare(sql: string): { all: () => Row[] };
    close(): void;
  }
}
