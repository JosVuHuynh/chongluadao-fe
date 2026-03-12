import {
  LayoutDashboard,
  Users,
  Building2,
  AlertTriangle,
  FileText,
  ShoppingCart,
  DollarSign,
  LogOut,
  Pencil,
  Trash2,
  Plus,
  Store,
  Menu,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Eye,
  Clock3,
  Globe,
  Phone,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Package,
  Layers3,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Toaster, toast } from "sonner";

import logoImage from "figma:asset/2e2b9f150b66714e8750e5a4fcd8bac815716ee5.png";
import { AdminUsersTab } from "./AdminUsersTab";
import { AdminReportsTab } from "./AdminReportsTab";
import { AdminBusinessesTab } from "./AdminBusinessesTab";

interface AdminDashboardProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

type ShopStatus = "pending" | "approved" | "rejected";
type ProductStatus = "pending" | "approved" | "rejected";

type ShopItem = {
  id: number;
  businessId: number;
  businessName: string;
  name: string;
  slug: string;
  category: string;
  logo: string;
  cover: string;
  shortDescription: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  province: string;
  district: string;
  address: string;
  status: ShopStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  productCount: number;
  isFeatured: boolean;
};

type ProductItem = {
  id: number;
  businessId: number;
  businessName: string;
  shopId: number;
  shopName: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  sales: number;
  image: string;
  buyUrl: string;
  status: ProductStatus;
  createdAt: string;
};

type ShopFormState = {
  name: string;
  businessName: string;
  slug: string;
  category: string;
  phone: string;
  email: string;
  website: string;
  province: string;
  district: string;
  address: string;
  shortDescription: string;
  description: string;
  logo: string;
  cover: string;
  isFeatured: boolean;
  status: ShopStatus;
};

const mockShops: ShopItem[] = [
  {
    id: 1,
    businessId: 101,
    businessName: "Công ty TNHH ABC Tech",
    name: "TechStore Premium",
    slug: "techstore-premium",
    category: "Điện tử - Công nghệ",
    logo: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=200&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=1200&auto=format&fit=crop",
    shortDescription: "Chuyên laptop, điện thoại và phụ kiện chính hãng.",
    description: "Cửa hàng chuyên phân phối thiết bị công nghệ cao cấp, hỗ trợ bảo hành chính hãng.",
    phone: "0901 234 567",
    email: "support@abctech.vn",
    website: "https://abctech.vn",
    province: "Hà Nội",
    district: "Cầu Giấy",
    address: "Số 12 Duy Tân",
    status: "approved",
    createdAt: "2025-01-10",
    updatedAt: "2025-01-15",
    productCount: 156,
    isFeatured: true,
  },
  {
    id: 2,
    businessId: 102,
    businessName: "Fashion House VN",
    name: "Fashion House VN",
    slug: "fashion-house-vn",
    category: "Thời trang",
    logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&auto=format&fit=crop",
    shortDescription: "Thời trang nam nữ phong cách hiện đại.",
    description: "Thương hiệu thời trang nội địa tập trung vào thiết kế tối giản, chất lượng cao.",
    phone: "0912 888 999",
    email: "hello@fashionhouse.vn",
    website: "https://fashionhouse.vn",
    province: "TP.HCM",
    district: "Quận 1",
    address: "45 Nguyễn Huệ",
    status: "pending",
    createdAt: "2025-02-02",
    updatedAt: "2025-02-03",
    productCount: 42,
    isFeatured: false,
  },
  {
    id: 3,
    businessId: 103,
    businessName: "Home & Living Store",
    name: "Home & Living Store",
    slug: "home-living-store",
    category: "Nội thất - Gia dụng",
    logo: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&auto=format&fit=crop",
    shortDescription: "Nội thất và đồ gia dụng cho không gian hiện đại.",
    description: "Nhà bán hàng tập trung vào sofa, decor và đồ dùng tiện ích trong gia đình.",
    phone: "0933 333 222",
    email: "cs@homeliving.vn",
    website: "https://homeliving.vn",
    province: "Đà Nẵng",
    district: "Hải Châu",
    address: "80 Bạch Đằng",
    status: "rejected",
    rejectionReason: "Thiếu thông tin website chính thức và ảnh cover chưa rõ thương hiệu.",
    createdAt: "2025-02-06",
    updatedAt: "2025-02-07",
    productCount: 18,
    isFeatured: false,
  },
];

