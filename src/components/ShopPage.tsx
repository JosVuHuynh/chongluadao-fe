import { ShoppingCart, Star, CheckCircle, Filter } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function ShopPage() {
  const products = [
    {
      id: 1,
      name: 'Gói xác thực doanh nghiệp',
      price: 2990000,
      originalPrice: 3500000,
      image: '🏢',
      rating: 4.9,
      reviews: 234,
      verified: true,
      badge: 'Bán chạy',
      features: ['Xác thực hồ sơ', 'Badge uy tín', 'Hỗ trợ 24/7'],
    },
    {
      id: 2,
      name: 'Quỹ bảo hiểm 1 năm',
      price: 5000000,
      image: '🛡️',
      rating: 4.8,
      reviews: 456,
      verified: true,
      badge: 'Đề xuất',
      features: ['Bảo hiểm 100 triệu', 'Bồi thường nhanh', 'Gia hạn linh hoạt'],
    },
    {
      id: 3,
      name: 'Gói quảng cáo Premium',
      price: 1500000,
      image: '📢',
      rating: 4.7,
      reviews: 123,
      verified: true,
      features: ['Hiển thị ưu tiên', 'Banner trang chủ', 'Thống kê chi tiết'],
    },
    {
      id: 4,
      name: 'Xác minh danh tính',
      price: 500000,
      image: '✅',
      rating: 4.9,
      reviews: 789,
      verified: true,
      features: ['Xác thực nhanh 24h', 'Badge xanh', 'Độ tin cậy cao'],
    },
    {
      id: 5,
      name: 'Gói doanh nghiệp VIP',
      price: 9900000,
      originalPrice: 12000000,
      image: '👑',
      rating: 5.0,
      reviews: 89,
      verified: true,
      badge: 'VIP',
      features: ['Tất cả dịch vụ', 'Quản lý chuyên biệt', 'Ưu tiên hỗ trợ'],
    },
    {
      id: 6,
      name: 'Báo cáo phân tích',
      price: 800000,
      image: '📊',
      rating: 4.6,
      reviews: 167,
      verified: true,
      features: ['Phân tích đối thủ', 'Xu hướng thị trường', 'Tư vấn chiến lược'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F8] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-[#A8E6CF] to-[#086644]">
            <ShoppingCart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-[#086644]">Cửa hàng dịch vụ</h1>
          <p className="text-[#6b7280] max-w-2xl mx-auto">
            Các gói dịch vụ giúp doanh nghiệp và cá nhân xây dựng uy tín, bảo vệ thương hiệu
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="default" size="sm" className="bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white rounded-full">
              Tất cả
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Xác thực
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Bảo hiểm
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Quảng cáo
            </Button>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl">
            <Filter className="h-4 w-4 mr-2" />
            Lọc
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Sản phẩm', value: '15+' },
            { label: 'Khách hàng', value: '2.5K+' },
            { label: 'Đánh giá', value: '4.8⭐' },
            { label: 'Hỗ trợ', value: '24/7' },
          ].map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-[#086644]">{stat.value}</div>
                <div className="text-sm text-[#6b7280]">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="border-0 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
              <CardContent className="p-0">
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-[#A8E6CF] to-[#086644] flex items-center justify-center text-8xl relative">
                  {product.image}
                  {product.badge && (
                    <Badge className="absolute top-4 right-4 bg-[#F8B400] text-white">
                      {product.badge}
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Title & Verified */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-[#086644] line-clamp-2">{product.name}</h3>
                      {product.verified && (
                        <CheckCircle className="h-5 w-5 text-[#086644] flex-shrink-0" />
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-[#F8B400] text-[#F8B400]" />
                        <span className="text-sm text-[#086644]">{product.rating}</span>
                      </div>
                      <span className="text-xs text-[#6b7280]">({product.reviews})</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-[#6b7280]">
                        <CheckCircle className="h-4 w-4 text-[#A8E6CF] flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="pt-4 border-t">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl text-[#086644]">
                        {product.price.toLocaleString('vi-VN')}đ
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-[#6b7280] line-through">
                          {product.originalPrice.toLocaleString('vi-VN')}đ
                        </span>
                      )}
                    </div>
                    <Button className="w-full bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white hover:opacity-90 rounded-xl">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Mua ngay
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Us */}
        <Card className="mt-12 border-0 shadow-lg">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-center text-[#086644] mb-8">Tại sao chọn dịch vụ của chúng tôi?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🔒',
                  title: 'Bảo mật tuyệt đối',
                  description: 'Thông tin của bạn được mã hóa và bảo vệ tối đa',
                },
                {
                  icon: '⚡',
                  title: 'Xử lý nhanh chóng',
                  description: 'Kích hoạt dịch vụ ngay sau khi thanh toán',
                },
                {
                  icon: '💯',
                  title: 'Đảm bảo hoàn tiền',
                  description: 'Hoàn tiền 100% nếu không hài lòng trong 7 ngày',
                },
              ].map((item, index) => (
                <div key={index} className="text-center space-y-3">
                  <div className="text-5xl">{item.icon}</div>
                  <h3 className="text-[#086644]">{item.title}</h3>
                  <p className="text-sm text-[#6b7280]">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="mt-8 border-0 bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white">
          <CardContent className="p-8 text-center space-y-4">
            <h3>Cần tư vấn về gói dịch vụ?</h3>
            <p className="text-white/90 max-w-2xl mx-auto">
              Đội ngũ chuyên viên sẵn sàng hỗ trợ bạn 24/7
            </p>
            <Button size="lg" className="bg-white text-[#086644] hover:bg-white/90 rounded-xl">
              Liên hệ ngay
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
