import { ThumbsUp, MessageCircle, Loader2, Shield, Building2, Send, MoreHorizontal, Check, AlertTriangle, TrendingUp, ShoppingBag, Store } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { useEffect, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Avatar, AvatarFallback } from './ui/avatar';
import * as newsService from '../services/newsService';
import type { NewsComment, NewsPost } from '../services/newsService';
import { getScamTypes, type ScamType } from '../services/reportService';
import { toast } from 'sonner@2.0.3';
import type { AuthUser } from '../services/authService';

interface NewsPageProps {
  user?: AuthUser | null;
  onNavigate?: (page: string, id?: number) => void;
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ`;
  const days = Math.floor(hours / 24);
  return `${days} ngày`;
}

function PostCard({
  post,
  isLoggedIn,
  onRequireLogin,
  onLikeChange,
  onNavigate,
}: {
  post: NewsPost;
  isLoggedIn: boolean;
  onRequireLogin: () => void;
  onLikeChange: (id: number, liked: boolean, likeCount: number) => void;
  onNavigate?: (page: string, id?: number) => void;
}) {
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [likeBusy, setLikeBusy] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount);

  const isOfficial = post.author.role === 'ADMIN';
  const isVerifiedBusiness = !!post.author.business?.verifiedBadge;
  const displayName = post.author.business?.name || post.author.name;
  const roleLabel = isOfficial ? 'Quản trị viên' : isVerifiedBusiness ? 'Doanh nghiệp đã xác thực' : 'Doanh nghiệp';

  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      onRequireLogin();
      return;
    }
    if (likeBusy) return;
    setLikeBusy(true);
    try {
      const result = await newsService.toggleLike(post.id);
      setLiked(result.liked);
      setLikeCount(result.likeCount);
      onLikeChange(post.id, result.liked, result.likeCount);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể thích bài viết');
    } finally {
      setLikeBusy(false);
    }
  };

  const handleToggleComments = async () => {
    const next = !showComments;
    setShowComments(next);
    if (next && !commentsLoaded) {
      setCommentsLoading(true);
      try {
        const result = await newsService.getNewsComments(post.id);
        setComments(result.data);
        setCommentsLoaded(true);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Không thể tải bình luận');
      } finally {
        setCommentsLoading(false);
      }
    }
  };

  const handleSubmitComment = async () => {
    if (!isLoggedIn) {
      onRequireLogin();
      return;
    }
    const content = commentInput.trim();
    if (!content || postingComment) return;
    setPostingComment(true);
    try {
      const comment = await newsService.addComment(post.id, content);
      setComments((prev) => [...prev, comment]);
      setCommentCount((c) => c + 1);
      setCommentInput('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể gửi bình luận');
    } finally {
      setPostingComment(false);
    }
  };

  return (
    <Card className="overflow-hidden rounded-2xl border-0 shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              {post.author.business?.logoUrl ? (
                <ImageWithFallback src={post.author.business.logoUrl} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-[#A8E6CF] to-[#086644] text-white">
                  {isOfficial ? <Shield className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate font-medium text-[#1F2937]">{displayName}</p>
                {(isOfficial || isVerifiedBusiness) && (
                  <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#3B82F6]">
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="text-sm text-[#9CA3AF]">
                {roleLabel} · {timeAgo(post.createdAt)}
              </p>
            </div>
          </div>
          <button className="rounded-full p-1 text-[#9CA3AF] hover:bg-[#F4F6F8]">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        {post.title && <h3 className="mt-4 font-medium text-[#1F2937]">{post.title}</h3>}
        <p className="mt-2 whitespace-pre-wrap text-[#333333]">{post.content}</p>

        {post.imageUrl && (
          <div className="mt-4 overflow-hidden rounded-xl">
            <ImageWithFallback src={post.imageUrl} alt={post.title || 'Ảnh bài viết'} className="w-full object-cover" style={{ maxHeight: '420px' }} />
          </div>
        )}

        {post.products && post.products.length > 0 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {post.products.map((product) => (
              <div key={product.id} className="w-44 flex-shrink-0 rounded-xl border overflow-hidden">
                <div className="h-28 w-full bg-[#F9FAFB]">
                  <ImageWithFallback src={product.imageUrl || ''} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-2.5">
                  <p className="truncate text-sm text-[#1F2937]">{product.name}</p>
                  <p className="mt-0.5 text-sm text-[#086644]">{product.price.toLocaleString('vi-VN')}đ</p>
                  <div className="mt-2 space-y-2">
                    {product.buyUrl ? (
                      <a href={product.buyUrl} target="_blank" rel="noopener noreferrer" className="block">
                        <Button size="sm" className="w-full rounded-lg bg-[#086644] text-white hover:bg-[#086644]/90">
                          <ShoppingBag className="mr-2 h-3.5 w-3.5" />
                          Mua ngay
                        </Button>
                      </a>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full rounded-lg bg-[#086644] text-white hover:bg-[#086644]/90"
                        onClick={() => onNavigate?.('shop-detail', product.shopId)}
                      >
                        <ShoppingBag className="mr-2 h-3.5 w-3.5" />
                        Mua ngay
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full rounded-lg"
                      onClick={() => onNavigate?.('shop-detail', product.shopId)}
                    >
                      <Store className="mr-2 h-3.5 w-3.5" />
                      Xem shop
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-1.5 text-sm text-[#6B7280]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3B82F6]">
            <ThumbsUp className="h-3 w-3 fill-current text-white" />
          </span>
          <span>{likeCount}</span>
          <span className="ml-auto">{commentCount} bình luận</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-1 border-t pt-2">
          <button
            onClick={handleToggleLike}
            disabled={likeBusy}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium hover:bg-[#F4F6F8] ${liked ? 'text-[#086644]' : 'text-[#6B7280]'}`}
          >
            <ThumbsUp className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            Thích
          </button>
          <button
            onClick={handleToggleComments}
            className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-[#6B7280] hover:bg-[#F4F6F8]"
          >
            <MessageCircle className="h-4 w-4" />
            Bình luận
          </button>
        </div>

        {showComments && (
          <div className="mt-3 space-y-3 border-t pt-2">
            {commentsLoading && (
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <Loader2 className="h-4 w-4 animate-spin" /> Đang tải bình luận...
              </div>
            )}

            {!commentsLoading &&
              comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-[#F4F6F8] text-[#333333]">{c.author.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 rounded-2xl bg-[#F4F6F8] px-3 py-2">
                    <p className="text-sm font-medium text-[#1F2937]">{c.author.name}</p>
                    <p className="text-sm text-[#333333]">{c.content}</p>
                  </div>
                </div>
              ))}

            {!commentsLoading && comments.length === 0 && (
              <p className="text-sm text-[#6B7280]">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
            )}

            {isLoggedIn ? (
              <div className="flex items-center gap-2 pt-2">
                <Input
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                  placeholder="Viết bình luận..."
                  className="rounded-full"
                  maxLength={1000}
                />
                <Button size="icon" onClick={handleSubmitComment} disabled={postingComment || !commentInput.trim()} className="flex-shrink-0 rounded-full bg-[#086644] text-white hover:bg-[#086644]/90">
                  {postingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            ) : (
              <button onClick={onRequireLogin} className="text-sm text-[#086644] hover:underline">
                Đăng nhập để bình luận
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function NewsPage({ user, onNavigate }: NewsPageProps) {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [scamTypes, setScamTypes] = useState<ScamType[]>([]);

  const isLoggedIn = !!user;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    newsService
      .getNewsList({ page: 1, limit: 10 })
      .then((result) => {
        if (cancelled) return;
        setPosts(result.data);
        setPage(1);
        setHasMore(result.pagination.page < result.pagination.totalPages);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Không thể tải tin tức');
      })
      .finally(() => !cancelled && setLoading(false));

    getScamTypes()
      .then((types) => !cancelled && setScamTypes(types))
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await newsService.getNewsList({ page: nextPage, limit: 10 });
      setPosts((prev) => [...prev, ...result.data]);
      setPage(nextPage);
      setHasMore(result.pagination.page < result.pagination.totalPages);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể tải thêm tin tức');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRequireLogin = () => {
    toast.info('Vui lòng đăng nhập để tiếp tục');
    onNavigate?.('login');
  };

  const handleLikeChange = (id: number, liked: boolean, likeCount: number) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likedByMe: liked, likeCount } : p)));
  };

  return (
    <div className="bg-[#F4F6F8] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1F2937]">Tin tức & Cảnh báo</h1>
          <p className="text-[#6B7280]">Cập nhật thông tin mới nhất về lừa đảo và bảo mật</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Main feed */}
          <div className="space-y-4 md:col-span-2">
            {loading && (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-[#086644]" />
              </div>
            )}

            {!loading && posts.length === 0 && (
              <Card className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-12 text-center text-[#6B7280]">Chưa có tin tức nào được đăng.</CardContent>
              </Card>
            )}

            {posts.map((post) => (
              <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} onRequireLogin={handleRequireLogin} onLikeChange={handleLikeChange} onNavigate={onNavigate} />
            ))}

            {hasMore && (
              <div className="flex justify-center pt-2">
                <Button variant="outline" onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Xem thêm
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2 font-medium text-[#1F2937]">
                  <TrendingUp className="h-5 w-5 text-[#F59E0B]" />
                  Loại lừa đảo cần cảnh giác
                </div>
                <div className="space-y-3">
                  {scamTypes.map((type) => (
                    <div key={type.id} className="text-sm text-[#333333]">
                      {type.name}
                    </div>
                  ))}
                  {scamTypes.length === 0 && <p className="text-sm text-[#9CA3AF]">Đang tải...</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 bg-[#FEF3C7] shadow-sm">
              <CardContent className="flex gap-3 p-5">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-[#F59E0B]" />
                <div>
                  <p className="font-medium text-[#92400E]">Lưu ý an toàn</p>
                  <p className="mt-1 text-sm text-[#92400E]">
                    Luôn kiểm tra kỹ thông tin trước khi giao dịch. Không chia sẻ OTP, mật khẩu với bất kỳ ai.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
