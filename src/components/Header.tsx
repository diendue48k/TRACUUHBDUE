import { Link, useLocation } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  
  return (
    <header className="bg-white shadow-sm border-b-4 border-[#005A9C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="https://levinhdien.id.vn/hocbongdue/wp-content/uploads/2026/02/logo-cong-thong-tin-@2x-2048x372.png" 
                alt="DUE Logo" 
                className="h-12 object-contain"
                referrerPolicy="no-referrer"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${location.pathname === '/' ? 'text-[#005A9C] border-b-2 border-[#005A9C] py-2' : 'text-gray-600 hover:text-[#005A9C]'}`}
            >
              Tra cứu
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
