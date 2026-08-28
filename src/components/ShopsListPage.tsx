import { Store, CheckCircle, Package, Search, Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useEffect, useState } from 'react';
import * as shopService from '../services/shopService';
import type { Shop } from '../services/shopService';
import { toast } from 'sonner@2.0.3';

interface ShopsListPageProps {
  onNavigate: (page: string, shopId?: number) => void;
}

export function ShopsListPage({ onNavigate }: ShopsListPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const timeout = setTimeout(() => {
      shopService
        .getShops({ q: searchQuery || undefined, category: categoryFilter || undefined, limit: 24 })
        .then((result) => {
          if (cancelled) return;
          setShops(result.data);
          setTotalItems(result.pagination.totalItems);
        })
        .catch((error) => toast.error(error instanceof Error ? error.message : 'Không thể tải danh sách cửa hàng'))
        .finally(() => !cancelled && setLoading(false));
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [searchQuery, categoryFilter]);

  const categories = Array.from(new Set(shops.map((s) => s.category).filter(Boolean))) as string[];

  return (
    <div className="min-h-screen bg-[#F4F6F8] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-[#A8E6CF] to-[#086644]">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-[#086644]">Cửa hàng doanh nghiệp</h1>
          <p className="text-[#6b7280] max-w-2xl mx-auto">
            Khám phá các cửa hàng của doanh nghiệp đã được ChongLuaDaoJP xác thực
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6b7280]" />
            <Input
              type="text"
              placeholder="Tìm kiếm cửa hàng theo tên, danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-xl border-[#E0E0E0] focus:border-[#086644]"
            />
          </div>
        </div>

        {/* Toolbar: category filters + compact stats, sharing one row and one alignment with the grid below */}
        <div className="mb-6 flex flex-col gap-4 border-b pb-6 sm:flex-row items-center justify-between">
          <div className="overflow-x-auto">
            <div className="flex gap-2">
              <Button
                variant={categoryFilter === null ? 'default' : 'outline'}
                size="sm"
                className={categoryFilter === null ? 'bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white rounded-full whitespace-nowrap' : 'rounded-full whitespace-nowrap'}
                onClick={() => setCategoryFilter(null)}
              >
                Tất cả
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={categoryFilter === category ? 'default' : 'outline'}
                  size="sm"
                  className={categoryFilter === category ? 'bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white rounded-full whitespace-nowrap' : 'rounded-full whitespace-nowrap'}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center gap-4 text-sm text-[#6b7280]">
            <span className="flex items-center gap-1.5">
              <Store className="h-4 w-4 text-[#086644]" />
              <span className="text-[#086644] font-medium">{totalItems}</span> cửa hàng
            </span>
            <span className="h-4 border-l border-[#E0E0E0]" style={{ width: 0 }} />
            <span className="flex items-center gap-1.5">
              <Package className="h-4 w-4 text-[#086644]" />
              <span className="text-[#086644] font-medium">{shops.reduce((sum, s) => sum + s.productCount, 0)}</span> sản phẩm
            </span>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#086644]" />
          </div>
        )}

        {/* Shops Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <Card
                key={shop.id}
                className="border-0 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group cursor-pointer"
                onClick={() => onNavigate('shop-detail', shop.id)}
              >
                <CardContent className="p-0">
                  {/* Cover Image */}
                  <div className="relative h-32 overflow-hidden bg-gradient-to-br from-[#A8E6CF] to-[#086644]">
                    {shop.coverUrl && (
                      <ImageWithFallback src={shop.coverUrl} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <Badge className="absolute top-3 right-3 bg-[#086644] text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Xác thực
                    </Badge>
                  </div>

                  {/* Shop Info */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="relative -mt-10 flex-shrink-0">
                        <div className="h-16 w-16 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg flex items-center justify-center">
                          {shop.logoUrl ? (
                            <ImageWithFallback src={shop.logoUrl} alt={shop.name} className="w-full h-full object-cover" />
                          ) : (
                            <Store className="h-6 w-6 text-[#086644]" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className="text-[#086644] line-clamp-1">{shop.name}</h3>
                        {shop.category && (
                          <Badge variant="secondary" className="mt-1">
                            {shop.category}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {shop.shortDescription && (
                      <p className="text-sm text-[#6b7280] line-clamp-2 min-h-[40px]">{shop.shortDescription}</p>
                    )}

                    <div className="pt-3 border-t text-center">
                      <div className="text-sm text-[#086644]">{shop.productCount}</div>
                      <div className="text-xs text-[#6b7280] mt-1">Sản phẩm</div>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white hover:opacity-90 rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('shop-detail', shop.id);
                      }}
                    >
                      Xem cửa hàng
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && shops.length === 0 && (
          <div className="text-center py-16">
            <Store className="h-16 w-16 mx-auto text-[#6b7280] mb-4" />
            <h3 className="text-[#333333] mb-2">Chưa có cửa hàng nào</h3>
            <p className="text-[#6b7280]">Thử tìm kiếm với từ khóa khác</p>
          </div>
        )}
      </div>
    </div>
  );
}
