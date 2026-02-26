import { Search, Star, CheckCircle, Building2, Phone, Globe, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

export function TrustedBusinessPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const businesses = [
    {
      id: 1,
      name: 'Công ty TNHH ABC Tech',
      logo: '🏢',
      category: 'Công nghệ',
      rating: 4.8,
      reviews: 245,
      verified: true,
      phone: '0901 234 567',
      website: 'abctech.vn',
      address: 'Hà Nội',
      description: 'Cung cấp giải pháp phần mềm doanh nghiệp',
      insurance: true,
      products: [
        {
          id: 1,
          name: 'Laptop Dell XPS 15',
          price: '35.000.000đ',
          image: 'https://images.unsplash.com/photo-1737868131581-6379cdee4ec3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYwNDY5MTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
          link: 'https://abctech.vn/laptop-dell-xps-15'
        },
        {
          id: 2,
          name: 'iPhone 15 Pro Max',
          price: '32.000.000đ',
          image: 'https://images.unsplash.com/photo-1675953935267-e039f13ddd79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwcGhvbmV8ZW58MXx8fHwxNzYwNDI1NzY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
          link: 'https://abctech.vn/iphone-15-pro-max'
        },
        {
          id: 3,
          name: 'Sony WH-1000XM5',
          price: '8.500.000đ',
          image: 'https://images.unsplash.com/photo-1713618651165-a3cf7f85506c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwYXVkaW98ZW58MXx8fHwxNzYwNDY0ODI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
          link: 'https://abctech.vn/sony-headphones'
        },
      ]
    },
    {
      id: 2,
      name: 'Siêu thị XYZ',
      logo: '🛒',
      category: 'Bán lẻ',
      rating: 4.9,
      reviews: 1823,
      verified: true,
      phone: '0902 345 678',
      website: 'xyzmart.vn',
      address: 'TP.HCM',
      description: 'Chuỗi siêu thị uy tín toàn quốc',
      insurance: true,
      products: [
        {
          id: 1,
          name: 'Rau củ tươi organic',
          price: '45.000đ/kg',
          image: 'https://images.unsplash.com/photo-1670680901600-8b2b1856ce3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBncm9jZXJ5fGVufDF8fHx8MTc2MDUwMzQxNXww&ixlib=rb-4.1.0&q=80&w=1080',
          link: 'https://xyzmart.vn/rau-cu-tuoi'
        },
        {
          id: 2,
          name: 'Bánh mì thủ công',
          price: '25.000đ',
          image: 'https://images.unsplash.com/photo-1666425200549-1916f77087f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBicmVhZCUyMGZvb2R8ZW58MXx8fHwxNzYwNTAzNDE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
          link: 'https://xyzmart.vn/banh-mi'
        },
      ]
    },
    {
      id: 3,
      name: 'Nhà hàng Việt Nam',
      logo: '🍜',
      category: 'Ẩm thực',
      rating: 4.7,
      reviews: 567,
      verified: true,
      phone: '0903 456 789',
      website: 'vietnamfood.vn',
      address: 'Đà Nẵng',
      description: 'Ẩm thực truyền thống Việt Nam',
      insurance: false,
      products: [
        {
          id: 1,
          name: 'Phở bò đặc biệt',
          price: '75.000đ',
          image: 'https://images.unsplash.com/photo-1636474498689-27e2d3ecf8d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwZm9vZCUyMHBob3xlbnwxfHx8fDE3NjA1MDM0MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
          link: 'https://vietnamfood.vn/pho-bo'
        },
      ]
    },
    {
      id: 4,
      name: 'Trung tâm Giáo dục DEF',
      logo: '📚',
      category: 'Giáo dục',
      rating: 4.9,
      reviews: 892,
      verified: true,
      phone: '0904 567 890',
      website: 'defedu.vn',
      address: 'Hà Nội',
      description: 'Đào tạo ngoại ngữ và kỹ năng mềm',
      insurance: true,
      products: []
    },
    {
      id: 5,
      name: 'Công ty Du lịch GHI',
      logo: '✈️',
      category: 'Du lịch',
      rating: 4.6,
      reviews: 423,
      verified: true,
      phone: '0905 678 901',
      website: 'ghitravel.vn',
      address: 'TP.HCM',
      description: 'Tour du lịch trong và ngoài nước',
      insurance: true,
      products: []
    },
    {
      id: 6,
      name: 'Phòng khám JKL',
      logo: '⚕️',
      category: 'Y tế',
      rating: 4.8,
      reviews: 634,
      verified: true,
      phone: '0906 789 012',
      website: 'jklclinic.vn',
      address: 'Hà Nội',
      description: 'Dịch vụ y tế chất lượng cao',
      insurance: true,
      products: []
    },
  ];

  const categories = ['Tất cả', 'Công nghệ', 'Bán lẻ', 'Ẩm thực', 'Giáo dục', 'Du lịch', 'Y tế'];
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const filteredBusinesses = businesses.filter(b => 
    (selectedCategory === 'Tất cả' || b.category === selectedCategory) &&
    (searchQuery === '' || b.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            Danh sách các doanh nghiệp đã được xác thực và có độ tin cậy cao từ cộng đồng
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
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white'
                    : ''
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Doanh nghiệp', value: '3,456' },
            { label: 'Đánh giá', value: '45,234' },
            { label: 'Tham gia quỹ BH', value: '2,345' },
            { label: 'Rating TB', value: '4.8⭐' },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="border-0 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#A8E6CF] to-[#086644] flex items-center justify-center text-3xl">
                      {business.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[#086644] line-clamp-1">{business.name}</h3>
                        {business.verified && (
                          <div className="flex-shrink-0" title="Doanh nghiệp đã xác thực">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fill="#1877F2"/>
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
                <p className="text-sm text-[#6b7280] line-clamp-2">{business.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-[#F8B400] text-[#F8B400]" />
                    <span className="text-sm text-[#086644]">{business.rating}</span>
                  </div>
                  <span className="text-xs text-[#6b7280]">({business.reviews} đánh giá)</span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-[#6b7280]">
                    <Phone className="h-4 w-4" />
                    <span>{business.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#6b7280]">
                    <Globe className="h-4 w-4" />
                    <span>{business.website}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#6b7280]">
                    <MapPin className="h-4 w-4" />
                    <span>{business.address}</span>
                  </div>
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

                {/* Products Scroll */}
                {business.products && business.products.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-sm text-[#086644] mb-2">Sản phẩm nổi bật</h4>
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      {business.products.map((product) => (
                        <a
                          key={product.id}
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 w-32 group cursor-pointer"
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
                          <p className="text-xs text-[#333333] line-clamp-2 mb-1 group-hover:text-[#086644] transition-colors">{product.name}</p>
                          <p className="text-xs text-[#086644]">{product.price}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <Button className="w-full rounded-xl bg-gradient-to-r from-[#A8E6CF] to-[#086644] text-white hover:opacity-90">
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
    </div>
  );
}
