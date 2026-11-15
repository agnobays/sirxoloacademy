import mysql from "mysql2/promise";

const dbHost = process.env.DB_HOST || "localhost";
const dbUser = process.env.DB_USER || "sirxoloa_db";
const dbPassword = process.env.DB_PASSWORD || "";
const dbName = process.env.DB_NAME || "sirxoloa_db";
const dbPort = Number(process.env.DB_PORT) || 3306;

let pool: mysql.Pool | null = null;
let isInitialized = false;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      port: dbPort,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 8000,
    });
  }
  return pool;
}

export async function initDatabase() {
  if (isInitialized) return;

  const currentPool = getDbPool();

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS parent_registrations (
      id VARCHAR(64) PRIMARY KEY,
      parent_name VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      child_name VARCHAR(100) DEFAULT '',
      child_age VARCHAR(20) DEFAULT '',
      subjects JSON,
      workbook_interest BOOLEAN DEFAULT FALSE,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  await currentPool.execute(createTableQuery);
  isInitialized = true;
}
