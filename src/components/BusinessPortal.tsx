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
  Pencil,
  Loader2,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import * as newsService from '../services/newsService';
import * as shopService from '../services/shopService';
import * as businessService from '../services/businessService';
import { toast } from 'sonner@2.0.3';

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
  const [selectedPost, setSelectedPost] = useState<newsService.NewsPost | null>(null);

  // Product dialog states
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const [editProductDialogOpen, setEditProductDialogOpen] = useState(false);
  const [deleteProductDialogOpen, setDeleteProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Business profile (for sidebar name/branding)
  const [myBusiness, setMyBusiness] = useState<businessService.MyBusiness | null>(null);

  useEffect(() => {
    businessService
      .getMyBusiness()
      .then(setMyBusiness)
      .catch(() => {});
  }, []);

  // News post form state
  const [newsPosts, setNewsPosts] = useState<newsService.NewsPost[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [postForm, setPostForm] = useState({ title: '', content: '', imageUrl: '' });
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [postFormLoading, setPostFormLoading] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const toggleProductId = (id: number) => {
    setSelectedProductIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const fetchMyNews = () => {
    setNewsLoading(true);
    newsService
      .getMyNews({ page: 1, limit: 20 })
      .then((result) => setNewsPosts(result.data))
      .catch((error) => toast.error(error instanceof Error ? error.message : 'Không thể tải tin tức'))
      .finally(() => setNewsLoading(false));
  };

  useEffect(() => {
    fetchMyNews();
  }, []);
  
  // Shop (cửa hàng) state
  const [myShop, setMyShop] = useState<shopService.Shop | null>(null);
  const [shopLoading, setShopLoading] = useState(true);
  const [shopForm, setShopForm] = useState({
    name: '', category: '', shortDescription: '', description: '',
    phone: '', email: '', website: '', province: '', district: '', address: '',
    logoUrl: '', coverUrl: '',
  });
  const [shopFormLoading, setShopFormLoading] = useState(false);
  const [shopLogoFile, setShopLogoFile] = useState<File | null>(null);
  const [shopCoverFile, setShopCoverFile] = useState<File | null>(null);

  const fetchMyShop = () => {
    setShopLoading(true);
    shopService
      .getMyShop()
      .then((shop) => {
        setMyShop(shop);
        if (shop) {
          setShopForm({
            name: shop.name,
            category: shop.category || '',
            shortDescription: shop.shortDescription || '',
            description: shop.description || '',
            phone: shop.phone || '',
            email: shop.email || '',
            website: shop.website || '',
            province: shop.province || '',
            district: shop.district || '',
            address: shop.address || '',
            logoUrl: shop.logoUrl || '',
            coverUrl: shop.coverUrl || '',
          });
        }
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : 'Không thể tải thông tin cửa hàng'))
      .finally(() => setShopLoading(false));
  };

  useEffect(() => {
    fetchMyShop();
  }, []);

  const handleSaveShop = async () => {
    if (!shopForm.name.trim()) {
      toast.error('Tên cửa hàng không được để trống');
      return;
    }
    setShopFormLoading(true);
    try {
      let logoUrl = shopForm.logoUrl || undefined;
      let coverUrl = shopForm.coverUrl || undefined;
      if (shopLogoFile) logoUrl = await shopService.uploadShopImage(shopLogoFile);
      if (shopCoverFile) coverUrl = await shopService.uploadShopImage(shopCoverFile);

      const payload = { ...shopForm, logoUrl, coverUrl };

      if (myShop) {
        const updated = await shopService.updateShop(myShop.id, payload);
        setMyShop(updated);
        toast.success('Đã cập nhật cửa hàng');
      } else {
        const created = await shopService.createShop(payload);
        setMyShop(created);
        toast.success('Đã tạo cửa hàng, vui lòng chờ admin duyệt');
      }
      setShopLogoFile(null);
      setShopCoverFile(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể lưu cửa hàng');
    } finally {
      setShopFormLoading(false);
    }
  };

  // Products state
  const [businessProducts, setBusinessProducts] = useState<shopService.Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productForm, setProductForm] = useState({ name: '', category: '', price: '', stock: '', buyUrl: '', imageUrl: '', description: '' });
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productFormLoading, setProductFormLoading] = useState(false);

  const fetchMyProducts = () => {
    setProductsLoading(true);
    shopService
      .getMyProducts({ limit: 50 })
      .then((result) => setBusinessProducts(result.data))
      .catch(() => {})
      .finally(() => setProductsLoading(false));
  };

  useEffect(() => {
    if (myShop?.status === 'APPROVED') fetchMyProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myShop?.status]);

  const emptyProductForm = { name: '', category: '', price: '', stock: '', buyUrl: '', imageUrl: '', description: '' };

  const resetProductForm = () => {
    setProductForm(emptyProductForm);
    setProductImageFile(null);
  };

  const openAddProduct = () => {
    resetProductForm();
    setAddProductDialogOpen(true);
  };

  const openEditProduct = (product: shopService.Product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      category: product.category || '',
      price: String(product.price),
      stock: String(product.stock),
      buyUrl: product.buyUrl || '',
      imageUrl: product.imageUrl || '',
      description: product.description || '',
    });
    setProductImageFile(null);
    setEditProductDialogOpen(true);
  };

  const handleCreateProduct = async () => {
    if (!productForm.name.trim() || !productForm.price) {
      toast.error('Vui lòng nhập tên và giá sản phẩm');
      return;
    }
    setProductFormLoading(true);
    try {
      let imageUrl = productForm.imageUrl || undefined;
      if (productImageFile) imageUrl = await shopService.uploadShopImage(productImageFile);
      await shopService.createProduct({
        name: productForm.name.trim(),
        category: productForm.category.trim() || undefined,
        price: Number(productForm.price),
        stock: productForm.stock ? Number(productForm.stock) : 0,
        buyUrl: productForm.buyUrl.trim() || undefined,
        imageUrl,
        description: productForm.description.trim() || undefined,
      });
      toast.success('Đã thêm sản phẩm, chờ admin duyệt');
      setAddProductDialogOpen(false);
      fetchMyProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể thêm sản phẩm');
    } finally {
      setProductFormLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;
    setProductFormLoading(true);
    try {
      let imageUrl = productForm.imageUrl || undefined;
      if (productImageFile) imageUrl = await shopService.uploadShopImage(productImageFile);
      await shopService.updateProduct(selectedProduct.id, {
        name: productForm.name.trim(),
        category: productForm.category.trim() || undefined,
        price: Number(productForm.price),
        stock: productForm.stock ? Number(productForm.stock) : 0,
        buyUrl: productForm.buyUrl.trim() || undefined,
        imageUrl,
        description: productForm.description.trim() || undefined,
      });
      toast.success('Đã cập nhật sản phẩm');
      setEditProductDialogOpen(false);
      fetchMyProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể cập nhật sản phẩm');
    } finally {
      setProductFormLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    try {
      await shopService.deleteProduct(selectedProduct.id);
      toast.success('Đã xóa sản phẩm');
      fetchMyProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể xóa sản phẩm');
    } finally {
      setDeleteProductDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const PRODUCT_STATUS_META: Record<string, { label: string; className: string }> = {
    PENDING: { label: 'Chờ duyệt', className: 'bg-amber-100 text-amber-800' },
    APPROVED: { label: 'Đã duyệt', className: 'bg-[#D1FAE5] text-[#065F46]' },
    REJECTED: { label: 'Từ chối', className: 'bg-[#FEE2E2] text-[#DC2626]' },
  };

  const stats = [
    { label: 'Tổng bài viết', value: '24', icon: FileText, color: 'bg-[#DBEAFE]', iconColor: 'text-[#3B82F6]', growth: '+12%' },
    { label: 'Lượt xem', value: '12,456', icon: Eye, color: 'bg-[#D1FAE5]', iconColor: 'text-[#10B981]', growth: '+23%' },
    { label: 'Đánh giá', value: '4.8⭐', icon: Star, color: 'bg-[#FEF3C7]', iconColor: 'text-[#F59E0B]', growth: '+0.2' },
    { label: 'Sản phẩm', value: '45', icon: Package, color: 'bg-[#E0E7FF]', iconColor: 'text-[#6366F1]', growth: '+8' },
  ];

  const sidebarItems = [
    { id: 'overview', icon: TrendingUp, label: 'Tổng quan' },
    { id: 'news', icon: FileText, label: 'Tin tức' },
    { id: 'shop', icon: Store, label: 'Cửa hàng' },
    { id: 'products', icon: Package, label: 'Sản phẩm' },
    { id: 'analytics', icon: BarChart3, label: 'Thống kê' },
    { id: 'settings', icon: Settings, label: 'Cài đặt' },
  ];

  const handleViewPost = (post: newsService.NewsPost) => {
    setSelectedPost(post);
    setViewDialogOpen(true);
  };

  const handleEditPost = (post: newsService.NewsPost) => {
    setSelectedPost(post);
    setPostForm({ title: post.title || '', content: post.content, imageUrl: post.imageUrl || '' });
    setPostImageFile(null);
    setSelectedProductIds((post.products || []).map((p) => p.id));
    setEditDialogOpen(true);
  };

  const handleDeletePost = (post: newsService.NewsPost) => {
    setSelectedPost(post);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPost) return;
    try {
      await newsService.deleteNews(selectedPost.id);
      toast.success('Đã xóa bài viết');
      fetchMyNews();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể xóa bài viết');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedPost(null);
    }
  };

  const resetNewsPostForm = () => {
    setPostForm({ title: '', content: '', imageUrl: '' });
    setPostImageFile(null);
    setSelectedProductIds([]);
  };

  const handleCreatePost = async () => {
    if (!postForm.content.trim()) {
      toast.error('Nội dung không được để trống');
      return;
    }
    setPostFormLoading(true);
    try {
      let imageUrl = postForm.imageUrl || undefined;
      if (postImageFile) imageUrl = await newsService.uploadNewsImage(postImageFile);
      await newsService.createNews({
        title: postForm.title.trim() || undefined,
        content: postForm.content.trim(),
        imageUrl,
        productIds: selectedProductIds,
      });
      toast.success('Đã đăng tin tức');
      setNewPostDialogOpen(false);
      resetNewsPostForm();
      fetchMyNews();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể đăng tin tức');
    } finally {
      setPostFormLoading(false);
    }
  };

  const handleUpdatePost = async () => {
    if (!selectedPost || !postForm.content.trim()) {
      toast.error('Nội dung không được để trống');
      return;
    }
    setPostFormLoading(true);
    try {
      let imageUrl = postForm.imageUrl || undefined;
      if (postImageFile) imageUrl = await newsService.uploadNewsImage(postImageFile);
      await newsService.updateNews(selectedPost.id, {
        title: postForm.title.trim() || undefined,
        content: postForm.content.trim(),
        imageUrl,
        productIds: selectedProductIds,
      });
      toast.success('Đã cập nhật tin tức');
      setEditDialogOpen(false);
      resetNewsPostForm();
      fetchMyNews();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể cập nhật tin tức');
    } finally {
      setPostFormLoading(false);
    }
  };

  const approvedProductsForPicker = businessProducts.filter((p) => p.status === 'APPROVED');

  const renderProductPicker = () => (
    <div className="space-y-2">
      <Label>Gắn sản phẩm vào bài viết (không bắt buộc)</Label>
      {approvedProductsForPicker.length === 0 ? (
        <p className="text-sm text-[#6B7280]">Bạn chưa có sản phẩm nào đã được duyệt để gắn vào bài viết.</p>
      ) : (
        <div className="max-h-[300px] overflow-y-auto rounded-xl border">
          {approvedProductsForPicker.map((product, index) => {
            const checked = selectedProductIds.includes(product.id);
            return (
              <label
                key={product.id}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-[#F4F6F8] ${index !== approvedProductsForPicker.length - 1 ? 'border-b' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleProductId(product.id)}
                  className="h-4 w-4 rounded border-[#E5E7EB] text-[#086644] focus:ring-[#086644]"
                />
                <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden bg-[#F9FAFB] border">
                  {product.imageUrl && (
                    <ImageWithFallback src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1F2937] truncate">{product.name}</p>
                  <p className="text-xs text-[#086644]">{product.price.toLocaleString('vi-VN')}đ</p>
                </div>
              </label>
            );
          })}
        </div>
      )}
      {selectedProductIds.length > 0 && (
        <p className="text-xs text-[#6B7280]">Đã chọn {selectedProductIds.length} sản phẩm</p>
      )}
    </div>
  );

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
              <span className="text-[#086644] whitespace-nowrap truncate" style={{ maxWidth: '140px' }}>{myBusiness?.name || 'Doanh nghiệp'}</span>
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
                      resetNewsPostForm();
                      setNewPostDialogOpen(true);
                    }}
                    className="bg-[#086644] text-white hover:bg-[#086644]/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Đăng tin tức mới
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  {newsLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-[#086644]" />
                    </div>
                  ) : newsPosts.length === 0 ? (
                    <div className="py-12 text-center text-[#6B7280]">Bạn chưa đăng tin tức nào.</div>
                  ) : (
                  <div className="overflow-x-auto -mx-6">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-[#6B7280] pl-6">Nội dung</TableHead>
                              <TableHead className="text-[#6B7280]">Ngày đăng</TableHead>
                              <TableHead className="text-[#6B7280]">Tương tác</TableHead>
                              <TableHead className="text-[#6B7280] pr-6">Thao tác</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {newsPosts.map((post) => (
                              <TableRow key={post.id}>
                                <TableCell className="pl-6" style={{ maxWidth: '320px' }}>
                                  {post.title && <p className="text-[#1F2937] truncate">{post.title}</p>}
                                  <p className="text-sm text-[#6B7280] truncate">{post.content}</p>
                                </TableCell>
                                <TableCell className="text-[#6B7280]">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                <TableCell className="text-[#6B7280] text-sm">
                                  {post.likeCount} thích · {post.commentCount} bình luận
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
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'shop' && (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between border-b">
                  <div>
                    <CardTitle className="text-[#1F2937]">Cửa hàng của bạn</CardTitle>
                    <p className="mt-1 text-sm text-[#6B7280]">Hồ sơ cửa hàng cần được admin duyệt trước khi hiển thị công khai.</p>
                  </div>
                  {myShop && (
                    <Badge
                      className={
                        myShop.status === 'APPROVED'
                          ? 'bg-[#D1FAE5] text-[#065F46]'
                          : myShop.status === 'REJECTED'
                            ? 'bg-[#FEE2E2] text-[#DC2626]'
                            : 'bg-amber-100 text-amber-800'
                      }
                    >
                      {myShop.status === 'APPROVED' ? 'Đã duyệt' : myShop.status === 'REJECTED' ? 'Bị từ chối' : 'Chờ duyệt'}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  {shopLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-[#086644]" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myShop?.status === 'REJECTED' && myShop.rejectionReason && (
                        <div className="rounded-xl border bg-[#FEE2E2] p-4 text-sm text-[#DC2626]">
                          <p className="font-medium">Lý do bị từ chối:</p>
                          <p>{myShop.rejectionReason}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tên cửa hàng *</Label>
                          <Input value={shopForm.name} onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Danh mục</Label>
                          <Input value={shopForm.category} onChange={(e) => setShopForm({ ...shopForm, category: e.target.value })} placeholder="VD: Điện tử" className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Số điện thoại</Label>
                          <Input value={shopForm.phone} onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input value={shopForm.email} onChange={(e) => setShopForm({ ...shopForm, email: e.target.value })} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Website</Label>
                          <Input value={shopForm.website} onChange={(e) => setShopForm({ ...shopForm, website: e.target.value })} placeholder="https://..." className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Tỉnh / Thành phố</Label>
                          <Input value={shopForm.province} onChange={(e) => setShopForm({ ...shopForm, province: e.target.value })} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Quận / Huyện</Label>
                          <Input value={shopForm.district} onChange={(e) => setShopForm({ ...shopForm, district: e.target.value })} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Địa chỉ</Label>
                          <Input value={shopForm.address} onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })} className="rounded-xl" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Mô tả ngắn</Label>
                        <Input value={shopForm.shortDescription} onChange={(e) => setShopForm({ ...shopForm, shortDescription: e.target.value })} placeholder="Hiển thị ở danh sách cửa hàng" className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Mô tả chi tiết</Label>
                        <Textarea value={shopForm.description} onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })} className="rounded-xl min-h-[100px]" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Logo</Label>
                          {shopLogoFile || shopForm.logoUrl ? (
                            <div className="relative w-fit">
                              <img src={shopLogoFile ? URL.createObjectURL(shopLogoFile) : shopForm.logoUrl} alt="logo" className="h-20 w-20 rounded-xl object-cover" />
                              <button type="button" onClick={() => { setShopLogoFile(null); setShopForm({ ...shopForm, logoUrl: '' }); }} className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed p-3 text-sm text-[#6B7280] hover:bg-[#F4F6F8]">
                              <Upload className="h-4 w-4" /> Chọn logo
                              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && setShopLogoFile(e.target.files[0])} />
                            </label>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Ảnh bìa</Label>
                          {shopCoverFile || shopForm.coverUrl ? (
                            <div className="relative w-fit">
                              <img src={shopCoverFile ? URL.createObjectURL(shopCoverFile) : shopForm.coverUrl} alt="cover" className="h-20 w-32 rounded-xl object-cover" />
                              <button type="button" onClick={() => { setShopCoverFile(null); setShopForm({ ...shopForm, coverUrl: '' }); }} className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed p-3 text-sm text-[#6B7280] hover:bg-[#F4F6F8]">
                              <Upload className="h-4 w-4" /> Chọn ảnh bìa
                              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && setShopCoverFile(e.target.files[0])} />
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button onClick={handleSaveShop} disabled={shopFormLoading} className="bg-[#086644] text-white hover:bg-[#086644]/90">
                          {shopFormLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          {myShop ? 'Lưu thay đổi' : 'Tạo cửa hàng'}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              {!shopLoading && myShop?.status !== 'APPROVED' ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-12 text-center space-y-3">
                    <Store className="h-10 w-10 mx-auto text-[#9CA3AF]" />
                    <h3 className="text-[#1F2937]">
                      {!myShop ? 'Bạn cần tạo cửa hàng trước' : myShop.status === 'PENDING' ? 'Cửa hàng đang chờ duyệt' : 'Cửa hàng bị từ chối'}
                    </h3>
                    <p className="text-[#6B7280]">
                      {!myShop
                        ? 'Vào tab "Cửa hàng" để tạo hồ sơ cửa hàng trước khi thêm sản phẩm.'
                        : myShop.status === 'PENDING'
                          ? 'Admin cần duyệt cửa hàng của bạn trước khi bạn có thể thêm sản phẩm.'
                          : 'Vui lòng chỉnh sửa lại thông tin cửa hàng ở tab "Cửa hàng" và chờ duyệt lại.'}
                    </p>
                    <Button variant="outline" onClick={() => setActiveTab('shop')}>
                      Đi tới tab Cửa hàng
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between border-b">
                    <CardTitle className="text-[#1F2937]">Quản lý sản phẩm</CardTitle>
                    <Button onClick={openAddProduct} className="bg-[#086644] text-white hover:bg-[#086644]/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm sản phẩm
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6">
                    {productsLoading ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-[#086644]" />
                      </div>
                    ) : businessProducts.length === 0 ? (
                      <div className="py-12 text-center text-[#6B7280]">Chưa có sản phẩm nào.</div>
                    ) : (
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
                                        {product.imageUrl ? (
                                          <ImageWithFallback
                                            src={product.imageUrl}
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
                                        {product.status === 'REJECTED' && product.rejectionReason && (
                                          <p className="text-xs text-[#DC2626] truncate">{product.rejectionReason}</p>
                                        )}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className="bg-[#E0E7FF] text-[#4338CA] border-0">{product.category || '—'}</Badge>
                                  </TableCell>
                                  <TableCell className="text-[#6B7280]">{product.price.toLocaleString('vi-VN')}đ</TableCell>
                                  <TableCell className="text-[#6B7280]">{product.stock}</TableCell>
                                  <TableCell className="text-[#6B7280]">{product.sales}</TableCell>
                                  <TableCell>
                                    <Badge className={PRODUCT_STATUS_META[product.status].className}>
                                      {PRODUCT_STATUS_META[product.status].label}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="pr-6">
                                    <div className="flex gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEditProduct(product)}
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
                    )}
                  </CardContent>
                </Card>
              )}
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
        if (!open) resetNewsPostForm();
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1F2937]">Đăng tin tức mới</DialogTitle>
            <DialogDescription>Bài viết sẽ hiển thị công khai cho tất cả người dùng.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="news-title">Tiêu đề (không bắt buộc)</Label>
              <Input
                id="news-title"
                value={postForm.title}
                onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                placeholder="Nhập tiêu đề tin tức..."
                className="rounded-xl"
                maxLength={255}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="news-content">Nội dung *</Label>
              <Textarea
                id="news-content"
                value={postForm.content}
                onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                placeholder="Nhập nội dung tin tức..."
                className="rounded-xl min-h-[120px]"
                maxLength={5000}
              />
            </div>
            <div className="space-y-2">
              <Label>Ảnh đính kèm (không bắt buộc)</Label>
              {(postImageFile || postForm.imageUrl) ? (
                <div className="relative w-fit">
                  <img
                    src={postImageFile ? URL.createObjectURL(postImageFile) : postForm.imageUrl}
                    alt="preview"
                    className="h-32 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPostImageFile(null);
                      setPostForm({ ...postForm, imageUrl: '' });
                    }}
                    className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed p-4 text-sm text-[#6B7280] hover:bg-[#F4F6F8]">
                  <Upload className="h-4 w-4" />
                  Chọn ảnh
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && setPostImageFile(e.target.files[0])}
                  />
                </label>
              )}
            </div>

            {renderProductPicker()}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => {
                  setNewPostDialogOpen(false);
                  resetNewsPostForm();
                }}
              >
                Hủy
              </Button>
              <Button
                type="button"
                disabled={postFormLoading}
                className="flex-1 rounded-xl bg-[#086644] hover:bg-[#086644]/90 text-white"
                onClick={handleCreatePost}
              >
                {postFormLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Đăng tin
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Post Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1F2937]">{selectedPost?.title || 'Bài viết'}</DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-[#6B7280]">
                  {selectedPost && new Date(selectedPost.createdAt).toLocaleDateString('vi-VN')}
                </span>
                <span className="text-sm text-[#6B7280]">
                  • {selectedPost?.likeCount} thích • {selectedPost?.commentCount} bình luận
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              {selectedPost.imageUrl && (
                <img src={selectedPost.imageUrl} alt={selectedPost.title || ''} className="w-full rounded-xl object-cover max-h-[300px]" />
              )}
              <div className="space-y-2">
                <Label className="text-sm">Nội dung</Label>
                <div className="p-4 bg-[#F9FAFB] rounded-xl text-sm text-[#1F2937] whitespace-pre-wrap">
                  {selectedPost.content}
                </div>
              </div>

              {selectedPost.products && selectedPost.products.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm">Sản phẩm đính kèm</Label>
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {selectedPost.products.map((product) => (
                      <div key={product.id} className="flex-shrink-0 w-32 rounded-xl border p-2">
                        <div className="h-20 w-full rounded-lg overflow-hidden bg-[#F9FAFB] border mb-2">
                          {product.imageUrl && (
                            <ImageWithFallback src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <p className="text-xs text-[#1F2937] truncate">{product.name}</p>
                        <p className="text-xs text-[#086644]">{product.price.toLocaleString('vi-VN')}đ</p>
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
        if (!open) resetNewsPostForm();
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1F2937]">Chỉnh sửa tin tức</DialogTitle>
            <DialogDescription>Cập nhật thông tin bài viết tin tức</DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Tiêu đề (không bắt buộc)</Label>
                <Input
                  id="edit-title"
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  className="rounded-xl"
                  maxLength={255}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Nội dung *</Label>
                <Textarea
                  id="edit-content"
                  value={postForm.content}
                  onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                  className="rounded-xl min-h-[120px]"
                  maxLength={5000}
                />
              </div>
              <div className="space-y-2">
                <Label>Ảnh đính kèm (không bắt buộc)</Label>
                {(postImageFile || postForm.imageUrl) ? (
                  <div className="relative w-fit">
                    <img
                      src={postImageFile ? URL.createObjectURL(postImageFile) : postForm.imageUrl}
                      alt="preview"
                      className="h-32 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPostImageFile(null);
                        setPostForm({ ...postForm, imageUrl: '' });
                      }}
                      className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed p-4 text-sm text-[#6B7280] hover:bg-[#F4F6F8]">
                    <Upload className="h-4 w-4" />
                    Chọn ảnh
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && setPostImageFile(e.target.files[0])}
                    />
                  </label>
                )}
              </div>

              {renderProductPicker()}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => {
                    setEditDialogOpen(false);
                    resetNewsPostForm();
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  disabled={postFormLoading}
                  className="flex-1 rounded-xl bg-[#086644] hover:bg-[#086644]/90 text-white"
                  onClick={handleUpdatePost}
                >
                  {postFormLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Lưu thay đổi
                </Button>
              </div>
            </div>
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
      <Dialog open={addProductDialogOpen} onOpenChange={(open) => { setAddProductDialogOpen(open); if (!open) resetProductForm(); }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm sản phẩm mới</DialogTitle>
            <DialogDescription>Sản phẩm sẽ cần admin duyệt trước khi hiển thị công khai.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Tên sản phẩm *</Label>
                <Input id="product-name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} placeholder="VD: iPhone 15 Pro Max" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-category">Danh mục</Label>
                <Input id="product-category" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} placeholder="VD: Điện tử" className="rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-price">Giá (VNĐ) *</Label>
                <Input id="product-price" type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} placeholder="VD: 32000000" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-stock">Số lượng kho</Label>
                <Input id="product-stock" type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} placeholder="VD: 20" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ảnh sản phẩm</Label>
              {productImageFile || productForm.imageUrl ? (
                <div className="relative w-fit">
                  <img src={productImageFile ? URL.createObjectURL(productImageFile) : productForm.imageUrl} alt="preview" className="h-20 w-20 rounded-xl object-cover" />
                  <button type="button" onClick={() => { setProductImageFile(null); setProductForm({ ...productForm, imageUrl: '' }); }} className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed p-3 text-sm text-[#6B7280] hover:bg-[#F4F6F8]">
                  <Upload className="h-4 w-4" /> Chọn ảnh
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && setProductImageFile(e.target.files[0])} />
                </label>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-link">Link mua hàng</Label>
              <Input id="product-link" value={productForm.buyUrl} onChange={(e) => setProductForm({ ...productForm, buyUrl: e.target.value })} placeholder="https://..." className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-description">Mô tả sản phẩm</Label>
              <Textarea id="product-description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} placeholder="Mô tả chi tiết..." className="rounded-xl min-h-[80px]" />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setAddProductDialogOpen(false)}>
                Hủy
              </Button>
              <Button disabled={productFormLoading} className="flex-1 rounded-xl bg-[#086644] hover:bg-[#086644]/90 text-white" onClick={handleCreateProduct}>
                {productFormLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Thêm sản phẩm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editProductDialogOpen} onOpenChange={(open) => { setEditProductDialogOpen(open); if (!open) resetProductForm(); }}>
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
                  <Input id="edit-product-name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-product-category">Danh mục</Label>
                  <Input id="edit-product-category" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-product-price">Giá (VNĐ) *</Label>
                  <Input id="edit-product-price" type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-product-stock">Số lượng kho</Label>
                  <Input id="edit-product-stock" type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ảnh sản phẩm</Label>
                {productImageFile || productForm.imageUrl ? (
                  <div className="relative w-fit">
                    <img src={productImageFile ? URL.createObjectURL(productImageFile) : productForm.imageUrl} alt="preview" className="h-20 w-20 rounded-xl object-cover" />
                    <button type="button" onClick={() => { setProductImageFile(null); setProductForm({ ...productForm, imageUrl: '' }); }} className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed p-3 text-sm text-[#6B7280] hover:bg-[#F4F6F8]">
                    <Upload className="h-4 w-4" /> Chọn ảnh
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && setProductImageFile(e.target.files[0])} />
                  </label>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-product-link">Link mua hàng</Label>
                <Input id="edit-product-link" value={productForm.buyUrl} onChange={(e) => setProductForm({ ...productForm, buyUrl: e.target.value })} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-product-description">Mô tả sản phẩm</Label>
                <Textarea id="edit-product-description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="rounded-xl min-h-[80px]" />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setEditProductDialogOpen(false)}>
                  Hủy
                </Button>
                <Button disabled={productFormLoading} className="flex-1 rounded-xl bg-[#086644] hover:bg-[#086644]/90 text-white" onClick={handleUpdateProduct}>
                  {productFormLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
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
              onClick={handleDeleteProduct}
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
