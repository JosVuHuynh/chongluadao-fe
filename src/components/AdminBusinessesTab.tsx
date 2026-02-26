import { useState, useEffect } from 'react';
import { Building2, Pencil, Trash2, Plus, Search, Loader2, CheckCircle2 } from 'lucide-react';
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
import * as adminService from '../services/adminService';
import { toast } from 'sonner@2.0.3';

export function AdminBusinessesTab() {
  const [businesses, setBusinesses] = useState<adminService.Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<adminService.Business | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch businesses from API
  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit };
      if (searchQuery) params.q = searchQuery;
      if (statusFilter !== 'all') {
        // Map filter to API status
        if (statusFilter === 'pending') params.status = 'PENDING';
        if (statusFilter === 'verified') params.status = 'VERIFIED';
        if (statusFilter === 'rejected') params.status = 'REJECTED';
      }
      
      const response = await adminService.getBusinesses(params);
      console.log('API Response:', response); // Debug log
      
      // Helper function to normalize business object (convert snake_case to camelCase)
      const normalizeBusiness = (business: any) => ({
        ...business,
        taxCode: business.taxCode || business.tax_code,
        verifiedBadge: business.verifiedBadge ?? business.verified_badge ?? false,
        createdAt: business.createdAt || business.created_at,
        updatedAt: business.updatedAt || business.updated_at,
      });
      
      // Handle different response structures
      if (response.data && Array.isArray(response.data)) {
        // If API returns { data: [...] }
        setBusinesses(response.data.map(normalizeBusiness));
        setTotal(response.data.length);
      } else if (response.items && Array.isArray(response.items)) {
        // If API returns { items: [...], total: X }
        setBusinesses(response.items.map(normalizeBusiness));
        setTotal(response.total || response.items.length);
      } else if (Array.isArray(response)) {
        // If API returns [...] directly
        setBusinesses(response.map(normalizeBusiness));
        setTotal(response.length);
      } else {
        console.error('Unexpected response structure:', response);
        setBusinesses([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast.error('Không thể tải danh sách doanh nghiệp');
      // Set empty array on error so UI shows "no data" instead of loading forever
      setBusinesses([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [page, searchQuery, statusFilter]);

  const handleEdit = (business: adminService.Business) => {
    setSelectedBusiness(business);
    setEditDialogOpen(true);
  };

  const handleDelete = (business: adminService.Business) => {
    setSelectedBusiness(business);
    setDeleteDialogOpen(true);
  };

  const handleToggleVerified = async (businessId: number, isVerified: boolean) => {
    try {
      await adminService.updateBusiness(businessId, { isVerified: !isVerified });
      toast.success(`${!isVerified ? 'Xác thực' : 'Hủy xác thực'} doanh nghiệp thành công`);
      fetchBusinesses();
    } catch (error: any) {
      toast.error(error.message || 'Không thể cập nhật trạng thái xác thực');
    }
  };

  const confirmDelete = async () => {
    if (!selectedBusiness) return;
    
    try {
      setFormLoading(true);
      await adminService.deleteBusiness(selectedBusiness.id);
      toast.success('Xóa doanh nghiệp thành công');
      fetchBusinesses();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa doanh nghiệp');
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
      await adminService.updateBusiness(selectedBusiness.id, {
        name: formData.get('name') as string,
        taxCode: formData.get('taxCode') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        website: formData.get('website') as string,
        address: formData.get('address') as string,
        description: formData.get('description') as string,
        plan: formData.get('plan') as 'BASIC' | 'PREMIUM' | 'VIP',
        status: formData.get('status') as 'PENDING' | 'VERIFIED' | 'REJECTED',
        verifiedBadge: formData.get('verifiedBadge') === 'true',
      });
      toast.success('Cập nhật doanh nghiệp thành công');
      fetchBusinesses();
      setEditDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Không thể cập nhật doanh nghiệp');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateBusiness = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      setFormLoading(true);
      await adminService.createBusiness({
        name: formData.get('name') as string,
        taxCode: formData.get('taxCode') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        website: formData.get('website') as string,
        address: formData.get('address') as string,
        description: formData.get('description') as string,
      });
      toast.success('Thêm doanh nghiệp thành công');
      fetchBusinesses();
      setAddDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Không thể thêm doanh nghiệp');
    } finally {
      setFormLoading(false);
    }
  };

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
        
        {/* Filters */}
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
                          <TableHead className="text-[#6B7280] pl-6">Tên doanh nghiệp</TableHead>
                          <TableHead className="text-[#6B7280]">MST</TableHead>
                          <TableHead className="text-[#6B7280]">Gói dịch vụ</TableHead>
                          <TableHead className="text-[#6B7280]">Bài viết</TableHead>
                          <TableHead className="text-[#6B7280]">Sản phẩm</TableHead>
                          <TableHead className="text-[#6B7280]">Trạng thái</TableHead>
                          <TableHead className="text-[#6B7280] pr-6">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {businesses.map((business) => (
                          <TableRow key={business.id}>
                            <TableCell className="text-[#1F2937] pl-6">
                              <div className="flex items-center gap-2">
                                {business.name}
                                {business.verifiedBadge && (
                                  <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-[#6B7280]">{business.taxCode}</TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  business.plan === 'PREMIUM' 
                                    ? 'bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90' 
                                    : business.plan === 'VIP'
                                    ? 'bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]/90'
                                    : 'bg-[#6B7280] text-white hover:bg-[#6B7280]/90'
                                }
                              >
                                {business.plan === 'BASIC' ? 'Basic' : business.plan === 'PREMIUM' ? 'Premium' : 'VIP'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-[#6B7280]">
                              {/* Mock data - would come from API in real implementation */}
                              {Math.floor(Math.random() * 50)}
                            </TableCell>
                            <TableCell className="text-[#6B7280]">
                              {/* Mock data - would come from API in real implementation */}
                              {Math.floor(Math.random() * 100)}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  business.status === 'VERIFIED' 
                                    ? 'bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5]/90' 
                                    : business.status === 'PENDING'
                                    ? 'bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7]/90'
                                    : 'bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FEE2E2]/90'
                                }
                              >
                                {business.status === 'VERIFIED' ? 'Đã xác minh' : business.status === 'PENDING' ? 'Chờ xử lý' : 'Từ chối'}
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

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-[#6B7280]">
                  Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, total)} trong tổng số {total}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Chỉnh sửa doanh nghiệp</DialogTitle>
            <DialogDescription className="text-white/80">Cập nhật thông tin doanh nghiệp</DialogDescription>
          </DialogHeader>
          {selectedBusiness && (
            <form onSubmit={handleUpdateBusiness} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên doanh nghiệp *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={selectedBusiness.name}
                  required
                  maxLength={100}
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxCode">Mã số thuế *</Label>
                  <Input
                    id="taxCode"
                    name="taxCode"
                    defaultValue={selectedBusiness.taxCode}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={selectedBusiness.phone}
                    required
                    maxLength={11}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={selectedBusiness.email}
                    required
                    maxLength={50}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    defaultValue={selectedBusiness.website || ''}
                    placeholder="https://example.com"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ *</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={selectedBusiness.address}
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả *</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={selectedBusiness.description}
                  required
                  rows={4}
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan">Gói dịch vụ *</Label>
                  <Select name="plan" defaultValue={selectedBusiness.plan}>
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
                  <Label htmlFor="status">Trạng thái *</Label>
                  <Select name="status" defaultValue={selectedBusiness.status}>
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
              <div className="space-y-2">
                <Label htmlFor="verifiedBadge">Dấu tích xanh *</Label>
                <Select name="verifiedBadge" defaultValue={selectedBusiness.verifiedBadge?.toString() || 'false'}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Có</SelectItem>
                    <SelectItem value="false">Không</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#086644] hover:bg-[#086644]/90 text-white"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    'Lưu'
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Thêm doanh nghiệp mới</DialogTitle>
            <DialogDescription className="text-white/80">Tạo hồ sơ doanh nghiệp mới</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateBusiness} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">Tên doanh nghiệp *</Label>
              <Input
                id="new-name"
                name="name"
                required
                maxLength={100}
                placeholder="Nhập tên doanh nghiệp..."
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-taxCode">Mã số thuế *</Label>
                <Input
                  id="new-taxCode"
                  name="taxCode"
                  required
                  placeholder="0123456789"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-phone">Số điện thoại *</Label>
                <Input
                  id="new-phone"
                  name="phone"
                  type="tel"
                  required
                  maxLength={11}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  placeholder="0xxx xxx xxx"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-email">Email *</Label>
                <Input
                  id="new-email"
                  name="email"
                  type="email"
                  required
                  maxLength={50}
                  placeholder="email@example.com"
                  className="rounded-xl"
                />
              </div>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-address">Địa chỉ *</Label>
              <Input
                id="new-address"
                name="address"
                required
                placeholder="Địa chỉ đầy đủ..."
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-description">Mô tả *</Label>
              <Textarea
                id="new-description"
                name="description"
                required
                rows={4}
                placeholder="Mô tả về doanh nghiệp..."
                className="rounded-xl"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button 
                type="submit" 
                className="bg-[#086644] hover:bg-[#086644]/90 text-white"
                disabled={formLoading}
              >
                {formLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Đang thêm...</span>
                  </>
                ) : (
                  'Thêm'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa doanh nghiệp "{selectedBusiness?.name}"? 
              Hành động này không thể hoàn tác.
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
                'Xóa'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}