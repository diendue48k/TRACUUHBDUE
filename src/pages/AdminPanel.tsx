import React, { useState, useEffect } from 'react';
import { Save, Trash2, FileSpreadsheet, CheckCircle2, AlertCircle, Lock, KeyRound, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { saveScholarshipData, loadScholarshipData, saveSheetUrl, loadSheetUrl, extractSheetId } from '../lib/dataStore';
import { fetchScholarshipData } from '../lib/googleSheets';
import { ScholarshipRecord } from '../types';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<ScholarshipRecord[]>([]);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'idle', message: string }>({ type: 'idle', message: '' });

  useEffect(() => {
    setRecords(loadScholarshipData());
    setSheetUrl(loadSheetUrl());
  }, []);

  const handleSyncData = async () => {
    if (!sheetUrl.trim()) {
      setStatus({ type: 'error', message: 'Vui lòng nhập đường dẫn Google Sheet.' });
      return;
    }

    const sheetId = extractSheetId(sheetUrl);
    if (!sheetId) {
      setStatus({ type: 'error', message: 'Đường dẫn không hợp lệ. Vui lòng kiểm tra lại.' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const parsedRecords = await fetchScholarshipData(sheetId);
      
      if (parsedRecords.length === 0) {
        setStatus({ type: 'error', message: 'Không tìm thấy dữ liệu hoặc định dạng không đúng.' });
        setIsLoading(false);
        return;
      }

      setRecords(parsedRecords);
      saveScholarshipData(parsedRecords);
      saveSheetUrl(sheetUrl);
      
      setStatus({ type: 'success', message: `Đã đồng bộ thành công ${parsedRecords.length} bản ghi.` });
      setTimeout(() => setStatus({ type: 'idle', message: '' }), 5000);
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Lỗi khi tải dữ liệu. Hãy chắc chắn bạn đã "Công bố lên web" (Publish to web) dưới dạng CSV.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu học bổng không? Hành động này không thể hoàn tác.')) {
      setRecords([]);
      saveScholarshipData([]);
      saveSheetUrl('');
      setSheetUrl('');
      setStatus({ type: 'success', message: 'Đã xóa toàn bộ dữ liệu.' });
      setTimeout(() => setStatus({ type: 'idle', message: '' }), 5000);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mật khẩu mặc định cho admin
    if (password === 'admin@due') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#005A9C]/10 text-[#005A9C] mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Đăng nhập Quản trị</h2>
          <p className="text-gray-500 mt-2">Vui lòng nhập mật khẩu để truy cập</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005A9C] focus:border-[#005A9C]"
                placeholder="Nhập mật khẩu..."
              />
            </div>
            {loginError && <p className="text-red-500 text-sm mt-2">Mật khẩu không chính xác!</p>}
          </div>
          <button type="submit" className="w-full py-3 px-4 bg-[#005A9C] hover:bg-[#004a80] text-white font-medium rounded-xl transition-colors cursor-pointer">
            Đăng nhập
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản trị dữ liệu học bổng</h1>
          <p className="text-gray-500 mt-1">Nhập dữ liệu từ Google Sheets để sinh viên có thể tra cứu.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#005A9C]/10 text-[#005A9C] px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <FileSpreadsheet size={18} />
            Tổng số: {records.length} bản ghi
          </div>
          {records.length > 0 && (
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Trash2 size={18} />
              Xóa tất cả
            </button>
          )}
        </div>
      </div>

      {status.type !== 'idle' && (
        <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
          status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="mt-0.5 shrink-0" size={20} /> : <AlertCircle className="mt-0.5 shrink-0" size={20} />}
          <p className="font-medium">{status.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <LinkIcon size={20} className="text-[#009A44]" />
              Kết nối Google Sheet
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Hệ thống sẽ tự động đồng bộ dữ liệu từ Google Sheet của bạn.
            </p>
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-700 mb-2">Hướng dẫn thiết lập:</p>
              <ol className="text-xs text-gray-600 list-decimal list-inside space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <li>Mở Google Sheet chứa dữ liệu. Dữ liệu cần có các cột theo thứ tự: <strong>TT, Lớp, KHOA, Mã sinh viên, CCCD, Họ lót, Tên, Ngày sinh, Tên học bổng, Đơn vị ban hành/tài trợ, Tiền học bổng, Mã học kỳ, Năm học</strong>.</li>
                <li>Chọn <strong>Tệp (File)</strong> &gt; <strong>Chia sẻ (Share)</strong> &gt; <strong>Công bố lên web (Publish to web)</strong>.</li>
                <li>Chọn <strong>Toàn bộ tài liệu</strong> và định dạng <strong>Dấu phẩy phân cách (CSV)</strong>.</li>
                <li>Nhấn <strong>Công bố (Publish)</strong>.</li>
                <li>Copy đường dẫn (URL) của Google Sheet trên thanh địa chỉ và dán vào ô bên dưới.</li>
              </ol>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Đường dẫn Google Sheet</label>
              <input
                type="text"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005A9C] focus:border-[#005A9C] text-sm bg-white"
                placeholder="https://docs.google.com/spreadsheets/d/..."
              />
            </div>
            <button
              onClick={handleSyncData}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#005A9C] hover:bg-[#004a80] disabled:bg-gray-400 text-white font-medium rounded-xl transition-colors cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isLoading ? 'Đang đồng bộ...' : 'Lưu & Đồng bộ dữ liệu'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Dữ liệu hiện tại</h2>
            </div>
            <div className="p-0 overflow-auto flex-1 max-h-[600px]">
              {records.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Mã SV</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Họ và tên</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Lớp</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Tên học bổng</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Số tiền</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {records.slice(0, 100).map((record, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.mssv}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.hoLot} {record.ten}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.lop}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={record.tenHocBong}>{record.tenHocBong}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#F26522]">{record.tienHocBong}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <FileSpreadsheet size={48} className="text-gray-300 mb-4" />
                  <p>Chưa có dữ liệu học bổng nào.</p>
                  <p className="text-sm mt-1">Hãy nhập dữ liệu từ Google Sheets ở cột bên trái.</p>
                </div>
              )}
            </div>
            {records.length > 100 && (
              <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-500 text-center">
                Đang hiển thị 100 bản ghi đầu tiên.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
