import db from "@/lib/database";
import cache from "@/lib/cache";

export type CostEntry = {
  timestamp: string;
  endpoint: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  input_cost_usd: number;
  output_cost_usd: number;
  total_cost_usd: number;
};

async function ensureTable() {
  const sql = `CREATE TABLE IF NOT EXISTS ai_cost_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    endpoint VARCHAR(64) NOT NULL,
    model VARCHAR(64) NOT NULL,
    prompt_tokens INT NOT NULL,
    completion_tokens INT NOT NULL,
    total_tokens INT NOT NULL,
    input_cost_usd DECIMAL(10,6) NOT NULL,
    output_cost_usd DECIMAL(10,6) NOT NULL,
    total_cost_usd DECIMAL(10,6) NOT NULL
  )`;
  try {
    await db.query(sql);
  } catch {}
}

export async function appendCostEntry(entry: CostEntry): Promise<void> {
  await ensureTable();
  const insertSql = `INSERT INTO ai_cost_entries (
    timestamp, endpoint, model, prompt_tokens, completion_tokens, total_tokens,
    input_cost_usd, output_cost_usd, total_cost_usd
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    await db.query(insertSql, [
      new Date(entry.timestamp),
      entry.endpoint,
      entry.model,
      entry.prompt_tokens,
      entry.completion_tokens,
      entry.total_tokens,
      entry.input_cost_usd,
      entry.output_cost_usd,
      entry.total_cost_usd,
    ]);
  } catch {
    const existing = (await cache.get<CostEntry[]>("ai:costs")) || [];
    existing.push(entry);
    await cache.set("ai:costs", existing, 24 * 60 * 60 * 1000);
  }
}

export async function readCostEntries(limit = 500): Promise<CostEntry[]> {
  await ensureTable();
  try {
    const rows = await db.query<{
      timestamp: string;
      endpoint: string;
      model: string;
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
      input_cost_usd: number;
      output_cost_usd: number;
      total_cost_usd: number;
    }>(`SELECT timestamp, endpoint, model, prompt_tokens, completion_tokens, total_tokens,
          input_cost_usd, output_cost_usd, total_cost_usd
        FROM ai_cost_entries
        ORDER BY timestamp DESC
        LIMIT ${limit}`);

    return rows.map((r) => ({
      timestamp: new Date(r.timestamp).toISOString(),
      endpoint: r.endpoint,
      model: r.model,
      prompt_tokens: r.prompt_tokens,
      completion_tokens: r.completion_tokens,
      total_tokens: r.total_tokens,
      input_cost_usd: Number(r.input_cost_usd),
      output_cost_usd: Number(r.output_cost_usd),
      total_cost_usd: Number(r.total_cost_usd),
    }));
  } catch {
    return (await cache.get<CostEntry[]>("ai:costs")) || [];
  }
}
