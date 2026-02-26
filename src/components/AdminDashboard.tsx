import { 
  LayoutDashboard,
  Users, 
  Building2, 
  AlertTriangle, 
  FileText, 
  ShoppingCart,
  DollarSign,
  Shield,
  LogOut,
  Pencil,
  Trash2,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  Store,
  MonitorPlay,
  Settings,
  Image as ImageIcon,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  Search,
  Upload
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { useState } from 'react';
import { Switch } from './ui/switch';
import { ScrollArea } from './ui/scroll-area';
import logoImage from 'figma:asset/2e2b9f150b66714e8750e5a4fcd8bac815716ee5.png';
import { AdminUsersTab } from './AdminUsersTab';
import { AdminReportsTab } from './AdminReportsTab';
import { AdminBusinessesTab } from './AdminBusinessesTab';

interface AdminDashboardProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function AdminDashboard({ onNavigate, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [addReportDialogOpen, setAddReportDialogOpen] = useState(false);
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Add Report form state
  const [reportLinks, setReportLinks] = useState<string[]>([]);
  const [reportLinkInput, setReportLinkInput] = useState('');
  const [addReportFiles, setAddReportFiles] = useState<string[]>([]);
  
  // News products state
  const [newsProducts, setNewsProducts] = useState<any[]>([]);
  const [productFormData, setProductFormData] = useState({
    name: '',
    price: '',
    image: '',
    link: ''
  });
  
  // Shop search state
  const [shopSearchQuery, setShopSearchQuery] = useState('');
  
  // Edit Report form state
  const [editReportLinks, setEditReportLinks] = useState<string[]>([]);
  const [editReportLinkInput, setEditReportLinkInput] = useState('');
  const [editReportFiles, setEditReportFiles] = useState<string[]>([]);

  // Mock data
  const stats = [
    { 
      label: 'Tổng đơn tố cáo', 
      value: '15,234', 
      icon: AlertTriangle, 
      color: 'bg-[#FEF3C7]',
      iconColor: 'text-[#F59E0B]',
      growth: '+12.5%'
    },
    { 
      label: 'Doanh nghiệp', 
      value: '3,456', 
      icon: Building2, 
      color: 'bg-[#D1FAE5]',
      iconColor: 'text-[#10B981]',
      growth: '+8.2%'
    },
    { 
      label: 'Người dùng', 
      value: '125,890', 
      icon: Users, 
      color: 'bg-[#DBEAFE]',
      iconColor: 'text-[#3B82F6]',
      growth: '+15.3%'
    },
    { 
      label: 'Doanh thu', 
      value: '428M', 
      icon: DollarSign, 
      color: 'bg-[#E0E7FF]',
      iconColor: 'text-[#6366F1]',
      growth: '+23.1%'
    },
  ];

  const users = [
    { id: 1, name: 'Nguyễn Admin', email: 'admin@chongluadaojp.com', role: 'Admin', permissions: 'All', status: 'active' },
    { id: 2, name: 'Công ty ABC', email: 'abc@business.vn', role: 'Doanh nghiệp', permissions: 'EditShop, News', status: 'active' },
    { id: 3, name: 'Trần Văn A', email: 'user1@gmail.com', role: 'Người dùng', permissions: 'Xem, Like, Comment', status: 'active' },
    { id: 4, name: 'Lê Thị B', email: 'user2@gmail.com', role: 'Người dùng', permissions: 'Xem, Like, Comment', status: 'inactive' },
  ];

  const reports = [
    { 
      id: 1, 
      type: 'transfer', 
      typeLabel: 'Lừa đảo chuyển khoản',
      reporter: 'Nguyễn Văn A', 
      target: 'Công ty XYZ', 
      date: '2025-01-05', 
      status: 'pending',
      phoneNumber: '0901234567',
      bankAccount: '123456789 - Vietcombank',
      links: ['https://facebook.com/abc', 'https://zalo.me/xyz'],
      description: 'Công ty này yêu cầu chuyển khoản trước nhưng không giao hàng',
      files: ['evidence1.jpg', 'evidence2.jpg'],
      reporterName: 'Nguyễn Văn A',
      reporterContact: '0912345678'
    },
    { 
      id: 2, 
      type: 'ecommerce', 
      typeLabel: 'Lừa đảo bán hàng',
      reporter: 'Trần Thị B', 
      target: '0901234567', 
      date: '2025-01-04', 
      status: 'verified',
      phoneNumber: '0901234567',
      bankAccount: '',
      links: ['https://shopee.vn/fake-shop'],
      description: 'Bán hàng giả mạo thương hiệu',
      files: ['proof1.jpg'],
      reporterName: 'Trần Thị B',
      reporterContact: 'tranthib@gmail.com'
    },
    { 
      id: 3, 
      type: 'investment', 
      typeLabel: 'Lừa đảo đầu tư',
      reporter: 'Lê Văn C', 
      target: 'website.com', 
      date: '2025-01-03', 
      status: 'rejected',
      phoneNumber: '',
      bankAccount: '987654321 - Techcombank',
      links: ['https://website.com', 'https://facebook.com/investment'],
      description: 'Lừa đảo đầu tư tiền ảo, hứa lợi nhuận cao',
      files: ['screenshot1.jpg', 'screenshot2.jpg', 'screenshot3.jpg'],
      reporterName: 'Lê Văn C',
      reporterContact: 'Zalo: 0923456789'
    },
  ];

  const newsItems = [
    {
      id: 1,
      title: 'Khuyến mãi cuối năm 2024',
      business: 'Công ty TNHH ABC Tech',
      businessId: 1,
      date: '15/10/2025',
      views: 1234,
      status: 'published',
      content: 'Giảm giá lên đến 50% cho tất cả sản phẩm công nghệ trong dịp cuối năm!',
      hasProduct: true,
      products: [
        {
          id: 1,
          name: 'Laptop Dell XPS 15',
          price: '25,990,000đ',
          image: 'https://images.unsplash.com/photo-1737868131581-6379cdee4ec3?w=400',
          link: 'https://example.com/laptop'
        },
        {
          id: 2,
          name: 'iPhone 15 Pro Max',
          price: '32,000,000đ',
          image: 'https://images.unsplash.com/photo-1675953935267-e039f13ddd79?w=400',
          link: 'https://example.com/iphone'
        }
      ]
    },
    {
      id: 2,
      title: 'Ra mắt sản phẩm mới',
      business: 'Công ty TNHH ABC Tech',
      businessId: 1,
      date: '14/10/2025',
      views: 856,
      status: 'published',
      content: 'Chúng tôi vui mừng giới thiệu dòng sản phẩm mới nhất.',
      hasProduct: false
    },
    {
      id: 3,
      title: 'Khai trương chi nhánh mới',
      business: 'Cửa hàng XYZ',
      businessId: 2,
      date: '12/10/2025',
      views: 543,
      status: 'published',
      content: 'Cửa hàng XYZ khai trương chi nhánh thứ 5 tại Hà Nội.',
      hasProduct: false
    },
  ];

  const services = [
    { id: 1, name: 'Xác thực doanh nghiệp', price: '2,990,000đ', duration: '12 tháng', status: 'active' },
    { id: 2, name: 'Quỹ bảo hiểm cơ bản', price: '5,000,000đ/năm', duration: '12 tháng', status: 'active' },
    { id: 3, name: 'Quảng cáo ưu tiên', price: '1,500,000đ/tháng', duration: '1 tháng', status: 'active' },
  ];

  const banners = [
    { id: 1, title: 'Banner trang chủ', position: 'Hero Section', image: 'banner1.jpg', status: 'active', clicks: 1234 },
    { id: 2, title: 'Quảng cáo sidebar', position: 'Sidebar', image: 'banner2.jpg', status: 'active', clicks: 567 },
    { id: 3, title: 'Banner footer', position: 'Footer', image: 'banner3.jpg', status: 'inactive', clicks: 89 },
  ];

  const shopProducts = [
    { 
      id: 1, 
      name: 'Laptop Dell XPS 15', 
      business: 'Công ty TNHH ABC Tech',
      price: '25,990,000đ', 
      stock: 15, 
      sales: 23, 
      status: 'active',
      category: 'Điện tử',
      image: 'laptop.jpg'
    },
    { 
      id: 2, 
      name: 'MacBook Pro M3', 
      business: 'Công ty TNHH ABC Tech',
      price: '45,990,000đ', 
      stock: 8, 
      sales: 12, 
      status: 'active',
      category: 'Điện tử',
      image: 'macbook.jpg'
    },
    { 
      id: 3, 
      name: 'iPad Air', 
      business: 'Cửa hàng XYZ',
      price: '15,990,000đ', 
      stock: 25, 
      sales: 45, 
      status: 'active',
      category: 'Điện tử',
      image: 'ipad.jpg'
    },
  ];

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Tổng quan' },
    { id: 'users', icon: Users, label: 'Người dùng' },
    { id: 'reports', icon: AlertTriangle, label: 'Tố cáo' },
    { id: 'businesses', icon: Building2, label: 'Doanh nghiệp' },
    { id: 'news', icon: FileText, label: 'Tin tức' },
    { id: 'shop', icon: ShoppingCart, label: 'Cửa hàng' },
    { id: 'finance', icon: DollarSign, label: 'Tài chính' },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-[#D1FAE5] text-[#065F46]',
      inactive: 'bg-[#E5E7EB] text-[#6B7280]',
      pending: 'bg-[#FEF3C7] text-[#92400E]',
      verified: 'bg-[#D1FAE5] text-[#065F46]',
      rejected: 'bg-[#FEE2E2] text-[#991B1B]',
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      pending: 'Chờ xử lý',
      verified: 'Đã xác minh',
      rejected: 'Từ chối',
    };
    return texts[status as keyof typeof texts] || status;
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    // Load existing products if editing news item
    if (item.products && item.hasProduct) {
      setNewsProducts(item.products);
    } else {
      setNewsProducts([]);
    }
    // Load existing links and files if editing report
    if (item.type && item.reporter && item.links) {
      setEditReportLinks(item.links || []);
      setEditReportFiles(item.files || []);
      setEditReportLinkInput('');
    } else {
      setEditReportLinks([]);
      setEditReportFiles([]);
      setEditReportLinkInput('');
    }
    setEditDialogOpen(true);
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // Handle delete logic here
    console.log('Deleting:', selectedItem);
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${sidebarCollapsed ? 'w-[80px]' : 'w-[240px]'}
        bg-white border-r min-h-screen flex flex-col transition-all duration-300
        fixed lg:sticky top-0 z-50 lg:z-auto
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        relative
      `}>
        <div className="p-6 flex items-center justify-between">
          <button 
            onClick={() => onNavigate?.('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img 
              src={logoImage} 
              alt="ChongLuaDaoJP Logo" 
              className="h-10 w-10 object-contain flex-shrink-0"
            />
            {!sidebarCollapsed && (
              <span className="text-[#086644] whitespace-nowrap">Admin Panel</span>
            )}
          </button>

          {/* Collapse Button - Desktop */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5F5F5] hover:bg-[#086644] hover:text-white transition-all group"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4 text-[#6B7280] group-hover:text-white transition-colors" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-[#6B7280] group-hover:text-white transition-colors" />
            )}
          </button>
        </div>

        {/* Scrollable Menu */}
        <ScrollArea className="flex-1 px-4">
          <nav className="space-y-1 pb-4">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-[#086644] text-white shadow-md'
                    : 'text-[#6B7280] hover:bg-[#F5F5F5]'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="text-sm whitespace-nowrap">{item.label}</span>
                )}
              </button>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className={`w-full gap-2 ${sidebarCollapsed ? 'px-2' : ''}`}
            onClick={() => onLogout?.()}
            title={sidebarCollapsed ? 'Đăng xuất' : ''}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Đăng xuất</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b px-4 sm:px-8 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-[#F5F5F5] rounded-lg"
              >
                <Menu className="h-6 w-6 text-[#6B7280]" />
              </button>
              
              <div>
                <h1 className="text-xl sm:text-2xl text-[#086644]">Bảng điều khiển quản trị</h1>
                <p className="text-xs sm:text-sm text-[#6B7280] hidden sm:block">Quản lý và giám sát hệ thống ChongLuaDaoJP</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-[#A8E6CF] text-[#086644] px-3 sm:px-4 py-1 text-xs sm:text-sm">Admin</Badge>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-[#A8E6CF] to-[#086644] flex items-center justify-center text-white flex-shrink-0">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.color}`}>
                          <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                        </div>
                        <Badge className="bg-[#D1FAE5] text-[#065F46] border-0">
                          {stat.growth}
                        </Badge>
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
                    <CardTitle className="text-[#1F2937]">Doanh thu & Chi phí</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-[#F9FAFB] rounded-xl">
                      <div className="text-center">
                        <LayoutDashboard className="h-16 w-16 text-[#A8E6CF] mx-auto mb-2" />
                        <p className="text-sm text-[#6B7280]">Biểu đồ doanh thu</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-[#1F2937]">Xu hướng người dùng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-[#F9FAFB] rounded-xl">
                      <div className="text-center">
                        <TrendingUp className="h-16 w-16 text-[#086644] mx-auto mb-2" />
                        <p className="text-sm text-[#6B7280]">Biểu đồ người dùng</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <AdminUsersTab />
          )}

          {activeTab === 'reports' && (
            <AdminReportsTab />
          )}

          {activeTab === 'businesses' && (
            <AdminBusinessesTab />
          )}

          {activeTab === 'news' && (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between border-b">
                  <CardTitle className="text-[#1F2937]">Quản lý tin tức</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="overflow-x-auto -mx-6">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-[#6B7280] pl-6">Tiêu đề</TableHead>
                              <TableHead className="text-[#6B7280]">Doanh nghiệp</TableHead>
                              <TableHead className="text-[#6B7280]">Ngày đăng</TableHead>
                              <TableHead className="text-[#6B7280]">Lượt xem</TableHead>
                              <TableHead className="text-[#6B7280]">Trạng thái</TableHead>
                              <TableHead className="text-[#6B7280] pr-6">Thao tác</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {newsItems.map((news) => (
                              <TableRow key={news.id}>
                                <TableCell className="pl-6">
                                  <div>
                                    <p className="text-[#1F2937]">{news.title}</p>
                                    {news.hasProduct && news.products && news.products.length > 0 && (
                                      <div className="flex items-center gap-1 mt-1">
                                        <Store className="h-3 w-3 text-[#086644]" />
                                        <span className="text-xs text-[#086644]">{news.products.length} sản phẩm</span>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-[#6B7280]">{news.business}</TableCell>
                                <TableCell className="text-[#6B7280]">{news.date}</TableCell>
                                <TableCell className="text-[#6B7280]">{news.views}</TableCell>
                                <TableCell>
                                  <Badge className={news.status === 'published' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEF3C7] text-[#92400E]'}>
                                    {news.status === 'published' ? 'Đã đăng' : 'Nháp'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="pr-6">
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleEdit(news)}
                                      className="hover:bg-[#DBEAFE]"
                                    >
                                      <Pencil className="h-4 w-4 text-[#3B82F6]" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDelete(news)}
                                      className="hover:bg-[#FEE2E2]"
                                    >
                                      <Trash2 className="h-4 w-4 text-[#DC2626]" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'shop' && (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between border-b">
                  <CardTitle className="text-[#1F2937]">Quản lý cửa hàng</CardTitle>
                  <Button 
                    className="bg-[#086644] text-white hover:bg-[#086644]/90"
                    onClick={() => setAddProductDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm sản phẩm
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Search Box */}
                  <div className="mb-6">
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
                      <Input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm theo tên, doanh nghiệp, danh mục..."
                        value={shopSearchQuery}
                        onChange={(e) => setShopSearchQuery(e.target.value)}
                        className="pl-10 rounded-xl border-[#E0E0E0] focus:border-[#086644]"
                      />
                      {shopSearchQuery && (
                        <button
                          onClick={() => setShopSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#086644]"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="overflow-x-auto -mx-6">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-[#6B7280] pl-6">Sản phẩm</TableHead>
                              <TableHead className="text-[#6B7280]">Doanh nghiệp</TableHead>
                              <TableHead className="text-[#6B7280]">Danh mục</TableHead>
                              <TableHead className="text-[#6B7280]">Giá</TableHead>
                              <TableHead className="text-[#6B7280]">Kho</TableHead>
                              <TableHead className="text-[#6B7280]">Đã bán</TableHead>
                              <TableHead className="text-[#6B7280]">Trạng thái</TableHead>
                              <TableHead className="text-[#6B7280] pr-6">Thao tác</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {shopProducts
                              .filter(product => 
                                shopSearchQuery === '' ||
                                product.name.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
                                product.business.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
                                product.category.toLowerCase().includes(shopSearchQuery.toLowerCase())
                              )
                              .map((product) => (
                              <TableRow key={product.id}>
                                <TableCell className="text-[#1F2937] pl-6">{product.name}</TableCell>
                                <TableCell className="text-[#6B7280]">{product.business}</TableCell>
                                <TableCell>
                                  <Badge className="bg-[#E0E7FF] text-[#4338CA] border-0">{product.category}</Badge>
                                </TableCell>
                                <TableCell className="text-[#6B7280]">{product.price}</TableCell>
                                <TableCell className="text-[#6B7280]">{product.stock}</TableCell>
                                <TableCell className="text-[#6B7280]">{product.sales}</TableCell>
                                <TableCell>
                                  <Badge className={getStatusBadge(product.status)}>
                                    {getStatusText(product.status)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="pr-6">
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleEdit(product)}
                                      className="hover:bg-[#DBEAFE]"
                                    >
                                      <Pencil className="h-4 w-4 text-[#3B82F6]" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDelete(product)}
                                      className="hover:bg-[#FEE2E2]"
                                    >
                                      <Trash2 className="h-4 w-4 text-[#DC2626]" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                            {shopProducts.filter(product => 
                              shopSearchQuery === '' ||
                              product.name.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
                              product.business.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
                              product.category.toLowerCase().includes(shopSearchQuery.toLowerCase())
                            ).length === 0 && (
                              <TableRow>
                                <TableCell colSpan={8} className="text-center py-12">
                                  <div className="text-[#6B7280]">
                                    <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p className="text-base">Không tìm thấy sản phẩm nào phù hợp với "{shopSearchQuery}"</p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Finance tab - Coming soon */}
          {activeTab === 'finance' && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-[#1F2937] mb-2">Đang phát triển</h3>
                <p className="text-[#6B7280]">
                  Tính năng này đang được hoàn thiện
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.taxCode ? 'Chỉnh sửa doanh nghiệp' : 
               selectedItem?.title ? 'Chỉnh sửa tin tức' : 
               selectedItem?.role ? 'Chỉnh sửa người dùng' :
               'Chỉnh sửa'}
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              {/* Business Edit Form */}
              {selectedItem.taxCode && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-business-name">Tên doanh nghiệp *</Label>
                    <Input 
                      id="edit-business-name"
                      defaultValue={selectedItem.name}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-tax-code">Mã số thuế *</Label>
                      <Input 
                        id="edit-tax-code"
                        defaultValue={selectedItem.taxCode}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-phone">Số điện thoại *</Label>
                      <Input 
                        id="edit-phone"
                        type="tel"
                        defaultValue={selectedItem.phone}
                        maxLength={11}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email *</Label>
                    <Input 
                      id="edit-email"
                      type="email"
                      defaultValue={selectedItem.email}
                      maxLength={30}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-website">Website</Label>
                    <Input 
                      id="edit-website"
                      defaultValue={selectedItem.website}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-address">Địa chỉ *</Label>
                    <Input 
                      id="edit-address"
                      defaultValue={selectedItem.address}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Mô tả</Label>
                    <Textarea 
                      id="edit-description"
                      defaultValue={selectedItem.description}
                      className="rounded-xl min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-package">Gói dịch vụ</Label>
                    <Select defaultValue={selectedItem.package}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-business-status">Trạng thái</Label>
                    <Select defaultValue={selectedItem.status}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Chờ xử lý</SelectItem>
                        <SelectItem value="verified">Đã xác minh</SelectItem>
                        <SelectItem value="rejected">Từ chối</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* News Edit Form */}
              {selectedItem.title && !selectedItem.taxCode && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-news-title">Tiêu đề *</Label>
                    <Input 
                      id="edit-news-title"
                      defaultValue={selectedItem.title}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-news-business">Doanh nghiệp</Label>
                    <Input 
                      id="edit-news-business"
                      defaultValue={selectedItem.business}
                      disabled
                      className="rounded-xl bg-[#F9FAFB]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-news-content">Nội dung</Label>
                    <Textarea 
                      id="edit-news-content"
                      defaultValue={selectedItem.content}
                      className="rounded-xl min-h-[120px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-news-status">Trạng thái</Label>
                    <Select defaultValue={selectedItem.status}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Nháp</SelectItem>
                        <SelectItem value="published">Đã đăng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="border-t pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base">Sản phẩm đính kèm</Label>
                      <Switch 
                        checked={selectedItem.hasProduct}
                        onCheckedChange={(checked) => {
                          setSelectedItem({ ...selectedItem, hasProduct: checked });
                          if (!checked) {
                            setNewsProducts([]);
                          } else if (selectedItem.products) {
                            setNewsProducts(selectedItem.products);
                          }
                        }}
                      />
                    </div>

                    {selectedItem.hasProduct && (
                      <div className="space-y-4">
                        {/* Existing Products */}
                        {newsProducts.length > 0 && (
                          <div className="space-y-2">
                            <Label>Danh sách sản phẩm ({newsProducts.length})</Label>
                            <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto">
                              {newsProducts.map((product, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg group relative">
                                  <div className="h-16 w-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                                    {product.image ? (
                                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                    ) : (
                                      <div className="h-full w-full flex items-center justify-center bg-[#F4F6F8]">
                                        <ImageIcon className="h-6 w-6 text-[#9CA3AF]" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-[#1F2937] truncate">{product.name}</p>
                                    <p className="text-sm text-[#086644]">{product.price}</p>
                                    {product.link && (
                                      <p className="text-xs text-[#6B7280] truncate">{product.link}</p>
                                    )}
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setNewsProducts(newsProducts.filter((_, i) => i !== index))}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-4 w-4 text-[#DC2626]" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Add New Product Form */}
                        <div className="space-y-3 p-4 bg-[#F0F9F4] rounded-lg border-2 border-dashed border-[#A8E6CF]">
                          <Label className="text-sm">Thêm sản phẩm mới</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor="product-name" className="text-xs">Tên sản phẩm *</Label>
                              <Input
                                id="product-name"
                                placeholder="VD: iPhone 15 Pro Max"
                                value={productFormData.name}
                                onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                                className="rounded-lg text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="product-price" className="text-xs">Giá *</Label>
                              <Input
                                id="product-price"
                                placeholder="VD: 29,990,000đ"
                                value={productFormData.price}
                                onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                                className="rounded-lg text-sm"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="product-image" className="text-xs">URL hình ảnh</Label>
                            <Input
                              id="product-image"
                              placeholder="https://example.com/image.jpg"
                              value={productFormData.image}
                              onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                              className="rounded-lg text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="product-link" className="text-xs">Link sản phẩm</Label>
                            <Input
                              id="product-link"
                              placeholder="https://example.com/product"
                              value={productFormData.link}
                              onChange={(e) => setProductFormData({ ...productFormData, link: e.target.value })}
                              className="rounded-lg text-sm"
                            />
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              if (productFormData.name && productFormData.price) {
                                setNewsProducts([...newsProducts, { 
                                  id: Date.now(),
                                  ...productFormData 
                                }]);
                                setProductFormData({ name: '', price: '', image: '', link: '' });
                              }
                            }}
                            className="w-full rounded-lg bg-[#086644] hover:bg-[#086644]/90 text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm sản phẩm
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* User Edit Form */}
              {selectedItem.role && !selectedItem.taxCode && !selectedItem.title && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-user-name">Tên</Label>
                    <Input
                      id="edit-user-name"
                      defaultValue={selectedItem.name}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-user-email">Email</Label>
                    <Input
                      id="edit-user-email"
                      type="email"
                      defaultValue={selectedItem.email}
                      maxLength={30}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Vai trò</Label>
                    <Select defaultValue={selectedItem.role}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Doanh nghiệp">Doanh nghiệp</SelectItem>
                        <SelectItem value="Người dùng">Người dùng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-user-status">Trạng thái</Label>
                    <Select defaultValue={selectedItem.status}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Report Edit Form */}
              {selectedItem.type && selectedItem.reporter && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-report-type">
                      Loại lừa đảo <span className="text-[#E57373]">*</span>
                    </Label>
                    <Select defaultValue={selectedItem.type}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Chọn loại lừa đảo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transfer">Lừa đảo chuyển khoản</SelectItem>
                        <SelectItem value="investment">Lừa đảo đầu tư</SelectItem>
                        <SelectItem value="ecommerce">Lừa đảo bán hàng</SelectItem>
                        <SelectItem value="job">Lừa đảo việc làm</SelectItem>
                        <SelectItem value="loan">Lừa đảo vay tiền</SelectItem>
                        <SelectItem value="prize">Lừa đảo trúng thưởng</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-report-phone">Số điện thoại (nếu có)</Label>
                    <Input
                      id="edit-report-phone"
                      type="tel"
                      placeholder="0xxx xxx xxx"
                      defaultValue={selectedItem.phoneNumber}
                      maxLength={11}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-report-links">
                      Đường dẫn liên quan (link lừa đảo, website, fanpage, v.v.) <span className="text-[#E57373]">*</span>
                    </Label>
                    
                    <div className="border border-[#E5E7EB] rounded-xl p-3 bg-[#F9FAFB] min-h-[100px] space-y-2">
                      {editReportLinks.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {editReportLinks.map((link, index) => (
                            <div
                              key={index}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-[#E5E7EB] text-sm hover:border-[#086644] transition-colors"
                            >
                              <span className="max-w-[250px] truncate text-[#1F2937]" title={link}>
                                {link}
                              </span>
                              <button
                                type="button"
                                onClick={() => setEditReportLinks(editReportLinks.filter((_, i) => i !== index))}
                                className="flex-shrink-0 hover:scale-110 transition-transform"
                              >
                                <X className="h-3.5 w-3.5 text-[#6B7280] hover:text-[#DC2626]" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <Textarea
                        id="edit-report-links"
                        placeholder={editReportLinks.length === 0 ? "Nhập link..." : ""}
                        value={editReportLinkInput}
                        onChange={(e) => setEditReportLinkInput(e.target.value)}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData('text');
                          const pastedLinks = pastedText
                            .split(/[\n,\s]+/)
                            .map(link => link.trim())
                            .filter(link => link.length > 0 && !editReportLinks.includes(link));
                          if (pastedLinks.length > 0) {
                            setEditReportLinks([...editReportLinks, ...pastedLinks]);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (editReportLinkInput.trim()) {
                              const newLinks = editReportLinkInput
                                .split(/[\n,\s]+/)
                                .map(link => link.trim())
                                .filter(link => link.length > 0 && !editReportLinks.includes(link));
                              if (newLinks.length > 0) {
                                setEditReportLinks([...editReportLinks, ...newLinks]);
                                setEditReportLinkInput('');
                              }
                            }
                          }
                        }}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent min-h-[40px] resize-none px-1 py-1 text-sm placeholder:text-[#9CA3AF]"
                      />
                    </div>
                    
                    <div className="flex items-start gap-2 text-xs text-[#6b7280]">
                      <div className="flex-1">
                        <p>💡 <strong>Mẹo:</strong> Paste nhiều link cùng lúc (mỗi link một dòng) hoặc nhấn Enter để thêm</p>
                        {editReportLinks.length > 0 && (
                          <p className="mt-1">📝 Đã thêm: <span className="text-[#086644]">{editReportLinks.length} link</span></p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-report-bank">Số tài khoản ngân hàng (nếu có)</Label>
                    <Input
                      id="edit-report-bank"
                      placeholder="VD: 1234567890 - Vietcombank"
                      defaultValue={selectedItem.bankAccount}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-report-description">Mô tả chi tiết hành vi lừa đảo</Label>
                    <Textarea
                      id="edit-report-description"
                      placeholder="Vui lòng mô tả chi tiết về hành vi lừa đảo, thời gian, phương thức..."
                      defaultValue={selectedItem.description}
                      rows={6}
                      className="rounded-xl resize-none"
                    />
                    <p className="text-xs text-[#6b7280]">
                      Cung cấp càng nhiều chi tiết càng giúp chúng tôi xử lý nhanh hơn
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-report-files">
                      Ảnh bằng chứng (hóa đơn, tin nhắn, ảnh chụp, v.v.) <span className="text-[#E57373]">*</span>
                    </Label>
                    
                    {editReportFiles.length > 0 && (
                      <div className="space-y-2">
                        {editReportFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-[#F4F6F8] rounded-xl"
                          >
                            <span className="text-sm text-[#333333] truncate">{file}</span>
                            <button
                              type="button"
                              onClick={() => setEditReportFiles(editReportFiles.filter((_, i) => i !== index))}
                              className="text-[#E57373] hover:text-[#E57373]/80"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="border-2 border-dashed border-[#e5e7eb] rounded-xl p-4 text-center hover:border-[#A8E6CF] transition-colors">
                      <p className="text-sm text-[#6b7280] mb-2">
                        Ảnh chụp màn hình, tin nhắn, giao dịch...
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const fileName = prompt('Nhập tên file (demo):');
                          if (fileName) {
                            setEditReportFiles([...editReportFiles, fileName]);
                          }
                        }}
                        className="rounded-xl"
                      >
                        Thêm file
                      </Button>
                    </div>
                    <p className="text-xs text-[#6b7280]">
                      * Bắt buộc phải có ít nhất 1 ảnh bằng chứng
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#e5e7eb]">
                    <h3 className="text-[#086644] mb-4">Thông tin người tố cáo</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-report-reporter-name">Họ tên</Label>
                        <Input
                          id="edit-report-reporter-name"
                          placeholder="Nhập họ tên của người tố cáo..."
                          defaultValue={selectedItem.reporterName}
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-report-reporter-contact">
                          Phương thức liên lạc (SĐT / Zalo / Line / Email)
                        </Label>
                        <Input
                          id="edit-report-reporter-contact"
                          placeholder="Nhập thông tin liên lạc..."
                          defaultValue={selectedItem.reporterContact}
                          className="rounded-xl"
                        />
                      </div>

                      <p className="text-xs text-[#6b7280]">
                        Thông tin này giúp chúng tôi liên lạc nếu cần thêm chi tiết.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-report-status">Trạng thái</Label>
                    <Select defaultValue={selectedItem.status}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Chờ xử lý</SelectItem>
                        <SelectItem value="verified">Đã xác minh</SelectItem>
                        <SelectItem value="rejected">Từ chối</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Shop Product Edit Form */}
              {selectedItem.price && selectedItem.stock !== undefined && !selectedItem.title && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-product-name">Tên sản phẩm</Label>
                    <Input
                      id="edit-product-name"
                      defaultValue={selectedItem.name}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-product-business">Doanh nghiệp</Label>
                    <Input
                      id="edit-product-business"
                      defaultValue={selectedItem.business}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-product-category">Danh mục</Label>
                    <Input
                      id="edit-product-category"
                      defaultValue={selectedItem.category}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-product-price">Giá</Label>
                      <Input
                        id="edit-product-price"
                        defaultValue={selectedItem.price}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-product-stock">Số lượng kho</Label>
                      <Input
                        id="edit-product-stock"
                        type="number"
                        defaultValue={selectedItem.stock}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-product-status">Trạng thái</Label>
                    <Select defaultValue={selectedItem.status}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-xl"
                  onClick={() => {
                    setEditDialogOpen(false);
                    setNewsProducts([]);
                    setProductFormData({ name: '', price: '', image: '', link: '' });
                    setEditReportLinks([]);
                    setEditReportFiles([]);
                    setEditReportLinkInput('');
                  }}
                >
                  Hủy
                </Button>
                <Button 
                  className="flex-1 rounded-xl bg-[#086644] text-white hover:bg-[#086644]/90"
                  onClick={() => {
                    const updatedItem = { ...selectedItem };
                    if (selectedItem.title && selectedItem.hasProduct) {
                      updatedItem.products = newsProducts;
                    }
                    if (selectedItem.type && selectedItem.reporter) {
                      updatedItem.links = editReportLinks;
                      updatedItem.files = editReportFiles;
                    }
                    console.log('Saving:', updatedItem);
                    setEditDialogOpen(false);
                    setNewsProducts([]);
                    setProductFormData({ name: '', price: '', image: '', link: '' });
                    setEditReportLinks([]);
                    setEditReportFiles([]);
                    setEditReportLinkInput('');
                  }}
                >
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1F2937]">Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription className="text-[#6B7280]">
              Bạn có chắc chắn muốn xóa "{selectedItem?.name || selectedItem?.title}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-[#DC2626] text-white hover:bg-[#DC2626]/90 rounded-xl"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm người dùng mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-user-name">Tên *</Label>
              <Input
                id="new-user-name"
                placeholder="Nhập tên người dùng..."
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-user-email">Email *</Label>
              <Input
                id="new-user-email"
                type="email"
                placeholder="Nhập email..."
                maxLength={30}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-user-password">Mật khẩu *</Label>
              <Input
                id="new-user-password"
                type="password"
                placeholder="Nhập mật khẩu..."
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-user-role">Vai trò</Label>
              <Select defaultValue="Người dùng">
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Doanh nghiệp">Doanh nghiệp</SelectItem>
                  <SelectItem value="Người dùng">Người dùng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-user-permissions">Quyền hạn</Label>
              <Input
                id="new-user-permissions"
                placeholder="VD: Xem, Like, Comment"
                className="rounded-xl"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl"
                onClick={() => setAddUserDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button 
                className="flex-1 rounded-xl bg-[#086644] text-white hover:bg-[#086644]/90"
                onClick={() => {
                  console.log('Adding new user');
                  setAddUserDialogOpen(false);
                }}
              >
                Thêm người dùng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Report Dialog */}
      <Dialog open={addReportDialogOpen} onOpenChange={setAddReportDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm tố cáo mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Scam Type */}
            <div className="space-y-2">
              <Label htmlFor="new-report-type">Loại lừa đảo *</Label>
              <Select>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Chọn loại lừa đảo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">Lừa đảo chuyển khoản</SelectItem>
                  <SelectItem value="investment">Lừa đảo đầu tư</SelectItem>
                  <SelectItem value="ecommerce">Lừa đảo bán hàng</SelectItem>
                  <SelectItem value="job">Lừa đảo việc làm</SelectItem>
                  <SelectItem value="loan">Lừa đảo vay tiền</SelectItem>
                  <SelectItem value="prize">Lừa đảo trúng thưởng</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="new-report-phone">Số điện thoại (nếu có)</Label>
              <Input
                id="new-report-phone"
                type="tel"
                placeholder="0xxx xxx xxx"
                maxLength={11}
                pattern="[0-9]*"
                inputMode="numeric"
                className="rounded-xl"
              />
            </div>

            {/* Bank Account */}
            <div className="space-y-2">
              <Label htmlFor="new-report-bank">Tài khoản ngân hàng (nếu có)</Label>
              <Input
                id="new-report-bank"
                placeholder="Số tài khoản hoặc tên ngân hàng"
                className="rounded-xl"
              />
            </div>

            {/* Links */}
            <div className="space-y-2">
              <Label htmlFor="new-report-links">
                Đường dẫn liên quan *
                <span className="text-xs text-[#6B7280] ml-2">(Paste nhiều links cùng lúc)</span>
              </Label>
              <div className="border border-[#E5E7EB] rounded-xl p-3 bg-[#F9FAFB] min-h-[100px] space-y-2">
                {/* Links Display */}
                {reportLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {reportLinks.map((link, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-[#E5E7EB] text-sm hover:border-[#086644] transition-colors"
                      >
                        <span className="max-w-[250px] truncate text-[#1F2937]" title={link}>
                          {link}
                        </span>
                        <button
                          type="button"
                          onClick={() => setReportLinks(reportLinks.filter((_, i) => i !== index))}
                          className="text-[#6B7280] hover:text-[#DC2626] transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Input Area */}
                <Textarea
                  id="new-report-links"
                  placeholder="Nhập hoặc paste link (có thể nhiều link cùng lúc)..."
                  value={reportLinkInput}
                  onChange={(e) => setReportLinkInput(e.target.value)}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData('text');
                    const pastedLinks = pastedText
                      .split(/[\n,\s]+/)
                      .map(link => link.trim())
                      .filter(link => link.length > 0 && !reportLinks.includes(link));
                    if (pastedLinks.length > 0) {
                      setReportLinks([...reportLinks, ...pastedLinks]);
                      setReportLinkInput('');
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (reportLinkInput.trim()) {
                        const newLinks = reportLinkInput
                          .split(/[\n,\s]+/)
                          .map(link => link.trim())
                          .filter(link => link.length > 0 && !reportLinks.includes(link));
                        if (newLinks.length > 0) {
                          setReportLinks([...reportLinks, ...newLinks]);
                          setReportLinkInput('');
                        }
                      }
                    }
                  }}
                  className="rounded-xl border-0 bg-transparent min-h-[60px] resize-none focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="new-report-description">Mô tả chi tiết *</Label>
              <Textarea
                id="new-report-description"
                placeholder="Mô tả chi tiết về tình huống lừa đảo..."
                className="rounded-xl min-h-[100px]"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="new-report-files">
                Ảnh bằng chứng (hóa đơn, tin nhắn, ảnh chụp, v.v.) <span className="text-[#E57373]">*</span>
              </Label>
              <div className="border-2 border-dashed border-[#e5e7eb] rounded-xl p-4 sm:p-6 text-center hover:border-[#A8E6CF] transition-colors">
                <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-[#6b7280] mx-auto mb-2" />
                <p className="text-sm text-[#6b7280] mb-2">
                  Tải lên ảnh chụp màn hình, tin nhắn, giao dịch...
                </p>
                <p className="text-xs text-[#9ca3af] mb-3">
                  Hỗ trợ: JPG, PNG, GIF (tối đa 5MB mỗi ảnh)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    // Mock file upload
                    const newFile = `evidence_${Date.now()}.jpg`;
                    setAddReportFiles([...addReportFiles, newFile]);
                  }}
                >
                  Chọn file
                </Button>
              </div>
              <p className="text-xs text-[#6b7280]">
                * Bắt buộc phải có ít nhất 1 ảnh bằng chứng
              </p>

              {/* File List */}
              {addReportFiles.length > 0 && (
                <div className="space-y-2 mt-4">
                  <Label className="text-sm">Đã tải lên ({addReportFiles.length} ảnh)</Label>
                  <div className="space-y-2">
                    {addReportFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-[#f9fafb] rounded-lg border border-[#e5e7eb] group hover:border-[#086644] transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 p-2 bg-white rounded-lg">
                            <ImageIcon className="h-5 w-5 text-[#086644]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#1f2937] truncate">{file}</p>
                            <p className="text-xs text-[#6b7280]">Ảnh bằng chứng</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setAddReportFiles(addReportFiles.filter((_, i) => i !== index))}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4 text-[#dc2626]" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reporter Name */}
            <div className="space-y-2">
              <Label htmlFor="new-report-reporter-name">Tên người tố cáo *</Label>
              <Input
                id="new-report-reporter-name"
                placeholder="Nhập tên người tố cáo..."
                className="rounded-xl"
              />
            </div>

            {/* Reporter Contact */}
            <div className="space-y-2">
              <Label htmlFor="new-report-reporter-contact">Thông tin liên hệ *</Label>
              <Input
                id="new-report-reporter-contact"
                placeholder="Email hoặc số điện thoại"
                className="rounded-xl"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl"
                onClick={() => {
                  setAddReportDialogOpen(false);
                  setReportLinks([]);
                  setReportLinkInput('');
                  setAddReportFiles([]);
                }}
              >
                Hủy
              </Button>
              <Button 
                className="flex-1 rounded-xl bg-[#086644] text-white hover:bg-[#086644]/90"
                onClick={() => {
                  // Validate
                  if (reportLinks.length === 0) {
                    alert('Vui lòng nhập ít nhất 1 đường dẫn liên quan');
                    return;
                  }
                  if (addReportFiles.length === 0) {
                    alert('Vui lòng tải lên ít nhất 1 ảnh bằng chứng');
                    return;
                  }
                  console.log('Adding new report with links:', reportLinks, 'and files:', addReportFiles);
                  setAddReportDialogOpen(false);
                  setReportLinks([]);
                  setReportLinkInput('');
                  setAddReportFiles([]);
                }}
              >
                Thêm tố cáo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={addProductDialogOpen} onOpenChange={setAddProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1F2937]">Thêm sản phẩm mới</DialogTitle>
            <DialogDescription className="text-[#6B7280]">
              Thêm sản ph��m mới vào cửa hàng
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-product-name">Tên sản phẩm *</Label>
                <Input
                  id="new-product-name"
                  placeholder="VD: iPhone 15 Pro Max"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-product-business">Doanh nghiệp *</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Chọn doanh nghiệp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Công ty TNHH ABC Tech</SelectItem>
                    <SelectItem value="2">Cửa hàng XYZ</SelectItem>
                    <SelectItem value="3">Doanh nghiệp DEF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-product-category">Danh mục *</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Điện tử</SelectItem>
                    <SelectItem value="fashion">Thời trang</SelectItem>
                    <SelectItem value="food">Thực phẩm</SelectItem>
                    <SelectItem value="home">Gia dụng</SelectItem>
                    <SelectItem value="beauty">Làm đẹp</SelectItem>
                    <SelectItem value="sports">Thể thao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-product-price">Giá *</Label>
                <Input
                  id="new-product-price"
                  placeholder="VD: 29,990,000đ"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-product-stock">Số lượng kho *</Label>
                <Input
                  id="new-product-stock"
                  type="number"
                  placeholder="VD: 100"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-product-sold">Đã bán</Label>
                <Input
                  id="new-product-sold"
                  type="number"
                  placeholder="VD: 45"
                  defaultValue="0"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-product-image">URL hình ảnh</Label>
              <Input
                id="new-product-image"
                placeholder="https://example.com/product-image.jpg"
                className="rounded-xl"
              />
              <p className="text-xs text-[#6B7280]">Link hình ảnh sản phẩm (tùy chọn)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-product-description">Mô tả sản phẩm</Label>
              <Textarea
                id="new-product-description"
                placeholder="Mô tả chi tiết về sản phẩm..."
                className="rounded-xl min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-product-status">Trạng thái *</Label>
              <Select defaultValue="active">
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl"
                onClick={() => setAddProductDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button 
                className="flex-1 rounded-xl bg-[#086644] text-white hover:bg-[#086644]/90"
                onClick={() => {
                  console.log('Adding new product');
                  setAddProductDialogOpen(false);
                }}
              >
                Thêm sản phẩm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
