import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalytics } from "@/store/admin/analytics-slice";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ── Palette ──────────────────────────────────────────────────────────────────
const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899"];

const STATUS_COLORS = {
  pending: "#94a3b8",
  confirmed: "#22c55e",
  inProcess: "#f59e0b",
  inShipping: "#3b82f6",
  delivered: "#10b981",
  rejected: "#ef4444",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatCurrency(value) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

function StatCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </CardContent>
    </Card>
  );
}

// Custom tooltip that matches the site's shadcn card style
function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-sm text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}:{" "}
          <span className="font-medium">
            {formatter ? formatter(entry.value, entry.name) : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { isLoading, timeline, topProducts, ordersByStatus, summary, error } =
    useSelector((state) => state.adminAnalytics);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading analytics…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive">
        <p>Failed to load analytics: {error}</p>
      </div>
    );
  }

  // Normalise status data for the pie chart
  const statusData = ordersByStatus.map((s) => ({
    name: s._id || "unknown",
    value: s.count,
    color: STATUS_COLORS[s._id] || "#6366f1",
  }));

  // Short month labels (e.g. "Jan 2025" → "Jan")
  const timelineShort = timeline.map((t) => ({
    ...t,
    shortMonth: t.month.split(" ")[0],
  }));

  return (
    <div className="space-y-6">
      {/* ── Page title ── */}
      <div className="flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      </div>

      {/* ── Summary stat cards ── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(summary.totalRevenue)}
          icon={DollarSign}
          color="bg-indigo-500"
          subtitle="All-time paid orders"
        />
        <StatCard
          title="Total Orders"
          value={summary.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          color="bg-emerald-500"
          subtitle="All order statuses"
        />
        <StatCard
          title="Total Users"
          value={summary.totalUsers.toLocaleString()}
          icon={Users}
          color="bg-amber-500"
          subtitle="Registered accounts"
        />
        <StatCard
          title="Total Products"
          value={summary.totalProducts.toLocaleString()}
          icon={Package}
          color="bg-blue-500"
          subtitle="Active listings"
        />
      </div>

      {/* ── Row 1: Revenue chart + Orders chart ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue over time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Over Time</CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly revenue (paid orders) – last 12 months
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={timelineShort}
                margin={{ top: 4, right: 12, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="shortMonth"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatCurrency(v)}
                />
                <Tooltip
                  content={
                    <ChartTooltip
                      formatter={(v) => formatCurrency(v)}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#revGrad)"
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders over time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders Over Time</CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly paid order count – last 12 months
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={timelineShort}
                margin={{ top: 4, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="shortMonth"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="orders"
                  name="Orders"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: User signups + Order status breakdown ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* User signups over time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Signups</CardTitle>
            <p className="text-sm text-muted-foreground">
              New registrations per month – last 12 months
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart
                data={timelineShort}
                margin={{ top: 4, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="shortMonth"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="signups"
                  name="Signups"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order status breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders by Status</CardTitle>
            <p className="text-sm text-muted-foreground">
              Distribution across all order statuses
            </p>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                No order data yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                  />
                  <Legend
                    formatter={(value) =>
                      value.charAt(0).toUpperCase() + value.slice(1)
                    }
                    iconType="circle"
                    iconSize={10}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Top selling products ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Selling Products</CardTitle>
          <p className="text-sm text-muted-foreground">
            Top 5 products by units sold (all time)
          </p>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              No sales data yet.
            </p>
          ) : (
            <div className="space-y-4">
              {/* Bar chart */}
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={topProducts}
                  layout="vertical"
                  margin={{ top: 4, right: 40, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="title"
                    width={120}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) =>
                      v.length > 16 ? `${v.slice(0, 16)}…` : v
                    }
                  />
                  <Tooltip
                    content={
                      <ChartTooltip
                        formatter={(v, name) =>
                          name === "Revenue" ? formatCurrency(v) : v
                        }
                      />
                    }
                  />
                  <Bar
                    dataKey="totalSold"
                    name="Units Sold"
                    radius={[0, 4, 4, 0]}
                  >
                    {topProducts.map((_, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Table summary */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground text-left">
                      <th className="pb-2 font-medium w-8">#</th>
                      <th className="pb-2 font-medium">Product</th>
                      <th className="pb-2 font-medium text-right">Units Sold</th>
                      <th className="pb-2 font-medium text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr key={product._id} className="border-b last:border-0">
                        <td className="py-2 text-muted-foreground">
                          {index + 1}
                        </td>
                        <td className="py-2 flex items-center gap-2">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-8 h-8 rounded object-cover flex-shrink-0"
                            />
                          )}
                          <span className="font-medium">{product.title}</span>
                        </td>
                        <td className="py-2 text-right font-semibold">
                          {product.totalSold}
                        </td>
                        <td className="py-2 text-right font-semibold text-emerald-600">
                          {formatCurrency(product.totalRevenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
