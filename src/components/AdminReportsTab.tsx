import { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, Search, Loader2, ExternalLink, Eye, Image, Plus, Pencil, Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import * as adminService from '../services/adminService';
import { toast } from 'sonner@2.0.3';

const SCAM_TYPES = [
  { id: 1, name: 'Lừa đảo chuyển khoản' },
  { id: 2, name: 'Lừa đảo đầu tư' },
  { id: 3, name: 'Lừa đảo bán hàng' },
  { id: 4, name: 'Lừa đảo việc làm' },
  { id: 5, name: 'Lừa đảo vay tiền' },
  { id: 6, name: 'Lừa đảo trúng thưởng' },
  { id: 7, name: 'Khác' },
];

export function AdminReportsTab() {
  const [reports, setReports] = useState<adminService.Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    limit: 10,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<adminService.Report | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [formLoading, setFormLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state for Add/Edit Report
  const [formData, setFormData] = useState({
    scamTypeId: 1,
    scamTypeOther: '',
    phone: '',
    bankAccount: '',
    relatedLinks: [] as string[],
    description: '',
    reporterName: '',
    contactInfo: '',
  });
  const [linkInput, setLinkInput] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch reports from API
  const fetchReports = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit: pagination.limit };
      if (searchQuery) params.q = searchQuery;
      if (statusFilter !== 'all') params.status = statusFilter.toUpperCase();
      
      const response = await adminService.getReports(params);
      setReports(response.data);
      setPagination({
        totalItems: response.pagination.totalItems,
        totalPages: response.pagination.totalPages,
        limit: response.pagination.limit,
      });
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast.error(error.message || 'Không thể tải danh sách tố cáo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, searchQuery, statusFilter]);

  const handleViewDetail = (report: adminService.Report) => {
    setSelectedReport(report);
    setDetailDialogOpen(true);
  };

  const handleAddNew = () => {
    setIsEditMode(false);
    setFormData({
      scamTypeId: 1,
      scamTypeOther: '',
      phone: '',
      bankAccount: '',
      relatedLinks: [],
      description: '',
      reporterName: '',
      contactInfo: '',
    });
    setEvidenceFiles([]);
    setEvidenceUrls([]);
    setLinkInput('');
    setAddEditDialogOpen(true);
  };

  const handleEdit = (report: adminService.Report) => {
    setIsEditMode(true);
    setSelectedReport(report);
    
    // Populate form data with existing report data
    setFormData({
      scamTypeId: report.scamType?.id || 1,
      scamTypeOther: report.scamTypeOther || '',
      phone: report.phone || '',
      bankAccount: report.bankAccount || '',
      relatedLinks: report.relatedLinks || [],
      description: report.description || '',
      reporterName: report.reporterName || '',
      contactInfo: report.contactInfo || '',
    });
    
    setEvidenceUrls(report.evidenceUrls || []);
    setEvidenceFiles([]);
    setLinkInput('');
    setAddEditDialogOpen(true);
  };

  const handleDelete = (report: adminService.Report) => {
    setSelectedReport(report);
    setDeleteDialogOpen(true);
  };

  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageViewerOpen(true);
  };

  const handleViewImageFromReport = (report: adminService.Report, imageUrl: string) => {
    setSelectedReport(report);
    setSelectedImage(imageUrl);
    setImageViewerOpen(true);
  };

  const handleStatusChange = async (reportId: number, newStatus: string) => {
    try {
      await adminService.updateReport(reportId, { status: newStatus.toUpperCase() });
      toast.success('Cập nhật trạng thái thành công');
      fetchReports();
    } catch (error: any) {
      toast.error(error.message || 'Không thể cập nhật trạng thái');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalFiles = evidenceFiles.length + files.length + evidenceUrls.length;
    
    if (totalFiles > 5) {
      toast.warning('Chỉ được upload tối đa 5 ảnh');
      return;
    }
    
    setEvidenceFiles([...evidenceFiles, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setEvidenceFiles(evidenceFiles.filter((_, i) => i !== index));
  };

  const handleRemoveUrl = (index: number) => {
    setEvidenceUrls(evidenceUrls.filter((_, i) => i !== index));
  };

  const handleAddLink = () => {
    if (linkInput.trim() && !formData.relatedLinks.includes(linkInput.trim())) {
      setFormData({
        ...formData,
        relatedLinks: [...formData.relatedLinks, linkInput.trim()]
      });
      setLinkInput('');
    }
  };

  const handleRemoveLink = (index: number) => {
    setFormData({
      ...formData,
      relatedLinks: formData.relatedLinks.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async () => {
    try {
      setFormLoading(true);
      setUploadProgress(0);

      // Upload images if any
      let uploadedUrls = [...evidenceUrls];
      if (evidenceFiles.length > 0) {
        for (let i = 0; i < evidenceFiles.length; i++) {
          // const url = await uploadImageToCloudinary(evidenceFiles[i]);
          // uploadedUrls.push(url);
          // setUploadProgress(Math.round(((i + 1) / evidenceFiles.length) * 100));
        }
      }

      if (isEditMode && selectedReport) {
        // Update existing report - Admin can update ALL fields
        await adminService.updateReport(selectedReport.id, {
          scamTypeId: formData.scamTypeId,
          scamTypeOther: formData.scamTypeOther,
          phone: formData.phone,
          bankAccount: formData.bankAccount,
          relatedLinks: formData.relatedLinks,
          description: formData.description,
          reporterName: formData.reporterName,
          contactInfo: formData.contactInfo,
          evidenceUrls: uploadedUrls,
        });
        toast.success('Cập nhật tố cáo thành công');
      } else {
        // Create new report
        await adminService.createReport({
          ...formData,
          evidenceUrls: uploadedUrls,
        });
        toast.success('Thêm tố cáo thành công');
      }

      setAddEditDialogOpen(false);
      fetchReports();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setFormLoading(false);
      setUploadProgress(0);
    }
  };

  const confirmDelete = async () => {
    if (!selectedReport) return;
    
    try {
      setFormLoading(true);
      await adminService.deleteReport(selectedReport.id);
      toast.success('Xóa tố cáo thành công');
      fetchReports();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa tố cáo');
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-[#FEF3C7] text-[#92400E]',
      VERIFIED: 'bg-[#D1FAE5] text-[#065F46]',
      REJECTED: 'bg-[#FEE2E2] text-[#991B1B]',
    };
    return styles[status as keyof typeof styles] || styles.PENDING;
  };

  const getStatusText = (status: string) => {
    const texts = {
      PENDING: 'Chờ xử lý',
      VERIFIED: 'Đã xác minh',
      REJECTED: 'Từ chối',
    };
    return texts[status as keyof typeof texts] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b space-y-0 pb-4">
          <CardTitle className="text-[#1F2937]">Quản lý tố cáo</CardTitle>
        </CardHeader>
        
        {/* Filters */}
        <div className="p-6 border-b flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <Input
                placeholder="Tìm kiếm theo SĐT, STK, tên người tố cáo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="verified">Đã xác minh</SelectItem>
              <SelectItem value="rejected">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#086644]" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 mx-auto text-[#6B7280] mb-4" />
              <p className="text-[#6B7280]">Không tìm thấy tố cáo nào</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-6">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-[#6B7280] pl-6">ID</TableHead>
                          <TableHead className="text-[#6B7280]">Loại</TableHead>
                          <TableHead className="text-[#6B7280]">SĐT / STK</TableHead>
                          <TableHead className="text-[#6B7280]">Ngư���i tố cáo</TableHead>
                          <TableHead className="text-[#6B7280]">Bằng chứng</TableHead>
                          <TableHead className="text-[#6B7280]">Ngày tạo</TableHead>
                          <TableHead className="text-[#6B7280]">Trạng thái</TableHead>
                          <TableHead className="text-[#6B7280] pr-6">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="text-[#1F2937] pl-6">#{report.id}</TableCell>
                            <TableCell className="text-[#6B7280]">
                              {report.scamType?.name || 'N/A'}
                            </TableCell>
                            <TableCell className="text-[#6B7280]">
                              <div className="max-w-[150px]">
                                <div className="truncate">{report.phone || 'N/A'}</div>
                                <div className="truncate text-xs text-[#9CA3AF]">{report.bankAccount || 'N/A'}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-[#6B7280]">
                              <div className="max-w-[120px]">
                                <div className="truncate">{report.reporterName}</div>
                                <div className="truncate text-xs text-[#9CA3AF]">{report.contactInfo}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {report.evidenceUrls && report.evidenceUrls.length > 0 ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewImageFromReport(report, report.evidenceUrls[0])}
                                  className="text-[#3B82F6] hover:text-[#2563EB]"
                                >
                                  <Image className="h-4 w-4 mr-1" />
                                  {report.evidenceUrls.length} ảnh
                                </Button>
                              ) : (
                                <span className="text-[#9CA3AF] text-sm">Không có</span>
                              )}
                            </TableCell>
                            <TableCell className="text-[#6B7280]">
                              {formatDate(report.createdAt)}
                            </TableCell>
                            <TableCell>
                              <Select 
                                value={report.status.toLowerCase()} 
                                onValueChange={(value) => handleStatusChange(report.id, value)}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <Badge className={`${getStatusBadge(report.status)} border-0`}>
                                    {getStatusText(report.status)}
                                  </Badge>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                                  <SelectItem value="verified">Đã xác minh</SelectItem>
                                  <SelectItem value="rejected">Từ chối</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="pr-6">
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetail(report)}
                                  className="hover:bg-[#D1FAE5]"
                                  title="Xem chi tiết"
                                >
                                  <Eye className="h-4 w-4 text-[#10B981]" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(report)}
                                  className="hover:bg-[#DBEAFE]"
                                  title="Chỉnh sửa"
                                >
                                  <Pencil className="h-4 w-4 text-[#3B82F6]" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(report)}
                                  className="hover:bg-[#FEE2E2]"
                                  title="Xóa"
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
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <div className="text-sm text-[#6B7280]">
                    Hiển thị <span className="font-medium text-[#1F2937]">{reports.length}</span> trong tổng số{' '}
                    <span className="font-medium text-[#1F2937]">{pagination.totalItems}</span> tố cáo
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= pagination.totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Chi tiết tố cáo #{selectedReport?.id}</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#6B7280]">Loại lừa đảo</Label>
                  <p className="text-[#1F2937] font-medium">{selectedReport.scamType?.name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-[#6B7280]">Trạng thái</Label>
                  <Badge className={`${getStatusBadge(selectedReport.status)} border-0 mt-1`}>
                    {getStatusText(selectedReport.status)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#6B7280]">Số điện thoại</Label>
                  <p className="text-[#1F2937]">{selectedReport.phone || 'Không có'}</p>
                </div>
                <div>
                  <Label className="text-[#6B7280]">Số tài khoản</Label>
                  <p className="text-[#1F2937]">{selectedReport.bankAccount || 'Không có'}</p>
                </div>
              </div>

              <div>
                <Label className="text-[#6B7280]">Người tố cáo</Label>
                <p className="text-[#1F2937]">{selectedReport.reporterName}</p>
                <p className="text-[#6B7280] text-sm">{selectedReport.contactInfo}</p>
              </div>

              {selectedReport.relatedLinks && selectedReport.relatedLinks.length > 0 && (
                <div>
                  <Label className="text-[#6B7280]">Liên kết liên quan</Label>
                  <div className="space-y-1 mt-1">
                    {selectedReport.relatedLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-[#3B82F6] hover:underline text-sm"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label className="text-[#6B7280]">Mô tả chi tiết</Label>
                <p className="text-[#1F2937] whitespace-pre-wrap">{selectedReport.description}</p>
              </div>

              {selectedReport.evidenceUrls && selectedReport.evidenceUrls.length > 0 && (
                <div>
                  <Label className="text-[#6B7280]">Bằng chứng ({selectedReport.evidenceUrls.length} ảnh)</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {selectedReport.evidenceUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border border-[#E5E7EB] cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleViewImage(url)}
                      >
                        <img
                          src={url}
                          alt={`Evidence ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm text-[#6B7280] pt-4 border-t">
                <div>
                  <span className="font-medium">Ngày tạo:</span> {formatDate(selectedReport.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Cập nhật:</span> {formatDate(selectedReport.updatedAt)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={addEditDialogOpen} onOpenChange={setAddEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-[#1F2937]">{isEditMode ? 'Chỉnh sửa tố cáo' : 'Thêm tố cáo mới'}</DialogTitle>
            <DialogDescription className="text-[#6B7280]">
              {isEditMode ? 'Admin có thể chỉnh sửa tất cả thông tin' : 'Điền đầy đủ thông tin để thêm tố cáo mới'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Tên người lừa đảo *</Label>
                <Input
                  value={formData.reporterName}
                  onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <Label className="mb-2 block">SĐT/Email người lừa đảo *</Label>
                <Input
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                  placeholder="0987654321 hoặc email@example.com"
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Loại lừa đảo *</Label>
              <Select 
                value={formData.scamTypeId.toString()} 
                onValueChange={(value) => setFormData({ ...formData, scamTypeId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCAM_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.scamTypeId === 7 && (
              <div>
                <Label className="mb-2 block">Loại khác (mô tả) *</Label>
                <Input
                  value={formData.scamTypeOther}
                  onChange={(e) => setFormData({ ...formData, scamTypeOther: e.target.value })}
                  placeholder="VD: Lừa đảo qua mạng xã hội"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Số điện thoại *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0123456789"
                />
              </div>
              <div>
                <Label className="mb-2 block">Số tài khoản *</Label>
                <Input
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  placeholder="1234567890 - Vietcombank"
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Liên kết liên quan</Label>
              <div className="flex gap-2">
                <Input
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="https://example.com"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLink()}
                />
                <Button type="button" onClick={handleAddLink} className="shrink-0">Thêm</Button>
              </div>
              {formData.relatedLinks.length > 0 && (
                <div className="mt-2 space-y-2">
                  {formData.relatedLinks.map((link, index) => (
                    <div key={index} className="flex items-center justify-between bg-[#F3F4F6] px-3 py-2 rounded">
                      <span className="text-sm truncate flex-1">{link}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLink(index)}
                        className="shrink-0 ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className="mb-2 block">Mô tả chi tiết *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả chi tiết hành vi lừa đảo..."
                rows={4}
              />
            </div>

            <div className="pt-2">
              <Label className="mb-2 block">Bằng chứng (Tối đa 5 ảnh)</Label>
              <div className="space-y-3">
                {/* Existing URLs (for edit mode) */}
                {evidenceUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {evidenceUrls.map((url, index) => (
                      <div key={`url-${index}`} className="relative">
                        <img src={url} alt="" className="w-full h-28 object-cover rounded-lg border" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => handleRemoveUrl(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New files to upload */}
                {evidenceFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {evidenceFiles.map((file, index) => (
                      <div key={`file-${index}`} className="relative">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="" 
                          className="w-full h-28 object-cover rounded-lg border" 
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button */}
                {(evidenceFiles.length + evidenceUrls.length) < 5 && (
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      id="evidence-upload"
                    />
                    <label htmlFor="evidence-upload">
                      <Button type="button" variant="outline" className="w-full h-11" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Chọn ảnh ({evidenceFiles.length + evidenceUrls.length}/5)
                        </span>
                      </Button>
                    </label>
                  </div>
                )}

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-[#E5E7EB] rounded-full h-2">
                    <div 
                      className="bg-[#086644] h-2 rounded-full transition-all" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setAddEditDialogOpen(false)} disabled={formLoading}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={formLoading} className="bg-[#086644] hover:bg-[#086644]/90 text-white">
              {formLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {uploadProgress > 0 ? `Đang upload (${uploadProgress}%)` : 'Đang xử lý...'}
                </>
              ) : (
                isEditMode ? 'Cập nhật' : 'Thêm tố cáo'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Viewer Dialog */}
      <Dialog open={imageViewerOpen} onOpenChange={setImageViewerOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Xem bằng chứng</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img src={selectedImage} alt="Evidence" className="max-w-full max-h-[70vh] object-contain" />
          </div>
          
          {selectedReport && selectedReport.evidenceUrls && selectedReport.evidenceUrls.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-4">
              {selectedReport.evidenceUrls.map((url, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded overflow-hidden border-2 ${
                    url === selectedImage ? 'border-[#086644]' : 'border-[#E5E7EB]'
                  }`}
                  onClick={() => setSelectedImage(url)}
                >
                  <img src={url} alt={`Thumb ${index + 1}`} className="w-full h-16 object-cover" />
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tố cáo</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tố cáo #{selectedReport?.id}? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={formLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={formLoading}
              className="bg-[#DC2626] hover:bg-[#DC2626]/90"
            >
              {formLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xóa...
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