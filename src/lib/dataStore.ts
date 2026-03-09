import { ScholarshipRecord } from '../types';

const STORAGE_KEY = 'due_scholarship_data';
const SHEET_URL_KEY = 'due_scholarship_sheet_url';

export const saveScholarshipData = (data: ScholarshipRecord[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadScholarshipData = (): ScholarshipRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveSheetUrl = (url: string) => {
  localStorage.setItem(SHEET_URL_KEY, url);
};

export const loadSheetUrl = (): string => {
  return localStorage.getItem(SHEET_URL_KEY) || '';
};

export const extractSheetId = (url: string): { id: string, type: 'regular' | 'published' } | null => {
  if (!url) return null;
  
  // Check for published URL (starts with /d/e/)
  const pubMatch = url.match(/\/d\/e\/([a-zA-Z0-9-_]+)/);
  if (pubMatch) return { id: pubMatch[1], type: 'published' };
  
  // Check for regular URL
  const regMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (regMatch) return { id: regMatch[1], type: 'regular' };
  
  return null;
};

export const findScholarship = (mssv: string, cccd: string): ScholarshipRecord[] => {
  const data = loadScholarshipData();
  return data.filter(record => record.mssv === mssv && record.cccd === cccd);
};
