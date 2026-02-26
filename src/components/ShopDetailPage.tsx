import { 
  Store, 
  CheckCircle, 
  Star, 
  Package, 
  TrendingUp, 
  MessageCircle, 
  Heart,
  Share2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
  ThumbsUp,
  ChevronLeft,
  ExternalLink,
  ShoppingCart
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

interface ShopDetailPageProps {
  shopId: number;
  onNavigate: (page: string) => void;
}

export function ShopDetailPage({ shopId, onNavigate }: ShopDetailPageProps) {
  const [activeTab, setActiveTab] = useState('products');
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock shop data based on shopId
  const shopData: Record<number, any> = {
    1: {
      id: 1,
      name: 'TechStore Premium',
      category: 'Điện tử - Công nghệ',
      description: 'Chuyên cung cấp các sản phẩm điện tử, laptop, điện thoại cao cấp chính hãng với giá tốt nhất thị trường. Cam kết 100% hàng chính hãng, bảo hành toàn quốc.',
      logo: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200',
      coverImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200',
      verified: true,
      rating: 4.8,
      totalReviews: 1234,
      totalProducts: 156,
      totalSales: 3420,
      joinedDate: '2022-01-15',
      followers: 5670,
      responseRate: 98,
      responseTime: '< 1 giờ',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      phone: '0901234567',
      email: 'contact@techstore.com',
      website: 'https://techstore.com',
      businessHours: 'Thứ 2 - CN: 8:00 - 22:00',
      products: [
        {
          id: 1,
          name: 'Laptop Dell XPS 15',
          price: 25990000,
          originalPrice: 29990000,
          image: 'https://images.unsplash.com/photo-1737868131581-6379cdee4ec3?w=400',
          rating: 4.9,
          reviews: 128,
          sold: 245,
          discount: 13,
        },
        {
          id: 2,
          name: 'iPhone 15 Pro Max 256GB',
          price: 32000000,
          image: 'https://images.unsplash.com/photo-1675953935267-e039f13ddd79?w=400',
          rating: 4.8,
          reviews: 342,
          sold: 567,
        },
        {
          id: 3,
          name: 'MacBook Pro M3 14 inch',
          price: 42000000,
          originalPrice: 45000000,
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
          rating: 5.0,
          reviews: 89,
          sold: 123,
          discount: 7,
        },
        {
          id: 4,
          name: 'Samsung Galaxy S24 Ultra',
          price: 28000000,
          image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
          rating: 4.7,
          reviews: 234,
          sold: 456,
        },
        {
          id: 5,
          name: 'iPad Pro M2 11 inch',
          price: 22000000,
          originalPrice: 24000000,
          image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
          rating: 4.9,
          reviews: 167,
          sold: 289,
          discount: 8,
        },
        {
          id: 6,
          name: 'AirPods Pro Gen 2',
          price: 6500000,
          image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400',
          rating: 4.8,
          reviews: 456,
          sold: 789,
        },
      ],
      reviews: [
        {
          id: 1,
          userName: 'Nguyễn Văn A',
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
          rating: 5,
          date: '2024-10-25',
          comment: 'Sản phẩm chất lượng, giao hàng nhanh. Shop tư vấn nhiệt tình!',
          images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200'],
          helpful: 45,
        },
        {
          id: 2,
          userName: 'Trần Thị B',
          userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
          rating: 4,
          date: '2024-10-20',
          comment: 'Laptop đẹp, cấu hình mạnh. Đóng gói cẩn thận.',
          helpful: 32,
        },
        {
          id: 3,
          userName: 'Lê Văn C',
          userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
          rating: 5,
          date: '2024-10-15',
          comment: 'Shop uy tín, hàng chính hãng 100%. Sẽ ủng hộ lâu dài!',
          helpful: 67,
        },
      ],
    },
    2: {
      id: 2,
      name: 'Fashion House VN',
      category: 'Thời trang',
      description: 'Thời trang nam nữ cao cấp, hàng hiệu chính hãng nhập khẩu từ Nhật Bản. Cam kết 100% hàng auth, có đầy đủ hóa đơn chứng từ.',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
      coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
      verified: true,
      rating: 4.9,
      totalReviews: 2156,
      totalProducts: 342,
      totalSales: 8920,
      joinedDate: '2021-06-20',
      followers: 12340,
      responseRate: 99,
      responseTime: '< 30 phút',
      address: '456 Đường XYZ, Quận 3, TP.HCM',
      phone: '0902345678',
      email: 'contact@fashionhouse.vn',
      website: 'https://fashionhouse.vn',
      businessHours: 'Thứ 2 - CN: 9:00 - 21:00',
      products: [
        {
          id: 1,
          name: 'Áo khoác da nam Uniqlo',
          price: 3990000,
          originalPrice: 4990000,
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
          rating: 4.9,
          reviews: 234,
          sold: 567,
          discount: 20,
        },
        {
          id: 2,
          name: 'Giày thể thao Nike Air Max',
          price: 2990000,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
          rating: 4.8,
          reviews: 456,
          sold: 890,
        },
        {
          id: 3,
          name: 'Túi xách nữ Gucci',
          price: 15990000,
          originalPrice: 18990000,
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
          rating: 5.0,
          reviews: 123,
          sold: 234,
          discount: 16,
        },
        {
          id: 4,
          name: 'Đồng hồ nam Seiko',
          price: 4500000,
          image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',
          rating: 4.7,
          reviews: 189,
          sold: 345,
        },
        {
          id: 5,
          name: 'Kính mát Ray-Ban',
          price: 3200000,
          originalPrice: 3800000,
          image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
          rating: 4.8,
          reviews: 267,
          sold: 456,
          discount: 16,
        },
        {
          id: 6,
          name: 'Áo thun nam Polo',
          price: 890000,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          rating: 4.6,
          reviews: 345,
          sold: 678,
        },
      ],
      reviews: [
        {
          id: 1,
          userName: 'Phạm Thị D',
          userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
          rating: 5,
          date: '2024-10-28',
          comment: 'Quần áo đẹp, chất lượng cao cấp. Đóng gói cẩn thận, giao hàng nhanh!',
          helpful: 89,
        },
        {
          id: 2,
          userName: 'Hoàng Văn E',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
          rating: 5,
          date: '2024-10-25',
          comment: 'Shop uy tín, hàng auth 100%. Rất hài lòng!',
          helpful: 67,
        },
      ],
    },
    3: {
      id: 3,
      name: 'Home & Living Store',
      category: 'Nội thất - Gia dụng',
      description: 'Nội thất cao cấp, đồ gia dụng thông minh cho ngôi nhà hiện đại. Thiết kế độc đáo, chất lượng bền đẹp.',
      logo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200',
      coverImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
      verified: true,
      rating: 4.7,
      totalReviews: 892,
      totalProducts: 234,
      totalSales: 2130,
      joinedDate: '2022-03-10',
      followers: 4520,
      responseRate: 96,
      responseTime: '< 2 giờ',
      address: '789 Đường DEF, Quận 7, TP.HCM',
      phone: '0903456789',
      email: 'contact@homeliving.vn',
      website: 'https://homeliving.vn',
      businessHours: 'Thứ 2 - CN: 8:30 - 20:00',
      products: [
        {
          id: 1,
          name: 'Sofa da thật 3 chỗ',
          price: 25000000,
          originalPrice: 30000000,
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
          rating: 4.8,
          reviews: 123,
          sold: 156,
          discount: 17,
        },
        {
          id: 2,
          name: 'Bộ bàn ăn 6 ghế',
          price: 12000000,
          image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400',
          rating: 4.7,
          reviews: 89,
          sold: 123,
        },
        {
          id: 3,
          name: 'Tủ lạnh Samsung 2 cánh',
          price: 18000000,
          image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400',
          rating: 4.9,
          reviews: 234,
          sold: 345,
        },
        {
          id: 4,
          name: 'Máy lọc không khí Xiaomi',
          price: 3500000,
          originalPrice: 4000000,
          image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400',
          rating: 4.6,
          reviews: 167,
          sold: 289,
          discount: 13,
        },
        {
          id: 5,
          name: 'Đèn trang trí LED thông minh',
          price: 1200000,
          image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400',
          rating: 4.5,
          reviews: 145,
          sold: 234,
        },
        {
          id: 6,
          name: 'Thảm trải sàn cao cấp',
          price: 2500000,
          image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400',
          rating: 4.7,
          reviews: 98,
          sold: 167,
        },
      ],
      reviews: [
        {
          id: 1,
          userName: 'Ngô Thị F',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
          rating: 5,
          date: '2024-10-26',
          comment: 'Nội thất đẹp, chất lượng tốt. Lắp đặt chuyên nghiệp!',
          helpful: 45,
        },
      ],
    },
  };

  const shop = shopData[shopId] || shopData[1]; // Fallback to shop 1

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      {/* Back Button */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate('shop')}
            className="gap-2"
          >
            <ChevronLeft className="h-5 w-5" />
            Quay lại danh sách cửa hàng
          </Button>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <ImageWithFallback
          src={shop.coverImage}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Shop Header */}
        <div className="relative -mt-20 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <div className="h-32 w-32 rounded-2xl border-4 border-white overflow-hidden bg-white shadow-lg">
                    <ImageWithFallback
                      src={shop.logo}
                      alt={shop.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <h1 className="text-[#086644]">{shop.name}</h1>
                        {shop.verified && (
                          <CheckCircle className="h-6 w-6 text-[#086644] fill-[#086644]" />
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary" className="mb-3">
                      {shop.category}
                    </Badge>
                    <p className="text-[#6b7280]">{shop.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-[#F8B400] fill-current" />
                      <div>
                        <div className="text-[#086644]">{shop.rating}</div>
                        <div className="text-xs text-[#6b7280]">{shop.totalReviews} đánh giá</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-[#086644]" />
                      <div>
                        <div className="text-[#086644]">{shop.totalProducts}</div>
                        <div className="text-xs text-[#6b7280]">Sản phẩm</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-[#086644]" />
                      <div>
                        <div className="text-[#086644]">{shop.totalSales}</div>
                        <div className="text-xs text-[#6b7280]">Đã bán</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-[#E57373]" />
                      <div>
                        <div className="text-[#086644]">{shop.followers.toLocaleString('vi-VN')}</div>
                        <div className="text-xs text-[#6b7280]">Theo dõi</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      className={`rounded-xl ${isFollowing ? 'bg-[#E0E0E0] text-[#333333]' : 'bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white'}`}
                      onClick={() => setIsFollowing(!isFollowing)}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                      {isFollowing ? 'Đã theo dõi' : 'Theo dõi'}
                    </Button>
                    <Button variant="outline" className="rounded-xl">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat ngay
                    </Button>
                    <Button variant="outline" className="rounded-xl">
                      <Share2 className="h-4 w-4 mr-2" />
                      Chia sẻ
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <div className="pb-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white p-1 rounded-xl shadow-sm w-full md:w-auto">
              <TabsTrigger value="products" className="rounded-lg">
                <Package className="h-4 w-4 mr-2" />
                Sản phẩm ({shop.products.length})
              </TabsTrigger>
              <TabsTrigger value="about" className="rounded-lg">
                <Store className="h-4 w-4 mr-2" />
                Giới thiệu
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg">
                <Star className="h-4 w-4 mr-2" />
                Đánh giá ({shop.totalReviews})
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shop.products.map((product: any) => (
                  <Card key={product.id} className="border-0 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardContent className="p-0">
                      {/* Image */}
                      <div className="relative h-56 bg-[#F4F6F8] overflow-hidden">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        {product.discount && (
                          <Badge className="absolute top-3 left-3 bg-[#E57373] text-white">
                            -{product.discount}%
                          </Badge>
                        )}
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                            <Heart className="h-4 w-4 text-[#333333]" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        <h3 className="text-[#086644] line-clamp-2 min-h-[48px]">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-[#F8B400] text-[#F8B400]" />
                            <span className="text-sm text-[#086644]">{product.rating}</span>
                          </div>
                          <span className="text-xs text-[#6b7280]">
                            ({product.reviews}) | Đã bán {product.sold}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl text-[#E57373]">
                              {product.price.toLocaleString('vi-VN')}đ
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-[#6b7280] line-through">
                                {product.originalPrice.toLocaleString('vi-VN')}đ
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 rounded-xl border-[#086644] text-[#086644] hover:bg-[#086644] hover:text-white"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Xem
                          </Button>
                          <Button 
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white hover:opacity-90 rounded-xl"
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Mua
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-[#086644] mb-4">Thông tin liên hệ</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-[#086644] flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm text-[#6b7280]">Địa chỉ</div>
                          <div className="text-[#333333]">{shop.address}</div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-[#086644] flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm text-[#6b7280]">Điện thoại</div>
                          <div className="text-[#333333]">{shop.phone}</div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-[#086644] flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm text-[#6b7280]">Email</div>
                          <div className="text-[#333333]">{shop.email}</div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-[#086644] flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm text-[#6b7280]">Giờ làm việc</div>
                          <div className="text-[#333333]">{shop.businessHours}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-[#086644] mb-4">Chất lượng dịch vụ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-[#F4F6F8] rounded-xl">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#A8E6CF] to-[#086644] flex items-center justify-center">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-[#086644]">{shop.responseRate}%</div>
                          <div className="text-xs text-[#6b7280]">Tỉ lệ phản hồi</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-[#F4F6F8] rounded-xl">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#A8E6CF] to-[#086644] flex items-center justify-center">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-[#086644]">{shop.responseTime}</div>
                          <div className="text-xs text-[#6b7280]">Thời gian phản hồi</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-[#086644] mb-4">Cam kết</h3>
                    <div className="space-y-3">
                      {[
                        'Hàng chính hãng 100%',
                        'Bảo hành toàn quốc',
                        'Đổi trả trong 7 ngày',
                        'Giao hàng nhanh chóng',
                        'Hỗ trợ 24/7',
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-[#A8E6CF] flex-shrink-0" />
                          <span className="text-[#333333]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              {/* Rating Summary */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="text-5xl text-[#086644] mb-2">{shop.rating}</div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-5 w-5 fill-[#F8B400] text-[#F8B400]" />
                        ))}
                      </div>
                      <div className="text-sm text-[#6b7280]">{shop.totalReviews} đánh giá</div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const percentage = stars === 5 ? 75 : stars === 4 ? 20 : 5;
                        return (
                          <div key={stars} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-20">
                              <span className="text-sm text-[#333333]">{stars}</span>
                              <Star className="h-4 w-4 fill-[#F8B400] text-[#F8B400]" />
                            </div>
                            <div className="flex-1 h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#F8B400] rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-[#6b7280] w-12 text-right">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="space-y-4">
                {shop.reviews.map((review: any) => (
                  <Card key={review.id} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={review.userAvatar} alt={review.userName} />
                          <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-[#333333]">{review.userName}</div>
                              <div className="text-xs text-[#6b7280]">{review.date}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= review.rating ? 'fill-[#F8B400] text-[#F8B400]' : 'text-[#E0E0E0]'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-[#333333]">{review.comment}</p>
                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-2">
                              {review.images.map((img: string, idx: number) => (
                                <div key={idx} className="h-20 w-20 rounded-lg overflow-hidden bg-[#F4F6F8]">
                                  <ImageWithFallback
                                    src={img}
                                    alt={`Review ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-4 pt-2">
                            <button className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#086644]">
                              <ThumbsUp className="h-4 w-4" />
                              Hữu ích ({review.helpful})
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
