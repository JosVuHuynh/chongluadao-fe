import {
  Store,
  CheckCircle,
  Package,
  MapPin,
  Phone,
  Mail,
  Globe,
  ChevronLeft,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useEffect, useState } from 'react';
import * as shopService from '../services/shopService';
import type { ShopDetail } from '../services/shopService';
import { toast } from 'sonner@2.0.3';

interface ShopDetailPageProps {
  shopId: number;
  onNavigate: (page: string) => void;
}

function formatPrice(price: number): string {
  return `${price.toLocaleString('vi-VN')}đ`;
}

export function ShopDetailPage({ shopId, onNavigate }: ShopDetailPageProps) {
  const [shop, setShop] = useState<ShopDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    shopService
      .getShopById(shopId)
      .then((result) => !cancelled && setShop(result))
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Không thể tải cửa hàng');
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [shopId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <Loader2 className="h-6 w-6 animate-spin text-[#086644]" />
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center px-4" style={{ minHeight: '60vh' }}>
        <Store className="h-16 w-16 text-[#9CA3AF]" />
        <h2 className="text-[#333333]">{error || 'Không tìm thấy cửa hàng'}</h2>
        <Button onClick={() => onNavigate('shop')} variant="outline">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] pb-12">
      {/* Cover */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#A8E6CF] to-[#086644]">
        {shop.coverUrl && <ImageWithFallback src={shop.coverUrl} alt={shop.name} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-black/50" />
        <button
          onClick={() => onNavigate('shop')}
          className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-sm text-[#333333] hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại
        </button>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Shop header card */}
        <Card className="mt-4 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="h-20 w-20 flex-shrink-0 rounded-2xl border-4 border-white bg-white shadow-lg overflow-hidden flex items-center justify-center">
                {shop.logoUrl ? (
                  <ImageWithFallback src={shop.logoUrl} alt={shop.name} className="w-full h-full object-cover" />
                ) : (
                  <Store className="h-8 w-8 text-[#086644]" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[#086644]">{shop.name}</h1>
                  <Badge className="bg-[#086644] text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Đã xác thực
                  </Badge>
                </div>
                {shop.category && (
                  <Badge variant="secondary" className="mt-2">
                    {shop.category}
                  </Badge>
                )}
                {shop.shortDescription && <p className="mt-2 text-[#6b7280]">{shop.shortDescription}</p>}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4 text-sm text-[#6b7280]">
              {shop.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{[shop.address, shop.district, shop.province].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {shop.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{shop.phone}</span>
                </div>
              )}
              {shop.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{shop.email}</span>
                </div>
              )}
              {shop.website && (
                <a href={shop.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#086644] hover:underline">
                  <Globe className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Website</span>
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {shop.description && (
          <Card className="mt-6 border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-[#086644] mb-2">Giới thiệu</h3>
              <p className="whitespace-pre-wrap text-[#333333]">{shop.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Products */}
        <div className="mt-6">
          <h2 className="text-[#086644] mb-4 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Sản phẩm ({shop.products.length})
          </h2>

          {shop.products.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center text-[#6b7280]">Cửa hàng chưa có sản phẩm nào.</CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {shop.products.map((product) => (
                <Card key={product.id} className="border-0 shadow-md hover:shadow-xl transition-all overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-32 bg-[#F4F6F8] flex items-center justify-center overflow-hidden">
                      {product.imageUrl ? (
                        <ImageWithFallback src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="h-10 w-10 text-[#9CA3AF]" />
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="text-[#1F2937] line-clamp-2">{product.name}</h4>
                      <p className="text-lg text-[#086644]">{formatPrice(product.price)}</p>
                      {product.buyUrl ? (
                        <Button asChild size="sm" className="w-full bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white hover:opacity-90 rounded-xl">
                          <a href={product.buyUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Xem sản phẩm
                          </a>
                        </Button>
                      ) : (
                        <Button size="sm" disabled className="w-full rounded-xl">
                          Chưa có link mua
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
