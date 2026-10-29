import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { RiskBadge } from '../components/RiskBadge';
import { Modal, LoadingSkeleton } from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import {
  History as HistoryIcon,
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Trash2,
  Calendar,
  Sparkles,
  RefreshCw,
  X,
} from 'lucide-react';

export const HistoryPage = () => {
  const { showToast } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [riskLevel, setRiskLevel] = useState('All');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.getAnalyses({
        page,
        limit,
        search,
        riskLevel,
        category,
        sortBy,
        order,
      });

      setItems(res.data || []);
      setTotal(res.pagination?.total || 0);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      showToast('error', err.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, riskLevel, category, sortBy, order]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleClearSearch = () => {
    setSearch('');
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await api.deleteAnalysis(deleteTargetId);
      showToast('success', 'Analysis record removed.');
      setDeleteTargetId(null);
      fetchHistory();
    } catch (err) {
      showToast('error', err.message || 'Deletion failed');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-brand-cyan mb-1">
                <HistoryIcon className="w-3.5 h-3.5" />
                <span>AUDIT ARCHIVE & LOGS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Analysis Audit History
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Search, filter, and review persistent misinformation risk analyses stored in MongoDB.
              </p>
            </div>

            <Link
              to="/analyze"
              className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-navy-950 font-bold text-xs shadow-md shadow-brand-cyan/20 hover:brightness-110 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Analysis</span>
            </Link>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="saas-card p-4 mb-6 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by keywords, titles, claims, or category..."
                  className="w-full pl-9 pr-9 py-2 rounded-xl bg-navy-950/80 border border-navy-750 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-brand-cyan transition-colors"
                />
                {search && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* Submit search button */}
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-750 border border-navy-700 text-xs font-semibold text-white transition-colors"
              >
                Search
              </button>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-navy-800 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Filter className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Filters:</span>
              </div>

              {/* Risk Level Filter */}
              <select
                value={riskLevel}
                onChange={(e) => {
                  setRiskLevel(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-lg bg-navy-950 border border-navy-750 text-slate-200 text-xs focus:outline-none focus:border-brand-cyan"
              >
                <option value="All">All Risk Levels</option>
                <option value="High Risk">High Risk</option>
                <option value="Moderate Risk">Moderate Risk</option>
                <option value="Low Risk">Low Risk</option>
              </select>

              {/* Category Filter */}
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-lg bg-navy-950 border border-navy-750 text-slate-200 text-xs focus:outline-none focus:border-brand-cyan"
              >
                <option value="All">All Threat Categories</option>
                <option value="Sensationalism & Clickbait">Sensationalism & Clickbait</option>
                <option value="Health Misinformation Risk">Health Misinformation</option>
                <option value="Conspiracy Rhetoric">Conspiracy Rhetoric</option>
                <option value="Financial / Commercial Hype">Financial Hype</option>
                <option value="Credible Journalistic Reporting">Credible Reporting</option>
                <option value="Unverified General Claim">General Claim</option>
              </select>

              {/* Sorting Filter */}
              <div className="flex items-center gap-1.5 ml-auto">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={`${sortBy}-${order}`}
                  onChange={(e) => {
                    const [sb, ord] = e.target.value.split('-');
                    setSortBy(sb);
                    setOrder(ord);
                    setPage(1);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-navy-950 border border-navy-750 text-slate-200 text-xs focus:outline-none focus:border-brand-cyan"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="riskScore-desc">Highest Risk Score</option>
                  <option value="riskScore-asc">Lowest Risk Score</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Table / Content List */}
          <div className="saas-card overflow-hidden">
            {loading ? (
              <div className="p-6">
                <LoadingSkeleton type="table" count={5} />
              </div>
            ) : items.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-navy-800 border border-navy-750 flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">No analysis records found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {search || riskLevel !== 'All' || category !== 'All'
                    ? 'Try relaxing your search terms or filter criteria.'
                    : 'Submit your first claim in the Analysis Workspace to see audit history records here.'}
                </p>
                <Link
                  to="/analyze"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan font-semibold text-xs hover:bg-brand-cyan/20 transition-colors"
                >
                  Go to Workspace
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-navy-800 bg-navy-950/60 text-slate-400 font-medium">
                      <th className="py-3.5 px-4">Title / Excerpt</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Risk Level</th>
                      <th className="py-3.5 px-4">Risk Score</th>
                      <th className="py-3.5 px-4">Words</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-800/60">
                    {items.map((item) => (
                      <tr key={item._id} className="hover:bg-navy-850/40 transition-colors">
                        <td className="py-3.5 px-4 max-w-xs">
                          <Link
                            to={`/analysis/${item._id}`}
                            className="font-semibold text-white hover:text-brand-cyan transition-colors block truncate"
                          >
                            {item.title}
                          </Link>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            {item.content}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-navy-800 border border-navy-750 text-[11px] text-slate-300">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <RiskBadge level={item.riskLevel} size="small" />
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          {item.riskScore}/100
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-400">
                          {item.metrics?.wordCount || 0}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/analysis/${item._id}`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-cyan hover:bg-navy-800 transition-colors"
                              title="View Full Report"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => setDeleteTargetId(item._id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls Footer */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-navy-800 flex items-center justify-between text-xs text-slate-400">
                <div>
                  Showing Page <span className="font-semibold text-white">{page}</span> of{' '}
                  <span className="font-semibold text-white">{totalPages}</span> ({total} total records)
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-navy-750 bg-navy-850 hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-navy-750 bg-navy-850 hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={!!deleteTargetId}
            onClose={() => setDeleteTargetId(null)}
            title="Confirm Record Deletion"
          >
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Are you sure you want to permanently delete this analysis record from the MongoDB collection?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl border border-navy-750 bg-navy-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs font-semibold text-white shadow-md disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </Modal>
        </main>
      </div>

      <Footer />
    </div>
  );
};
export default HistoryPage;
