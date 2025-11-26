import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Items from './pages/Items';
import Members from './pages/Members';
import Loans from './pages/Loans';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold">Library Management System</h1>
              <div className="flex space-x-4">
                <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition">
                  Dashboard
                </Link>
                <Link to="/items" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition">
                  Items
                </Link>
                <Link to="/members" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition">
                  Members
                </Link>
                <Link to="/loans" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition">
                  Loans
                </Link>
                <Link to="/reports" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition">
                  Reports
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/items" element={<Items />} />
            <Route path="/books" element={<Books />} />
            <Route path="/members" element={<Members />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
