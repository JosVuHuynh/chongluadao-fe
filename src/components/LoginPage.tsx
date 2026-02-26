import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useState } from 'react';
import logoImage from 'figma:asset/2e2b9f150b66714e8750e5a4fcd8bac815716ee5.png';
import { login, type AuthUser } from '../services/authService';
import { LoadingOverlay } from './LoadingOverlay';

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
  onNavigate: (page: string) => void;
}

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call API to login
      const user = await login(email, password);
      onLogin(user);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Đã xảy ra lỗi không xác định');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingOverlay message="Đang đăng nhập..." />}
      <div className="min-h-screen bg-gradient-to-br from-[#A8E6CF] to-[#086644] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden">
              <img src={logoImage} alt="ChongLuaDaoJP Logo" className="h-full w-full object-cover" />
            </div>
            <CardTitle className="text-[#086644] text-2xl">Đăng nhập</CardTitle>
            <p className="text-sm text-[#6b7280]">
              Đăng nhập vào tài khoản ChongLuaDaoJP của bạn
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6b7280]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    maxLength={30}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6b7280]" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 pr-10 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#086644] disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-[#E57373]/10 border border-[#E57373]">
                  <p className="text-sm text-[#E57373]">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white hover:opacity-90 rounded-xl min-h-[48px] disabled:opacity-50"
              >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e5e7eb]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#6b7280]">hoặc</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-[#6b7280]">
                Chưa có tài khoản?{' '}
                <button
                  onClick={() => onNavigate('register')}
                  className="text-[#086644] hover:underline"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <button
                onClick={() => onNavigate('home')}
                className="text-sm text-[#6b7280] hover:text-[#086644]"
              >
                ← Quay lại trang chủ
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}