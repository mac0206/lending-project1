import { useEffect, useState } from 'react';
import { circulationApi } from '../services/api/circulationApi';
import { catalogApi } from '../services/api/catalogApi';
import { Loan } from '@library-system/shared';
import { Item } from '@library-system/shared';
import { Member } from '@library-system/shared';

function Loans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [returningId, setReturningId] = useState<string | null>(null);
  const [returningLoadingId, setReturningLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [borrowFormData, setBorrowFormData] = useState({
    itemId: '',
    borrowerMemberId: '',
    days: '14'
  });
  // Inline borrow state for quick borrow from available items list
  const [inlineBorrowingId, setInlineBorrowingId] = useState<string | null>(null);
  const [inlineBorrowMemberId, setInlineBorrowMemberId] = useState<string | null>(null);
  const [inlineBorrowDays, setInlineBorrowDays] = useState<string>('14');
  const [borrowingLoadingId, setBorrowingLoadingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [loansData, itemsData, membersData] = await Promise.all([
        circulationApi.getLoans(),
        catalogApi.getItems(),
        catalogApi.getMembers()
      ]);
      setLoans(loansData);
      setItems(itemsData);
      setMembers(membersData);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const item = items.find(i => i._id === borrowFormData.itemId);
      const itemTitle = item?.title || 'item';
      
      // Librarian records the loan in the system
      await circulationApi.borrowItem(
        borrowFormData.itemId, 
        borrowFormData.borrowerMemberId, 
        parseInt(borrowFormData.days)
      );
      
      setBorrowFormData({ itemId: '', borrowerMemberId: '', days: '14' });
      setShowBorrowForm(false);
      setError(null);
      
      // Show success message
      alert(`✅ Librarian has recorded the loan.\n\n"${itemTitle}" is now UNAVAILABLE (on loan).\n\nThe item will become AVAILABLE again when returned.`);
      
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to borrow item');
    }
  };

  // Start return flow: show inline confirm buttons for the item
  const initiateReturn = (itemId: string) => {
    setReturningId(itemId);
    setError(null);
  };

  // Cancel the inline confirm
  const cancelReturn = () => {
    setReturningId(null);
  };

  // Confirm and perform the return via API
  const confirmReturn = async (itemId: string) => {
    const item = items.find(i => i._id === itemId);
    const itemTitle = item?.title || 'this item';
    try {
      setReturningLoadingId(itemId);
      // Librarian processes the return in the system
      await circulationApi.returnItem(itemId);
      setError(null);
      setToast({ message: `✅ "${itemTitle}" marked AVAILABLE.`, type: 'success' });
      setReturningId(null);
      setReturningLoadingId(null);
      // reload data to reflect availability and loan status
      loadData();
      // clear toast after 3s
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      setReturningLoadingId(null);
      setToast({ message: err.response?.data?.error || err.message || 'Failed to return item', type: 'error' });
      setTimeout(() => setToast(null), 4000);
    }
  };

  const getItemTitle = (itemId: string) => {
    const item = items.find(i => i._id === itemId || i._id === (itemId as any));
    return item?.title || 'Unknown';
  };

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m._id === memberId);
    return member?.name || 'Unknown';
  };

  // (removed modal pre-fill helper) quick inline borrow is used instead

  // Inline borrow handlers
  const startInlineBorrow = (itemId: string) => {
    setInlineBorrowingId(itemId);
    setInlineBorrowMemberId(null);
    setInlineBorrowDays('14');
    setError(null);
  };

  const cancelInlineBorrow = () => {
    setInlineBorrowingId(null);
    setInlineBorrowMemberId(null);
    setInlineBorrowDays('14');
  };

  const confirmInlineBorrow = async (itemId: string) => {
    if (!inlineBorrowMemberId) {
      setError('Please select a member to borrow the item.');
      return;
    }
    try {
      setBorrowingLoadingId(itemId);
      await circulationApi.borrowItem(itemId, inlineBorrowMemberId, parseInt(inlineBorrowDays || '14'));
      setToast({ message: '✅ Loan recorded. Item marked UNAVAILABLE.', type: 'success' });
      setInlineBorrowingId(null);
      setInlineBorrowMemberId(null);
      setInlineBorrowDays('14');
      setBorrowingLoadingId(null);
      setError(null);
      loadData();
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      setBorrowingLoadingId(null);
      setError(err.response?.data?.error || err.message || 'Failed to borrow item');
      setToast({ message: err.response?.data?.error || err.message || 'Failed to borrow item', type: 'error' });
      setTimeout(() => setToast(null), 4000);
    }
  };

  const availableItems = items.filter(i => i.availability);
  const activeLoans = loans.filter(loan => loan.status === 'active' || !loan.returnDate);
  const borrowedItems = activeLoans.map(loan => ({
    loan,
    itemId: (loan as any).itemId || loan.bookId,
    item: items.find(i => i._id === ((loan as any).itemId || loan.bookId))
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* transient toast (success / error) shown top-right */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Lending & Returns</h1>
        <button
          onClick={() => setShowBorrowForm(!showBorrowForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition shadow-md hover:shadow-lg"
        >
          {showBorrowForm ? 'Cancel' : '+ Borrow Item'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {showBorrowForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Librarian: Record New Loan</h2>
            <p className="text-sm text-gray-600 mt-1">When a member borrows an item, record it here. The item will be marked as <span className="font-semibold text-red-600">UNAVAILABLE</span>.</p>
          </div>
          <form onSubmit={handleBorrow} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Item</label>
              <select
                required
                value={borrowFormData.itemId}
                onChange={(e) => setBorrowFormData({ ...borrowFormData, itemId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select an available item</option>
                {availableItems.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.title} ({item.type}) - Owner: {item.owner}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member</label>
              <select
                required
                value={borrowFormData.borrowerMemberId}
                onChange={(e) => setBorrowFormData({ ...borrowFormData, borrowerMemberId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a member</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.studentId})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Period (days)</label>
              <input
                type="number"
                min="1"
                value={borrowFormData.days}
                onChange={(e) => setBorrowFormData({ ...borrowFormData, days: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition shadow-md hover:shadow-lg"
              >
                📝 Record Loan (Item → UNAVAILABLE)
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBorrowForm(false);
                  setError(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Items to Borrow */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-green-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">✅ Available Items - Ready to Borrow ({availableItems.length})</h2>
            {/* Instruction removed; click Borrow on an item to open the form with it pre-selected. */}
          </div>
          <div className="p-6">
            {availableItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No available items</p>
            ) : (
              <div className="space-y-2">
                {availableItems.slice(0, 5).map((item) => (
                  <div key={item._id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">Type: {item.type} | Owner: {item.owner}</p>
                    </div>
                    <div className="ml-4">
                      {inlineBorrowingId === item._id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={inlineBorrowMemberId || ''}
                            onChange={(e) => setInlineBorrowMemberId(e.target.value || null)}
                            className="text-sm px-2 py-1 border rounded"
                          >
                            <option value="">Select member</option>
                            {members.map((m) => (
                              <option key={m._id} value={m._id}>{m.name}</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min={1}
                            value={inlineBorrowDays}
                            onChange={(e) => setInlineBorrowDays(e.target.value)}
                            className="w-16 text-sm px-2 py-1 border rounded"
                            title="Loan days"
                          />
                          <button
                            onClick={() => confirmInlineBorrow(item._id!)}
                            disabled={!!borrowingLoadingId}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-1 px-3 rounded transition"
                          >
                            {borrowingLoadingId === item._id ? 'Saving...' : 'Confirm'}
                          </button>
                          <button
                            onClick={cancelInlineBorrow}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-medium py-1 px-3 rounded transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => item._id && startInlineBorrow(item._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1 px-3 rounded transition"
                          title="Quick borrow"
                        >
                          ➕ Borrow
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {availableItems.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">+ {availableItems.length - 5} more items</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Currently Borrowed Items */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-red-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">❌ Items Currently on Loan - UNAVAILABLE ({borrowedItems.length})</h2>
            {/* Instruction removed; inline return confirmation and toast will guide the librarian */}
          </div>
          <div className="p-6">
            {borrowedItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No items currently borrowed</p>
            ) : (
              <div className="space-y-2">
                {borrowedItems.map(({ loan, itemId, item }) => (
                  <div key={loan._id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{item?.title || getItemTitle(itemId)}</p>
                        <p className="text-sm text-gray-600">Borrower: {getMemberName(loan.memberId || (loan as any).borrowerMemberId)}</p>
                        <p className="text-xs text-gray-500">Due: {new Date(loan.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {returningId === itemId ? (
                          <>
                            <button
                              onClick={() => confirmReturn(itemId)}
                              disabled={!!returningLoadingId}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-1 px-3 rounded transition flex items-center gap-2"
                              title="Confirm return - Item will become AVAILABLE"
                            >
                              {returningLoadingId === itemId ? (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"/></svg>
                              ) : 'Confirm'}
                              <span className="text-xs">Return</span>
                            </button>
                            <button
                              onClick={cancelReturn}
                              className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-medium py-1 px-3 rounded transition"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => initiateReturn(itemId)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-1 px-3 rounded transition"
                            title="Librarian: Prepare to process return - click to confirm"
                            disabled={!!returningLoadingId}
                          >
                            📚 Return (→ AVAILABLE)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Loans History */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">All Loans History ({loans.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrow Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans.map((loan) => {
                const itemId = (loan as any).itemId || loan.bookId;
                return (
                  <tr key={loan._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getItemTitle(itemId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getMemberName(loan.memberId || (loan as any).borrowerMemberId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(loan.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(loan.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        loan.status === 'returned' 
                          ? 'bg-gray-100 text-gray-800'
                          : loan.status === 'overdue'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {loan.status !== 'returned' && (
                        returningId === itemId ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => confirmReturn(itemId)}
                              disabled={!!returningLoadingId}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-1 px-3 rounded transition flex items-center gap-2"
                              title="Confirm return - Item will become AVAILABLE"
                            >
                              {returningLoadingId === itemId ? (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"/></svg>
                              ) : 'Confirm'}
                              <span className="text-xs">Return</span>
                            </button>
                            <button
                              onClick={cancelReturn}
                              className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-medium py-1 px-3 rounded transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => initiateReturn(itemId)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-1 px-3 rounded transition"
                            title="Librarian: Prepare to process return - click to confirm"
                            disabled={!!returningLoadingId}
                          >
                            📚 Return (→ AVAILABLE)
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {loans.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No loans found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Loans;