const mockProducts: ProductItem[] = [
  {
    id: 1,
    businessId: 101,
    businessName: "Công ty TNHH ABC Tech",
    shopId: 1,
    shopName: "TechStore Premium",
    name: "Laptop Dell XPS 15",
    category: "Điện tử",
    price: "25,990,000đ",
    stock: 15,
    sales: 23,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&auto=format&fit=crop",
    buyUrl: "https://abctech.vn/products/dell-xps-15",
    status: "approved",
    createdAt: "2025-02-01",
  },
  {
    id: 2,
    businessId: 102,
    businessName: "Fashion House VN",
    shopId: 2,
    shopName: "Fashion House VN",
    name: "Áo khoác bomber premium",
    category: "Thời trang",
    price: "899,000đ",
    stock: 42,
    sales: 12,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&auto=format&fit=crop",
    buyUrl: "https://fashionhouse.vn/products/bomber-premium",
    status: "pending",
    createdAt: "2025-02-03",
  },
  {
    id: 3,
    businessId: 103,
    businessName: "Home & Living Store",
    shopId: 3,
    shopName: "Home & Living Store",
    name: "Sofa vải xanh hiện đại",
    category: "Nội thất",
    price: "12,500,000đ",
    stock: 5,
    sales: 3,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop",
    buyUrl: "https://homeliving.vn/products/sofa-xanh",
    status: "rejected",
    createdAt: "2025-02-07",
  },
];

const overviewStats = [
  { label: "Cửa hàng chờ duyệt", value: "14", icon: Clock3, color: "bg-amber-50", iconColor: "text-amber-600" },
  { label: "Cửa hàng đã duyệt", value: "238", icon: ShieldCheck, color: "bg-emerald-50", iconColor: "text-emerald-600" },
  { label: "Sản phẩm chờ duyệt", value: "96", icon: Package, color: "bg-blue-50", iconColor: "text-blue-600" },
  { label: "Tổng shop public", value: "184", icon: Store, color: "bg-violet-50", iconColor: "text-violet-600" },
];

function getShopStatusMeta(status: ShopStatus) {
  switch (status) {
    case "pending":
      return {
        label: "Chờ xử lý",
        badgeClass: "bg-amber-100 text-amber-700 hover:bg-amber-100",
        chipClass: "bg-amber-50 text-amber-700 border-amber-100",
      };
    case "approved":
      return {
        label: "Đã xác minh",
        badgeClass: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
        chipClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
      };
    case "rejected":
      return {
        label: "Từ chối",
        badgeClass: "bg-rose-100 text-rose-700 hover:bg-rose-100",
        chipClass: "bg-rose-50 text-rose-700 border-rose-100",
      };
  }
}

function getProductStatusBadge(status: ProductStatus) {
  const map = {
    pending: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    approved: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
    rejected: "bg-rose-100 text-rose-800 hover:bg-rose-100",
  };

  const text = {
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    rejected: "Từ chối",
  };

  return <Badge className={map[status]}>{text[status]}</Badge>;
}

