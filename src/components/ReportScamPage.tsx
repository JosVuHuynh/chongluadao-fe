import { AlertTriangle, Upload, CheckCircle, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import * as reportService from '../services/reportService';

export function ReportScamPage() {
  const [formData, setFormData] = useState<FormDataState>({
    scammerName: "",
    scamTypeId: null,
    scamTypeOther: "",
    phoneNumber: "",
    bankAccount: "",
    description: "",
  });

  const [scamTypes, setScamTypes] = useState<reportService.ScamType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);

  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");

  const [files, setFiles] = useState<File[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  // Determine "OTHER" id from API list (fallback to null)
  const otherTypeId = useMemo(() => {
    const other = scamTypes.find((t) => t.code?.toUpperCase() === "OTHER");
    return other?.id ?? null;
  }, [scamTypes]);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoadingTypes(true);
        const types = await reportService.getScamTypes();
        // only active ones
        setScamTypes(types.filter((t) => t.isActive));
      } catch (err: any) {
        toast.error(err?.message || "Không thể tải danh sách loại lừa đảo");
      } finally {
        setIsLoadingTypes(false);
      }
    };
    load();
  }, []);

  const handleAddLinks = () => {
    if (!linkInput.trim()) return;

    const newLinks = linkInput
      .split(/[\n,\s]+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !links.includes(l));

    if (newLinks.length > 0) {
      setLinks([...links, ...newLinks]);
      setLinkInput("");
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");

    const pastedLinks = pastedText
      .split(/[\n,\s]+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !links.includes(l));

    if (pastedLinks.length > 0) {
      setLinks([...links, ...pastedLinks]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLinks();
    }
  };

  const removeLink = (indexToRemove: number) => {
    setLinks(links.filter((_, index) => index !== indexToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const totalFiles = files.length + selectedFiles.length;
    if (totalFiles > 5) {
      toast.error("Chỉ được tải lên tối đa 5 hình ảnh");
      const remaining = 5 - files.length;
      if (remaining > 0) {
        setFiles([...files, ...selectedFiles.slice(0, remaining)]);
        toast.warning(`Chỉ thêm được ${remaining} hình ảnh nữa`);
      }
      return;
    }

    setFiles([...files, ...selectedFiles]);
  };

  const resetForm = () => {
    setFormData({
      scammerName: "",
      scamTypeId: null,
      scamTypeOther: "",
      phoneNumber: "",
      bankAccount: "",
      description: "",
    });
    setLinks([]);
    setLinkInput("");
    setFiles([]);
    setUploadProgress({ current: 0, total: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If user typed links but didn't press Enter
    if (links.length === 0 && linkInput.trim()) handleAddLinks();

    if (!formData.scammerName.trim()) {
      toast.error("Vui lòng nhập tên người lừa đảo");
      return;
    }

    if (!formData.scamTypeId) {
      toast.error("Vui lòng chọn loại lừa đảo");
      return;
    }

    // If selected OTHER then require scamTypeOther
    if (otherTypeId && formData.scamTypeId === otherTypeId && !formData.scamTypeOther.trim()) {
      toast.error("Vui lòng mô tả loại lừa đảo khác");
      return;
    }

    if (links.length === 0) {
      toast.error("Vui lòng nhập ít nhất 1 đường dẫn liên quan");
      return;
    }

    if (files.length === 0) {
      toast.error("Vui lòng tải lên ít nhất 1 ảnh bằng chứng");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Vui lòng mô tả chi tiết hành vi lừa đảo");
      return;
    }

    try {
      setIsSubmitting(true);

      toast.info("Đang tải lên hình ảnh...");
      const evidenceUrls = await reportService.uploadMultipleImages(files, (current, total) =>
        setUploadProgress({ current, total })
      );

      toast.info("Đang gửi tố cáo...");

      const reportData: reportService.CreateReportRequest = {
        scamTypeId: formData.scamTypeId,
        scamTypeOther:
          otherTypeId && formData.scamTypeId === otherTypeId ? formData.scamTypeOther : null,

        scammerName: formData.scammerName.trim(),
        phone: formData.phoneNumber.trim(),
        bankAccount: formData.bankAccount.trim(),

        relatedLinks: links,
        description: formData.description.trim(),
        evidenceUrls,

        reporterName: "Ẩn danh",
        contactInfo: "Không cung cấp",
      };

      await reportService.createReport(reportData);

      toast.success("Gửi tố cáo thành công!");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
      }, 2500);
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error?.message || "Không thể gửi tố cáo. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#F4F6F8] py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-[#F8B400] to-[#E57373]">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-[#086644]">Tố cáo lừa đảo</h1>
          <p className="text-[#6b7280] max-w-2xl mx-auto">
            Thông tin của bạn sẽ giúp cộng đồng tránh được những rủi ro không đáng có. Mọi thông tin sẽ được bảo mật và xác minh cẩn thận.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: '🔒', title: 'Bảo mật', description: 'Thông tin của bạn được bảo vệ' },
            { icon: '✅', title: 'Xác minh', description: 'Đội ngũ sẽ kiểm tra kỹ lưỡng' },
            { icon: '⚡', title: 'Nhanh chóng', description: 'Xử lý trong 24-48 giờ' },
          ].map((item, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-sm text-[#086644]">{item.title}</div>
                <div className="text-xs text-[#6b7280]">{item.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Form */}
         <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#A8E6CF]/10 to-[#086644]/10 border-b">
            <CardTitle className="text-[#086644]">Thông tin tố cáo</CardTitle>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Scammer Name */}
              <div className="space-y-2">
                <Label htmlFor="scammerName">
                  Tên người lừa đảo <span className="text-[#E57373]">*</span>
                </Label>
                <Input
                  id="scammerName"
                  placeholder="Nhập tên người lừa đảo..."
                  value={formData.scammerName}
                  onChange={(e) => setFormData({ ...formData, scammerName: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              {/* Scam Type */}
              <div className="space-y-2">
                <Label htmlFor="scamType">
                  Loại lừa đảo <span className="text-[#E57373]">*</span>
                </Label>

                <Select
                  value={formData.scamTypeId ? String(formData.scamTypeId) : ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, scamTypeId: value ? Number(value) : null })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue
                      placeholder={isLoadingTypes ? "Đang tải..." : "Chọn loại lừa đảo"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {scamTypes.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {otherTypeId && formData.scamTypeId === otherTypeId && (
                  <Input
                    id="scamTypeOther"
                    placeholder="Mô tả loại lừa đảo khác..."
                    value={formData.scamTypeOther}
                    onChange={(e) => setFormData({ ...formData, scamTypeOther: e.target.value })}
                    className="mt-2 rounded-xl"
                  />
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Số điện thoại (nếu có)</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="0xxx xxx xxx"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 11) setFormData({ ...formData, phoneNumber: value });
                  }}
                  maxLength={11}
                  className="rounded-xl"
                />
              </div>

              {/* Scam Link */}
              <div className="space-y-2">
                <Label htmlFor="scamLink">
                  Đường dẫn liên quan (link lừa đảo, website, fanpage, v.v.){" "}
                  <span className="text-[#E57373]">*</span>
                </Label>

                <div className="border border-[#E5E7EB] rounded-xl p-3 bg-[#F9FAFB] min-h-[100px] space-y-2">
                  {links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {links.map((link, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-[#E5E7EB] text-sm hover:border-[#086644] transition-colors"
                        >
                          <span className="max-w-[250px] truncate text-[#1F2937]" title={link}>
                            {link}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeLink(index)}
                            className="flex-shrink-0 hover:scale-110 transition-transform"
                          >
                            <X className="h-3.5 w-3.5 text-[#6B7280] hover:text-[#DC2626]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Textarea
                    id="scamLink"
                    placeholder={links.length === 0 ? "Nhập link..." : ""}
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    onPaste={handlePaste}
                    onKeyDown={handleKeyDown}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent min-h-[40px] resize-none px-1 py-1 text-sm placeholder:text-[#9CA3AF]"
                  />
                </div>

                <div className="flex items-start gap-2 text-xs text-[#6b7280]">
                  <div className="flex-1">
                    <p>
                      💡 <strong>Mẹo:</strong> Paste nhiều link cùng lúc (mỗi link một dòng) hoặc nhấn
                      Enter để thêm
                    </p>
                    {links.length > 0 && (
                      <p className="mt-1">
                        📝 Đã thêm: <span className="text-[#086644]">{links.length} link</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Account */}
              <div className="space-y-2">
                <Label htmlFor="bankAccount">Số tài khoản ngân hàng (nếu có)</Label>
                <Input
                  id="bankAccount"
                  placeholder="VD: 1234567890 - Vietcombank"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Mô tả chi tiết hành vi lừa đảo <span className="text-[#E57373]">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Vui lòng mô tả chi tiết về hành vi lừa đảo, thời gian, phương thức..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="rounded-xl resize-none"
                />
                <p className="text-xs text-[#6b7280]">
                  Cung cấp càng nhiều chi tiết càng giúp chúng tôi xử lý nhanh hơn
                </p>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="files">
                  Ảnh bằng chứng (hóa đơn, tin nhắn, ảnh chụp, v.v.){" "}
                  <span className="text-[#E57373]">*</span>
                </Label>

                <div className="border-2 border-dashed border-[#e5e7eb] rounded-xl p-4 sm:p-6 text-center hover:border-[#A8E6CF] transition-colors">
                  <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-[#6b7280] mx-auto mb-2" />
                  <p className="text-sm text-[#6b7280] mb-2">
                    Tải lên ảnh chụp màn hình, tin nhắn, giao dịch...
                  </p>
                  <Input
                    id="files"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("files")?.click()}
                    className="rounded-xl"
                    disabled={files.length >= 5 || isSubmitting}
                  >
                    Chọn file
                  </Button>

                  {isSubmitting && uploadProgress.total > 0 && (
                    <p className="mt-3 text-xs text-[#6b7280]">
                      Đang upload: {uploadProgress.current}/{uploadProgress.total}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-[#6b7280]">
                  <p>* Bắt buộc phải có ít nhất 1 ảnh bằng chứng</p>
                  {files.length > 0 && (
                    <p className={files.length >= 5 ? "text-[#E57373]" : "text-[#086644]"}>
                      {files.length}/5 ảnh
                    </p>
                  )}
                </div>

                {files.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-[#F4F6F8] rounded-xl"
                      >
                        <span className="text-sm text-[#333333] truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setFiles(files.filter((_, i) => i !== index))}
                          className="text-[#E57373] hover:text-[#E57373]/80"
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#F8B400] to-[#E57373] text-white hover:opacity-90 rounded-xl h-12"
                disabled={isSubmitting || isLoadingTypes}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <AlertTriangle className="h-5 w-5 mr-2" />
                )}
                Gửi tố cáo
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#A8E6CF]">
              <CheckCircle className="h-8 w-8 text-[#086644]" />
            </div>
            <DialogTitle className="text-center text-[#086644]">Gửi tố cáo thành công!</DialogTitle>
            <DialogDescription className="text-center">
              Cảm ơn bạn đã đóng góp thông tin. Chúng tôi sẽ xem xét và xác minh trong vòng 24-48 giờ.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}