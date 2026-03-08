import {
  Search,
  AlertTriangle,
  Shield,
  FileText,
  TrendingUp,
  Users,
  Building2,
  Star,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { toast } from "sonner@2.0.3";
import * as businessService from "../services/businessService";

interface HomePageProps {
  onNavigate: (page: string, shopId?: number) => void;
  onSearch: (query: string) => void;
}

export function HomePage({ onNavigate, onSearch }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [businessDialogOpen, setBusinessDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [ceoAvatarFile, setCeoAvatarFile] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState("");
  const [ceoAvatarPreview, setCeoAvatarPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    taxCode: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    description: "",
    category: "",
    facebookUrl: "",
    messengerUrl: "",
    tiktokUrl: "",
    instagramUrl: "",
    zaloUrl: "",
    youtubeUrl: "",
    ceoName: "",
    packageType: "basic",
    isVerified: false,
  });

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (ceoAvatarPreview) URL.revokeObjectURL(ceoAvatarPreview);
    };
  }, [logoPreview, ceoAvatarPreview]);

  const stats = [
    { icon: AlertTriangle, label: "Vụ tố cáo", value: "15,234", color: "text-[#F8B400]" },
    { icon: Building2, label: "Doanh nghiệp uy tín", value: "3,456", color: "text-[#086644]" },
    { icon: Users, label: "Người dùng", value: "125,890", color: "text-[#A8E6CF]" },
    { icon: TrendingUp, label: "Vụ giải quyết", value: "12,789", color: "text-[#086644]" },
  ];

  const quickActions = [
    {
      icon: AlertTriangle,
      title: "Tố cáo lừa đảo",
      description: "Báo cáo các hành vi lừa đảo, gian lận",
      action: "report",
      color: "from-[#F8B400] to-[#E57373]",
    },
    {
      icon: Shield,
      title: "Doanh nghiệp uy tín",
      description: "Danh sách doanh nghiệp đã xác thực",
      action: "businesses",
      color: "from-[#A8E6CF] to-[#086644]",
    },
    {
      icon: FileText,
      title: "Tin tức mới nhất",
      description: "Cảnh báo và thông tin mới",
      action: "news",
      color: "from-[#086644] to-[#A8E6CF]",
    },
  ];

  const testimonials = [
    {
      name: "Nguyễn Minh Tuấn",
      role: "Chủ doanh nghiệp",
      content:
        "ChongLuaDaoJP đã giúp tôi tránh được nhiều giao dịch lừa đảo. Hệ thống xác minh rất tin cậy!",
      avatar: "👤",
      rating: 5,
    },
    {
      name: "Trần Thu Hà",
      role: "Người tiêu dùng",
      content:
        "Tôi đã tra cứu được thông tin về nhiều công ty và tránh được những rủi ro không đáng có.",
      avatar: "👤",
      rating: 5,
    },
    {
      name: "Lê Hoàng Nam",
      role: "Nhà đầu tư",
      content:
        "Nền tảng rất hữu ích cho việc kiểm tra độ tin cậy của đối tác kinh doanh.",
      avatar: "👤",
      rating: 5,
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      onNavigate("lookup");
    }
  };

  const handleOpenBusinessDialog = () => {
    setBusinessDialogOpen(true);
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

    if (logoPreview) URL.revokeObjectURL(logoPreview);

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
      toast.error("Ảnh đại diện CEO phải nhỏ hơn 5MB");
      return;
    }

    if (ceoAvatarPreview) URL.revokeObjectURL(ceoAvatarPreview);

    setCeoAvatarFile(file);
    setCeoAvatarPreview(URL.createObjectURL(file));
  };

  const removeSelectedImage = (type: "logo" | "ceo") => {
    if (type === "logo") {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      setLogoFile(null);
      setLogoPreview("");
    } else {
      if (ceoAvatarPreview) URL.revokeObjectURL(ceoAvatarPreview);
      setCeoAvatarFile(null);
      setCeoAvatarPreview("");
    }
  };

  const resetForm = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    if (ceoAvatarPreview) URL.revokeObjectURL(ceoAvatarPreview);

    setFormData({
      name: "",
      taxCode: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      description: "",
      category: "",
      facebookUrl: "",
      messengerUrl: "",
      tiktokUrl: "",
      instagramUrl: "",
      zaloUrl: "",
      youtubeUrl: "",
      ceoName: "",
      packageType: "basic",
      isVerified: false,
    });

    setLogoFile(null);
    setCeoAvatarFile(null);
    setLogoPreview("");
    setCeoAvatarPreview("");
  };

  const handleSubmitBusiness = async () => {
    if (
      !formData.name ||
      !formData.taxCode ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setFormLoading(true);

    try {
      let uploadedLogoUrl: string | undefined = undefined;
      let uploadedCeoAvatarUrl: string | undefined = undefined;

      if (logoFile || ceoAvatarFile) {
        setUploadingImages(true);
      }

      if (logoFile) {
        uploadedLogoUrl = await businessService.uploadImage(logoFile);
      }

      if (ceoAvatarFile) {
        uploadedCeoAvatarUrl = await businessService.uploadImage(
          ceoAvatarFile
        );
      }

      const requestData: businessService.BusinessRegistration = {
        name: formData.name,
        taxCode: formData.taxCode,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        website: formData.website || undefined,
        description: formData.description || undefined,
        category: formData.category || undefined,
        logoUrl: uploadedLogoUrl,
        ceoName: formData.ceoName || undefined,
        ceoAvatarUrl: uploadedCeoAvatarUrl,
        facebookUrl: formData.facebookUrl || undefined,
        messengerUrl: formData.messengerUrl || undefined,
        tiktokUrl: formData.tiktokUrl || undefined,
        instagramUrl: formData.instagramUrl || undefined,
        zaloUrl: formData.zaloUrl || undefined,
        youtubeUrl: formData.youtubeUrl || undefined,
        plan: formData.packageType.toUpperCase() as "BASIC" | "PREMIUM" | "VIP",
        requestVerifiedBadge: formData.isVerified,
      };

      await businessService.registerBusiness(requestData);

      toast.success("Đăng ký doanh nghiệp thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
      setBusinessDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setUploadingImages(false);
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#A8E6CF] to-[#086644] text-white">
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(168, 230, 207, 0.8) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(168, 230, 207, 0.8) 0%, transparent 50%)",
                "radial-gradient(circle at 50% 80%, rgba(168, 230, 207, 0.8) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(168, 230, 207, 0.8) 0%, transparent 50%)",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10 backdrop-blur-sm"
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}

          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/20 backdrop-blur-sm">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">Bảo vệ cộng đồng từ năm 2020</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-2">
              Bảo vệ bạn khỏi lừa đảo
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/90 px-2">
              ChongLuaDaoJP.com - Nền tảng uy tín giúp bạn xác minh thông tin, tố cáo
              lừa đảo và tìm kiếm doanh nghiệp đáng tin cậy
            </p>

            <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-2 p-2 rounded-2xl bg-white shadow-xl">
                <div className="flex-1 flex items-center gap-2 px-3 sm:px-4 min-h-[44px]">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-[#6b7280] flex-shrink-0" />
                  <Input
                    type="text"
                    placeholder="Kiểm tra thông tin..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-[#333333] p-0"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="rounded-xl bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white hover:opacity-90 min-h-[44px]"
                >
                  Tra cứu
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-0 shadow-md"
                onClick={() => onNavigate(action.action)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div
                    className={`inline-flex p-2.5 sm:p-3 rounded-xl bg-gradient-to-br ${action.color} mb-3 sm:mb-4`}
                  >
                    <action.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="text-[#086644] mb-2">{action.title}</h3>
                  <p className="text-sm text-[#6b7280]">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-10 sm:py-16 bg-[#F4F6F8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-[#086644] mb-3 sm:mb-4 px-2">Thành tựu của chúng tôi</h2>
            <p className="text-[#6b7280] max-w-2xl mx-auto px-2">
              Hàng nghìn người dùng tin tưởng và sử dụng ChongLuaDaoJP mỗi ngày để bảo
              vệ bản thân khỏi lừa đảo
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-md">
                <CardContent className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                  <div className={`inline-flex p-2 sm:p-3 rounded-xl bg-[#F4F6F8] ${stat.color}`}>
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="text-2xl sm:text-3xl text-[#086644]">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-[#6b7280]">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-[#086644] mb-3 sm:mb-4 px-2">Cách thức hoạt động</h2>
            <p className="text-[#6b7280] max-w-2xl mx-auto px-2">
              Quy trình đơn giản và minh bạch để bảo vệ cộng đồng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: "01",
                title: "Tra cứu thông tin",
                description:
                  "Nhập số điện thoại, tên doanh nghiệp hoặc website để kiểm tra",
              },
              {
                step: "02",
                title: "Xem kết quả",
                description:
                  "Hệ thống hiển thị lịch sử tố cáo và đánh giá từ cộng đồng",
              },
              {
                step: "03",
                title: "Đóng góp thông tin",
                description:
                  "Tố cáo hoặc xác nhận độ tin cậy để giúp người khác",
              },
            ].map((item, index) => (
              <div key={index} className="text-center space-y-3 sm:space-y-4">
                <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A8E6CF] to-[#086644] text-white">
                  {item.step}
                </div>
                <h3 className="text-[#086644] px-2">{item.title}</h3>
                <p className="text-sm text-[#6b7280] px-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 sm:py-16 bg-[#F4F6F8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-[#086644] mb-3 sm:mb-4 px-2">Người dùng nói gì về chúng tôi</h2>
            <p className="text-[#6b7280] max-w-2xl mx-auto px-2">
              Hàng nghìn phản hồi tích cực từ cộng đồng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 sm:h-5 sm:w-5 fill-[#F8B400] text-[#F8B400]"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-[#6b7280]">{testimonial.content}</p>
                  <div className="flex items-center gap-3 pt-3 sm:pt-4 border-t">
                    <div className="h-10 w-10 rounded-full bg-[#A8E6CF] flex items-center justify-center">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-sm text-[#086644]">{testimonial.name}</div>
                      <div className="text-xs text-[#6b7280]">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-16 bg-gradient-to-br from-[#A8E6CF] to-[#086644] text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-6">
          <h2 className="px-2">Tham gia cộng đồng ngay hôm nay</h2>
          <p className="text-base sm:text-lg text-white/90 px-2">
            Cùng nhau xây dựng môi trường kinh doanh minh bạch và an toàn
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              onClick={() => onNavigate("report")}
              size="lg"
              className="bg-white text-[#086644] hover:bg-white/90 rounded-xl min-h-[48px]"
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              Tố cáo lừa đảo
            </Button>
            <Button
              onClick={handleOpenBusinessDialog}
              size="lg"
              className="bg-white text-[#086644] hover:bg-white/90 rounded-xl min-h-[48px]"
            >
              <Building2 className="h-5 w-5 mr-2" />
              Đăng ký doanh nghiệp
            </Button>
          </div>
        </div>
      </section>

      {/* Business Registration Dialog */}
      <Dialog open={businessDialogOpen} onOpenChange={setBusinessDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-[#1F2937]">Đăng ký doanh nghiệp</DialogTitle>
            <DialogDescription className="text-[#6B7280]">
              Đăng ký doanh nghiệp mới vào hệ thống
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block text-[#374151]">
                  Tên doanh nghiệp <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="VD: Công ty TNHH ABC Tech"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-[#F9FAFB]"
                />
              </div>
              <div>
                <Label className="mb-2 block text-[#374151]">
                  Mã số thuế <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="VD: 0123456789"
                  value={formData.taxCode}
                  onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                  className="bg-[#F9FAFB]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block text-[#374151]">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="contact@company.vn"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-[#F9FAFB]"
                />
              </div>
              <div>
                <Label className="mb-2 block text-[#374151]">
                  Số điện thoại <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="0901234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-[#F9FAFB]"
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-[#374151]">
                Địa chỉ <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="123 Đường ABC, Quận 1, TP.HCM"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-[#F9FAFB]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block text-[#374151]">Website</Label>
                <Input
                  placeholder="https://www.company.vn"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="bg-[#F9FAFB]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-logo">Logo doanh nghiệp</Label>

                <div className="border-2 border-dashed border-[#e5e7eb] rounded-xl p-4 sm:p-6 text-center hover:border-[#A8E6CF] transition-colors">
                  <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-[#6b7280] mx-auto mb-2" />
                  <p className="text-sm text-[#6b7280] mb-2">Tải lên logo doanh nghiệp</p>

                  <Input
                    id="business-logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("business-logo")?.click()}
                    className="rounded-xl"
                    disabled={formLoading || uploadingImages}
                  >
                    Chọn file
                  </Button>
                </div>

                <div className="flex items-center justify-between text-xs text-[#6b7280]">
                  <p>Tối đa 1 ảnh, dung lượng không quá 5MB</p>
                  {logoFile && <p className="text-[#086644]">1/1 ảnh</p>}
                </div>

                {logoFile && (
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between p-3 bg-[#F4F6F8] rounded-xl">
                      <span className="text-sm text-[#333333] truncate">{logoFile.name}</span>
                      <button
                        type="button"
                        onClick={() => removeSelectedImage("logo")}
                        className="text-[#E57373] hover:text-[#E57373]/80"
                        disabled={formLoading || uploadingImages}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {logoPreview && (
                      <div className="w-24 h-24 rounded-xl overflow-hidden border bg-[#F9FAFB]">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-[#374151]">Danh mục</Label>
              <Input
                placeholder="VD: Công nghệ, Spa, Nhà hàng..."
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="bg-[#F9FAFB]"
              />
            </div>

            <div>
              <Label className="mb-2 block text-[#374151]">Mô tả doanh nghiệp</Label>
              <Textarea
                placeholder="Giới thiệu về doanh nghiệp, lĩnh vực hoạt động..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="bg-[#F9FAFB]"
              />
            </div>

            <div className="border rounded-xl p-4 space-y-4 bg-[#FCFCFC]">
              <div className="text-sm font-semibold text-[#1F2937]">
                Thông tin CEO / đại diện
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block text-[#374151]">Tên CEO / người đại diện</Label>
                  <Input
                    placeholder="Nguyễn Văn A"
                    value={formData.ceoName}
                    onChange={(e) => setFormData({ ...formData, ceoName: e.target.value })}
                    className="bg-[#F9FAFB]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ceo-avatar">Ảnh đại diện CEO</Label>

                  <div className="border-2 border-dashed border-[#e5e7eb] rounded-xl p-4 sm:p-6 text-center hover:border-[#A8E6CF] transition-colors">
                    <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-[#6b7280] mx-auto mb-2" />
                    <p className="text-sm text-[#6b7280] mb-2">
                      Tải lên ảnh đại diện CEO / người đại diện
                    </p>

                    <Input
                      id="ceo-avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleCeoAvatarUpload}
                      className="hidden"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("ceo-avatar")?.click()}
                      className="rounded-xl"
                      disabled={formLoading || uploadingImages}
                    >
                      Chọn file
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#6b7280]">
                    <p>Tối đa 1 ảnh, dung lượng không quá 5MB</p>
                    {ceoAvatarFile && <p className="text-[#086644]">1/1 ảnh</p>}
                  </div>

                  {ceoAvatarFile && (
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between p-3 bg-[#F4F6F8] rounded-xl">
                        <span className="text-sm text-[#333333] truncate">
                          {ceoAvatarFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSelectedImage("ceo")}
                          className="text-[#E57373] hover:text-[#E57373]/80"
                          disabled={formLoading || uploadingImages}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {ceoAvatarPreview && (
                        <div className="w-24 h-24 rounded-xl overflow-hidden border bg-[#F9FAFB]">
                          <img
                            src={ceoAvatarPreview}
                            alt="CEO preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border rounded-xl p-4 space-y-4 bg-[#FCFCFC]">
              <div className="text-sm font-semibold text-[#1F2937]">Liên kết mạng xã hội</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block text-[#374151]">Facebook URL</Label>
                  <Input
                    placeholder="https://facebook.com/yourpage"
                    value={formData.facebookUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, facebookUrl: e.target.value })
                    }
                    className="bg-[#F9FAFB]"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-[#374151]">Messenger URL</Label>
                  <Input
                    placeholder="https://m.me/yourpage"
                    value={formData.messengerUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, messengerUrl: e.target.value })
                    }
                    className="bg-[#F9FAFB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block text-[#374151]">TikTok URL</Label>
                  <Input
                    placeholder="https://tiktok.com/@yourbrand"
                    value={formData.tiktokUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, tiktokUrl: e.target.value })
                    }
                    className="bg-[#F9FAFB]"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-[#374151]">Instagram URL</Label>
                  <Input
                    placeholder="https://instagram.com/yourbrand"
                    value={formData.instagramUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, instagramUrl: e.target.value })
                    }
                    className="bg-[#F9FAFB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block text-[#374151]">Zalo URL</Label>
                  <Input
                    placeholder="https://zalo.me/0901234567"
                    value={formData.zaloUrl}
                    onChange={(e) => setFormData({ ...formData, zaloUrl: e.target.value })}
                    className="bg-[#F9FAFB]"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-[#374151]">YouTube URL</Label>
                  <Input
                    placeholder="https://youtube.com/@yourchannel"
                    value={formData.youtubeUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, youtubeUrl: e.target.value })
                    }
                    className="bg-[#F9FAFB]"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-[#374151]">
                Gói dịch vụ <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.packageType}
                onValueChange={(value) => setFormData({ ...formData, packageType: value })}
              >
                <SelectTrigger className="bg-[#F9FAFB]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 bg-[#F9FAFB] p-3 rounded-lg">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#086644] text-white shrink-0">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-[#1F2937]">Doanh nghiệp uy tín</div>
                <div className="text-xs text-[#6B7280]">Yêu cầu thêm dấu tích xanh xác thực</div>
              </div>
              <Switch
                checked={formData.isVerified}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isVerified: checked })
                }
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setBusinessDialogOpen(false)}
              disabled={formLoading || uploadingImages}
              className="text-[#374151]"
            >
              Hủy
            </Button>

            <Button
              onClick={handleSubmitBusiness}
              disabled={formLoading || uploadingImages}
              className="bg-[#086644] hover:bg-[#086644]/90 text-white"
            >
              {formLoading || uploadingImages ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {uploadingImages ? "Đang upload ảnh..." : "Đang xử lý..."}
                </>
              ) : (
                "Đăng ký"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}