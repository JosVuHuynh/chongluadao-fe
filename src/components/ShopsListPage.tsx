import { Store, CheckCircle, Star, Package, TrendingUp, Search } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

interface ShopsListPageProps {
  onNavigate: (page: string, shopId?: number) => void;
}

export function ShopsListPage({ onNavigate }: ShopsListPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const shops = [
    {
      id: 1,
      name: 'TechStore Premium',
      category: 'Điện tử - Công nghệ',
      description: 'Chuyên cung cấp các sản phẩm điện tử, laptop, điện thoại cao cấp chính hãng',
      logo: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200',
      coverImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
      verified: true,
      rating: 4.8,
      totalReviews: 1234,
      totalProducts: 156,
      totalSales: 3420,
      joinedDate: '2022-01-15',
      followers: 5670,
      responseRate: 98,
      responseTime: '< 1 giờ',
    },
    {
      id: 2,
      name: 'Fashion House VN',
      category: 'Thời trang',
      description: 'Thời trang nam nữ cao cấp, hàng hiệu chính hãng nhập khẩu từ Nhật Bản',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
      coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      verified: true,
      rating: 4.9,
      totalReviews: 2156,
      totalProducts: 342,
      totalSales: 8920,
      joinedDate: '2021-06-20',
      followers: 12340,
      responseRate: 99,
      responseTime: '< 30 phút',
    },
    {
      id: 3,
      name: 'Home & Living Store',
      category: 'Nội thất - Gia dụng',
      description: 'Nội thất cao cấp, đồ gia dụng thông minh cho ngôi nhà hiện đại',
      logo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200',
      coverImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      verified: true,
      rating: 4.7,
      totalReviews: 892,
      totalProducts: 234,
      totalSales: 2130,
      joinedDate: '2022-03-10',
      followers: 4520,
      responseRate: 96,
      responseTime: '< 2 giờ',
    },
    {
      id: 4,
      name: 'Beauty & Care JP',
      category: 'Làm đẹp - Sức khỏe',
      description: 'Mỹ phẩm Nhật Bản chính hãng, sản phẩm chăm sóc sức khỏe cao cấp',
      logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200',
      coverImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
      verified: true,
      rating: 4.9,
      totalReviews: 3421,
      totalProducts: 567,
      totalSales: 12340,
      joinedDate: '2021-02-01',
      followers: 18760,
      responseRate: 99,
      responseTime: '< 30 phút',
    },
    {
      id: 5,
      name: 'Sports & Outdoor',
      category: 'Thể thao - Dụng cụ',
      description: 'Trang thiết bị thể thao chuyên nghiệp, dụng cụ outdoor chất lượng cao',
      logo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200',
      coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
      verified: true,
      rating: 4.6,
      totalReviews: 674,
      totalProducts: 189,
      totalSales: 1560,
      joinedDate: '2022-08-15',
      followers: 3210,
      responseRate: 95,
      responseTime: '< 3 giờ',
    },
    {
      id: 6,
      name: 'Gourmet Food Shop',
      category: 'Thực phẩm - Đồ uống',
      description: 'Thực phẩm cao cấp nhập khẩu, đồ uống đặc sản từ Nhật Bản',
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
      coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
      verified: true,
      rating: 4.8,
      totalReviews: 1567,
      totalProducts: 423,
      totalSales: 4230,
      joinedDate: '2021-11-05',
      followers: 8920,
      responseRate: 97,
      responseTime: '< 1 giờ',
    },
  ];

  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { name: 'Tất cả', count: shops.length },
    { name: 'Điện tử - Công nghệ', count: 1 },
    { name: 'Thời trang', count: 1 },
    { name: 'Nội thất - Gia dụng', count: 1 },
    { name: 'Làm đẹp - Sức khỏe', count: 1 },
    { name: 'Thể thao - Dụng cụ', count: 1 },
    { name: 'Thực phẩm - Đồ uống', count: 1 },
  ];

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
            Khám phá các cửa hàng uy tín đã được xác thực bởi ChongLuaDaoJP
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

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-3 pb-2">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                size="sm"
                className={index === 0 
                  ? "bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white rounded-full whitespace-nowrap" 
                  : "rounded-full whitespace-nowrap"
                }
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Cửa hàng', value: `${shops.length}+`, icon: Store },
            { label: 'Sản phẩm', value: '2K+', icon: Package },
            { label: 'Đã bán', value: '30K+', icon: TrendingUp },
            { label: 'Đánh giá', value: '4.8⭐', icon: Star },
          ].map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4 text-center space-y-2">
                <stat.icon className="h-6 w-6 mx-auto text-[#086644]" />
                <div className="text-2xl text-[#086644]">{stat.value}</div>
                <div className="text-sm text-[#6b7280]">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Shops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <Card 
              key={shop.id} 
              className="border-0 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group cursor-pointer"
              onClick={() => onNavigate('shop-detail', shop.id)}
            >
              <CardContent className="p-0">
                {/* Cover Image */}
                <div className="relative h-32 overflow-hidden">
                  <ImageWithFallback
                    src={shop.coverImage}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {shop.verified && (
                    <Badge className="absolute top-3 right-3 bg-[#086644] text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Xác thực
                    </Badge>
                  )}
                </div>

                {/* Shop Info */}
                <div className="p-5 space-y-4">
                  {/* Logo & Name */}
                  <div className="flex items-start gap-3">
                    <div className="relative -mt-10 flex-shrink-0">
                      <div className="h-16 w-16 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                        <ImageWithFallback
                          src={shop.logo}
                          alt={shop.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="flex items-start gap-2">
                        <h3 className="text-[#086644] line-clamp-1 flex-1">{shop.name}</h3>
                        {shop.verified && (
                          <CheckCircle className="h-5 w-5 text-[#086644] flex-shrink-0 fill-[#086644]" />
                        )}
                      </div>
                      <Badge variant="secondary" className="mt-1">
                        {shop.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#6b7280] line-clamp-2 min-h-[40px]">
                    {shop.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-[#F8B400]">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm text-[#086644]">{shop.rating}</span>
                      </div>
                      <div className="text-xs text-[#6b7280] mt-1">{shop.totalReviews} đánh giá</div>
                    </div>
                    <div className="text-center border-l">
                      <div className="text-sm text-[#086644]">{shop.totalProducts}</div>
                      <div className="text-xs text-[#6b7280] mt-1">Sản phẩm</div>
                    </div>
                    <div className="text-center border-l">
                      <div className="text-sm text-[#086644]">{shop.followers.toLocaleString('vi-VN')}</div>
                      <div className="text-xs text-[#6b7280] mt-1">Theo dõi</div>
                    </div>
                  </div>

                  {/* Response Info */}
                  <div className="flex items-center justify-between text-xs pt-3 border-t">
                    <div className="flex items-center gap-1 text-[#6b7280]">
                      <div className="h-2 w-2 rounded-full bg-[#A8E6CF]" />
                      <span>Phản hồi: {shop.responseRate}%</span>
                    </div>
                    <span className="text-[#6b7280]">Trong {shop.responseTime}</span>
                  </div>

                  {/* Action Button */}
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

        {/* No Results */}
        {filteredShops.length === 0 && (
          <div className="text-center py-16">
            <Store className="h-16 w-16 mx-auto text-[#6b7280] mb-4" />
            <h3 className="text-[#333333] mb-2">Không tìm thấy cửa hàng</h3>
            <p className="text-[#6b7280]">Thử tìm kiếm với từ khóa khác</p>
          </div>
        )}

        {/* Trust Banner */}
        <Card className="mt-12 border-0 bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white">
          <CardContent className="p-8 text-center space-y-4">
            <h3>Tất cả cửa hàng đều được xác thực</h3>
            <p className="text-white/90 max-w-2xl mx-auto">
              Chúng tôi đảm bảo mọi cửa hàng trên nền tảng đều được kiểm tra kỹ lưỡng 
              về giấy phép kinh doanh, uy tín và chất lượng dịch vụ
            </p>
            <div className="flex flex-wrap justify-center gap-8 pt-4">
              {[
                { icon: CheckCircle, label: '100% xác thực' },
                { icon: Star, label: 'Đánh giá cao' },
                { icon: TrendingUp, label: 'Giao dịch minh bạch' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
