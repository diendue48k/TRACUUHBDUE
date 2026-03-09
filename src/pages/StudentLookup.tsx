import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, Award, Calendar, Building, CreditCard, User, BookOpen, Loader2 } from 'lucide-react';
import { loadSheetUrl, extractSheetId } from '../lib/dataStore';
import { fetchScholarshipData } from '../lib/googleSheets';
import { ScholarshipRecord } from '../types';

export default function StudentLookup() {
  const [mssv, setMssv] = useState('');
  const [cccd, setCccd] = useState('');
  const [results, setResults] = useState<ScholarshipRecord[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [records, setRecords] = useState<ScholarshipRecord[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const url = loadSheetUrl();
      const sheetInfo = extractSheetId(url);
      
      if (sheetInfo) {
        try {
          const data = await fetchScholarshipData(sheetInfo);
          setRecords(data);
        } catch (err: any) {
          console.error("Failed to fetch sheet data", err);
          setError(err.message || 'Không thể tải dữ liệu từ Google Sheet. Vui lòng liên hệ quản trị viên.');
        }
      } else {
        setError('Hệ thống chưa được cấu hình nguồn dữ liệu. Vui lòng liên hệ quản trị viên.');
      }
      setIsFetching(false);
    };
    
    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mssv.trim() || !cccd.trim() || records.length === 0) return;
    
    setIsLoading(true);
    
    // Simulate slight delay for UX
    setTimeout(() => {
      const found = records.filter(record => record.mssv === mssv.trim() && record.cccd === cccd.trim());
      setResults(found);
      setHasSearched(true);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#005A9C] mb-4 uppercase">
          Tra cứu kết quả xét cấp học bổng
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Sinh viên vui lòng nhập chính xác Mã sinh viên và số CCCD <br /> để tra cứu thông tin học bổng.
        </p>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="mt-0.5 shrink-0" size={20} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-12 relative">
        {isFetching && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#005A9C] mb-2" size={32} />
            <p className="text-[#005A9C] font-medium">Đang tải dữ liệu...</p>
          </div>
        )}
        <div className="bg-gradient-to-r from-[#005A9C] to-[#009A44] p-6 sm:p-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="mssv" className="block text-sm font-medium text-white mb-2">
                Mã sinh viên
              </label>
              <input
                type="text"
                id="mssv"
                value={mssv}
                onChange={(e) => setMssv(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-[#F26522] shadow-sm text-gray-900 bg-white"
                placeholder="Nhập mã sinh viên..."
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="cccd" className="block text-sm font-medium text-white mb-2">
                Số CCCD
              </label>
              <input
                type="text"
                id="cccd"
                value={cccd}
                onChange={(e) => setCccd(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-[#F26522] shadow-sm text-gray-900 bg-white"
                placeholder="Nhập số CCCD..."
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading || isFetching || records.length === 0}
                className="w-full sm:w-auto px-8 py-3 bg-[#F26522] hover:bg-[#d95a1e] disabled:bg-gray-400 text-white font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                <span>Tra cứu</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {hasSearched && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {results && results.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Award className="text-[#009A44]" />
                Kết quả tra cứu ({results.length} học bổng)
              </h2>
              
              {results.map((record, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <h3 className="text-lg font-bold text-[#005A9C]">{record.tenHocBong}</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#009A44]/10 text-[#009A44] whitespace-nowrap">
                      {record.namHoc} - {record.maHocKy}
                    </span>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <User className="text-gray-400 mt-1 shrink-0" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Họ và tên</p>
                          <p className="font-medium text-gray-900">{record.hoLot} {record.ten}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CreditCard className="text-gray-400 mt-1 shrink-0" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Mã SV / CCCD</p>
                          <p className="font-medium text-gray-900">{record.mssv} / {record.cccd}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="text-gray-400 mt-1 shrink-0" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Ngày sinh</p>
                          <p className="font-medium text-gray-900">{record.ngaySinh}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <BookOpen className="text-gray-400 mt-1 shrink-0" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Lớp / Khoa</p>
                          <p className="font-medium text-gray-900">{record.lop} / {record.khoa}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Building className="text-gray-400 mt-1 shrink-0" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Đơn vị tài trợ</p>
                          <p className="font-medium text-gray-900">{record.donViTaiTro}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Award className="text-[#F26522] mt-1 shrink-0" size={20} />
                        <div>
                          <p className="text-sm text-gray-500">Số tiền học bổng</p>
                          <p className="font-bold text-lg text-[#F26522]">{record.tienHocBong}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 rounded-2xl p-8 text-center border border-yellow-200">
              <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-medium text-yellow-800 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-yellow-700">
                Không tìm thấy thông tin học bổng nào khớp với Mã sinh viên và CCCD bạn vừa nhập. 
                Vui lòng kiểm tra lại thông tin hoặc liên hệ Phòng Công tác Sinh viên để được hỗ trợ.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
