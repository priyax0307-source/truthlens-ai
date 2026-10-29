import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { StatCard } from '../components/StatCard';
import { RiskBadge } from '../components/RiskBadge';
import { LoadingSkeleton } from '../components/Modal';
import { api } from '../services/api';
import {
  BarChart3,
  TrendingUp,
  AlertOctagon,
  ShieldCheck,
  Activity,
  PlusCircle,
  ExternalLink,
  Calendar,
  Layers,
  Search,
  Database,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const DashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const COLORS = ['#06B6D4', '#3B82F6', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6'];

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-brand-cyan mb-1">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>PLATFORM METRICS & INTELLIGENCE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Misinformation Risk Analytics
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Aggregated linguistic intelligence and risk distributions from persistent MongoDB records.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchMetrics}
                className="p-2.5 rounded-xl border border-navy-700 bg-navy-900 text-slate-300 hover:text-white hover:bg-navy-800 transition-colors"
                title="Refresh Metrics"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-cyan' : ''}`} />
              </button>
              <Link
                to="/analyze"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-navy-950 font-bold text-xs shadow-md shadow-brand-cyan/20 hover:brightness-110 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Audit New Content</span>
              </Link>
            </div>
          </div>

          {/* System Health Status Bar */}
          {metrics?.systemHealth && (
            <div className="mb-6 p-3.5 rounded-xl bg-navy-900/60 border border-navy-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>MongoDB: </span>
                  <span className="font-semibold text-emerald-400">Connected</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>AI NLP Engine: </span>
                  <span className="font-semibold text-cyan-300">
                    {metrics.systemHealth.aiService?.service || 'Modular Heuristic Provider'}
                  </span>
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                Data Mode: Real Backend Aggregations
              </span>
            </div>
          )}

          {loading ? (
            <div className="space-y-6">
              <LoadingSkeleton type="card" count={4} />
              <div className="h-64 bg-navy-850 rounded-xl animate-pulse"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
              <p className="text-sm font-semibold">{error}</p>
              <button
                onClick={fetchMetrics}
                className="mt-4 px-4 py-2 rounded-lg bg-navy-800 border border-navy-700 text-xs font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Analyses"
                  value={metrics.kpis.totalAnalyses}
                  icon={Activity}
                  badgeText="MongoDB Persisted"
                  badgeColor="cyan"
                  description="Lifetime audited texts stored in database."
                />
                <StatCard
                  title="High-Risk Flagged"
                  value={metrics.kpis.highRiskCount}
                  icon={AlertOctagon}
                  badgeText={`${metrics.kpis.highRiskRatio}% of total`}
                  badgeColor="rose"
                  description="Exhibiting severe sensationalist or panic cues."
                />
                <StatCard
                  title="Average Risk Score"
                  value={`${metrics.kpis.avgRiskScore}/100`}
                  icon={TrendingUp}
                  badgeText="Aggregate Index"
                  badgeColor={metrics.kpis.avgRiskScore >= 70 ? 'rose' : metrics.kpis.avgRiskScore >= 35 ? 'amber' : 'emerald'}
                  description="Mean calibrated linguistic threat index."
                />
                <StatCard
                  title="Credible Assessments"
                  value={metrics.kpis.lowRiskCount}
                  icon={ShieldCheck}
                  badgeText="Low Risk"
                  badgeColor="emerald"
                  description="Verified journalistic style & balanced sourcing."
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 7-Day Trend Chart */}
                <div className="lg:col-span-2 saas-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        Analysis Volume & Risk Score Trend
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Daily audited volumes and mean risk score variations.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-brand-cyan">7-Day History</span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={metrics.dailyTrend}>
                        <defs>
                          <linearGradient id="colorAnalyses" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="date"
                          stroke="#475569"
                          fontSize={11}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#475569"
                          fontSize={11}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0F172A',
                            borderColor: '#1E293B',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: '#F8FAFC',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="analyses"
                          name="Audits Completed"
                          stroke="#06B6D4"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorAnalyses)"
                        />
                        <Area
                          type="monotone"
                          dataKey="avgRisk"
                          name="Average Risk"
                          stroke="#EF4444"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorRisk)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category Distribution Donut Chart */}
                <div className="saas-card p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight mb-1">
                      Threat Category Breakdown
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Distribution by detected narrative classification.
                    </p>
                  </div>

                  <div className="h-56 w-full flex items-center justify-center">
                    {metrics.categoryDistribution?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={metrics.categoryDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {metrics.categoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0F172A',
                              borderColor: '#1E293B',
                              borderRadius: '8px',
                              fontSize: '12px',
                              color: '#F8FAFC',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-xs text-slate-400 text-center">
                        No category records recorded yet.
                      </div>
                    )}
                  </div>

                  {/* Category Legend list */}
                  <div className="space-y-1.5 mt-2 max-h-28 overflow-y-auto pr-1">
                    {metrics.categoryDistribution?.map((cat, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                          ></span>
                          <span className="text-slate-300 truncate">{cat.name}</span>
                        </div>
                        <span className="font-mono text-slate-400 shrink-0 font-medium">{cat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Analyses Table */}
              <div className="saas-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Recent Intelligence Records
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Live records fetched from the database collection.
                    </p>
                  </div>
                  <Link
                    to="/history"
                    className="text-xs font-semibold text-brand-cyan hover:underline flex items-center gap-1"
                  >
                    <span>View All History</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {metrics.recentAnalyses?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-navy-800 text-slate-400 font-medium">
                          <th className="pb-3 pr-4">Title / Excerpt</th>
                          <th className="pb-3 px-4">Category</th>
                          <th className="pb-3 px-4">Risk Level</th>
                          <th className="pb-3 px-4">Score</th>
                          <th className="pb-3 px-4">Date</th>
                          <th className="pb-3 pl-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-navy-800/60">
                        {metrics.recentAnalyses.map((item) => (
                          <tr key={item._id} className="hover:bg-navy-850/40 transition-colors">
                            <td className="py-3 pr-4 font-semibold text-white max-w-xs truncate">
                              {item.title}
                            </td>
                            <td className="py-3 px-4 text-slate-300">
                              <span className="px-2 py-0.5 rounded bg-navy-800 border border-navy-750 text-[11px]">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <RiskBadge level={item.riskLevel} size="small" />
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-white">
                              {item.riskScore}/100
                            </td>
                            <td className="py-3 px-4 text-slate-400">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 pl-4 text-right">
                              <Link
                                to={`/analysis/${item._id}`}
                                className="inline-flex items-center gap-1 text-brand-cyan hover:underline font-semibold"
                              >
                                View Report
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No audits found in database. Start an analysis to populate metrics!
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
export default DashboardPage;
