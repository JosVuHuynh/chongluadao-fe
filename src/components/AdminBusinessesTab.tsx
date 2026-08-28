import { useState, useEffect } from "react";
import {
  Building2,
  Pencil,
  Trash2,
  Plus,
  Search,
  Loader2,
  CheckCircle2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
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
import * as adminService from "../services/adminService";
import * as businessService from "../services/businessService";
import { toast } from "sonner@2.0.3";

export function AdminBusinessesTab() {
  const [businesses, setBusinesses] = useState<adminService.Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] =
    useState<adminService.Business | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [ceoAvatarFile, setCeoAvatarFile] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState("");
  const [ceoAvatarPreview, setCeoAvatarPreview] = useState("");

  const getErrorMessages = (error: any, fallback: string): string[] => {
    const data = error?.response?.data;

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors
        .map((item: any) => item?.message)
        .filter((msg: string) => !!msg);
    }

    if (typeof data?.message === "string" && data.message.trim()) {
      return [data.message];
    }

    if (typeof error?.message === "string" && error.message.trim()) {
      return [error.message];
    }

    return [fallback];
  };

  const showApiErrorToast = (error: any, fallback: string) => {
    const messages = getErrorMessages(error, fallback);
    messages.forEach((msg) => toast.error(msg));
  };

  const fetchBusinesses = async () => {
    try {
      setLoading(true);

      const params: any = { page, limit };
      if (searchQuery) params.q = searchQuery;
      if (statusFilter !== "all") {
        if (statusFilter === "pending") params.status = "PENDING";
        if (statusFilter === "verified") params.status = "VERIFIED";
        if (statusFilter === "rejected") params.status = "REJECTED";
      }

      const response = await adminService.getBusinesses(params);

      const normalizeBusiness = (business: any) => ({
        ...business,
        taxCode: business.taxCode || business.tax_code,
        logoUrl: business.logoUrl || business.logo_url,
        verifiedBadge:
          business.verifiedBadge ?? business.verified_badge ?? false,
        verifiedAt: business.verifiedAt || business.verified_at,
        isTrusted: business.isTrusted ?? business.is_trusted ?? false,
        hasInsurance: business.hasInsurance ?? business.has_insurance ?? false,
        facebookUrl: business.facebookUrl || business.facebook_url,
        messengerUrl: business.messengerUrl || business.messenger_url,
        tiktokUrl: business.tiktokUrl || business.tiktok_url,
        instagramUrl: business.instagramUrl || business.instagram_url,
        zaloUrl: business.zaloUrl || business.zalo_url,
        youtubeUrl: business.youtubeUrl || business.youtube_url,
        ceoName: business.ceoName || business.ceo_name,
        ceoAvatarUrl: business.ceoAvatarUrl || business.ceo_avatar_url,
        rejectReason: business.rejectReason || business.reject_reason,
        createdAt: business.createdAt || business.created_at,
        updatedAt: business.updatedAt || business.updated_at,
      });

      if (response.data && Array.isArray(response.data)) {
        setBusinesses(response.data.map(normalizeBusiness));
        setTotal(response.pagination?.totalItems || response.data.length);
      } else if (response.items && Array.isArray(response.items)) {
        setBusinesses(response.items.map(normalizeBusiness));
        setTotal(response.total || response.items.length);
      } else if (Array.isArray(response)) {
        setBusinesses(response.map(normalizeBusiness));
        setTotal(response.length);
      } else {
        setBusinesses([]);
        setTotal(0);
      }
    } catch (error: any) {

      console.error("Error fetching businesses:", error);
      showApiErrorToast(error, "Không thể tải danh sách doanh nghiệp");
      setBusinesses([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [page, searchQuery, statusFilter]);

  const resetImageStates = () => {
    if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
    if (ceoAvatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(ceoAvatarPreview);
    }

    setLogoFile(null);
    setCeoAvatarFile(null);
    setLogoPreview("");
    setCeoAvatarPreview("");
  };

  const handleCloseEditDialog = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      resetImageStates();
      setSelectedBusiness(null);
    }
  };

  const handleCloseAddDialog = (open: boolean) => {
    setAddDialogOpen(open);
    if (!open) {
      resetImageStates();
    }
  };

  const handleEdit = (business: adminService.Business) => {
    setSelectedBusiness(business);
    setLogoFile(null);
    setCeoAvatarFile(null);
    setLogoPreview((business as any).logoUrl || "");
    setCeoAvatarPreview((business as any).ceoAvatarUrl || "");
    setEditDialogOpen(true);
  };

  const handleDelete = (business: adminService.Business) => {
    setSelectedBusiness(business);
    setDeleteDialogOpen(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Ảnh logo phải nhỏ hơn 5MB");
      return;
    }

    if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleCeoAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Ảnh CEO phải nhỏ hơn 5MB");
      return;
    }

    if (ceoAvatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(ceoAvatarPreview);
    }

    setCeoAvatarFile(file);
    setCeoAvatarPreview(URL.createObjectURL(file));
  };

  const removeSelectedImage = (type: "logo" | "ceo") => {
    if (type === "logo") {
      if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
      setLogoFile(null);
      setLogoPreview((selectedBusiness as any)?.logoUrl || "");
      if (!selectedBusiness) setLogoPreview("");
    } else {
      if (ceoAvatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(ceoAvatarPreview);
      }
      setCeoAvatarFile(null);
      setCeoAvatarPreview((selectedBusiness as any)?.ceoAvatarUrl || "");
      if (!selectedBusiness) setCeoAvatarPreview("");
    }
  };

  const confirmDelete = async () => {
    if (!selectedBusiness) return;

    try {
      setFormLoading(true);
      await adminService.deleteBusiness(selectedBusiness.id);
      toast.success("Xóa doanh nghiệp thành công");
      fetchBusinesses();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      showApiErrorToast(error, "Không thể xóa doanh nghiệp");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateBusiness = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBusiness) return;

    const formData = new FormData(e.currentTarget);

    try {
      setFormLoading(true);

      let finalLogoUrl = (selectedBusiness as any).logoUrl || undefined;
      let finalCeoAvatarUrl = (selectedBusiness as any).ceoAvatarUrl || undefined;

      if (logoFile || ceoAvatarFile) {
        setUploadingImages(true);
      }

      if (logoFile) {
        finalLogoUrl = await businessService.uploadImage(logoFile);
      }

      if (ceoAvatarFile) {
        finalCeoAvatarUrl = await businessService.uploadImage(ceoAvatarFile);
      }

      await adminService.updateBusiness(selectedBusiness.id, {
        name: (formData.get("name") as string) || undefined,
        taxCode: (formData.get("taxCode") as string) || undefined,
        phone: (formData.get("phone") as string) || undefined,
        email: (formData.get("email") as string) || undefined,
        website: (formData.get("website") as string) || undefined,
        address: (formData.get("address") as string) || undefined,
        description: (formData.get("description") as string) || undefined,
        logoUrl: finalLogoUrl,
        category: (formData.get("category") as string) || undefined,
        plan: formData.get("plan") as "BASIC" | "PREMIUM" | "VIP",
        status: formData.get("status") as "PENDING" | "VERIFIED" | "REJECTED",
        verifiedBadge: formData.get("verifiedBadge") === "true",
        rejectReason: (formData.get("rejectReason") as string) || undefined,
        isTrusted: formData.get("isTrusted") === "true",
        hasInsurance: formData.get("hasInsurance") === "true",
        facebookUrl: (formData.get("facebookUrl") as string) || undefined,
        messengerUrl: (formData.get("messengerUrl") as string) || undefined,
        tiktokUrl: (formData.get("tiktokUrl") as string) || undefined,
        instagramUrl: (formData.get("instagramUrl") as string) || undefined,
        zaloUrl: (formData.get("zaloUrl") as string) || undefined,
        youtubeUrl: (formData.get("youtubeUrl") as string) || undefined,
        ceoName: (formData.get("ceoName") as string) || undefined,
        ceoAvatarUrl: finalCeoAvatarUrl,
      });

      toast.success("Cập nhật doanh nghiệp thành công");
      fetchBusinesses();
      setEditDialogOpen(false);
      resetImageStates();
      setSelectedBusiness(null);
    } catch (error: any) {
      console.error("UPDATE BUSINESS ERROR:", error?.response?.data || error);
      showApiErrorToast(error, "Không thể cập nhật doanh nghiệp");
    } finally {
      setUploadingImages(false);
      setFormLoading(false);
    }
  };

  const handleCreateBusiness = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setFormLoading(true);

      let finalLogoUrl: string | undefined = undefined;
      let finalCeoAvatarUrl: string | undefined = undefined;

      if (logoFile || ceoAvatarFile) {
        setUploadingImages(true);
      }

      if (logoFile) {
        finalLogoUrl = await businessService.uploadImage(logoFile);
      }

      if (ceoAvatarFile) {
        finalCeoAvatarUrl = await businessService.uploadImage(ceoAvatarFile);
      }

      await adminService.createBusiness({
        name: formData.get("name") as string,
        taxCode: (formData.get("taxCode") as string) || undefined,
        phone: (formData.get("phone") as string) || undefined,
        email: (formData.get("email") as string) || undefined,
        website: (formData.get("website") as string) || undefined,
        address: (formData.get("address") as string) || undefined,
        description: (formData.get("description") as string) || undefined,
        logoUrl: finalLogoUrl,
        category: (formData.get("category") as string) || undefined,
        plan:
          ((formData.get("plan") as "BASIC" | "PREMIUM" | "VIP") || "BASIC"),
        status:
          ((formData.get("status") as "PENDING" | "VERIFIED" | "REJECTED") ||
            "PENDING"),
        verifiedBadge: formData.get("verifiedBadge") === "true",
        rejectReason: (formData.get("rejectReason") as string) || undefined,
        isTrusted: formData.get("isTrusted") === "true",
        hasInsurance: formData.get("hasInsurance") === "true",
        facebookUrl: (formData.get("facebookUrl") as string) || undefined,
        messengerUrl: (formData.get("messengerUrl") as string) || undefined,
        tiktokUrl: (formData.get("tiktokUrl") as string) || undefined,
        instagramUrl: (formData.get("instagramUrl") as string) || undefined,
        zaloUrl: (formData.get("zaloUrl") as string) || undefined,
        youtubeUrl: (formData.get("youtubeUrl") as string) || undefined,
        ceoName: (formData.get("ceoName") as string) || undefined,
        ceoAvatarUrl: finalCeoAvatarUrl,
      });

      toast.success("Thêm doanh nghiệp thành công");
      fetchBusinesses();
      setAddDialogOpen(false);
      resetImageStates();
    } catch (error: any) {
      showApiErrorToast(error, "Không thể thêm doanh nghiệp");
    } finally {
      setUploadingImages(false);
      setFormLoading(false);
    }
  };

  const renderImageUploadBlock = ({
    id,
    label,
    preview,
    file,
    onChange,
    onRemove,
    buttonText,
  }: {
    id: string;
    label: string;
    preview: string;
    file: File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    buttonText: string;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      {preview && (
        <div className="w-20 h-20 rounded-xl overflow-hidden border bg-[#F9FAFB]">
          <img src={preview} alt={label} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="border-2 border-dashed border-[#e5e7eb] rounded-xl p-4 text-center hover:border-[#A8E6CF] transition-colors">
        <Upload className="h-6 w-6 text-[#6b7280] mx-auto mb-2" />
        <p className="text-sm text-[#6b7280] mb-2">{buttonText}</p>

        <Input
          id={id}
          type="file"
          accept="image/*"
          onChange={onChange}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById(id)?.click()}
          className="rounded-xl"
          disabled={formLoading || uploadingImages}
        >
          Chọn file
        </Button>
      </div>

      {file && (
        <div className="flex items-center justify-between p-3 bg-[#F4F6F8] rounded-xl">
          <span className="text-sm text-[#333333] truncate">{file.name}</span>
          <button
            type="button"
            onClick={onRemove}
            className="text-[#E57373] hover:text-[#E57373]/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b space-y-0 pb-4">
          <CardTitle className="text-[#1F2937]">Quản lý doanh nghiệp</CardTitle>
          <Button
            className="bg-[#086644] text-white hover:bg-[#086644]/90"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm doanh nghiệp
          </Button>
        </CardHeader>

        <div className="p-6 border-b flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <Input
                placeholder="Tìm kiếm doanh nghiệp..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="verified">Đã xác thực</SelectItem>
              <SelectItem value="rejected">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-[#086644]" />
            </div>
          ) : !businesses || businesses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Building2 className="h-16 w-16 text-[#E5E7EB] mb-4" />
              <p className="text-[#6B7280]">Không tìm thấy doanh nghiệp</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-6">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-[#6B7280] pl-6">
                            Tên doanh nghiệp
                          </TableHead>
                          <TableHead className="text-[#6B7280]">MST</TableHead>
                          <TableHead className="text-[#6B7280]">Danh mục</TableHead>
                          <TableHead className="text-[#6B7280]">Gói dịch vụ</TableHead>
                          <TableHead className="text-[#6B7280]">Trạng thái</TableHead>
                          <TableHead className="text-[#6B7280] pr-6">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {businesses.map((business: any) => (
                          <TableRow key={business.id}>
                            <TableCell className="text-[#1F2937] pl-6">
                              <div className="flex items-center gap-2">
                                {business.name}
                                {business.verifiedBadge && (
                                  <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-[#6B7280]">
                              {business.taxCode}
                            </TableCell>
                            <TableCell className="text-[#6B7280]">
                              {business.category || "-"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  business.plan === "PREMIUM"
                                    ? "bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90"
                                    : business.plan === "VIP"
                                      ? "bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]/90"
                                      : "bg-[#6B7280] text-white hover:bg-[#6B7280]/90"
                                }
                              >
                                {business.plan === "BASIC"
                                  ? "Basic"
                                  : business.plan === "PREMIUM"
                                    ? "Premium"
                                    : "VIP"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  business.status === "VERIFIED"
                                    ? "bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5]/90"
                                    : business.status === "PENDING"
                                      ? "bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7]/90"
                                      : "bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FEE2E2]/90"
                                }
                              >
                                {business.status === "VERIFIED"
                                  ? "Đã xác minh"
                                  : business.status === "PENDING"
                                    ? "Chờ xử lý"
                                    : "Từ chối"}
                              </Badge>
                            </TableCell>
                            <TableCell className="pr-6">
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(business)}
                                  className="hover:bg-[#DBEAFE] h-8 w-8 p-0"
                                >
                                  <Pencil className="h-4 w-4 text-[#3B82F6]" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(business)}
                                  className="hover:bg-[#FEE2E2] h-8 w-8 p-0"
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

              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-[#6B7280]">
                  Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, total)}{" "}
                  trong tổng số {total}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page * limit >= total}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa doanh nghiệp</DialogTitle>
            <DialogDescription>
              Cập nhật đầy đủ thông tin doanh nghiệp
            </DialogDescription>
          </DialogHeader>

          {selectedBusiness && (
            <form onSubmit={handleUpdateBusiness} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-[#1F2937]">Thông tin cơ bản</h3>

                <div className="space-y-2">
                  <Label htmlFor="name">Tên doanh nghiệp *</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={(selectedBusiness as any).name}
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxCode">Mã số thuế *</Label>
                    <Input
                      id="taxCode"
                      name="taxCode"
                      defaultValue={(selectedBusiness as any).taxCode}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục</Label>
                    <Input
                      id="category"
                      name="category"
                      defaultValue={(selectedBusiness as any).category || ""}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      defaultValue={(selectedBusiness as any).phone}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={(selectedBusiness as any).email}
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ *</Label>
                  <Input
                    id="address"
                    name="address"
                    defaultValue={(selectedBusiness as any).address}
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      defaultValue={(selectedBusiness as any).website || ""}
                      placeholder="https://example.com"
                      className="rounded-xl"
                    />
                  </div>

                  {renderImageUploadBlock({
                    id: "edit-logo-upload",
                    label: "Logo doanh nghiệp",
                    preview: logoPreview,
                    file: logoFile,
                    onChange: handleLogoUpload,
                    onRemove: () => removeSelectedImage("logo"),
                    buttonText: "Tải logo mới",
                  })}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={(selectedBusiness as any).description || ""}
                    rows={4}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-[#1F2937]">Người đại diện</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ceoName">Tên CEO / người đại diện</Label>
                    <Input
                      id="ceoName"
                      name="ceoName"
                      defaultValue={(selectedBusiness as any).ceoName || ""}
                      className="rounded-xl"
                    />
                  </div>

                  {renderImageUploadBlock({
                    id: "edit-ceo-upload",
                    label: "Ảnh đại diện CEO",
                    preview: ceoAvatarPreview,
                    file: ceoAvatarFile,
                    onChange: handleCeoAvatarUpload,
                    onRemove: () => removeSelectedImage("ceo"),
                    buttonText: "Tải ảnh CEO mới",
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-[#1F2937]">Mạng xã hội</h3>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="facebookUrl"
                    defaultValue={(selectedBusiness as any).facebookUrl || ""}
                    placeholder="https://facebook.com/tenpage"
                    className="rounded-xl"
                  />
                  <Input
                    name="messengerUrl"
                    defaultValue={(selectedBusiness as any).messengerUrl || ""}
                    placeholder="https://m.me/tenpage"
                    className="rounded-xl"
                  />
                  <Input
                    name="tiktokUrl"
                    defaultValue={(selectedBusiness as any).tiktokUrl || ""}
                    placeholder="https://tiktok.com/@tenkenh"
                    className="rounded-xl"
                  />
                  <Input
                    name="instagramUrl"
                    defaultValue={(selectedBusiness as any).instagramUrl || ""}
                    placeholder="https://instagram.com/tenkenh"
                    className="rounded-xl"
                  />
                  <Input
                    name="zaloUrl"
                    defaultValue={(selectedBusiness as any).zaloUrl || ""}
                    placeholder="https://zalo.me/..."
                    className="rounded-xl"
                  />
                  <Input
                    name="youtubeUrl"
                    defaultValue={(selectedBusiness as any).youtubeUrl || ""}
                    placeholder="https://youtube.com/@channel"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-[#1F2937]">Trạng thái & quyền lợi</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan">Gói dịch vụ</Label>
                    <Select
                      name="plan"
                      defaultValue={(selectedBusiness as any).plan || "BASIC"}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BASIC">Basic</SelectItem>
                        <SelectItem value="PREMIUM">Premium</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select
                      name="status"
                      defaultValue={(selectedBusiness as any).status || "PENDING"}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                        <SelectItem value="VERIFIED">Đã xác thực</SelectItem>
                        <SelectItem value="REJECTED">Từ chối</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="verifiedBadge">Dấu tích xanh</Label>
                    <Select
                      name="verifiedBadge"
                      defaultValue={String(!!(selectedBusiness as any).verifiedBadge)}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Có</SelectItem>
                        <SelectItem value="false">Không</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="isTrusted">Doanh nghiệp uy tín</Label>
                    <Select
                      name="isTrusted"
                      defaultValue={String(!!(selectedBusiness as any).isTrusted)}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Có</SelectItem>
                        <SelectItem value="false">Không</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hasInsurance">Có quỹ bảo hiểm</Label>
                    <Select
                      name="hasInsurance"
                      defaultValue={String(!!(selectedBusiness as any).hasInsurance)}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Có</SelectItem>
                        <SelectItem value="false">Không</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rejectReason">Lý do từ chối</Label>
                    <Input
                      id="rejectReason"
                      name="rejectReason"
                      defaultValue={(selectedBusiness as any).rejectReason || ""}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleCloseEditDialog(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="bg-[#086644] hover:bg-[#086644]/90 text-white"
                  disabled={formLoading || uploadingImages}
                >
                  {formLoading || uploadingImages ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>{uploadingImages ? "Đang upload..." : "Đang lưu..."}</span>
                    </>
                  ) : (
                    "Lưu"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
            <Button
  type="button"
  onClick={() => {
    console.log("toast test clicked");
    toast.error("Toast test");
  }}
>
  Test Toast
</Button>
      <Dialog open={addDialogOpen} onOpenChange={handleCloseAddDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm doanh nghiệp mới</DialogTitle>
            <DialogDescription>Tạo hồ sơ doanh nghiệp đầy đủ</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateBusiness} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-[#1F2937]">Thông tin cơ bản</h3>

              <div className="space-y-2">
                <Label htmlFor="new-name">Tên doanh nghiệp *</Label>
                <Input id="new-name" name="name" required className="rounded-xl" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-taxCode">Mã số thuế *</Label>
                  <Input id="new-taxCode" name="taxCode" required className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-category">Danh mục</Label>
                  <Input id="new-category" name="category" className="rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-phone">Số điện thoại *</Label>
                  <Input id="new-phone" name="phone" type="tel" required className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-email">Email *</Label>
                  <Input
                    id="new-email"
                    name="email"
                    type="email"
                    required
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-address">Địa chỉ *</Label>
                <Input id="new-address" name="address" required className="rounded-xl" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-website">Website</Label>
                  <Input
                    id="new-website"
                    name="website"
                    type="url"
                    placeholder="https://example.com"
                    className="rounded-xl"
                  />
                </div>

                {renderImageUploadBlock({
                  id: "add-logo-upload",
                  label: "Logo doanh nghiệp",
                  preview: logoPreview,
                  file: logoFile,
                  onChange: handleLogoUpload,
                  onRemove: () => {
                    if (logoPreview?.startsWith("blob:")) {
                      URL.revokeObjectURL(logoPreview);
                    }
                    setLogoFile(null);
                    setLogoPreview("");
                  },
                  buttonText: "Tải logo",
                })}
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-description">Mô tả</Label>
                <Textarea
                  id="new-description"
                  name="description"
                  rows={4}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-[#1F2937]">Người đại diện</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="ceoName"
                  placeholder="Tên CEO / người đại diện"
                  className="rounded-xl"
                />

                {renderImageUploadBlock({
                  id: "add-ceo-upload",
                  label: "Ảnh đại diện CEO",
                  preview: ceoAvatarPreview,
                  file: ceoAvatarFile,
                  onChange: handleCeoAvatarUpload,
                  onRemove: () => {
                    if (ceoAvatarPreview?.startsWith("blob:")) {
                      URL.revokeObjectURL(ceoAvatarPreview);
                    }
                    setCeoAvatarFile(null);
                    setCeoAvatarPreview("");
                  },
                  buttonText: "Tải ảnh CEO",
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-[#1F2937]">Mạng xã hội</h3>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="facebookUrl"
                  placeholder="https://facebook.com/tenpage"
                  className="rounded-xl"
                />
                <Input
                  name="messengerUrl"
                  placeholder="https://m.me/tenpage"
                  className="rounded-xl"
                />
                <Input
                  name="tiktokUrl"
                  placeholder="https://tiktok.com/@tenkenh"
                  className="rounded-xl"
                />
                <Input
                  name="instagramUrl"
                  placeholder="https://instagram.com/tenkenh"
                  className="rounded-xl"
                />
                <Input
                  name="zaloUrl"
                  placeholder="https://zalo.me/..."
                  className="rounded-xl"
                />
                <Input
                  name="youtubeUrl"
                  placeholder="https://youtube.com/@channel"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-[#1F2937]">Trạng thái & quyền lợi</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-plan">Gói dịch vụ</Label>
                  <Select name="plan" defaultValue="BASIC">
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BASIC">Basic</SelectItem>
                      <SelectItem value="PREMIUM">Premium</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-status">Trạng thái</Label>
                  <Select name="status" defaultValue="PENDING">
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                      <SelectItem value="VERIFIED">Đã xác thực</SelectItem>
                      <SelectItem value="REJECTED">Từ chối</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Dấu tích xanh</Label>
                  <Select name="verifiedBadge" defaultValue="false">
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Có</SelectItem>
                      <SelectItem value="false">Không</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Doanh nghiệp uy tín</Label>
                  <Select name="isTrusted" defaultValue="false">
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Có</SelectItem>
                      <SelectItem value="false">Không</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Có quỹ bảo hiểm</Label>
                  <Select name="hasInsurance" defaultValue="false">
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Có</SelectItem>
                      <SelectItem value="false">Không</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-rejectReason">Lý do từ chối</Label>
                  <Input id="new-rejectReason" name="rejectReason" className="rounded-xl" />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleCloseAddDialog(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-[#086644] hover:bg-[#086644]/90 text-white"
                disabled={formLoading || uploadingImages}
              >
                {formLoading || uploadingImages ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>{uploadingImages ? "Đang upload..." : "Đang thêm..."}</span>
                  </>
                ) : (
                  "Thêm"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa doanh nghiệp "{selectedBusiness?.name}"? Hành
              động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={formLoading}
              className="bg-[#DC2626] hover:bg-[#DC2626]/90 text-white"
            >
              {formLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Đang xóa...</span>
                </>
              ) : (
                "Xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}