import { useState, useEffect } from 'react';
import { Store, Trash2, Search, Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import * as shopService from '../services/shopService';
import type { Shop, ModerationStatus } from '../services/shopService';
import { toast } from 'sonner@2.0.3';

const STATUS_META: Record<ModerationStatus, { label: string; className: string }> = {
  PENDING: { label: 'Chờ xử lý', className: 'bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7]' },
  APPROVED: { label: 'Đã xác minh', className: 'bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5]' },
  REJECTED: { label: 'Từ chối', className: 'bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FEE2E2]' },
};

export function AdminShopsTab() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 1, limit: 10 });
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ModerationStatus>('all');

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchShops = async (targetPage = page) => {
    setLoading(true);
    try {
      const result = await shopService.adminGetShops({
        q: keyword || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        page: targetPage,
        limit: 10,
      });
      setShops(result.data);
      setPagination(result.pagination);
      setPage(targetPage);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể tải danh sách cửa hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetchShops(1), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, statusFilter]);

  const handleApprove = async (shop: Shop) => {
    try {
      await shopService.adminApproveShop(shop.id);
      toast.success('Đã duyệt cửa hàng');
      fetchShops(page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể duyệt cửa hàng');
    }
  };

  const openReject = (shop: Shop) => {
    setSelectedShop(shop);
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!selectedShop || !rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }
    setActionLoading(true);
    try {
      await shopService.adminRejectShop(selectedShop.id, rejectReason.trim());
      toast.success('Đã từ chối cửa hàng');
      setRejectDialogOpen(false);
      fetchShops(page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể từ chối cửa hàng');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleFeatured = async (shop: Shop) => {
    try {
      await shopService.adminSetShopFeatured(shop.id, !shop.isFeatured);
      setShops((prev) => prev.map((s) => (s.id === shop.id ? { ...s, isFeatured: !s.isFeatured } : s)));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể cập nhật');
    }
  };

  const confirmDelete = async () => {
    if (!selectedShop) return;
    try {
      await shopService.adminDeleteShop(selectedShop.id);
      toast.success('Đã xóa cửa hàng');
      setDeleteDialogOpen(false);
      fetchShops(page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể xóa cửa hàng');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-[#1F2937]">Quản lý cửa hàng</CardTitle>
          <p className="mt-1 text-sm text-[#6B7280]">Duyệt hồ sơ shop của doanh nghiệp trước khi hiển thị công khai.</p>
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col gap-3 md:flex-row items-center">
            <div className="relative w-full flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm theo tên shop, doanh nghiệp..."
                className="h-11 w-full rounded-xl border-0 bg-[#F4F6F8] pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | ModerationStatus)}>
              <SelectTrigger className="h-11 rounded-xl border-0 bg-[#F4F6F8]" style={{ width: '220px' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                <SelectItem value="APPROVED">Đã xác minh</SelectItem>
                <SelectItem value="REJECTED">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-[#086644]" />
            </div>
          ) : shops.length === 0 ? (
            <div className="py-12 text-center text-[#6B7280]">Không có cửa hàng phù hợp.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cửa hàng</TableHead>
                    <TableHead>Doanh nghiệp</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Nổi bật</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {shops.map((shop) => (
                    <TableRow key={shop.id}>
                      <TableCell>
                        <div className="flex items-center gap-3" style={{ minWidth: '220px' }}>
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border bg-[#F9FAFB] flex items-center justify-center">
                            {shop.logoUrl ? <img src={shop.logoUrl} alt={shop.name} className="h-full w-full object-cover" /> : <Store className="h-5 w-5 text-[#9CA3AF]" />}
                          </div>
                          <div>
                            <p className="text-[#1F2937]">{shop.name}</p>
                            <p className="text-xs text-[#6B7280]">/{shop.slug}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#6B7280]">{shop.businessName}</TableCell>
                      <TableCell className="text-[#6B7280]">{shop.category || '—'}</TableCell>
                      <TableCell className="text-[#6B7280]">{shop.productCount}</TableCell>
                      <TableCell>
                        <Switch checked={shop.isFeatured} onCheckedChange={() => handleToggleFeatured(shop)} />
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_META[shop.status].className}>{STATUS_META[shop.status].label}</Badge>
                        {shop.status === 'REJECTED' && shop.rejectionReason && (
                          <p className="mt-1 text-xs text-[#DC2626] truncate" style={{ maxWidth: '200px' }} title={shop.rejectionReason}>
                            {shop.rejectionReason}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          {shop.website && (
                            <Button variant="ghost" size="icon" onClick={() => window.open(shop.website!, '_blank')}>
                              <ExternalLink className="h-4 w-4 text-[#6B7280]" />
                            </Button>
                          )}
                          {shop.status !== 'APPROVED' && (
                            <Button variant="ghost" size="icon" onClick={() => handleApprove(shop)} title="Duyệt">
                              <CheckCircle2 className="h-4 w-4 text-[#065F46]" />
                            </Button>
                          )}
                          {shop.status !== 'REJECTED' && (
                            <Button variant="ghost" size="icon" onClick={() => openReject(shop)} title="Từ chối">
                              <XCircle className="h-4 w-4 text-[#F59E0B]" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedShop(shop);
                              setDeleteDialogOpen(true);
                            }}
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => fetchShops(page - 1)}>
                Trước
              </Button>
              <span className="flex items-center px-3 text-sm text-[#6B7280]">
                Trang {page}/{pagination.totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => fetchShops(page + 1)}>
                Sau
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối cửa hàng</DialogTitle>
            <DialogDescription>Nhập lý do để doanh nghiệp biết cần điều chỉnh gì.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Lý do từ chối *</Label>
            <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="min-h-[100px]" placeholder="VD: Thiếu thông tin liên hệ, ảnh bìa chưa rõ thương hiệu..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={confirmReject} disabled={actionLoading} className="bg-[#DC2626] text-white hover:bg-[#DC2626]/90">
              {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa cửa hàng?</AlertDialogTitle>
            <AlertDialogDescription>
              Xóa "{selectedShop?.name}" sẽ xóa luôn toàn bộ sản phẩm của cửa hàng này. Hành động không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction className="bg-[#DC2626] text-white hover:bg-[#DC2626]/90" onClick={confirmDelete}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
