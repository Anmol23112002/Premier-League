import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuctionDisplayPage from './pages/AuctionDisplayPage';
import AdminPanelPage from './pages/AdminPanelPage';
import SummaryPage from './pages/SummaryPage';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AuctionDisplayPage />} />
        <Route path="/admin" element={<AdminPanelPage />} />
        <Route path="/summary" element={<SummaryPage />} />
      </Routes>
    </Layout>
  );
};

export default App;


