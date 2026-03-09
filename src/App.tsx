/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import StudentLookup from './pages/StudentLookup';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<StudentLookup />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Trường Đại học Kinh tế - Đại học Đà Nẵng.</p>
            <p className="mt-1">Hệ thống tra cứu kết quả xét cấp học bổng sinh viên.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
