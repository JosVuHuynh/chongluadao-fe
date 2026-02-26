import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, TrendingUp, AlertCircle, Send, Smile, ShoppingBag, Store, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Avatar, AvatarFallback } from './ui/avatar';

export function NewsPage() {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
  const [scrollPositions, setScrollPositions] = useState<{ [key: number]: number }>({});

  const newsPosts = [
    {
      id: 1,
      author: 'Cục Cảnh sát phòng chống tội phạm công nghệ cao',
      authorAvatar: '🛡️',
      role: 'Cơ quan chính phủ',
      time: '2 giờ',
      content: '⚠️ CẢNH BÁO: Thủ đoạn lừa đảo mới qua tin nhắn Zalo giả mạo ngân hàng!\n\nCác đối tượng lừa đảo đang gửi tin nhắn giả mạo thông báo từ ngân hàng, yêu cầu người dùng cập nhật thông tin hoặc xác minh tài khoản. Khi click vào link, nạn nhân sẽ bị đánh cắp thông tin ngân hàng.\n\n✅ Lưu ý: Ngân hàng KHÔNG BAO GIỜ yêu cầu khách hàng cung cấp OTP, mật khẩu qua tin nhắn hoặc điện thoại.',
      image: 'security alert',
      likes: 1234,
      comments: 89,
      shares: 456,
      commentList: [
        { id: 1, author: 'Phạm Minh Đức', avatar: '👤', content: 'Cảm ơn cơ quan đã cảnh báo kịp thời!', time: '1 giờ' },
        { id: 2, author: 'Trần Thu Hương', avatar: '👤', content: 'Mình suýt bị lừa rồi, may đọc được bài này!', time: '45 phút' },
      ],
      isOfficial: true,
      hasProduct: false,
    },
    {
      id: 2,
      author: 'Hiệp hội Doanh nghiệp TP.HCM',
      authorAvatar: '🏢',
      role: 'Tổ chức',
      time: '5 giờ',
      content: '📢 Danh sách doanh nghiệp uy tín được xác thực tháng 1/2025\n\nChúng tôi vui mừng công bố 156 doanh nghiệp đã hoàn tất quy trình xác thực và được cấp chứng nhận uy tín. Các doanh nghiệp này đã đáp ứng đầy đủ tiêu chuẩn về pháp lý, tài chính và uy tín thương mại.\n\nXem danh sách đầy đủ tại: ChongLuaDaoJP.com/verified',
      image: null,
      likes: 567,
      comments: 34,
      shares: 123,
      commentList: [
        { id: 1, author: 'Võ Thành Công', avatar: '👤', content: 'Công ty mình cũng đang làm hồ sơ xác thực, hy vọng sớm được duyệt!', time: '2 giờ' },
      ],
      isOfficial: true,
    },
    {
      id: 3,
      author: 'Công ty TNHH ABC Tech',
      authorAvatar: '💼',
      role: 'Doanh nghiệp đã xác thực',
      time: '1 ngày',
      content: '🎉 Khuyến mãi cuối năm - Giảm giá lên đến 50%!\n\nĐừng bỏ lỡ cơ hội sở hữu các sản phẩm công nghệ cao cấp với mức giá ưu đãi nhất trong năm. Sản phẩm chính hãng, bảo hành đầy đủ.\n\n✨ Cấu hình mạnh mẽ\n✨ Thiết kế cao cấp\n✨ Hiệu năng vượt trội\n\n#Sale #CongNghe #ABCTech',
      image: null,
      likes: 567,
      comments: 45,
      shares: 123,
      commentList: [
        { id: 1, author: 'Đỗ Quang Minh', avatar: '👤', content: 'Giá tốt quá, mình đã đặt hàng rồi!', time: '30 phút' },
      ],
      isOfficial: false,
      verified: true,
      hasProduct: true,
      products: [
        {
          id: 1,
          name: 'Laptop Dell XPS 15',
          price: '25,990,000đ',
          image: 'https://images.unsplash.com/photo-1737868131581-6379cdee4ec3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYwNDY5MTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
          link: 'https://example.com/laptop'
        },
        {
          id: 2,
          name: 'iPhone 15 Pro Max',
          price: '32,000,000đ',
          image: 'https://images.unsplash.com/photo-1675953935267-e039f13ddd79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwcGhvbmV8ZW58MXx8fHwxNzYwNDI1NzY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
          link: 'https://example.com/iphone'
        },
        {
          id: 3,
          name: 'Sony WH-1000XM5',
          price: '8,500,000đ',
          image: 'https://images.unsplash.com/photo-1713618651165-a3cf7f85506c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwYXVkaW98ZW58MXx8fHwxNzYwNDY0ODI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
          link: 'https://example.com/headphones'
        },
        {
          id: 4,
          name: 'MacBook Pro M3',
          price: '45,990,000đ',
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwbGFwdG9wfGVufDF8fHx8MTc2MDQ2OTE3OHww&ixlib=rb-4.1.0&q=80&w=1080',
          link: 'https://example.com/macbook'
        },
        {
          id: 5,
          name: 'iPad Pro 12.9"',
          price: '28,500,000đ',
          image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBpcGFkfGVufDF8fHx8MTc2MDQ2OTE3OHww&ixlib=rb-4.1.0&q=80&w=1080',
          link: 'https://example.com/ipad'
        },
        {
          id: 6,
          name: 'Apple Watch Ultra 2',
          price: '21,990,000đ',
          image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwd2F0Y2h8ZW58MXx8fHwxNzYwNDY5MTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
          link: 'https://example.com/watch'
        },
        {
          id: 7,
          name: 'Samsung Galaxy S24 Ultra',
          price: '29,990,000đ',
          image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1zdW5nJTIwcGhvbmV8ZW58MXx8fHwxNzYwNDI1NzY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
          link: 'https://example.com/samsung'
        }
      ]
    },
    {
      id: 4,
      author: 'ChongLuaDaoJP Official',
      authorAvatar: '🛡️',
      role: 'Nền tảng chính thức',
      time: '2 ngày',
      content: '📊 BÁO CÁO THÁNG 1/2025: Xu hướng lừa đảo trực tuyến\n\nCác hình thức lừa đảo phổ biến nhất:\n• Lừa đảo qua mạng xã hội: 45%\n• Lừa đảo đầu tư tiền ảo: 28%\n• Lừa đảo thương mại điện tử: 18%\n• Các hình thức khác: 9%\n\nTổng số vụ việc được báo cáo: 2,847 vụ\nSố tiền bị lừa đảo ước tính: 127 tỷ VNĐ\n\nHãy luôn cảnh giác và kiểm tra thông tin trước khi giao dịch!',
      image: 'statistics chart',
      likes: 2156,
      comments: 234,
      shares: 892,
      commentList: [
        { id: 1, author: 'Bùi Lan Anh', avatar: '👤', content: 'Con số đáng báo động! Mọi người cần cảnh giác hơn nữa', time: '1 ngày' },
        { id: 2, author: 'Hoàng Đức Long', avatar: '👤', content: 'Cảm ơn nền tảng đã cung cấp thông tin chi tiết', time: '1 ngày' },
      ],
      isOfficial: true,
      hasProduct: false,
    },
  ];

  const trendingTopics = [
    { title: 'Lừa đảo qua Zalo', posts: 234 },
    { title: 'Đầu tư tiền ảo', posts: 189 },
    { title: 'TMĐT giả mạo', posts: 156 },
    { title: 'Mạo danh ngân hàng', posts: 134 },
  ];

  const toggleLike = (postId: number) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  const toggleComments = (postId: number) => {
    setShowComments({
      ...showComments,
      [postId]: !showComments[postId]
    });
  };

  const handleCommentChange = (postId: number, value: string) => {
    setCommentInputs({
      ...commentInputs,
      [postId]: value
    });
  };

  const handleCommentSubmit = (postId: number) => {
    // Handle comment submission
    console.log('Comment submitted for post', postId, commentInputs[postId]);
    setCommentInputs({
      ...commentInputs,
      [postId]: ''
    });
  };

  const scrollProducts = (postId: number, direction: 'left' | 'right') => {
    const container = document.getElementById(`products-${postId}`);
    if (container) {
      const scrollAmount = 200;
      const newScroll = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      container.scrollTo({ left: newScroll, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-4">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-[#1F2937] mb-2">Tin tức & Cảnh báo</h1>
              <p className="text-[#6B7280]">Cập nhật thông tin mới nhất về lừa đảo và bảo mật</p>
            </div>

            {/* News Feed */}
            {newsPosts.map((post) => (
              <Card key={post.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-[#A8E6CF] to-[#086644] text-white text-lg">
                          {post.authorAvatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#1F2937]">{post.author}</span>
                          {post.isOfficial && (
                            <Badge className="bg-[#3B82F6] text-white border-0 h-5 px-1.5">
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </Badge>
                          )}
                          {post.verified && !post.isOfficial && (
                            <Badge className="bg-[#10B981] text-white border-0 h-5 px-1.5 text-xs">✓</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                          <span>{post.role}</span>
                          <span>•</span>
                          <span>{post.time}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-5 w-5 text-[#6B7280]" />
                    </Button>
                  </div>

                  {/* Post Content */}
                  <div className="mb-3">
                    <p className="text-[#1F2937] whitespace-pre-line">{post.content}</p>
                  </div>

                  {/* Post Image */}
                  {post.image && (
                    <div className="mb-3 -mx-4 rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={`https://source.unsplash.com/800x500/?${post.image}`}
                        alt={post.content.slice(0, 50)}
                        className="w-full h-auto"
                      />
                    </div>
                  )}

                  {/* Product Cards - Horizontal Scroll */}
                  {post.hasProduct && post.products && post.products.length > 0 && (
                    <div className="mb-3 relative group/carousel">
                      {/* Scroll Left Button */}
                      <button
                        onClick={() => scrollProducts(post.id, 'left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="h-5 w-5 text-[#086644]" />
                      </button>

                      {/* Scroll Right Button */}
                      <button
                        onClick={() => scrollProducts(post.id, 'right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="h-5 w-5 text-[#086644]" />
                      </button>

                      <div 
                        id={`products-${post.id}`}
                        className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1 snap-x snap-mandatory"
                      >
                        {post.products.map((product: any) => (
                          <div
                            key={product.id}
                            className="flex-shrink-0 w-44 snap-start"
                          >
                            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow">
                              <div className="relative bg-[#F9FAFB] h-44 cursor-pointer group">
                                <ImageWithFallback
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-3">
                                <p className="text-xs text-[#1F2937] line-clamp-2 mb-1">{product.name}</p>
                                <p className="text-sm text-[#086644] mb-3">{product.price}</p>
                                
                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2">
                                  <a
                                    href={product.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Button 
                                      size="sm" 
                                      className="w-full bg-[#086644] hover:bg-[#086644]/90 text-white py-2 px-3 h-auto text-xs"
                                    >
                                      <ShoppingBag className="h-3 w-3 mr-1" />
                                      Mua ngay
                                    </Button>
                                  </a>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="w-full border-[#086644] text-[#086644] hover:bg-[#086644]/10 py-2 px-3 h-auto text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open('#shop', '_blank');
                                    }}
                                  >
                                    <Store className="h-3 w-3 mr-1" />
                                    Xem shop
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Post Stats */}
                  <div className="flex items-center justify-between text-sm text-[#6B7280] py-2">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        <div className="h-5 w-5 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-xs">
                          👍
                        </div>
                      </div>
                      <span>{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleComments(post.id)}
                        className="hover:underline"
                      >
                        {post.comments} bình luận
                      </button>
                      <span>{post.shares} chia sẻ</span>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(post.id)}
                      className={`rounded-lg ${
                        likedPosts.includes(post.id)
                          ? 'text-[#3B82F6] hover:text-[#3B82F6]'
                          : 'text-[#6B7280] hover:text-[#1F2937]'
                      }`}
                    >
                      <ThumbsUp className={`h-5 w-5 mr-2 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                      Thích
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleComments(post.id)}
                      className="text-[#6B7280] hover:text-[#1F2937] rounded-lg"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Bình luận
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#6B7280] hover:text-[#1F2937] rounded-lg"
                    >
                      <Share2 className="h-5 w-5 mr-2" />
                      Chia sẻ
                    </Button>
                  </div>

                  {/* Comments Section */}
                  {showComments[post.id] && (
                    <>
                      <Separator className="my-3" />
                      <div className="space-y-3">
                        {/* Existing Comments */}
                        {post.commentList.map((comment) => (
                          <div key={comment.id} className="flex gap-2">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="bg-[#E5E7EB] text-[#6B7280]">
                                {comment.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-[#F0F2F5] rounded-2xl px-3 py-2">
                                <p className="text-sm text-[#1F2937]">{comment.author}</p>
                                <p className="text-sm text-[#1F2937]">{comment.content}</p>
                              </div>
                              <div className="flex items-center gap-3 mt-1 px-3">
                                <button className="text-xs text-[#6B7280] hover:underline">Thích</button>
                                <button className="text-xs text-[#6B7280] hover:underline">Trả lời</button>
                                <span className="text-xs text-[#6B7280]">{comment.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Comment Input */}
                        <div className="flex gap-2 pt-2">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-[#A8E6CF] to-[#086644] text-white">
                              U
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 flex gap-2">
                            <div className="flex-1 relative">
                              <Input
                                placeholder="Viết bình luận..."
                                value={commentInputs[post.id] || ''}
                                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleCommentSubmit(post.id);
                                  }
                                }}
                                className="rounded-full bg-[#F0F2F5] border-0 pr-10"
                              />
                              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#086644]">
                                <Smile className="h-5 w-5" />
                              </button>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleCommentSubmit(post.id)}
                              disabled={!commentInputs[post.id]?.trim()}
                              className="rounded-full bg-[#086644] hover:bg-[#086644]/90 px-4"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            {/* Trending Topics */}
            <Card className="border-0 shadow-sm sticky top-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-[#F59E0B]" />
                  <h3 className="text-[#1F2937]">Chủ đề nổi bật</h3>
                </div>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-3 rounded-lg hover:bg-[#F0F2F5] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-[#1F2937] mb-1">{topic.title}</p>
                          <p className="text-xs text-[#6B7280]">{topic.posts} bài viết</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Alert */}
            <Card className="border-0 shadow-sm bg-[#FEF3C7]">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm text-[#92400E] mb-1">Lưu ý an toàn</h4>
                    <p className="text-xs text-[#92400E]">
                      Luôn kiểm tra kỹ thông tin trước khi giao dịch. Không chia sẻ OTP, mật khẩu với bất kỳ ai.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}