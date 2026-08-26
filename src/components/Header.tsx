import { Shield, Search, Menu, X, LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import logoImage from 'figma:asset/2e2b9f150b66714e8750e5a4fcd8bac815716ee5.png';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, shopId?: number) => void;
  user: { email: string; name: string; role?: string } | null;
  onLogout: () => void;
}

export function Header({ currentPage, onNavigate, user, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'lookup', label: 'Tra cứu' },
    { id: 'report', label: 'Tố cáo' },
    { id: 'businesses', label: 'Doanh nghiệp uy tín' },
    { id: 'news', label: 'Tin tức' },
    { id: 'shop', label: 'Cửa hàng' },
  ];

  // Determine user's portal page based on role
  const getUserPortalPage = () => {
    if (!user) return null;
    if (user.role === 'ADMIN') {
      return { page: 'admin', label: 'Quản trị' };
    } else if (user.role === 'BUSINESS') {
      return { page: 'business-portal', label: 'Quản lý doanh nghiệp' };
    }
    return null;
  };

  const portalInfo = getUserPortalPage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden">
              <img src={logoImage} alt="ChongLuaDaoJP Logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-2xl font-medium text-[#086644] hidden sm:block">ChongLuaDaoJP</span>
          </button>

          {/* Desktop Navigation — shows from lg only, so iPad (md–lg) falls back to the single hamburger button like mobile; no font-size changed here */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-base font-medium transition-colors hover:text-[#086644] ${
                  currentPage === item.id ? 'text-[#086644]' : 'text-[#333333]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              /* User logged in */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-[#A8E6CF] to-[#086644] flex items-center justify-center text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm text-[#333333]">{user.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-[#086644]">{user.name}</p>
                    <p className="text-xs text-[#6b7280]">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {portalInfo && (
                    <DropdownMenuItem onClick={() => {
                      onNavigate(portalInfo.page);
                    }}>
                      <User className="h-4 w-4 mr-2" />
                      {portalInfo.label}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-[#E57373]">
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* User not logged in */
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('login')}
                  className="hidden sm:flex"
                >
                  Đăng nhập
                </Button>
                <Button
                  size="sm"
                  onClick={() => onNavigate('register')}
                  className="hidden sm:flex bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white hover:opacity-90"
                >
                  Đăng ký
                </Button>
              </>
            )}

            {/* Menu Button — now covers phones + iPad (hidden only from lg up) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-[#333333]" />
              ) : (
                <Menu className="h-6 w-6 text-[#333333]" />
              )}
            </button>
          </div>
        </div>

        {/* Menu panel — same dropdown as mobile, now also used for iPad */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-base font-medium text-left px-4 py-2 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-[#A8E6CF] text-[#086644]'
                      : 'text-[#333333] hover:bg-[#F4F6F8]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {user ? (
                <>
                  {portalInfo && (
                    <button
                      onClick={() => {
                        onNavigate(portalInfo.page);
                        setMobileMenuOpen(false);
                      }}
                      className="text-base font-medium text-left px-4 py-2 rounded-lg text-[#333333] hover:bg-[#F4F6F8]"
                    >
                      {portalInfo.label}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-base font-medium text-left px-4 py-2 rounded-lg text-[#E57373] hover:bg-[#F4F6F8]"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                /* Already shown in the header bar itself from md (768px) up — only needed here below that. (Would ideally be sm/640px to match exactly when the header bar's own buttons appear, but this static build's CSS has no .sm\:hidden rule generated — see docs/CONVENTIONS.md.) */
                <>
                  <button
                    onClick={() => {
                      onNavigate('login');
                      setMobileMenuOpen(false);
                    }}
                    className="md:hidden text-base font-medium text-left px-4 py-2 rounded-lg text-[#333333] hover:bg-[#F4F6F8]"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('register');
                      setMobileMenuOpen(false);
                    }}
                    className="md:hidden text-base font-medium text-left px-4 py-2 rounded-lg bg-[#A8E6CF] text-[#086644]"
                  >
                    Đăng ký
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}