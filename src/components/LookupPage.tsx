import { Search, AlertTriangle, CheckCircle, Building2, User, Phone, Mail, Calendar, Star, Globe, MapPin, ExternalLink, Loader2, CheckCircle2, Check, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState, useEffect } from 'react';
import * as searchService from '../services/searchService';
import { toast } from 'sonner@2.0.3';

interface LookupPageProps {
  initialQuery?: string;
}

export function LookupPage({ initialQuery = '' }: LookupPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState<searchService.Business[]>([]);
  const [scams, setScams] = useState<searchService.Scam[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [pagination, setPagination] = useState({
    businesses: { page: 1, limit: 10, totalItems: 0, totalPages: 0 },
    scams: { page: 1, limit: 10, totalItems: 0, totalPages: 0 },
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Vui lòng nhập thông tin tra cứu');
      return;
    }

    try {
      setLoading(true);
      const response = await searchService.search(searchQuery, 1, 10);
      
      setBusinesses(response.businesses || []);
      setScams(response.scams || []);
      setPagination(response.pagination);
      setHasSearched(true);

      if (response.businesses.length === 0 && response.scams.length === 0) {
        toast.info('Không tìm thấy kết quả phù hợp');
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error(error.message || 'Không thể tra cứu thông tin');
      setBusinesses([]);
      setScams([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search when initialQuery is provided
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setSearchQuery(initialQuery);
      setLoading(true);
      // Trigger search automatically
      searchService.search(initialQuery, 1, 10)
        .then(response => {
          setBusinesses(response.businesses || []);
          setScams(response.scams || []);
          setPagination(response.pagination);
          setHasSearched(true);
        })
        .catch(error => {
          console.error('Auto-search error:', error);
          toast.error('Không thể tra cứu thông tin');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [initialQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-[#D1FAE5] text-[#065F46] border-0">Uy tín</Badge>;
      case 'warning':
        return <Badge className="bg-[#FEF3C7] text-[#92400E] border-0">Cảnh báo</Badge>;
      case 'danger':
        return <Badge className="bg-[#FEE2E2] text-[#991B1B] border-0">Nguy hiểm</Badge>;
      default:
        return <Badge className="bg-[#E5E7EB] text-[#6B7280] border-0">Chưa xác minh</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-[#065F46]';
      case 'warning':
        return 'text-[#92400E]';
      case 'danger':
        return 'text-[#991B1B]';
      default:
        return 'text-[#6B7280]';
    }
  };

  const handleViewDetail = (item: any) => {
    setSelectedItem(item);
    setDetailDialogOpen(true);
  };

  const handleReport = (item: any) => {
    setSelectedItem(item);
    setReportDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-[#A8E6CF] to-[#086644]">
            <Search className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-[#086644]">Tra cứu thông tin</h1>
          <p className="text-[#6b7280] max-w-2xl mx-auto">
            Kiểm tra độ tin cậy của người, doanh nghiệp hoặc website trước khi giao dịch
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 border-0 shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Nhập số điện thoại, tên doanh nghiệp, website..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="h-12 rounded-xl"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white hover:opacity-90 rounded-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Đang tìm...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Tra cứu
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Tips */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-[#6b7280]">Ví dụ:</span>
                {['0901234567', 'Công ty ABC', 'example.com'].map((example) => (
                  <button
                    key={example}
                    onClick={() => setSearchQuery(example)}
                    className="text-sm px-3 py-1 rounded-full bg-[#F4F6F8] text-[#086644] hover:bg-[#A8E6CF] transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: CheckCircle,
              title: 'Dữ liệu chính xác',
              description: 'Cập nhật liên tục từ cộng đồng',
              color: 'text-[#086644]',
            },
            {
              icon: AlertTriangle,
              title: 'Cảnh báo kịp thời',
              description: 'Phát hiện lừa đảo nhanh chóng',
              color: 'text-[#F8B400]',
            },
            {
              icon: Building2,
              title: 'Xác thực doanh nghiệp',
              description: 'Kiểm tra thông tin MST',
              color: 'text-[#A8E6CF]',
            },
          ].map((item, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`flex-shrink-0 ${item.color}`}>
                  <item.icon className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-sm text-[#086644]">{item.title}</div>
                  <div className="text-xs text-[#6b7280]">{item.description}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Results */}
        {hasSearched && (businesses.length > 0 || scams.length > 0) && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[#086644]">Kết quả tra cứu</h2>
              <span className="text-sm text-[#6b7280]">
                Tìm thấy {businesses.length + scams.length} kết quả
              </span>
            </div>

            {/* Business Results */}
            {businesses.map((business) => {
              // Map business status to display status
              const displayStatus = business.status === 'VERIFIED' ? 'verified' : 
                                   business.status === 'REJECTED' ? 'danger' : 'warning';
              
              // Check if business has verified badge - now it's normalized
              const hasVerifiedBadge = business.verifiedBadge === 1 && displayStatus === 'verified';
              
              return (
              <Card key={business.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon - Always green background for verified businesses */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl flex-shrink-0 bg-[#D1FAE5]">
                      <Building2 className={`h-8 w-8 ${
                        displayStatus === 'verified' ? 'text-[#065F46]' :
                        displayStatus === 'warning' ? 'text-[#92400E]' :
                        'text-[#991B1B]'
                      }`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-[#1F2937]">{business.name}</h3>
                            {/* Verified Badge - Facebook style: Blue circle with white checkmark */}
                            {hasVerifiedBadge && (
                              <div className="relative inline-flex items-center justify-center h-5 w-5 bg-[#1877F2] rounded-full flex-shrink-0">
                                <Check className="h-3 w-3 text-white stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(displayStatus)}
                            <Badge variant="outline" className="border-[#E5E7EB] text-[#6B7280]">
                              Doanh nghiệp
                            </Badge>
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
                          </div>
                          <div className="space-y-1 text-sm text-[#6B7280]">
                            {business.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{business.phone}</span>
                              </div>
                            )}
                            {business.taxCode && (
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                <span>MST: {business.taxCode}</span>
                              </div>
                            )}
                            {business.website && (
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                <span>{business.website}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {business.description && (
                        <div className="mb-4 p-3 bg-[#F9FAFB] rounded-xl">
                          <p className="text-sm text-[#6B7280]">{business.description}</p>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 p-4 bg-[#F9FAFB] rounded-xl">
                        <div>
                          <p className="text-xs text-[#6B7280] mb-1">Email</p>
                          <p className="text-[#1F2937] text-sm truncate">{business.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#6B7280] mb-1">Địa chỉ</p>
                          <p className="text-[#1F2937] text-sm truncate">{business.address}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#6B7280] mb-1">Trạng thái</p>
                          <p className={getStatusColor(displayStatus)}>
                            {displayStatus === 'verified' ? 'Đã xác thực' : displayStatus === 'warning' ? 'Chờ xử lý' : 'Từ chối'}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-xl"
                          onClick={() => handleViewDetail({ ...business, type: 'business', status: displayStatus, verifiedBadge: hasVerifiedBadge ? 1 : 0 })}
                        >
                          Xem chi tiết
                        </Button>
                        {/* Hide report button for verified businesses */}
                        {displayStatus !== 'verified' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-xl border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white"
                            onClick={() => handleReport({ ...business, type: 'business', status: displayStatus })}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Tố cáo
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )})}

            {/* Scam Results */}
            {scams.map((scam, index) => {
              // Map scam status to display status
              const displayStatus = scam.status === 'SAFE' ? 'verified' : 
                                   scam.status === 'DANGER' ? 'danger' : 'warning';
              
              // Format date
              const formattedDate = new Date(scam.latestReportedAt).toLocaleDateString('vi-VN');
              
              return (
              <Card key={`scam-${index}`} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl flex-shrink-0 ${
                      displayStatus === 'verified' ? 'bg-[#D1FAE5]' :
                      displayStatus === 'warning' ? 'bg-[#FEF3C7]' :
                      'bg-[#FEE2E2]'
                    }`}>
                      <User className={`h-8 w-8 ${
                        displayStatus === 'verified' ? 'text-[#065F46]' :
                        displayStatus === 'warning' ? 'text-[#92400E]' :
                        'text-[#991B1B]'
                      }`} />
                    </div>

                    {/* Warning Icon */}
                    {displayStatus === 'warning' && (
                      <div className="absolute top-4 left-4">
                        <AlertTriangle className="h-10 w-10 text-[#F59E0B]" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                   <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-[#1F2937] mb-2">
                            {scam.scammerName ? scam.scammerName : scam.phone}
                          </h3>

                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(displayStatus)}
                            {/* <Badge variant="outline" className="border-[#E5E7EB] text-[#6B7280]">
                              Số điện thoại
                            </Badge> */}
                          </div>

                          <div className="space-y-1 text-sm text-[#6B7280]">
                            {/* Nếu có scammerName thì show phone bên dưới */}
                            {scam.scammerName ? (
                              scam.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  <span>{scam.phone}</span>
                                </div>
                              )
                            ) : (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{scam.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 p-4 bg-[#F9FAFB] rounded-xl">
                        <div>
                          <p className="text-xs text-[#6B7280] mb-1">Số tố cáo</p>
                          <p className={scam.totalReports > 0 ? 'text-[#DC2626] font-semibold' : 'text-[#1F2937]'}>
                            {scam.totalReports}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#6B7280] mb-1">Tố cáo gần nhất</p>
                          <p className="text-[#1F2937] text-sm">{formattedDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#6B7280] mb-1">Mức độ</p>
                          <p className={getStatusColor(displayStatus)}>
                            {displayStatus === 'verified' ? 'An toàn' : displayStatus === 'warning' ? 'Cảnh báo' : 'Nguy hiểm'}
                          </p>
                        </div>
                      </div>

                      {/* Warning Reason */}
                      {scam.reason && (
                        <div className="mb-4 p-3 bg-[#FEF3C7] rounded-xl border border-[#FCD34D]">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-[#F59E0B] mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-[#92400E]">
                              <strong>Lý do:</strong> {scam.reason}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-xl"
                          onClick={() => handleViewDetail({ 
                            ...scam, 
                            type: 'person', 
                            status: displayStatus,
                            name: scam.scammerName || scam.phone,
                            reportCount: scam.totalReports,
                            lastReport: formattedDate
                          })}
                        >
                          Xem chi tiết
                        </Button>
                        
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )})}
          </div>
        )}

        {/* Empty State - No Search Yet */}
        {!hasSearched && !loading && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-12 text-center space-y-4">
              <Search className="h-16 w-16 text-[#6b7280] mx-auto" />
              <h3 className="text-[#333333]">Nhập thông tin để bắt đầu tra cứu</h3>
              <p className="text-[#6b7280] max-w-md mx-auto">
                Bạn có thể tra cứu bằng số điện thoại, tên doanh nghiệp hoặc địa chỉ website
              </p>
            </CardContent>
          </Card>
        )}

        {/* Empty State - No Results Found */}
        {hasSearched && businesses.length === 0 && scams.length === 0 && !loading && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-12 text-center space-y-4">
              <AlertTriangle className="h-16 w-16 text-[#6b7280] mx-auto" />
              <h3 className="text-[#333333]">Không tìm thấy kết quả</h3>
              <p className="text-[#6b7280] max-w-md mx-auto">
                Không tìm thấy thông tin phù hợp với từ khóa "{searchQuery}". Vui lòng thử lại với từ khóa khác.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-12 text-center space-y-4">
              <Loader2 className="h-16 w-16 text-[#086644] mx-auto animate-spin" />
              <h3 className="text-[#333333]">Đang tra cứu...</h3>
              <p className="text-[#6b7280] max-w-md mx-auto">
                Vui lòng đợi trong giây lát
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1F2937]">Thông tin chi tiết</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl flex-shrink-0 ${
                  selectedItem.status === 'verified' ? 'bg-[#D1FAE5]' :
                  selectedItem.status === 'warning' ? 'bg-[#FEF3C7]' :
                  'bg-[#FEE2E2]'
                }`}>
                  {selectedItem.type === 'business' ? (
                    <Building2 className={`h-8 w-8 ${getStatusColor(selectedItem.status)}`} />
                  ) : (
                    <User className={`h-8 w-8 ${getStatusColor(selectedItem.status)}`} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-[#1F2937]">{selectedItem.name}</h3>
                    {/* Verified Badge in Dialog - Facebook style: Blue circle with white checkmark */}
                    {selectedItem.verifiedBadge === 1 && selectedItem.status === 'verified' && (
                      <div className="relative inline-flex items-center justify-center h-5 w-5 bg-[#1877F2] rounded-full flex-shrink-0">
                        <Check className="h-3 w-3 text-white stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedItem.status)}
                    <Badge variant="outline" className="border-[#E5E7EB] text-[#6B7280]">
                      {selectedItem.type === 'business' ? 'Doanh nghiệp' : 'Cá nhân'}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="text-sm text-[#6B7280]">Thông tin liên hệ</h4>
                <div className="space-y-2">
                  {selectedItem.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-[#6B7280]" />
                      <span className="text-[#1F2937]">{selectedItem.phone}</span>
                    </div>
                  )}
                  {selectedItem.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-[#6B7280]" />
                      <span className="text-[#1F2937]">{selectedItem.email}</span>
                    </div>
                  )}
                  {selectedItem.website && (
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="h-4 w-4 text-[#6B7280]" />
                      <a href={`https://${selectedItem.website}`} target="_blank" rel="noopener noreferrer" className="text-[#086644] hover:underline flex items-center gap-1">
                        {selectedItem.website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  {selectedItem.address && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-[#6B7280]" />
                      <span className="text-[#1F2937]">{selectedItem.address}</span>
                    </div>
                  )}
                  {selectedItem.taxCode && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="h-4 w-4 text-[#6B7280]" />
                      <span className="text-[#1F2937]">MST: {selectedItem.taxCode}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#F9FAFB] rounded-xl">
                  <p className="text-xs text-[#6B7280] mb-1">Đánh giá</p>
                  <div className="flex items-center gap-1">
                    <span className={`text-2xl ${getStatusColor(selectedItem.status)}`}>{selectedItem.rating}</span>
                    <Star className="h-5 w-5 text-[#F59E0B] fill-current" />
                  </div>
                </div>
                {/* Hide report count and last report for businesses */}
                {selectedItem.type !== 'business' && (
                  <>
                    <div className="p-4 bg-[#F9FAFB] rounded-xl">
                      <p className="text-xs text-[#6B7280] mb-1">Số tố cáo</p>
                      <p className={`text-2xl ${selectedItem.reportCount > 0 ? 'text-[#DC2626]' : 'text-[#1F2937]'}`}>
                        {selectedItem.reportCount}
                      </p>
                    </div>
                    <div className="p-4 bg-[#F9FAFB] rounded-xl">
                      <p className="text-xs text-[#6B7280] mb-1">Tố cáo gần nhất</p>
                      <p className="text-[#1F2937]">{selectedItem.lastReport}</p>
                    </div>
                  </>
                )}
                {/* Show verification date for businesses */}
                {selectedItem.type === 'business' && selectedItem.verifiedDate && (
                  <div className="p-4 bg-[#F9FAFB] rounded-xl">
                    <p className="text-xs text-[#6B7280] mb-1">Ngày xác thực</p>
                    <p className="text-[#1F2937]">{selectedItem.verifiedDate}</p>
                  </div>
                )}
                <div className="p-4 bg-[#F9FAFB] rounded-xl">
                  <p className="text-xs text-[#6B7280] mb-1">Trạng thái</p>
                  <p className={getStatusColor(selectedItem.status)}>
                    {selectedItem.status === 'verified' ? 'Uy tín' : selectedItem.status === 'warning' ? 'Cảnh báo' : 'Nguy hiểm'}
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedItem.description && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="text-sm text-[#6B7280]">Mô tả</h4>
                    <p className="text-sm text-[#1F2937]">{selectedItem.description}</p>
                  </div>
                </>
              )}

              {/* Services */}
              {selectedItem.services && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="text-sm text-[#6B7280]">Dịch vụ</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.services.map((service: string, index: number) => (
                        <Badge key={index} variant="outline" className="border-[#086644] text-[#086644]">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Warning */}
              {selectedItem.reason && (
                <>
                  <Separator />
                  <div className="p-4 bg-[#FEF3C7] rounded-xl border border-[#FCD34D]">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertTriangle className="h-5 w-5 text-[#F59E0B] mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm text-[#92400E] mb-1">Cảnh báo</h4>
                        <p className="text-sm text-[#92400E]">{selectedItem.reason}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Evidence Images - Only for scams/persons */}
              {selectedItem.type === 'person' && selectedItem.evidenceUrls && selectedItem.evidenceUrls.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-[#6B7280]" />
                      <h4 className="text-sm text-[#6B7280]">Ảnh bằng chứng ({selectedItem.evidenceUrls.length})</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedItem.evidenceUrls.map((url: string, index: number) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative aspect-square rounded-xl overflow-hidden bg-[#F9FAFB] hover:opacity-80 transition-opacity group"
                        >
                          <img
                            src={url}
                            alt={`Bằng chứng ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback if image fails to load
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23F3F4F6" width="100" height="100"/%3E%3Ctext fill="%239CA3AF" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <ExternalLink className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Related Links - Only for scams/persons */}
              {selectedItem.type === 'person' && selectedItem.relatedLinks && selectedItem.relatedLinks.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-[#6B7280]" />
                      <h4 className="text-sm text-[#6B7280]">Liên kết liên quan</h4>
                    </div>
                    <div className="space-y-2">
                      {selectedItem.relatedLinks.map((link: string, index: number) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg hover:bg-[#E5E7EB] transition-colors group"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#086644]/10 flex-shrink-0">
                            <Globe className="h-4 w-4 text-[#086644]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#086644] group-hover:underline truncate">{link}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-[#6B7280] flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Reports List */}
              {selectedItem.reports && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="text-sm text-[#6B7280]">Lịch sử tố cáo</h4>
                    <div className="space-y-2">
                      {selectedItem.reports.map((report: any, index: number) => (
                        <div key={index} className="p-3 bg-[#F9FAFB] rounded-lg">
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-sm text-[#1F2937]">{report.type}</span>
                            <span className="text-xs text-[#6B7280]">{report.date}</span>
                          </div>
                          <p className="text-xs text-[#6B7280]">Người tố cáo: {report.reporter}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

           
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#1F2937]">Tố cáo thêm</DialogTitle>
            <DialogDescription className="text-[#6B7280]">
              Gửi thông tin tố cáo về {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Target Info */}
            {selectedItem && (
              <div className="p-4 bg-[#F9FAFB] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    selectedItem.status === 'verified' ? 'bg-[#D1FAE5]' : 'bg-[#FEF3C7]'
                  }`}>
                    {selectedItem.type === 'business' ? (
                      <Building2 className={`h-6 w-6 ${getStatusColor(selectedItem.status)}`} />
                    ) : (
                      <User className={`h-6 w-6 ${getStatusColor(selectedItem.status)}`} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-[#1F2937]">{selectedItem.name}</p>
                    <p className="text-xs text-[#6B7280]">{selectedItem.phone}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Report Form */}
            <div className="space-y-2">
              <Label htmlFor="report-type">Loại lừa đảo *</Label>
              <Select>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Chọn loại lừa đảo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">Lừa đảo chuyển khoản</SelectItem>
                  <SelectItem value="sale">Lừa đảo bán hàng</SelectItem>
                  <SelectItem value="investment">Lừa đảo đầu tư</SelectItem>
                  <SelectItem value="social">Lừa đảo mạng xã hội</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-description">Mô tả chi tiết *</Label>
              <Textarea
                id="report-description"
                placeholder="Mô tả chi tiết về hành vi lừa đảo..."
                className="rounded-xl min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-evidence">Ảnh bằng chứng</Label>
              <Input
                id="report-evidence"
                type="file"
                accept="image/*"
                multiple
                className="rounded-xl"
              />
              <p className="text-xs text-[#6B7280]">Tải lên ảnh chứng minh (tối đa 5 ảnh)</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setReportDialogOpen(false)}
                className="flex-1 rounded-xl"
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  // Handle submit
                  setReportDialogOpen(false);
                }}
                className="flex-1 bg-[#DC2626] text-white hover:bg-[#DC2626]/90 rounded-xl"
              >
                Gửi tố cáo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}