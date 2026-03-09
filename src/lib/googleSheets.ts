import Papa from 'papaparse';
import { ScholarshipRecord } from '../types';

export const fetchScholarshipData = async (sheetInfo: { id: string, type: 'regular' | 'published' }): Promise<ScholarshipRecord[]> => {
  const csvUrl = sheetInfo.type === 'published'
    ? `https://docs.google.com/spreadsheets/d/e/${sheetInfo.id}/pub?output=csv`
    : `https://docs.google.com/spreadsheets/d/${sheetInfo.id}/export?format=csv`;
  
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const lines = results.data as string[][];
          const parsedRecords: ScholarshipRecord[] = [];
          
          let startIndex = 0;
          // Kiểm tra xem dòng đầu tiên có phải là tiêu đề không (chứa chữ TT hoặc Lớp)
          if (lines.length > 0 && (lines[0][0]?.toLowerCase().includes('tt') || lines[0][1]?.toLowerCase().includes('lớp'))) {
            startIndex = 1;
          }

          for (let i = startIndex; i < lines.length; i++) {
            const columns = lines[i];
            // Đảm bảo có đủ dữ liệu (ít nhất đến cột Năm học - index 12)
            if (columns.length >= 12) {
              parsedRecords.push({
                lop: columns[1]?.trim() || '',
                khoa: columns[2]?.trim() || '',
                mssv: columns[3]?.trim() || '',
                cccd: columns[4]?.trim() || '',
                hoLot: columns[5]?.trim() || '',
                ten: columns[6]?.trim() || '',
                ngaySinh: columns[7]?.trim() || '',
                tenHocBong: columns[8]?.trim() || '',
                donViTaiTro: columns[9]?.trim() || '',
                tienHocBong: columns[10]?.trim() || '',
                maHocKy: columns[11]?.trim() || '',
                namHoc: columns[12]?.trim() || '',
              });
            }
          }
          resolve(parsedRecords);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    throw error;
  }
};
