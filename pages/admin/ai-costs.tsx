import { useState } from "react";
import Head from "next/head";
import Layout from "../../components/Layout";

interface CostEntry {
  id: number;
  timestamp: string;
  endpoint: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  input_cost_usd: number;
  output_cost_usd: number;
  total_cost_usd: number;
}

interface ApiResponse {
  entries: CostEntry[];
  totals: {
    calls: number;
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    input_cost_usd: number;
    output_cost_usd: number;
    total_cost_usd: number;
  };
  by_model: Record<
    string,
    {
      calls: number;
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
      input_cost_usd: number;
      output_cost_usd: number;
      total_cost_usd: number;
    }
  >;
}

export default function AICostsPage() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    if (!token.trim()) {
      setError("Admin token is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/ai-costs", {
        headers: {
          "X-Admin-Token": token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load cost report"
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(6)}`;
  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <Layout>
      <Head>
        <title>AI Costs Admin - Vim Quizzer</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">
                OpenAI Cost Report
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Monitor OpenAI API usage and costs for the Vim Quizzer
                application
              </p>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label
                  htmlFor="token"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Admin Token
                </label>
                <div className="flex gap-3">
                  <input
                    type="password"
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter admin token"
                  />
                  <button
                    onClick={loadReport}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Loading..." : "Load Report"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {data && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Overall Totals
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-900">
                          {formatNumber(data.totals.calls)}
                        </div>
                        <div className="text-sm text-blue-700">Total Calls</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-900">
                          {formatNumber(data.totals.total_tokens)}
                        </div>
                        <div className="text-sm text-green-700">
                          Total Tokens
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-900">
                          {formatCurrency(data.totals.total_cost_usd)}
                        </div>
                        <div className="text-sm text-purple-700">
                          Total Cost
                        </div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-900">
                          {data.totals.calls > 0
                            ? formatCurrency(
                                data.totals.total_cost_usd / data.totals.calls
                              )
                            : "$0.000000"}
                        </div>
                        <div className="text-sm text-orange-700">
                          Avg Cost/Call
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      By Model
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {Object.entries(data.by_model).map(([model, stats]) => (
                        <div
                          key={model}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <h3 className="font-medium text-gray-900 mb-3">
                            {model}
                          </h3>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600">Calls:</span>
                              <span className="ml-2 font-medium">
                                {formatNumber(stats.calls)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Tokens:</span>
                              <span className="ml-2 font-medium">
                                {formatNumber(stats.total_tokens)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Input Cost:</span>
                              <span className="ml-2 font-medium">
                                {formatCurrency(stats.input_cost_usd)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Output Cost:
                              </span>
                              <span className="ml-2 font-medium">
                                {formatCurrency(stats.output_cost_usd)}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-600">Total Cost:</span>
                              <span className="ml-2 font-semibold text-lg">
                                {formatCurrency(stats.total_cost_usd)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Entries
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Timestamp
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Model
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Endpoint
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tokens
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cost
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {data.entries.map((entry) => (
                            <tr key={entry.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(entry.timestamp).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {entry.model}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {entry.endpoint}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="text-xs text-gray-500">
                                  Input: {formatNumber(entry.prompt_tokens)} |
                                  Output:{" "}
                                  {formatNumber(entry.completion_tokens)} |
                                  Total: {formatNumber(entry.total_tokens)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="font-medium">
                                  {formatCurrency(entry.total_cost_usd)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  In: {formatCurrency(entry.input_cost_usd)} |
                                  Out: {formatCurrency(entry.output_cost_usd)}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
