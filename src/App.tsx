import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ReportScamPage } from './components/ReportScamPage';
import { TrustedBusinessPage } from './components/TrustedBusinessPage';
import { NewsPage } from './components/NewsPage';
import { LookupPage } from './components/LookupPage';
import { ShopPage } from './components/ShopPage';
import { ShopsListPage } from './components/ShopsListPage';
import { ShopDetailPage } from './components/ShopDetailPage';
import { AdminDashboard } from './components/AdminDashboard';
import { BusinessPortal } from './components/BusinessPortal';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { LoadingOverlay } from './components/LoadingOverlay';
import { getCurrentUser, logout as logoutService, type AuthUser } from './services/authService';
import { Toaster } from 'sonner@2.0.3';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [lookupQuery, setLookupQuery] = useState('');
  const [shopId, setShopId] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Redirect to appropriate page based on role
      if (currentUser.role === 'ADMIN') {
        setCurrentPage('admin');
      } else if (currentUser.role === 'BUSINESS') {
        setCurrentPage('business-portal');
      }
    }
  }, []);

  const handleLogin = (authUser: AuthUser) => {
    setUser(authUser);
    
    // Redirect based on role
    // For admin users
    if (authUser.role === 'ADMIN') {
      setCurrentPage('admin');
    } 
    // For business users
    else if (authUser.role === 'BUSINESS') {
      setCurrentPage('business-portal');
    }
    // Default users go to home
    else {
      setCurrentPage('home');
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutService();
      setUser(null);
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (page: string, id?: number) => {
    setCurrentPage(page);
    if (id !== undefined) {
      setShopId(id);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onSearch={(query) => setLookupQuery(query)} />;
      case 'report':
        return <ReportScamPage />;
      case 'businesses':
        return <TrustedBusinessPage />;
      case 'news':
        return <NewsPage />;
      case 'lookup':
        return <LookupPage initialQuery={lookupQuery} />;
      case 'shop':
        return <ShopsListPage onNavigate={handleNavigate} />;
      case 'shop-detail':
        return <ShopDetailPage shopId={shopId} onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} />;
      case 'admin':
        // Require admin login
        if (user && user.role === 'ADMIN') {
          return <AdminDashboard onNavigate={setCurrentPage} onLogout={handleLogout} />;
        } else {
          setCurrentPage('login');
          return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
        }
      case 'business-portal':
        // Require business login
        if (user && user.role === 'BUSINESS') {
          return <BusinessPortal onNavigate={setCurrentPage} onLogout={handleLogout} />;
        } else {
          setCurrentPage('login');
          return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
        }
      default:
        return <HomePage onNavigate={handleNavigate} onSearch={(query) => setLookupQuery(query)} />;
    }
  };

  // Pages with custom layout (no header/footer)
  if (currentPage === 'admin' || currentPage === 'login' || currentPage === 'register' || currentPage === 'business-portal') {
    return (
      <>
        {isLoading && <LoadingOverlay message="Đang xử lý..." />}
        <div className="min-h-screen bg-[#F4F6F8]">
          {renderPage()}
        </div>
      </>
    );
  }

  return (
    <>
      {isLoading && <LoadingOverlay message="Đang đăng xuất..." />}
      <div className="min-h-screen bg-white flex flex-col">
        <Header 
          currentPage={currentPage} 
          onNavigate={handleNavigate}
          user={user ? { email: user.email, name: user.name, role: user.role } : null}
          onLogout={handleLogout}
        />
        <main className="flex-1">
          {renderPage()}
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
      <Toaster position="top-right" richColors />
    </>
  );
}