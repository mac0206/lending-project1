import { useEffect, useState } from 'react';
import { reportingApi, DashboardStats } from '../services/api/reportingApi';

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await reportingApi.getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
      setStats({
        totalBooks: 0,
        totalMembers: 0,
        activeLoans: 0,
        overdueLoans: 0,
        availableBooks: 0,
        lastUpdated: new Date()
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error && stats) {
    return (
      <div>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-600 text-sm font-medium mb-2">Total Books</div>
              <div className="text-3xl font-bold text-blue-600">{stats.totalBooks}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-600 text-sm font-medium mb-2">Total Members</div>
              <div className="text-3xl font-bold text-green-600">{stats.totalMembers}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-600 text-sm font-medium mb-2">Active Loans</div>
              <div className="text-3xl font-bold text-purple-600">{stats.activeLoans}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-600 text-sm font-medium mb-2">Overdue Loans</div>
              <div className="text-3xl font-bold text-red-600">{stats.overdueLoans}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-gray-600 text-sm font-medium mb-2">Available Books</div>
              <div className="text-3xl font-bold text-indigo-600">{stats.availableBooks}</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Last Updated</h2>
                <p className="text-gray-600">
                  {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'N/A'}
                </p>
              </div>
              <button
                onClick={loadDashboard}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-gray-600 text-sm font-medium mb-2">Total Books</div>
          <div className="text-3xl font-bold text-blue-600">{stats?.totalBooks || 0}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-gray-600 text-sm font-medium mb-2">Total Members</div>
          <div className="text-3xl font-bold text-green-600">{stats?.totalMembers || 0}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-gray-600 text-sm font-medium mb-2">Active Loans</div>
          <div className="text-3xl font-bold text-purple-600">{stats?.activeLoans || 0}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-gray-600 text-sm font-medium mb-2">Overdue Loans</div>
          <div className="text-3xl font-bold text-red-600">{stats?.overdueLoans || 0}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-gray-600 text-sm font-medium mb-2">Available Books</div>
          <div className="text-3xl font-bold text-indigo-600">{stats?.availableBooks || 0}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Last Updated</h2>
            <p className="text-gray-600">
              {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'N/A'}
          </p>
          </div>
          <button
            onClick={loadDashboard}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

