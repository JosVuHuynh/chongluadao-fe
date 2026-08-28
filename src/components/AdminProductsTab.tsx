import { useState, useEffect } from 'react';
import { Package, Search, Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import * as shopService from '../services/shopService';
import type { Product, ModerationStatus } from '../services/shopService';
import { toast } from 'sonner@2.0.3';

const STATUS_META: Record<ModerationStatus, { label: string; className: string }> = {
  PENDING: { label: 'Chờ duyệt', className: 'bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7]' },
  APPROVED: { label: 'Đã duyệt', className: 'bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5]' },
  REJECTED: { label: 'Từ chối', className: 'bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FEE2E2]' },
};

export function AdminProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 1, limit: 10 });
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ModerationStatus>('all');

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProducts = async (targetPage = page) => {
    setLoading(true);
    try {
      const result = await shopService.adminGetProducts({
        q: keyword || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        page: targetPage,
        limit: 10,
      });
      setProducts(result.data);
      setPagination(result.pagination);
      setPage(targetPage);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetchProducts(1), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, statusFilter]);

  const handleApprove = async (product: Product) => {
    try {
      await shopService.adminApproveProduct(product.id);
      toast.success('Đã duyệt sản phẩm');
      fetchProducts(page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể duyệt sản phẩm');
    }
  };

  const openReject = (product: Product) => {
    setSelectedProduct(product);
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!selectedProduct || !rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }
    setActionLoading(true);
    try {
      await shopService.adminRejectProduct(selectedProduct.id, rejectReason.trim());
      toast.success('Đã từ chối sản phẩm');
      setRejectDialogOpen(false);
      fetchProducts(page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể từ chối sản phẩm');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-[#1F2937]">Quản lý sản phẩm</CardTitle>
          <p className="mt-1 text-sm text-[#6B7280]">Duyệt sản phẩm doanh nghiệp đăng lên cửa hàng của họ.</p>
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col gap-3 md:flex-row items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm sản phẩm, shop, doanh nghiệp..."
                className="rounded-xl border-0 bg-[#F4F6F8] pl-8"
              />
            </div>

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | ModerationStatus)}>
              <SelectTrigger className="rounded-xl border-0 bg-[#F4F6F8]" style={{ width: '220px' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                <SelectItem value="REJECTED">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-[#086644]" />
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center text-[#6B7280]">Không có sản phẩm phù hợp.</div>
          ) : (
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
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3" style={{ minWidth: '220px' }}>
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border bg-[#F9FAFB] flex items-center justify-center">
                            {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" /> : <Package className="h-5 w-5 text-[#9CA3AF]" />}
                          </div>
                          <div>
                            <p className="text-[#1F2937]">{product.name}</p>
                            <p className="text-xs text-[#6B7280]">{product.category || '—'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#6B7280]">{product.shopName}</TableCell>
                      <TableCell className="text-[#6B7280]">{product.businessName}</TableCell>
                      <TableCell className="text-[#6B7280]">{product.price.toLocaleString('vi-VN')}đ</TableCell>
                      <TableCell className="text-[#6B7280]">{product.stock}</TableCell>
                      <TableCell>
                        <Badge className={STATUS_META[product.status].className}>{STATUS_META[product.status].label}</Badge>
                        {product.status === 'REJECTED' && product.rejectionReason && (
                          <p className="mt-1 text-xs text-[#DC2626] truncate" style={{ maxWidth: '200px' }} title={product.rejectionReason}>
                            {product.rejectionReason}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          {product.buyUrl && (
                            <Button variant="ghost" size="icon" onClick={() => window.open(product.buyUrl!, '_blank')} title="Xem link">
                              <ExternalLink className="h-4 w-4 text-[#6B7280]" />
                            </Button>
                          )}
                          {product.status !== 'APPROVED' && (
                            <Button variant="ghost" size="icon" onClick={() => handleApprove(product)} title="Duyệt">
                              <CheckCircle2 className="h-4 w-4 text-[#065F46]" />
                            </Button>
                          )}
                          {product.status !== 'REJECTED' && (
                            <Button variant="ghost" size="icon" onClick={() => openReject(product)} title="Từ chối">
                              <XCircle className="h-4 w-4 text-[#F59E0B]" />
                            </Button>
                          )}
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
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => fetchProducts(page - 1)}>
                Trước
              </Button>
              <span className="flex items-center px-3 text-sm text-[#6B7280]">
                Trang {page}/{pagination.totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => fetchProducts(page + 1)}>
                Sau
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối sản phẩm</DialogTitle>
            <DialogDescription>Nhập lý do để doanh nghiệp biết cần điều chỉnh gì.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Lý do từ chối *</Label>
            <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="min-h-[100px]" placeholder="VD: Ảnh sản phẩm không rõ ràng, link mua hàng không hợp lệ..." />
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
    </div>
  );
}
