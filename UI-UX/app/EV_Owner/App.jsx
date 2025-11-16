import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './pages/Overview';
import UploadData from './pages/UploadData';
import CarbonWallet from './pages/CarbonWallet';
import ListCredits from './pages/ListCredits';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import LoadingIndicator from './components/LoadingIndicator';
import Notification from './components/Notification';
import './App.css';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  useEffect(() => {
    // Show welcome notification
    setTimeout(() => {
      showNotification('🎉 Chào mừng bạn đến với EV Owner Dashboard!', 'success');
    }, 1000);
  }, []);

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-green-600 text-white p-3 rounded-xl shadow-lg hover:bg-green-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPath={location.pathname}
          onNavigate={navigate}
        />

        {/* Main Content Area */}
        <div className="md:ml-72 min-h-full flex-1">
          <Header currentPath={location.pathname} />
          
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Overview onNavigate={navigate} />} />
              <Route
                path="/upload-data"
                element={
                  <UploadData
                    showNotification={showNotification}
                    showLoading={showLoading}
                    hideLoading={hideLoading}
                  />
                }
              />
              <Route
                path="/carbon-wallet"
                element={
                  <CarbonWallet
                    onNavigate={navigate}
                    showNotification={showNotification}
                    showLoading={showLoading}
                    hideLoading={hideLoading}
                  />
                }
              />
              <Route
                path="/list-credits"
                element={
                  <ListCredits
                    showNotification={showNotification}
                    showLoading={showLoading}
                    hideLoading={hideLoading}
                  />
                }
              />
              <Route
                path="/transactions"
                element={
                  <Transactions
                    showNotification={showNotification}
                    showLoading={showLoading}
                    hideLoading={hideLoading}
                  />
                }
              />
              <Route
                path="/reports"
                element={
                  <Reports
                    showNotification={showNotification}
                    showLoading={showLoading}
                    hideLoading={hideLoading}
                  />
                }
              />
              <Route
                path="/settings"
                element={
                  <Settings
                    showNotification={showNotification}
                    showLoading={showLoading}
                    hideLoading={hideLoading}
                  />
                }
              />
            </Routes>
          </main>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && <LoadingIndicator />}

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

