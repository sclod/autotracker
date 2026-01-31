type SQLiteDb = {
  exec: (sql: string) => unknown;
  prepare: (sql: string) => { all: () => Array<{ name: string }> };
};

export function ensureSchema(db: SQLiteDb) {
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS "Order" (
      "id" TEXT PRIMARY KEY,
      "trackingNumber" TEXT NOT NULL UNIQUE,
      "accessCode" TEXT,
      "clientName" TEXT,
      "clientPhone" TEXT,
      "vehicleSummary" TEXT NOT NULL,
      "vehicleVin" TEXT,
      "vehicleLot" TEXT,
      "etaText" TEXT,
      "publicStatus" TEXT,
      "lastUpdateNote" TEXT,
      "currentStageId" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "Stage" (
      "id" TEXT PRIMARY KEY,
      "orderId" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'pending',
      "dateText" TEXT NOT NULL DEFAULT '-',
      "comment" TEXT NOT NULL DEFAULT '',
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "RoutePoint" (
      "id" TEXT PRIMARY KEY,
      "orderId" TEXT NOT NULL,
      "lat" REAL NOT NULL,
      "lng" REAL NOT NULL,
      "label" TEXT NOT NULL,
      "type" TEXT NOT NULL DEFAULT 'checkpoint',
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "Message" (
      "id" TEXT PRIMARY KEY,
      "orderId" TEXT NOT NULL,
      "author" TEXT NOT NULL,
      "text" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "Attachment" (
      "id" TEXT PRIMARY KEY,
      "orderId" TEXT NOT NULL,
      "stageId" TEXT,
      "type" TEXT NOT NULL DEFAULT 'image',
      "filename" TEXT NOT NULL DEFAULT '',
      "originalName" TEXT NOT NULL DEFAULT '',
      "mime" TEXT NOT NULL DEFAULT '',
      "size" INTEGER NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "Lead" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "message" TEXT,
      "source" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'new',
      "adminNote" TEXT,
      "orderId" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE
    );

    CREATE INDEX IF NOT EXISTS "Stage_orderId_idx" ON "Stage"("orderId");
    CREATE INDEX IF NOT EXISTS "RoutePoint_orderId_idx" ON "RoutePoint"("orderId");
    CREATE INDEX IF NOT EXISTS "Message_orderId_idx" ON "Message"("orderId");
    CREATE INDEX IF NOT EXISTS "Attachment_orderId_idx" ON "Attachment"("orderId");
    CREATE INDEX IF NOT EXISTS "Lead_createdAt_idx" ON "Lead"("createdAt");
  `);

  const getColumns = (table: string) =>
    new Set(
      db
        .prepare(`PRAGMA table_info("${table}")`)
        .all()
        .map((row: { name: string }) => row.name)
    );

  const addColumnIfMissing = (
    table: string,
    column: string,
    definition: string
  ) => {
    const columns = getColumns(table);
    if (!columns.has(column)) {
      db.exec(`ALTER TABLE "${table}" ADD COLUMN "${column}" ${definition}`);
    }
  };

  addColumnIfMissing("Order", "accessCode", "TEXT");
  addColumnIfMissing("Order", "publicStatus", "TEXT");
  addColumnIfMissing("Order", "lastUpdateNote", "TEXT");
  addColumnIfMissing(
    "RoutePoint",
    "createdAt",
    "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP"
  );
  addColumnIfMissing("Attachment", "stageId", "TEXT");
  addColumnIfMissing("Attachment", "type", "TEXT NOT NULL DEFAULT 'image'");
  addColumnIfMissing("Attachment", "filename", "TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing("Attachment", "originalName", "TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing("Attachment", "mime", "TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing("Attachment", "size", "INTEGER NOT NULL DEFAULT 0");
  addColumnIfMissing(
    "Attachment",
    "createdAt",
    "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP"
  );
  addColumnIfMissing("Lead", "status", "TEXT NOT NULL DEFAULT 'new'");
  addColumnIfMissing("Lead", "adminNote", "TEXT");
  addColumnIfMissing("Lead", "orderId", "TEXT");
}
