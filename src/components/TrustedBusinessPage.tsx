import {
  Search,
  Star,
  CheckCircle,
  Building2,
  Phone,
  Globe,
  MapPin,
  ExternalLink,
  Mail,
  Hash,
  Shield,
  User as UserIcon,
  MessageCircle,
  Link as LinkIcon,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ApiBusiness = {
  id: number;
  name: string;
  logo_url?: string | null;
  tax_code?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
  description?: string | null;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  verified_badge: 0 | 1;
  is_trusted: 0 | 1;
  category?: string | null;
  has_insurance: 0 | 1;
  verified_at?: string | null;

  // ✅ socials + CEO
  facebook_url?: string | null;
  messenger_url?: string | null;
  tiktok_url?: string | null;
  instagram_url?: string | null;
  zalo_url?: string | null;
  youtube_url?: string | null;

  ceo_name?: string | null;
  ceo_avatar_url?: string | null;
};

type BusinessListResponse = {
  data: ApiBusiness[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

type UiBusiness = {
  id: number;
  name: string;
  logo: string;
  category: string;
  rating: number;
  reviews: number;
  verified: boolean;
  phone: string;
  website: string;
  address: string;
  description: string;
  insurance: boolean;

  email?: string;
  taxCode?: string;
  isTrusted?: boolean;
  verifiedAt?: string | null;

  // ✅ socials + CEO (UI)
  facebookUrl?: string;
  messengerUrl?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  zaloUrl?: string;
  youtubeUrl?: string;

  ceoName?: string;
  ceoAvatarUrl?: string;

  products: Array<{
    id: number;
    name: string;
    price: string;
    image: string;
    link: string;
  }>;
};

function getLogoByCategory(category?: string | null) {
  const c = (category || "").toLowerCase();
  if (c.includes("công nghệ") || c.includes("cong nghe")) return "🏢";
  if (c.includes("bán lẻ") || c.includes("ban le")) return "🛒";
  if (c.includes("ẩm thực") || c.includes("am thuc")) return "🍜";
  if (c.includes("giáo dục") || c.includes("giao duc")) return "📚";
  if (c.includes("du lịch") || c.includes("du lich")) return "✈️";
  if (c.includes("y tế") || c.includes("y te")) return "⚕️";
  return "🏢";
}

function formatDateVi(x?: string | null) {
  if (!x) return "";
  const d = new Date(x);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN");
}

function normalizeLink(url?: string) {
  const u = (url || "").trim();
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  return `https://${u}`;
}

function SocialRow({ label, url }: { label: string; url?: string }) {
  if (!url) return null;
  const href = normalizeLink(url);
  if (!href) return null;

  return (
    <div className="flex items-center gap-2 min-w-0">
      <LinkIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
      <a
        className="text-[#086644] hover:underline inline-flex items-center gap-1 break-all min-w-0"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="min-w-0 break-all">{label}</span>
        <ExternalLink className="h-3 w-3 flex-shrink-0" />
      </a>
    </div>
  );
}

export function TrustedBusinessPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState<UiBusiness[]>([]);

  const [openDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState<UiBusiness | null>(null);

  const categories = [
    "Tất cả",
    "Công nghệ",
    "Bán lẻ",
    "Ẩm thực",
    "Giáo dục",
    "Du lịch",
    "Y tế",
  ];
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  async function fetchBusinesses() {
    try {
      const res = await fetch(`${API_BASE_URL}/business/list?page=1&limit=100`);
      if (!res.ok) throw new Error(await res.text());

      const json = (await res.json()) as BusinessListResponse;

      const mapped: UiBusiness[] = (json.data || []).map((b) => ({
        id: b.id,
        name: b.name,
        logo: b.logo_url || getLogoByCategory(b.category),
        category: b.category || "Khác",

        // rating/reviews DB chưa có -> default
        rating: 4.8,
        reviews: 245,

        verified: b.verified_badge === 1,
        phone: b.phone || "",
        website: b.website || "",
        address: b.address || "",
        description: b.description || "",
        insurance: b.has_insurance === 1,

        email: b.email,
        taxCode: (b.tax_code || "") as string,
        isTrusted: b.is_trusted === 1,
        verifiedAt: b.verified_at || null,

        // ✅ NEW socials + CEO
        facebookUrl: b.facebook_url || "",
        messengerUrl: b.messenger_url || "",
        tiktokUrl: b.tiktok_url || "",
        instagramUrl: b.instagram_url || "",
        zaloUrl: b.zalo_url || "",
        youtubeUrl: b.youtube_url || "",
        ceoName: b.ceo_name || "",
        ceoAvatarUrl: b.ceo_avatar_url || "",

        products: [],
      }));

      setBusinesses(mapped);
    } catch (e: any) {
      toast.error(e?.message || "Không tải được danh sách doanh nghiệp");
      setBusinesses([]);
    }
  }

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const filteredBusinesses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return businesses.filter((b) => {
      const okCategory =
        selectedCategory === "Tất cả" || b.category === selectedCategory;

      const okQuery =
        q === "" ||
        b.name.toLowerCase().includes(q) ||
        (b.phone || "").toLowerCase().includes(q) ||
        (b.website || "").toLowerCase().includes(q) ||
        (b.address || "").toLowerCase().includes(q);

      return okCategory && okQuery;
    });
  }, [businesses, selectedCategory, searchQuery]);

  const handleOpenDetail = (biz: UiBusiness) => {
    setSelected(biz);
    setOpenDetail(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-[#A8E6CF] to-[#086644]">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-[#086644]">Doanh nghiệp uy tín</h1>
          <p className="text-[#6b7280] max-w-2xl mx-auto">
            Danh sách các doanh nghiệp đã được xác thực và có độ tin cậy cao từ
            cộng đồng
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2 p-2 rounded-2xl bg-white shadow-md">
              <div className="flex-1 flex items-center gap-2 px-4">
                <Search className="h-5 w-5 text-[#6b7280]" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm doanh nghiệp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white"
                    : ""
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats (demo) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Doanh nghiệp", value: String(businesses.length) },
            { label: "Đánh giá", value: "45,234" },
            { label: "Tham gia quỹ BH", value: "2,345" },
            { label: "Rating TB", value: "4.8⭐" },
          ].map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-[#086644]">{stat.value}</div>
                <div className="text-sm text-[#6b7280]">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Business Grid */}
        {/* ✅ GRID: items-stretch để card cùng height */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredBusinesses.map((business) => (
            <Card
              key={business.id}
              className="border-0 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer h-full"
              onClick={() => handleOpenDetail(business)}
            >
              {/* ✅ CardContent: flex-col h-full */}
              <CardContent className="p-6 flex flex-col h-full">
                {/* ✅ Nội dung chiếm hết chiều cao */}
                <div className="space-y-4 flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#A8E6CF] to-[#086644] flex items-center justify-center overflow-hidden">
                        {business.logo?.startsWith("http") ? (
                          <img
                            src={business.logo}
                            alt={business.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl">{business.logo}</span>
                        )}
                    </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 min-w-0">
                          <h3 className="text-[#086644] line-clamp-1 min-w-0">
                            {business.name}
                          </h3>
                          {business.verified && (
                            <div className="flex-shrink-0" title="Đã xác thực">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  fill="#1877F2"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {business.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {!!business.description && (
                    <p className="text-sm text-[#6b7280] line-clamp-2">
                      {business.description}
                    </p>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-[#F8B400] text-[#F8B400]" />
                      <span className="text-sm text-[#086644]">
                        {business.rating}
                      </span>
                    </div>
                    <span className="text-xs text-[#6b7280]">
                      ({business.reviews} đánh giá)
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 pt-2 border-t">
                    {!!business.phone && (
                      <div className="flex items-center gap-2 text-sm text-[#6b7280]">
                        <Phone className="h-4 w-4" />
                        <span className="break-words">{business.phone}</span>
                      </div>
                    )}
                    {!!business.website && (
                      <div className="flex items-center gap-2 text-sm text-[#6b7280]">
                        <Globe className="h-4 w-4" />
                        <span className="break-words">{business.website}</span>
                      </div>
                    )}
                    {!!business.address && (
                      <div className="flex items-center gap-2 text-sm text-[#6b7280]">
                        <MapPin className="h-4 w-4" />
                        <span className="break-words">{business.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge className="bg-[#A8E6CF] text-[#086644] hover:bg-[#A8E6CF]/80">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Đã xác thực
                    </Badge>
                    {business.insurance && (
                      <Badge className="bg-[#086644] text-white hover:bg-[#086644]/80">
                        🛡️ Có quỹ BH
                      </Badge>
                    )}
                  </div>

                  {/* Products Scroll (optional) */}
                  {business.products && business.products.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-sm text-[#086644] mb-2">
                        Sản phẩm nổi bật
                      </h4>
                      <div
                        className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        {business.products.map((product) => (
                          <a
                            key={product.id}
                            href={product.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 w-32 group cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="relative rounded-lg overflow-hidden mb-2 bg-gray-100">
                              <ImageWithFallback
                                src={product.image}
                                alt={product.name}
                                className="w-32 h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                                <ExternalLink className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                            <p className="text-xs text-[#333333] line-clamp-2 mb-1 group-hover:text-[#086644] transition-colors">
                              {product.name}
                            </p>
                            <p className="text-xs text-[#086644]">
                              {product.price}
                            </p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ✅ NÚT LUÔN Ở ĐÁY -> THẲNG HÀNG */}
                <Button
                  className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white hover:opacity-90"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDetail(business);
                  }}
                >
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-[#6b7280] mx-auto mb-4" />
            <h3 className="text-[#333333] mb-2">Không tìm thấy doanh nghiệp</h3>
            <p className="text-[#6b7280]">Thử tìm kiếm với từ khóa khác</p>
          </div>
        )}
      </div>

      {/* ✅ POPUP DETAIL (show all DB fields, hide empty) */}
      <Dialog open={openDetail} onOpenChange={setOpenDetail}>
        {/* ✅ CHỈ SỬA RESPONSIVE UI CHO MOBILE */}
        <DialogContent
          className="
            !w-[90vw] sm:!w-full !max-w-none sm:!max-w-[760px]
            p-0 overflow-hidden
            !max-h-[90vh] sm:!max-h-[85vh]
            rounded-2xl
          "
        >
          {/* ✅ wrapper scroll bên trong để không tràn màn hình */}
          <div className="max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
            <div className="p-4 sm:p-7">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-[#086644]">
                  Thông tin doanh nghiệp
                </DialogTitle>
              </DialogHeader>

              {selected && (
                <div className="space-y-4">
                  {/* Top */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#A8E6CF] to-[#086644] flex items-center justify-center overflow-hidden">
                    {selected.logo?.startsWith("http") ? (
                      <img
                        src={selected.logo}
                        alt={selected.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">{selected.logo}</span>
                    )}
                  </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="text-lg font-semibold text-[#086644] break-words min-w-0">
                          {selected.name}
                        </div>

                        {selected.verified && (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            title="Đã xác thực"
                            className="flex-shrink-0"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              fill="#1877F2"
                            />
                          </svg>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap gap-2">
                        {!!selected.category && (
                          <Badge variant="secondary" className="text-xs">
                            {selected.category}
                          </Badge>
                        )}

                        <Badge className="bg-[#A8E6CF] text-[#086644] hover:bg-[#A8E6CF]/80">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Đã xác thực
                        </Badge>

                        {selected.insurance && (
                          <Badge className="bg-[#086644] text-white hover:bg-[#086644]/80">
                            <Shield className="h-3 w-3 mr-1" />
                            Có quỹ BH
                          </Badge>
                        )}

                        {selected.isTrusted && (
                          <Badge className="bg-emerald-700 text-white">
                            Uy tín
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Desc */}
                  {!!selected.description && (
                    <p className="text-sm text-gray-600 break-words">
                      {selected.description}
                    </p>
                  )}

                  <Separator />

                  {/* Info rows */}
                  <div className="space-y-2 text-sm text-gray-700 min-w-0">
                    {!!selected.taxCode && (
                      <div className="flex items-center gap-2 min-w-0">
                        <Hash className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="break-words min-w-0">
                          MST: {selected.taxCode}
                        </span>
                      </div>
                    )}

                    {!!selected.email && (
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="break-words min-w-0">
                          {selected.email}
                        </span>
                      </div>
                    )}

                    {!!selected.phone && (
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="break-words min-w-0">
                          {selected.phone}
                        </span>
                      </div>
                    )}

                    {!!selected.website && (
                      <div className="flex items-center gap-2 min-w-0">
                        <Globe className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <a
                          className="text-[#086644] hover:underline inline-flex items-center gap-1 break-all min-w-0"
                          href={normalizeLink(selected.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="break-all min-w-0">
                            {selected.website}
                          </span>
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      </div>
                    )}

                    {!!selected.address && (
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="break-words min-w-0">
                          {selected.address}
                        </span>
                      </div>
                    )}

                    {!!selected.verifiedAt && (
                      <div className="text-xs text-gray-500">
                        Ngày xác thực: {formatDateVi(selected.verifiedAt)}
                      </div>
                    )}
                  </div>

                  {/* ✅ CEO */}
                  {(!!selected.ceoName || !!selected.ceoAvatarUrl) && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-[#086644]">
                          CEO
                        </div>

                        <div className="flex items-center gap-3">
                          {selected.ceoAvatarUrl ? (
                            <img
                              src={normalizeLink(selected.ceoAvatarUrl)}
                              alt={selected.ceoName || "CEO"}
                              className="h-12 w-12 rounded-full object-cover border"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-[#F4F6F8] flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-gray-500" />
                            </div>
                          )}

                          {!!selected.ceoName && (
                            <div className="text-sm text-gray-700">
                              <span className="font-medium">
                                {selected.ceoName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* ✅ Social Links */}
                  {(!!selected.facebookUrl ||
                    !!selected.messengerUrl ||
                    !!selected.tiktokUrl ||
                    !!selected.instagramUrl ||
                    !!selected.zaloUrl ||
                    !!selected.youtubeUrl) && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-[#086644]">
                          Liên kết mạng xã hội
                        </div>

                        <div className="space-y-2 text-sm min-w-0">
                          <SocialRow
                            label="Facebook"
                            url={selected.facebookUrl}
                          />
                          <div className="flex items-center gap-2 min-w-0">
                            {/* Messenger row with icon */}
                            {selected.messengerUrl ? (
                              <>
                                <MessageCircle className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <a
                                  className="text-[#086644] hover:underline inline-flex items-center gap-1 break-all min-w-0"
                                  href={normalizeLink(selected.messengerUrl)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <span className="min-w-0 break-all">
                                    Messenger
                                  </span>
                                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                </a>
                              </>
                            ) : null}
                          </div>

                          <SocialRow label="TikTok" url={selected.tiktokUrl} />
                          <SocialRow
                            label="Instagram"
                            url={selected.instagramUrl}
                          />
                          <SocialRow label="Zalo" url={selected.zaloUrl} />
                          <SocialRow
                            label="YouTube"
                            url={selected.youtubeUrl}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Bottom actions */}
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setOpenDetail(false)}
                    >
                      Đóng
                    </Button>
                    <Button className="bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white hover:opacity-90">
                      Liên hệ
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}