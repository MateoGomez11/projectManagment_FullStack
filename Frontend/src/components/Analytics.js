import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMonthYearShort } from "../utils/dateUtils";

// Colores por estado (ajusta a tu paleta si quieres)
const STATUS_COLORS = {
  PENDING: "#f59e0b", // amber-500
  IN_PROGRESS: "#3b82f6", // blue-500
  COMPLETED: "#10b981", 
};

function useAnalytics() {
  const [statusData, setStatusData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    const ac = new AbortController();
    try {
      const [statusRes, monthsRes] = await Promise.all([
        fetch("http://localhost:5001/api/projects/analytics/status", { signal: ac.signal }),
        fetch("http://localhost:5001/api/projects/analytics/months", { signal: ac.signal }),
      ]);

      if (!statusRes.ok) throw new Error(`Status ${statusRes.status}`);
      if (!monthsRes.ok) throw new Error(`Months ${monthsRes.status}`);

      const statusJson = await statusRes.json();
      const monthsJson = await monthsRes.json();

      const status = (Array.isArray(statusJson) ? statusJson : []).map((d) => ({
        name: d.status?.replaceAll("_", " ") ?? "UNKNOWN",
        status: d.status ?? "UNKNOWN",
        count: Number(d.count) || 0,
        fill: STATUS_COLORS[d.status] ?? "#64748b", 
      }));

      const months = (Array.isArray(monthsJson) ? monthsJson : [])
        .map((d) => ({
          monthRaw: d.month, // "YYYY-MM"
          month: formatMonthYearShort(d.month), 
          count: Number(d.count) || 0,
          sortKey: d.month,
        }))
        .sort((a, b) => (a.sortKey > b.sortKey ? 1 : -1));

      setStatusData(status);
      setMonthlyData(months);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al cargar analíticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { statusData, monthlyData, loading, error, refetch: fetchAll };
}

function EmptyState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-slate-500">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.75 6a.75.75 0 0 0-1.5 0v5.25a.75.75 0 0 0 1.5 0V8.25ZM12 16.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" clipRule="evenodd" />
      </svg>
      <p className="text-slate-600">No hay datos para mostrar.</p>
      {onRetry && (
        <button onClick={onRetry} className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M12 6v3l4-4-4-4v3C6.477 4 2 8.477 2 14a8 8 0 0 0 14.32 4.906l-1.232-1.6A6.5 6.5 0 1 1 12 6Z" />
          </svg>
          Reintentar
        </button>
      )}
    </div>
  );
}

export default function Analytics() {
  const { statusData, monthlyData, loading, error, refetch } = useAnalytics();
  const totalProjects = useMemo(() => statusData.reduce((acc, d) => acc + d.count, 0), [statusData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Porject analytics</h1>
          <p className="text-slate-600">Quick overview of statuses and monthly creation.</p>
        </div>
        <button onClick={refetch} className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M12 6v3l4-4-4-4v3C6.477 4 2 8.477 2 14a8 8 0 0 0 14.32 4.906l-1.232-1.6A6.5 6.5 0 1 1 12 6Z" />
          </svg>
          Update
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Status Distribution */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="pb-2">
            <h2 className="text-base font-medium">Distribution by State</h2>
            <p className="text-sm text-slate-500">Total projects: {totalProjects}</p>
          </div>
          <div className="h-72">
            {loading ? (
              <div className="h-full animate-pulse rounded-xl bg-slate-100" />
            ) : error ? (
              <EmptyState onRetry={refetch} />
            ) : statusData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => [v, "Projects"]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="count" name="Projects">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Monthly Starts */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="pb-2">
            <h2 className="text-base font-medium">New projects by month</h2>
            <p className="text-sm text-slate-500">Start date count monthly</p>
          </div>
          <div className="h-72">
            {loading ? (
              <div className="h-full animate-pulse rounded-xl bg-slate-100" />
            ) : error ? (
              <EmptyState onRetry={refetch} />
            ) : monthlyData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => [v, "Projects"]} labelFormatter={(l) => `Month: ${l}`} />
                  <Area type="monotone" dataKey="count" name="Projects" stroke="#3b82f6" fillOpacity={1} fill="url(#fillCount)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
