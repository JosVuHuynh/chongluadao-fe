import { useState, useEffect } from 'react';
import { LayoutDashboard, AlertTriangle, Building2, Users, Clock3, TrendingUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import * as adminService from '../services/adminService';
import { toast } from 'sonner@2.0.3';

export function AdminOverviewTab() {
  const [stats, setStats] = useState<adminService.Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminService.getStatistics();
        setStats(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        toast.error('Không thể tải thống kê');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-[#086644]" />
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Tổng đơn tố cáo', 
      value: stats?.totalReports.toLocaleString() || '0', 
      icon: AlertTriangle, 
      color: 'bg-[#FEF3C7]',
      iconColor: 'text-[#F59E0B]',
    },
    { 
      label: 'Doanh nghiệp', 
      value: stats?.totalBusinesses.toLocaleString() || '0', 
      icon: Building2, 
      color: 'bg-[#D1FAE5]',
      iconColor: 'text-[#10B981]',
    },
    { 
      label: 'Người dùng', 
      value: stats?.totalUsers.toLocaleString() || '0', 
      icon: Users, 
      color: 'bg-[#DBEAFE]',
      iconColor: 'text-[#3B82F6]',
    },
    {
      label: 'Chờ duyệt (shop + sản phẩm)',
      value: String((stats?.pendingShops || 0) + (stats?.pendingProducts || 0)),
      icon: Clock3,
      color: 'bg-[#FEF3C7]',
      iconColor: 'text-[#F59E0B]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-sm text-[#6B7280] mb-1">{stat.label}</p>
              <p className="text-3xl text-[#1F2937]">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#1F2937]">Tin tức & Cửa hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-xl">
                <div>
                  <p className="text-sm text-[#6B7280]">Tổng tin tức</p>
                  <p className="text-2xl text-[#1F2937]">{stats?.totalNews || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                  <LayoutDashboard className="h-6 w-6 text-[#3B82F6]" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-xl">
                <div>
                  <p className="text-sm text-[#6B7280]">Tổng cửa hàng</p>
                  <p className="text-2xl text-[#1F2937]">{stats?.totalShops || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-[#D1FAE5] flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-[#10B981]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#1F2937]">Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-[#F9FAFB] rounded-xl">
                    <div className="h-8 w-8 rounded-full bg-[#A8E6CF] flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-4 w-4 text-[#086644]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1F2937]">{activity.message}</p>
                      <p className="text-xs text-[#6B7280] mt-1">
                        {new Date(activity.timestamp).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[#6B7280]">
                  <p>Chưa có hoạt động nào</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#1F2937]">Thống kê chi tiết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-[#F9FAFB] rounded-xl">
              <p className="text-sm text-[#6B7280] mb-2">Tổng tin tức</p>
              <p className="text-3xl text-[#1F2937]">{stats?.totalNews || 0}</p>
            </div>
            <div className="text-center p-6 bg-[#F9FAFB] rounded-xl">
              <p className="text-sm text-[#6B7280] mb-2">Tổng cửa hàng</p>
              <p className="text-3xl text-[#1F2937]">{stats?.totalShops || 0}</p>
            </div>
            <div className="text-center p-6 bg-[#F9FAFB] rounded-xl">
              <p className="text-sm text-[#6B7280] mb-2">Sản phẩm chờ duyệt</p>
              <p className="text-3xl text-[#1F2937]">{stats?.pendingProducts || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
