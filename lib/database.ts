import mysql from "mysql2/promise";
import { parse } from "url";

interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
  ssl?: { ca?: string; rejectUnauthorized?: boolean };
}

interface PoolStats {
  _allConnections?: unknown[];
  _freeConnections?: unknown[];
  _acquiringConnections?: unknown[];
}

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: mysql.Pool;

  public escape(val: string | number): string {
    return this.pool.escape(val);
  }

  private constructor() {
    const { dbUrl, user, password, database, sslMode } =
      this.parseDatabaseUrl();

    const config: DatabaseConfig = {
      host: dbUrl.hostname || "",
      port: Number(dbUrl.port) || 3306,
      user: user || "",
      password: password || "",
      database,
    };

    if (sslMode) {
      const caCert = process.env.MYSQL_CA_CERT
        ? Buffer.from(process.env.MYSQL_CA_CERT, "base64").toString("utf8")
        : undefined;

      config.ssl = caCert
        ? { ca: caCert, rejectUnauthorized: true }
        : { rejectUnauthorized: false };
    }

    this.pool = mysql.createPool({
      ...config,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  private parseDatabaseUrl() {
    const { DATABASE_URL } = process.env;

    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    const dbUrl = parse(DATABASE_URL, true);
    const [user, password] = (dbUrl.auth || "").split(":");
    const database = (dbUrl.pathname || "").replace(/^\//, "");

    const sslMode =
      (dbUrl.query && "ssl-mode" in dbUrl.query) || !!process.env.MYSQL_CA_CERT;

    return { dbUrl, user, password, database, sslMode };
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      try {
        DatabaseConnection.instance = new DatabaseConnection();
      } catch (error) {
        throw error;
      }
    }
    return DatabaseConnection.instance;
  }

  public async query<T = unknown>(
    sql: string,
    params?: unknown[]
  ): Promise<T[]> {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows as T[];
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("ECONNREFUSED")) {
          throw new Error(
            "Database connection refused. Please check if MySQL is running."
          );
        } else if (error.message.includes("ER_ACCESS_DENIED_ERROR")) {
          throw new Error("Database access denied. Please check credentials.");
        } else if (error.message.includes("ER_BAD_DB_ERROR")) {
          throw new Error(
            "Database does not exist. Please create the database first."
          );
        } else if (error.message.includes("ETIMEDOUT")) {
          throw new Error(
            "Database connection timeout. Please try again later."
          );
        }
      }

      throw error;
    }
  }

  public async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      await this.pool.execute("SELECT 1");
      return {
        status: "healthy",
        message: "Database connection is working",
      };
    } catch (error) {
      return {
        status: "unhealthy",
        message:
          error instanceof Error ? error.message : "Unknown database error",
      };
    }
  }

  public getPoolStats(): {
    totalConnections: number;
    freeConnections: number;
    acquiringConnections: number;
    allConnections: number;
  } {
    const pool = this.pool as unknown as PoolStats;
    return {
      totalConnections: pool._allConnections?.length || 0,
      freeConnections: pool._freeConnections?.length || 0,
      acquiringConnections: pool._acquiringConnections?.length || 0,
      allConnections: pool._allConnections?.length || 0,
    };
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}

export default DatabaseConnection.getInstance();
