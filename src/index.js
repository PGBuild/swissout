import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import OrgApp from './OrgApp';
import Analytics from './Analytics';
import Embed from './Embed';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/org" element={<OrgApp />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/embed" element={<Embed />} />
    </Routes>
  </BrowserRouter>
);
