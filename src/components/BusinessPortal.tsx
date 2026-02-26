import { 
  Building2, 
  TrendingUp, 
  FileText, 
  BarChart3, 
  Star, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Store, 
  Package, 
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  X,
  ExternalLink,
  Pencil
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Switch } from './ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BusinessPortalProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function BusinessPortal({ onNavigate, onLogout }: BusinessPortalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Dialog states
  const [newPostDialogOpen, setNewPostDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  
  // Product dialog states
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const [editProductDialogOpen, setEditProductDialogOpen] = useState(false);
  const [deleteProductDialogOpen, setDeleteProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Form states
  const [hasProduct, setHasProduct] = useState(false);
  const [postProducts, setPostProducts] = useState<any[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    price: '',
    image: '',
    link: ''
  });
  
  // Business products - stored separately from post products
  const [businessProducts, setBusinessProducts] = useState<any[]>([
    {
      id: 1,
      name: 'Laptop Dell XPS 15',
      price: '25,990,000đ',
      image: 'https://images.unsplash.com/photo-1737868131581-6379cdee4ec3?w=400',
      link: 'https://example.com/laptop',
      category: 'Điện tử',
      stock: 15,
      sales: 28,
      status: 'active',
      description: 'Laptop Dell XPS 15 với cấu hình mạnh mẽ, màn hình 15.6 inch 4K'
    },
    {
      id: 2,
      name: 'iPhone 15 Pro Max',
      price: '32,000,000đ',
      image: 'https://images.unsplash.com/photo-1675953935267-e039f13ddd79?w=400',
      link: 'https://example.com/iphone',
      category: 'Điện tử',
      stock: 20,
      sales: 45,
      status: 'active',
      description: 'iPhone 15 Pro Max 256GB chính hãng VN/A, chip A17 Pro'
    },
    {
      id: 3,
      name: 'Camera Canon EOS R6',
      price: '45,000,000đ',
      image: 'https://images.unsplash.com/photo-1579535984712-92fffbbaa266?w=400',
      link: 'https://example.com/camera',
      category: 'Điện tử',
      stock: 8,
      sales: 12,
      status: 'active',
      description: 'Máy ảnh Canon EOS R6 full-frame, quay video 4K 60fps'
    }
  ]);

  const stats = [
    { label: 'Tổng bài viết', value: '24', icon: FileText, color: 'bg-[#DBEAFE]', iconColor: 'text-[#3B82F6]', growth: '+12%' },
    { label: 'Lượt xem', value: '12,456', icon: Eye, color: 'bg-[#D1FAE5]', iconColor: 'text-[#10B981]', growth: '+23%' },
    { label: 'Đánh giá', value: '4.8⭐', icon: Star, color: 'bg-[#FEF3C7]', iconColor: 'text-[#F59E0B]', growth: '+0.2' },
    { label: 'Sản phẩm', value: '45', icon: Package, color: 'bg-[#E0E7FF]', iconColor: 'text-[#6366F1]', growth: '+8' },
  ];

  const newsPosts = [
    { 
      id: 1, 
      title: 'Khuyến mãi cuối năm 2024', 
      date: '15/10/2025', 
      views: 1234, 
      status: 'published',
      content: 'Giảm giá lên đến 50% cho tất cả sản phẩm công nghệ trong dịp cuối năm! Đừng bỏ lỡ cơ hội sở hữu những sản phẩm chất lượng cao với mức giá ưu đãi nhất trong năm.\n\nChương trình áp dụng từ 01/12/2025 đến 31/12/2025.',
      hasProduct: true,
      products: [
        {
          id: 1,
          name: 'Laptop Dell XPS 15',
          price: '25,990,000đ',
          image: 'https://images.unsplash.com/photo-1737868131581-6379cdee4ec3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYwNDY5MTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
          link: 'https://example.com/laptop'
        },
        {
          id: 2,
          name: 'iPhone 15 Pro Max',
          price: '32,000,000đ',
          image: 'https://images.unsplash.com/photo-1675953935267-e039f13ddd79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwcGhvbmV8ZW58MXx8fHwxNzYwNDI1NzY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
          link: 'https://example.com/iphone'
        },
        {
          id: 3,
          name: 'Camera Canon EOS R6',
          price: '45,000,000đ',
          image: 'https://images.unsplash.com/photo-1579535984712-92fffbbaa266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NjA0MDk3MzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
          link: 'https://example.com/camera'
        }
      ]
    },
    { 
      id: 2, 
      title: 'Ra mắt sản phẩm mới', 
      date: '14/10/2025', 
      views: 856, 
      status: 'published',
      content: 'Chúng tôi vui mừng giới thiệu dòng sản phẩm mới nhất với công nghệ tiên tiến. Sản phẩm đã được nghiên cứu và phát triển trong suốt 2 năm qua.',
      hasProduct: false,
      products: []
    },
    { 
      id: 3, 
      title: 'Thông báo nghỉ lễ', 
      date: '13/10/2025', 
      views: 432, 
      status: 'draft',
      content: 'Công ty sẽ nghỉ lễ từ ngày 30/12 đến hết 02/01. Mọi đơn hàng sẽ được xử lý sau kỳ nghỉ lễ.',
      hasProduct: false,
      products: []
    },
  ];

  const sidebarItems = [
    { id: 'overview', icon: TrendingUp, label: 'Tổng quan' },
    { id: 'news', icon: FileText, label: 'Tin tức' },
    { id: 'products', icon: Package, label: 'Sản phẩm' },
    { id: 'analytics', icon: BarChart3, label: 'Thống kê' },
    { id: 'settings', icon: Settings, label: 'Cài đặt' },
  ];

  const handleViewPost = (post: any) => {
    setSelectedPost(post);
    setViewDialogOpen(true);
  };

  const handleEditPost = (post: any) => {
    setSelectedPost(post);
    setHasProduct(post.hasProduct || false);
    setPostProducts(post.products || []);
    // Pre-select products that are in the post
    if (post.products && post.products.length > 0) {
      const productIds = post.products
        .map((p: any) => {
          const found = businessProducts.find(bp => bp.name === p.name);
          return found ? found.id : null;
        })
        .filter((id: number | null) => id !== null);
      setSelectedProductIds(productIds);
    } else {
      setSelectedProductIds([]);
    }
    setEditDialogOpen(true);
  };

  const handleDeletePost = (post: any) => {
    setSelectedPost(post);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting post:', selectedPost);
    setDeleteDialogOpen(false);
    setSelectedPost(null);
  };

  const handleAddProduct = () => {
    if (currentProduct.name && currentProduct.price && currentProduct.link) {
      setPostProducts([...postProducts, { ...currentProduct, id: Date.now() }]);
      setCurrentProduct({ name: '', price: '', image: '', link: '' });
    }
  };

  const handleRemoveProduct = (productId: number) => {
    setPostProducts(postProducts.filter(p => p.id !== productId));
  };

  const resetProductForm = () => {
    setPostProducts([]);
    setSelectedProductIds([]);
    setCurrentProduct({ name: '', price: '', image: '', link: '' });
    setHasProduct(false);
  };

  const handleToggleProduct = (productId: number) => {
    setSelectedProductIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
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
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            onClick={() => onNavigate?.('home')}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#A8E6CF] to-[#086644] flex-shrink-0">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-[#086644] whitespace-nowrap">ABC Tech</span>
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
                <h1 className="text-xl sm:text-2xl text-[#086644]">Cổng Doanh Nghiệp</h1>
                <p className="text-xs sm:text-sm text-[#6B7280] hidden sm:block">Quản lý tin tức, sản phẩm và thông tin</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-[#A8E6CF] text-[#086644] px-3 sm:px-4 py-1 text-xs sm:text-sm">Doanh nghiệp</Badge>
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
                    <CardTitle className="text-[#1F2937]">Lượt xem theo thời gian</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-[#F9FAFB] rounded-xl">
                      <div className="text-center">
                        <BarChart3 className="h-16 w-16 text-[#A8E6CF] mx-auto mb-2" />
                        <p className="text-sm text-[#6B7280]">Biểu đồ thống kê</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-[#1F2937]">Sản phẩm bán chạy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-[#F9FAFB] rounded-xl">
                      <div className="text-center">
                        <TrendingUp className="h-16 w-16 text-[#086644] mx-auto mb-2" />
                        <p className="text-sm text-[#6B7280]">Top sản phẩm</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between border-b">
                  <CardTitle className="text-[#1F2937]">Quản lý tin tức</CardTitle>
                  <Button 
                    onClick={() => {
                      resetProductForm();
                      setNewPostDialogOpen(true);
                    }}
                    className="bg-[#086644] text-white hover:bg-[#086644]/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Đăng tin tức mới
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="overflow-x-auto -mx-6">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-[#6B7280] pl-6">Tiêu đề</TableHead>
                              <TableHead className="text-[#6B7280]">Ngày đăng</TableHead>
                              <TableHead className="text-[#6B7280]">Lượt xem</TableHead>
                              <TableHead className="text-[#6B7280]">Trạng thái</TableHead>
                              <TableHead className="text-[#6B7280] pr-6">Thao tác</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {newsPosts.map((post) => (
                              <TableRow key={post.id}>
                                <TableCell className="pl-6">
                                  <div>
                                    <p className="text-[#1F2937]">{post.title}</p>
                                    {post.hasProduct && post.products && post.products.length > 0 && (
                                      <div className="flex items-center gap-1 mt-1">
                                        <Package className="h-3 w-3 text-[#086644]" />
                                        <span className="text-xs text-[#086644]">{post.products.length} sản phẩm đính kèm</span>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-[#6B7280]">{post.date}</TableCell>
                                <TableCell className="text-[#6B7280]">{post.views}</TableCell>
                                <TableCell>
                                  <Badge className={post.status === 'published' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEF3C7] text-[#92400E]'}>
                                    {post.status === 'published' ? 'Đã đăng' : 'Nháp'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="pr-6">
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="hover:bg-[#DBEAFE]"
                                      onClick={() => handleViewPost(post)}
                                    >
                                      <Eye className="h-4 w-4 text-[#3B82F6]" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="hover:bg-[#DBEAFE]"
                                      onClick={() => handleEditPost(post)}
                                    >
                                      <Edit className="h-4 w-4 text-[#3B82F6]" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="hover:bg-[#FEE2E2]"
                                      onClick={() => handleDeletePost(post)}
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

          {activeTab === 'products' && (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between border-b">
                  <CardTitle className="text-[#1F2937]">Quản lý sản phẩm</CardTitle>
                  <Button
                    onClick={() => setAddProductDialogOpen(true)}
                    className="bg-[#086644] text-white hover:bg-[#086644]/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm sản phẩm
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="overflow-x-auto -mx-6">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-[#6B7280] pl-6">Sản phẩm</TableHead>
                              <TableHead className="text-[#6B7280]">Danh mục</TableHead>
                              <TableHead className="text-[#6B7280]">Giá</TableHead>
                              <TableHead className="text-[#6B7280]">Kho</TableHead>
                              <TableHead className="text-[#6B7280]">Đã bán</TableHead>
                              <TableHead className="text-[#6B7280]">Trạng thái</TableHead>
                              <TableHead className="text-[#6B7280] pr-6">Thao tác</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {businessProducts.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell className="pl-6">
                                  <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-[#F4F6F8] flex-shrink-0">
                                      {product.image ? (
                                        <ImageWithFallback 
                                          src={product.image} 
                                          alt={product.name}
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                          <Package className="h-5 w-5 text-[#9CA3AF]" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-[#1F2937] truncate">{product.name}</p>
                                      <p className="text-xs text-[#6B7280] truncate">{product.description}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-[#E0E7FF] text-[#4338CA] border-0">{product.category}</Badge>
                                </TableCell>
                                <TableCell className="text-[#6B7280]">{product.price}</TableCell>
                                <TableCell className="text-[#6B7280]">{product.stock}</TableCell>
                                <TableCell className="text-[#6B7280]">{product.sales}</TableCell>
                                <TableCell>
                                  <Badge className={product.status === 'active' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#E5E7EB] text-[#6B7280]'}>
                                    {product.status === 'active' ? 'Hoạt động' : 'Tạm ngừng'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="pr-6">
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedProduct(product);
                                        setEditProductDialogOpen(true);
                                      }}
                                      className="hover:bg-[#DBEAFE]"
                                    >
                                      <Pencil className="h-4 w-4 text-[#3B82F6]" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedProduct(product);
                                        setDeleteProductDialogOpen(true);
                                      }}
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

          {(activeTab === 'analytics' || activeTab === 'settings') && (
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

      {/* New Post Dialog */}
      <Dialog open={newPostDialogOpen} onOpenChange={(open) => {
        setNewPostDialogOpen(open);
        if (!open) resetProductForm();
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1F2937]">Đăng tin tức mới</DialogTitle>
            <DialogDescription>Tạo bài viết tin tức mới với nội dung và sản phẩm đính kèm</DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="news-title">Tiêu đề *</Label>
              <Input 
                id="news-title" 
                placeholder="Nhập tiêu đề tin tức..."
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="news-content">Nội dung *</Label>
              <Textarea 
                id="news-content"
                placeholder="Nhập nội dung tin tức..."
                className="rounded-xl min-h-[120px]"
              />
            </div>

            {/* Product Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label>Đính kèm sản phẩm</Label>
                <Switch checked={hasProduct} onCheckedChange={setHasProduct} />
              </div>

              {hasProduct && (
                <div className="space-y-4 border border-[#E5E7EB] rounded-xl p-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Chọn sản phẩm từ danh sách</Label>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {businessProducts.map((product) => (
                        <label
                          key={product.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedProductIds.includes(product.id)
                              ? 'bg-[#E8F5E9] border-[#086644]'
                              : 'bg-white border-[#E5E7EB] hover:border-[#A8E6CF]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedProductIds.includes(product.id)}
                            onChange={() => handleToggleProduct(product.id)}
                            className="h-4 w-4 rounded border-[#6B7280] text-[#086644] focus:ring-[#086644]"
                          />
                          {product.image && (
                            <ImageWithFallback 
                              src={product.image} 
                              alt={product.name}
                              className="h-12 w-12 rounded object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#1F2937] truncate">{product.name}</p>
                            <p className="text-xs text-[#6B7280]">{product.price}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    {selectedProductIds.length > 0 && (
                      <p className="text-xs text-[#086644]">
                        Đã chọn {selectedProductIds.length} sản phẩm
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button"
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => {
                  setNewPostDialogOpen(false);
                  resetProductForm();
                }}
              >
                Hủy
              </Button>
              <Button 
                type="submit"
                className="flex-1 rounded-xl bg-[#086644] hover:bg-[#086644]/90 text-white"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Creating post');
                  setNewPostDialogOpen(false);
                  resetProductForm();
                }}
              >
                Đăng tin
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Post Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1F2937]">{selectedPost?.title}</DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-3 mt-2">
                <Badge className={selectedPost?.status === 'published' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEF3C7] text-[#92400E]'}>
                  {selectedPost?.status === 'published' ? 'Đã đăng' : 'Nháp'}
                </Badge>
                <span className="text-sm text-[#6B7280]">{selectedPost?.date}</span>
                <span className="text-sm text-[#6B7280]">• {selectedPost?.views} lượt xem</span>
              </div>
            </DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Nội dung</Label>
                <div className="p-4 bg-[#F9FAFB] rounded-xl text-sm text-[#1F2937] whitespace-pre-wrap">
                  {selectedPost.content}
                </div>
              </div>

              {selectedPost.hasProduct && selectedPost.products && selectedPost.products.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm">Sản phẩm đính kèm ({selectedPost.products.length})</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedPost.products.map((product: any) => (
                      <div key={product.id} className="border border-[#E5E7EB] rounded-xl p-3 hover:shadow-sm transition-shadow">
                        <div className="flex gap-3">
                          {product.image && (
                            <ImageWithFallback 
                              src={product.image} 
                              alt={product.name}
                              className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#1F2937] truncate">{product.name}</p>
                            <p className="text-xs text-[#086644] mb-2">{product.price}</p>
                            <a 
                              href={product.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-[#3B82F6] hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Xem sản phẩm
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setViewDialogOpen(false)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) resetProductForm();
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1F2937]">Chỉnh sửa tin tức</DialogTitle>
            <DialogDescription>Cập nhật thông tin bài viết tin tức</DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Tiêu đề *</Label>
                <Input 
                  id="edit-title" 
                  defaultValue={selectedPost.title}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Nội dung *</Label>
                <Textarea 
                  id="edit-content"
                  defaultValue={selectedPost.content}
                  className="rounded-xl min-h-[120px]"
                />
              </div>

              {/* Product Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label>Đính kèm sản phẩm</Label>
                  <Switch checked={hasProduct} onCheckedChange={setHasProduct} />
                </div>

                {hasProduct && (
                  <div className="space-y-4 border border-[#E5E7EB] rounded-xl p-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Chọn sản phẩm từ danh sách</Label>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {businessProducts.map((product) => (
                          <label
                            key={product.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedProductIds.includes(product.id)
                                ? 'bg-[#E8F5E9] border-[#086644]'
                                : 'bg-white border-[#E5E7EB] hover:border-[#A8E6CF]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedProductIds.includes(product.id)}
                              onChange={() => handleToggleProduct(product.id)}
                              className="h-4 w-4 rounded border-[#6B7280] text-[#086644] focus:ring-[#086644]"
                            />
                            {product.image && (
                              <ImageWithFallback 
                                src={product.image} 
                                alt={product.name}
                                className="h-12 w-12 rounded object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-[#1F2937] truncate">{product.name}</p>
                              <p className="text-xs text-[#6B7280]">{product.price}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                      {selectedProductIds.length > 0 && (
                        <p className="text-xs text-[#086644]">
                          Đã chọn {selectedProductIds.length} sản phẩm
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => {
                    setEditDialogOpen(false);
                    resetProductForm();
                  }}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 rounded-xl bg-[#086644] hover:bg-[#086644]/90 text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Updating post');
                    setEditDialogOpen(false);
                    resetProductForm();
                  }}
                >
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Post Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bài viết</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài viết "{selectedPost?.title}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="rounded-xl bg-[#DC2626] hover:bg-[#DC2626]/90 text-white"
            >
              Xóa bài viết
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Add Product Dialog */}
      <Dialog open={addProductDialogOpen} onOpenChange={setAddProductDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm sản phẩm mới</DialogTitle>
            <DialogDescription>Thêm sản phẩm vào danh mục sản phẩm của doanh nghiệp</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Tên sản phẩm *</Label>
                <Input id="product-name" placeholder="VD: iPhone 15 Pro Max" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-category">Danh mục *</Label>
                <Input id="product-category" placeholder="VD: Điện tử" className="rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-price">Giá *</Label>
                <Input id="product-price" placeholder="VD: 32,000,000đ" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-stock">Số lượng kho *</Label>
                <Input id="product-stock" type="number" placeholder="VD: 20" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-image">URL hình ảnh</Label>
              <Input id="product-image" placeholder="https://..." className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-link">Link sản phẩm</Label>
              <Input id="product-link" placeholder="https://..." className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-description">Mô tả sản phẩm</Label>
              <Textarea id="product-description" placeholder="Mô tả chi tiết..." className="rounded-xl min-h-[80px]" />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setAddProductDialogOpen(false)}>
                Hủy
              </Button>
              <Button className="flex-1 rounded-xl bg-[#086644] hover:bg-[#086644]/90 text-white" onClick={() => {
                console.log('Adding product');
                setAddProductDialogOpen(false);
              }}>
                Thêm sản phẩm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editProductDialogOpen} onOpenChange={setEditProductDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
            <DialogDescription>Cập nhật thông tin sản phẩm</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-product-name">Tên sản phẩm *</Label>
                  <Input 
                    id="edit-product-name" 
                    defaultValue={selectedProduct.name}
                    className="rounded-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-product-category">Danh mục *</Label>
                  <Input 
                    id="edit-product-category" 
                    defaultValue={selectedProduct.category}
                    className="rounded-xl" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-product-price">Giá *</Label>
                  <Input 
                    id="edit-product-price" 
                    defaultValue={selectedProduct.price}
                    className="rounded-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-product-stock">Số lượng kho *</Label>
                  <Input 
                    id="edit-product-stock" 
                    type="number" 
                    defaultValue={selectedProduct.stock}
                    className="rounded-xl" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-product-image">URL hình ảnh</Label>
                <Input 
                  id="edit-product-image" 
                  defaultValue={selectedProduct.image}
                  className="rounded-xl" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-product-link">Link sản phẩm</Label>
                <Input 
                  id="edit-product-link" 
                  defaultValue={selectedProduct.link}
                  className="rounded-xl" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-product-description">Mô tả sản phẩm</Label>
                <Textarea 
                  id="edit-product-description" 
                  defaultValue={selectedProduct.description}
                  className="rounded-xl min-h-[80px]" 
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setEditProductDialogOpen(false)}>
                  Hủy
                </Button>
                <Button className="flex-1 rounded-xl bg-[#086644] hover:bg-[#086644]/90 text-white" onClick={() => {
                  console.log('Updating product');
                  setEditProductDialogOpen(false);
                }}>
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <AlertDialog open={deleteProductDialogOpen} onOpenChange={setDeleteProductDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm "{selectedProduct?.name}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                console.log('Deleting product:', selectedProduct);
                setDeleteProductDialogOpen(false);
                setSelectedProduct(null);
              }}
              className="rounded-xl bg-[#DC2626] hover:bg-[#DC2626]/90 text-white"
            >
              Xóa sản phẩm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