function StatusDropdown({
  value,
  onChange,
}: {
  value: ShopStatus;
  onChange: (value: ShopStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const options: ShopStatus[] = ["pending", "approved", "rejected"];
  const current = getShopStatusMeta(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex min-w-[170px] items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition hover:bg-slate-100"
        >
          <span className={`inline-flex items-center rounded-full border px-3 py-1 font-medium ${current.chipClass}`}>
            {current.label}
          </span>
          <ChevronsUpDown className="ml-3 h-4 w-4 text-slate-400" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[206px] p-2" align="start">
        <div className="space-y-1">
          {options.map((option) => {
            const meta = getShopStatusMeta(option);
            const active = option === value;

            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                  active ? `${meta.chipClass} bg-opacity-100` : "hover:bg-slate-50"
                }`}
              >
                <span>{meta.label}</span>
                {active && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ShopManagementTab() {
  const [shops, setShops] = useState<ShopItem[]>(mockShops);
  const [products] = useState<ProductItem[]>(mockProducts);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ShopStatus>("all");
  const [selectedShop, setSelectedShop] = useState<ShopItem | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addShopOpen, setAddShopOpen] = useState(false);

  const emptyForm: ShopFormState = {
    name: "",
    businessName: "",
    slug: "",
    category: "",
    phone: "",
    email: "",
    website: "",
    province: "",
    district: "",
    address: "",
    shortDescription: "",
    description: "",
    logo: "",
    cover: "",
    isFeatured: false,
    status: "pending",
  };

  const [formData, setFormData] = useState<ShopFormState>(emptyForm);

  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      const q = keyword.toLowerCase();
      const matchKeyword =
        !keyword ||
        shop.name.toLowerCase().includes(q) ||
        shop.businessName.toLowerCase().includes(q) ||
        shop.category.toLowerCase().includes(q) ||
        shop.phone.toLowerCase().includes(q) ||
        shop.website.toLowerCase().includes(q);

      const matchStatus = statusFilter === "all" || shop.status === statusFilter;
      return matchKeyword && matchStatus;
    });
  }, [shops, keyword, statusFilter]);

  function fillForm(shop: ShopItem) {
    setFormData({
      name: shop.name,
      businessName: shop.businessName,
      slug: shop.slug,
      category: shop.category,
      phone: shop.phone,
      email: shop.email,
      website: shop.website,
      province: shop.province,
      district: shop.district,
      address: shop.address,
      shortDescription: shop.shortDescription,
      description: shop.description,
      logo: shop.logo,
      cover: shop.cover,
      isFeatured: shop.isFeatured,
      status: shop.status,
    });
  }

  function resetForm() {
    setFormData(emptyForm);
  }

  function openDetail(shop: ShopItem) {
    setSelectedShop(shop);
    setDetailOpen(true);
  }

  function openEdit(shop: ShopItem) {
    setSelectedShop(shop);
    fillForm(shop);
    setEditOpen(true);
  }

  function updateShopStatus(id: number, status: ShopStatus) {
    setShops((prev) =>
      prev.map((shop) =>
        shop.id === id
          ? {
              ...shop,
              status,
              updatedAt: "2026-02-27",
              rejectionReason: status === "rejected" ? shop.rejectionReason || "Thiếu thông tin xác thực cửa hàng." : "",
            }
          : shop,
      ),
    );

    if (selectedShop?.id === id) {
      setSelectedShop((prev) =>
        prev
          ? {
              ...prev,
              status,
              updatedAt: "2026-02-27",
              rejectionReason: status === "rejected" ? prev.rejectionReason || "Thiếu thông tin xác thực cửa hàng." : "",
            }
          : prev,
      );
    }

    toast.success("Đã cập nhật trạng thái");
  }

  function saveEditShop() {
    if (!selectedShop) return;

    setShops((prev) =>
      prev.map((shop) =>
        shop.id === selectedShop.id
          ? {
              ...shop,
              ...formData,
              updatedAt: "2026-02-27",
              rejectionReason:
                formData.status === "rejected"
                  ? shop.rejectionReason || "Thiếu thông tin xác thực cửa hàng."
                  : "",
            }
          : shop,
      ),
    );

    setSelectedShop((prev) =>
      prev
        ? {
            ...prev,
            ...formData,
            updatedAt: "2026-02-27",
            rejectionReason:
              formData.status === "rejected"
                ? prev.rejectionReason || "Thiếu thông tin xác thực cửa hàng."
                : "",
          }
        : prev,
    );

    setEditOpen(false);
    toast.success("Đã lưu thay đổi");
  }

  function addShop() {
    const nowId = Date.now();
    const newShop: ShopItem = {
      id: nowId,
      businessId: nowId,
      name: formData.name || "New Brand Store",
      businessName: formData.businessName || "Doanh nghiệp mới",
      slug: formData.slug || "new-brand-store",
      category: formData.category || "Thời trang",
      phone: formData.phone || "0988 888 888",
      email: formData.email || "hello@newbrand.vn",
      website: formData.website || "https://newbrand.vn",
      province: formData.province || "Hà Nội",
      district: formData.district || "Nam Từ Liêm",
      address: formData.address || "99 Mễ Trì",
      shortDescription: formData.shortDescription || "Mô tả ngắn hiển thị ngoài card cửa hàng.",
      description: formData.description || "Mô tả chi tiết để admin kiểm tra trước khi duyệt shop public.",
      logo:
        formData.logo ||
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&auto=format&fit=crop",
      cover:
        formData.cover ||
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&auto=format&fit=crop",
      status: formData.status,
      createdAt: "2026-02-27",
      updatedAt: "2026-02-27",
      productCount: 0,
      isFeatured: formData.isFeatured,
      rejectionReason: formData.status === "rejected" ? "Thiếu thông tin xác thực cửa hàng." : "",
    };

    setShops((prev) => [newShop, ...prev]);
    setAddShopOpen(false);
    resetForm();
    toast.success("Đã thêm cửa hàng");
  }

  function removeShop() {
    if (!selectedShop) return;
    setShops((prev) => prev.filter((shop) => shop.id !== selectedShop.id));
    setDeleteDialogOpen(false);
    setDetailOpen(false);
    setEditOpen(false);
    toast.success("Đã xóa cửa hàng");
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4 border-b">
          <div>
            <CardTitle className="text-slate-900">Quản lý cửa hàng</CardTitle>
            <p className="mt-1 text-sm text-slate-500">Admin duyệt hồ sơ shop của doanh nghiệp trước khi public.</p>
          </div>

          <Button
            className="bg-[#086644] text-white hover:bg-[#086644]/90"
            onClick={() => {
              resetForm();
              setFormData((prev) => ({ ...prev, status: "pending" }));
              setAddShopOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm cửa hàng
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative w-full lg:flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm theo tên shop, doanh nghiệp, danh mục..."
                className="h-11 w-full rounded-xl border-0 bg-slate-100 pl-10 pr-10"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | ShopStatus)}>
              <SelectTrigger className="h-11 w-full rounded-xl border-0 bg-slate-100 lg:w-[220px]">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="approved">Đã xác minh</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cửa hàng</TableHead>
                  <TableHead>Doanh nghiệp</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredShops.map((shop) => (
                  <TableRow key={shop.id}>
                    <TableCell className="font-medium text-slate-800">#{shop.id}</TableCell>

                    <TableCell>
                      <div className="flex min-w-[240px] items-center gap-3">
                        <img src={shop.logo} alt={shop.name} className="h-11 w-11 rounded-xl border object-cover" />
                        <div>
                          <p className="text-slate-900">{shop.name}</p>
                          <p className="text-xs text-slate-500">/{shop.slug}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-slate-600">{shop.businessName}</TableCell>
                    <TableCell className="text-slate-600">{shop.category}</TableCell>
                    <TableCell className="text-slate-600">{shop.productCount}</TableCell>
                    <TableCell className="text-slate-600">{shop.createdAt}</TableCell>

                    <TableCell>
                      <StatusDropdown value={shop.status} onChange={(next) => updateShopStatus(shop.id, next)} />
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openDetail(shop)}>
                          <Eye className="h-4 w-4 text-emerald-500" />
                        </Button>

                        <Button variant="ghost" size="icon" onClick={() => openEdit(shop)}>
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedShop(shop);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredShops.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-12 text-center text-slate-500">
                      Không có cửa hàng phù hợp.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết cửa hàng</DialogTitle>
            <DialogDescription>Xem nhanh giao diện quản lý shop ở phía admin.</DialogDescription>
          </DialogHeader>

          {selectedShop && (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl border bg-white">
                <div className="relative h-48 w-full bg-slate-100">
                  <img src={selectedShop.cover} alt={selectedShop.name} className="h-full w-full object-cover" />
                  <div className="absolute right-4 top-4">
                    <Badge className={getShopStatusMeta(selectedShop.status).badgeClass}>
                      {getShopStatusMeta(selectedShop.status).label}
                    </Badge>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <div className="-mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="flex items-end gap-4">
                      <img
                        src={selectedShop.logo}
                        alt={selectedShop.name}
                        className="h-20 w-20 rounded-2xl border-4 border-white bg-white object-cover"
                      />
                      <div className="pb-1">
                        <h3 className="text-2xl text-slate-900">{selectedShop.name}</h3>
                        <p className="text-sm text-slate-500">{selectedShop.businessName}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => window.open(selectedShop.website, "_blank")}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Mở website
                      </Button>

                      <Button
                        className="bg-[#086644] text-white hover:bg-[#086644]/90"
                        onClick={() => {
                          setDetailOpen(false);
                          openEdit(selectedShop);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Sửa
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Thông tin shop</TabsTrigger>
                  <TabsTrigger value="public">Preview public</TabsTrigger>
                  <TabsTrigger value="products">Sản phẩm liên quan</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="mt-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Thông tin cơ bản</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                          <Store className="mt-0.5 h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-slate-500">Tên cửa hàng</p>
                            <p className="text-slate-900">{selectedShop.name}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Layers3 className="mt-0.5 h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-slate-500">Danh mục</p>
                            <p className="text-slate-900">{selectedShop.category}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <ShieldCheck className="mt-0.5 h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-slate-500">Nổi bật</p>
                            <p className="text-slate-900">{selectedShop.isFeatured ? "Có" : "Không"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Liên hệ</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                          <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-slate-500">Số điện thoại</p>
                            <p className="text-slate-900">{selectedShop.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Globe className="mt-0.5 h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-slate-500">Website</p>
                            <p className="break-all text-slate-900">{selectedShop.website}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-slate-500">Địa chỉ</p>
                            <p className="text-slate-900">
                              {selectedShop.address}, {selectedShop.district}, {selectedShop.province}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Mô tả</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600">
                      <p>
                        <span className="text-slate-900">Mô tả ngắn:</span> {selectedShop.shortDescription}
                      </p>
                      <p>
                        <span className="text-slate-900">Mô tả chi tiết:</span> {selectedShop.description}
                      </p>

                      {selectedShop.status === "rejected" && selectedShop.rejectionReason && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
                          <p className="mb-1 text-sm text-rose-900">Lý do từ chối</p>
                          <p>{selectedShop.rejectionReason}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="public" className="mt-4">
                  <div className="rounded-[28px] bg-[#F7F7F7] p-6">
                    <div className="mx-auto max-w-md overflow-hidden rounded-[28px] border bg-white shadow-sm">
                      <div className="relative h-44">
                        <img src={selectedShop.cover} alt={selectedShop.name} className="h-full w-full object-cover" />
                        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#086644] px-3 py-1 text-sm text-white">
                          <ShieldCheck className="h-4 w-4" /> Xác thực
                        </div>
                      </div>

                      <div className="px-5 pb-5">
                        <div className="-mt-8 flex items-end gap-3">
                          <img
                            src={selectedShop.logo}
                            alt={selectedShop.name}
                            className="h-16 w-16 rounded-full border-4 border-white bg-white object-cover"
                          />
                          <div className="pb-1">
                            <h4 className="text-xl text-[#086644]">{selectedShop.name}</h4>
                            <Badge className="mt-1 bg-slate-100 text-slate-700 hover:bg-slate-100">
                              {selectedShop.category}
                            </Badge>
                          </div>
                        </div>

                        <p className="mt-4 leading-7 text-slate-600">{selectedShop.shortDescription}</p>

                        <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-lg text-[#086644]">4.8</p>
                            <p className="text-slate-500">Đánh giá</p>
                          </div>
                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-lg text-[#086644]">{selectedShop.productCount}</p>
                            <p className="text-slate-500">Sản phẩm</p>
                          </div>
                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-lg text-[#086644]">98%</p>
                            <p className="text-slate-500">Phản hồi</p>
                          </div>
                        </div>

                        <Button className="mt-5 w-full rounded-full bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white hover:opacity-95">
                          Xem cửa hàng
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="products" className="mt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {products
                      .filter((product) => product.shopId === selectedShop.id)
                      .map((product) => (
                        <Card key={product.id}>
                          <CardContent className="flex gap-4 p-4">
                            <img src={product.image} alt={product.name} className="h-24 w-24 rounded-xl object-cover" />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="line-clamp-2 text-slate-900">{product.name}</p>
                                  <p className="mt-1 text-sm text-slate-500">{product.category}</p>
                                </div>
                                {getProductStatusBadge(product.status)}
                              </div>
                              <div className="mt-4 flex items-center justify-between text-sm">
                                <span className="text-[#086644]">{product.price}</span>
                                <span className="text-slate-500">Kho: {product.stock}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                    {products.filter((product) => product.shopId === selectedShop.id).length === 0 && (
                      <Card>
                        <CardContent className="p-10 text-center text-slate-500">
                          Chưa có sản phẩm nào.
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </Button>

                <Button
                  className="bg-[#086644] text-white hover:bg-[#086644]/90"
                  onClick={() => {
                    setDetailOpen(false);
                    openEdit(selectedShop);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Sửa
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa cửa hàng</DialogTitle>
            <DialogDescription>Cập nhật thông tin hiển thị của cửa hàng.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Tên cửa hàng</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Doanh nghiệp</Label>
              <Input
                value={formData.businessName}
                onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Danh mục</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={formData.website}
                onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as ShopStatus }))}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="approved">Đã xác minh</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tỉnh / Thành phố</Label>
              <Input
                value={formData.province}
                onChange={(e) => setFormData((prev) => ({ ...prev, province: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Quận / Huyện</Label>
              <Input
                value={formData.district}
                onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Địa chỉ</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Mô tả ngắn</Label>
              <Input
                value={formData.shortDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Mô tả chi tiết</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="min-h-[120px] rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Logo URL</Label>
              <Input
                value={formData.logo}
                onChange={(e) => setFormData((prev) => ({ ...prev, logo: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Cover URL</Label>
              <Input
                value={formData.cover}
                onChange={(e) => setFormData((prev) => ({ ...prev, cover: e.target.value }))}
                className="rounded-xl"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Hủy
            </Button>

            <Button className="bg-[#086644] text-white hover:bg-[#086644]/90" onClick={saveEditShop}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addShopOpen} onOpenChange={setAddShopOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo cửa hàng</DialogTitle>
            <DialogDescription>Nhập thông tin để tạo mới cửa hàng.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Tên cửa hàng</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Doanh nghiệp</Label>
              <Input
                value={formData.businessName}
                onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Danh mục</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={formData.website}
                onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as ShopStatus }))}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="approved">Đã xác minh</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tỉnh / Thành phố</Label>
              <Input
                value={formData.province}
                onChange={(e) => setFormData((prev) => ({ ...prev, province: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Quận / Huyện</Label>
              <Input
                value={formData.district}
                onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Địa chỉ</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Mô tả ngắn</Label>
              <Input
                value={formData.shortDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Mô tả chi tiết</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="min-h-[120px] rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Logo URL</Label>
              <Input
                value={formData.logo}
                onChange={(e) => setFormData((prev) => ({ ...prev, logo: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Cover URL</Label>
              <Input
                value={formData.cover}
                onChange={(e) => setFormData((prev) => ({ ...prev, cover: e.target.value }))}
                className="rounded-xl"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddShopOpen(false)}>
              Hủy
            </Button>

            <Button className="bg-[#086644] text-white hover:bg-[#086644]/90" onClick={addShop}>
              Tạo cửa hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa cửa hàng?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này sẽ xóa cửa hàng khỏi danh sách hiện tại.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-600 text-white hover:bg-rose-700" onClick={removeShop}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ProductManagementTab() {
  const [products] = useState<ProductItem[]>(mockProducts);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ProductStatus>("all");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchKeyword =
        !keyword ||
        product.name.toLowerCase().includes(keyword.toLowerCase()) ||
        product.businessName.toLowerCase().includes(keyword.toLowerCase()) ||
        product.shopName.toLowerCase().includes(keyword.toLowerCase()) ||
        product.category.toLowerCase().includes(keyword.toLowerCase());

      const matchStatus = statusFilter === "all" || product.status === statusFilter;
      return matchKeyword && matchStatus;
    });
  }, [products, keyword, statusFilter]);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4 border-b">
          <div>
            <CardTitle className="text-slate-900">Quản lý sản phẩm</CardTitle>
            <p className="mt-1 text-sm text-slate-500">Tách riêng khỏi tab cửa hàng để không lẫn giữa hồ sơ shop và hàng hóa.</p>
          </div>

          <Button className="bg-[#086644] text-white hover:bg-[#086644]/90">
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="rounded-xl border-0 bg-slate-100 pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | ProductStatus)}>
              <SelectTrigger className="w-[220px] rounded-xl border-0 bg-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="approved">Đã duyệt</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Cửa hàng</TableHead>
                  <TableHead>Doanh nghiệp</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Kho</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Mua ngoài</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex min-w-[240px] items-center gap-3">
                        <img src={product.image} alt={product.name} className="h-12 w-12 rounded-xl object-cover" />
                        <div>
                          <p className="text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.category}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-slate-600">{product.shopName}</TableCell>
                    <TableCell className="text-slate-600">{product.businessName}</TableCell>
                    <TableCell className="text-slate-600">{product.price}</TableCell>
                    <TableCell className="text-slate-600">{product.stock}</TableCell>
                    <TableCell>{getProductStatusBadge(product.status)}</TableCell>

                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => window.open(product.buyUrl, "_blank")}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Xem link
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-slate-500">
                      Không có sản phẩm phù hợp.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminDashboard({ onNavigate, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: "overview", icon: LayoutDashboard, label: "Tổng quan" },
    { id: "users", icon: Users, label: "Người dùng" },
    { id: "reports", icon: AlertTriangle, label: "Tố cáo" },
    { id: "businesses", icon: Building2, label: "Doanh nghiệp" },
    { id: "news", icon: FileText, label: "Tin tức" },
    { id: "shop", icon: Store, label: "Cửa hàng" },
    { id: "product", icon: ShoppingCart, label: "Sản phẩm" },
    { id: "finance", icon: DollarSign, label: "Tài chính" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      <aside
        className={`
          ${sidebarCollapsed ? "w-[80px]" : "w-[240px]"}
          fixed top-0 z-50 flex min-h-screen flex-col border-r bg-white transition-all duration-300
          lg:sticky lg:z-auto
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between p-6">
          <button onClick={() => onNavigate?.("home")} className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <img src={logoImage} alt="ChongLuaDaoJP Logo" className="h-10 w-10 flex-shrink-0 object-contain" />
            {!sidebarCollapsed && <span className="whitespace-nowrap text-[#086644]">Admin Panel</span>}
          </button>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="group hidden h-7 w-7 items-center justify-center rounded-lg bg-[#F5F5F5] transition-all hover:bg-[#086644] hover:text-white lg:flex"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <ScrollArea className="flex-1 px-4">
          <nav className="space-y-1 pb-4">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full rounded-xl px-4 py-3 transition-all ${
                  activeTab === item.id ? "bg-[#086644] text-white shadow-md" : "text-[#6B7280] hover:bg-[#F5F5F5]"
                } ${sidebarCollapsed ? "flex justify-center" : "flex items-center gap-3"}`}
                title={sidebarCollapsed ? item.label : ""}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="whitespace-nowrap text-sm">{item.label}</span>}
              </button>
            ))}
          </nav>
        </ScrollArea>

        <div className="border-t p-4">
          <Button variant="outline" className={`w-full gap-2 ${sidebarCollapsed ? "px-2" : ""}`} onClick={() => onLogout?.()}>
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Đăng xuất</span>}
          </Button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b bg-white px-4 py-4 sm:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileSidebarOpen(true)} className="rounded-lg p-2 hover:bg-[#F5F5F5] lg:hidden">
                <Menu className="h-6 w-6 text-[#6B7280]" />
              </button>

              <div>
                <h1 className="text-xl text-[#086644] sm:text-2xl">Bảng điều khiển quản trị</h1>
                <p className="hidden text-xs text-[#6B7280] sm:block sm:text-sm">Quản lý shop, sản phẩm và dữ liệu hệ thống.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="bg-[#A8E6CF] px-3 py-1 text-xs text-[#086644] sm:px-4 sm:text-sm">Admin</Badge>
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A8E6CF] to-[#086644] text-white sm:h-10 sm:w-10">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-6 overflow-auto p-4 sm:p-6 lg:p-8">
          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {overviewStats.map((stat, index) => (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className={`inline-flex rounded-2xl p-3 ${stat.color}`}>
                        <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                      </div>
                      <p className="mt-4 text-sm text-slate-500">{stat.label}</p>
                      <p className="mt-1 text-3xl text-slate-900">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Tổng quan phần shop</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 text-sm text-slate-600 lg:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="mb-2 text-slate-900">Phân tách rõ 2 module</p>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>
                        <strong>Cửa hàng</strong>: quản lý hồ sơ shop, duyệt shop, preview public.
                      </li>
                      <li>
                        <strong>Sản phẩm</strong>: quản lý hàng hóa, link mua ngoài, tồn kho, duyệt sản phẩm.
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="mb-2 text-slate-900">Flow phase đầu</p>
                    <ol className="list-decimal space-y-2 pl-5">
                      <li>Doanh nghiệp setup shop.</li>
                      <li>Admin xem chi tiết và cập nhật trạng thái.</li>
                      <li>Shop được duyệt mới được public và gắn sản phẩm.</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "users" && <AdminUsersTab />}
          {activeTab === "reports" && <AdminReportsTab />}
          {activeTab === "businesses" && <AdminBusinessesTab />}

          {activeTab === "news" && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-10 text-center text-slate-500">Giữ nguyên tab tin tức hiện tại của bạn.</CardContent>
            </Card>
          )}

          {activeTab === "shop" && <ShopManagementTab />}
          {activeTab === "product" && <ProductManagementTab />}

          {activeTab === "finance" && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="mb-4 text-6xl">🚧</div>
                <h3 className="mb-2 text-slate-900">Đang phát triển</h3>
                <p className="text-slate-500">Tính năng tài chính sẽ làm sau khi xong shop và product.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Toaster position="top-right" richColors />
    </div>
  );
}