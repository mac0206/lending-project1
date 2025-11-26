import { useEffect, useState } from 'react';
import { reportingApi, BookBorrowingStats, BorrowingHistory, MemberBorrowingStats } from '../services/api/reportingApi';

function Reports() {
  const [mostBorrowed, setMostBorrowed] = useState<BookBorrowingStats[]>([]);
  const [overdueBooks, setOverdueBooks] = useState<BorrowingHistory[]>([]);
  const [memberStats, setMemberStats] = useState<MemberBorrowingStats[]>([]);
  const [borrowingHistory, setBorrowingHistory] = useState<BorrowingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'books' | 'overdue' | 'members' | 'history'>('books');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const [books, overdue, members, history] = await Promise.all([
        reportingApi.getMostBorrowedBooks(10),
        reportingApi.getOverdueBooks(),
        reportingApi.getMemberBorrowingStats(10),
        reportingApi.getBorrowingHistory()
      ]);
      setMostBorrowed(books);
      setOverdueBooks(overdue);
      setMemberStats(members);
      setBorrowingHistory(history);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading reports...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports & Statistics</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('books')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'books'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Most Borrowed Books
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'overdue'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overdue Books
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'members'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Member Statistics
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'history'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Borrowing History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'books' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Most Borrowed Books</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrow Count</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mostBorrowed.map((book, index) => (
                      <tr key={book.bookId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}. {book.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.borrowCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {mostBorrowed.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No data available</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'overdue' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Overdue Books</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Overdue</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {overdueBooks.map((item) => {
                      const dueDate = new Date(item.loan.dueDate);
                      const now = new Date();
                      const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <tr key={item.loan._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.bookTitle}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.memberName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {dueDate.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                            {daysOverdue} days
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {overdueBooks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No overdue books</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Top Borrowers</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrow Count</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {memberStats.map((member, index) => (
                      <tr key={member.memberId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.studentId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.borrowCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {memberStats.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No data available</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Borrowing History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrow Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {borrowingHistory.slice(0, 50).map((item) => (
                      <tr key={item.loan._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.bookTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.memberName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.loan.borrowDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.loan.returnDate ? new Date(item.loan.returnDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.loan.status === 'returned'
                              ? 'bg-gray-100 text-gray-800'
                              : item.loan.status === 'overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {item.loan.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {borrowingHistory.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No borrowing history</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;

