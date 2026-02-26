import { Shield, Mail, Phone, Facebook, MessageCircle } from 'lucide-react';
import logoImage from 'figma:asset/2e2b9f150b66714e8750e5a4fcd8bac815716ee5.png';

interface FooterProps {
  onNavigate: (page: string, shopId?: number) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#F4F6F8] border-t mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden">
                <img src={logoImage} alt="ChongLuaDaoJP Logo" className="h-full w-full object-cover" />
              </div>
              <span className="text-base font-medium text-[#086644]">ChongLuaDaoJP</span>
            </div>
            <p className="text-base font-medium text-[#6b7280]">
              Bảo vệ cộng đồng khỏi lừa đảo, xây dựng niềm tin trong kinh doanh.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-white hover:bg-[#A8E6CF] transition-colors">
                <Facebook className="h-5 w-5 text-[#086644]" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white hover:bg-[#A8E6CF] transition-colors">
                <MessageCircle className="h-5 w-5 text-[#086644]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-medium mb-3 sm:mb-4 text-[#086644]">Liên kết nhanh</h4>
            <ul className="space-y-2 text-base font-medium">
              <li>
                <button onClick={() => onNavigate('home')} className="text-[#6b7280] hover:text-[#086644] text-left">
                  Trang chủ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('lookup')} className="text-[#6b7280] hover:text-[#086644] text-left">
                  Tra cứu thông tin
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('report')} className="text-[#6b7280] hover:text-[#086644] text-left">
                  Tố cáo lừa đảo
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('businesses')} className="text-[#6b7280] hover:text-[#086644] text-left">
                  Doanh nghiệp uy tín
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-base font-medium mb-3 sm:mb-4 text-[#086644]">Dịch vụ</h4>
            <ul className="space-y-2 text-base font-medium">
              <li>
                <button onClick={() => onNavigate('business-portal')} className="text-[#6b7280] hover:text-[#086644] text-left">
                  Đăng ký doanh nghiệp
                </button>
              </li>
              <li>
                <a href="#" className="text-[#6b7280] hover:text-[#086644]">
                  Quỹ bảo hiểm
                </a>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="text-[#6b7280] hover:text-[#086644] text-left">
                  Cửa hàng
                </button>
              </li>
              <li>
                <a href="#" className="text-[#6b7280] hover:text-[#086644]">
                  Hỗ trợ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-medium mb-3 sm:mb-4 text-[#086644]">Liên hệ</h4>
            <ul className="space-y-2 sm:space-y-3 text-base font-medium">
              <li className="flex items-center gap-2 text-[#6b7280]">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="break-all">contact@chongluadaojp.com</span>
              </li>
              <li className="flex items-center gap-2 text-[#6b7280]">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>1900 xxxx</span>
              </li>
            </ul>
            <div className="mt-3 sm:mt-4">
              <a href="#" className="text-base font-medium text-[#6b7280] hover:text-[#086644]">
                Chính sách bảo mật
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#e5e7eb] text-center text-sm sm:text-base font-medium text-[#6b7280]">
          <p>© 2025 ChongLuaDaoJP.com - Bảo vệ cộng đồng khỏi lừa đảo</p>
        </div>
      </div>
    </footer>
  );
}