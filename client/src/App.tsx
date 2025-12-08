import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuctionDisplayPage from './pages/AuctionDisplayPage';
import AdminPanelPage from './pages/AdminPanelPage';
import SummaryPage from './pages/SummaryPage';
import AdminGate from './components/AdminGate';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AuctionDisplayPage />} />
       {/* Protected Admin Route */}
        <Route 
          path="/admin" 
          element={
            <AdminGate>
              <AdminPanelPage />
            </AdminGate>
          } 
        />
        <Route path="/summary" element={<SummaryPage />} />
      </Routes>
    </Layout>
  );
};

export default App;


