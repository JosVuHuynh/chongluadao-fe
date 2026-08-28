import { useState, useEffect } from 'react';
import { FileText, Trash2, Loader2, Plus, Pencil, Upload, X, ThumbsUp, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import * as newsService from '../services/newsService';
import type { NewsPost } from '../services/newsService';
import { toast } from 'sonner@2.0.3';

const emptyForm = { title: '', content: '', imageUrl: '' };

export function AdminNewsTab() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 1, limit: 10 });

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const fetchPosts = async (targetPage = page) => {
    setLoading(true);
    try {
      const result = await newsService.getNewsList({ page: targetPage, limit: 10 });
      setPosts(result.data);
      setPagination(result.pagination);
      setPage(targetPage);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể tải danh sách tin tức');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const openCreateDialog = () => {
    setIsEditMode(false);
    setSelectedPost(null);
    setFormData(emptyForm);
    setImageFile(null);
    setFormDialogOpen(true);
  };

  const openEditDialog = (post: NewsPost) => {
    setIsEditMode(true);
    setSelectedPost(post);
    setFormData({ title: post.title || '', content: post.content, imageUrl: post.imageUrl || '' });
    setImageFile(null);
    setFormDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async () => {
    if (!formData.content.trim()) {
      toast.error('Nội dung không được để trống');
      return;
    }
    setFormLoading(true);
    try {
      let imageUrl = formData.imageUrl || undefined;
      if (imageFile) {
        setImageUploading(true);
        imageUrl = await newsService.uploadNewsImage(imageFile);
        setImageUploading(false);
      }

      const payload = { title: formData.title.trim() || undefined, content: formData.content.trim(), imageUrl };

      if (isEditMode && selectedPost) {
        await newsService.updateNews(selectedPost.id, payload);
        toast.success('Đã cập nhật tin tức');
      } else {
        await newsService.createNews(payload);
        toast.success('Đã đăng tin tức');
      }
      setFormDialogOpen(false);
      fetchPosts(isEditMode ? page : 1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể lưu tin tức');
    } finally {
      setFormLoading(false);
      setImageUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    try {
      await newsService.deleteNews(selectedPost.id);
      toast.success('Đã xóa tin tức');
      setDeleteDialogOpen(false);
      fetchPosts(page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể xóa tin tức');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="text-[#1F2937]">Quản lý tin tức</CardTitle>
          <Button onClick={openCreateDialog} className="bg-[#086644] text-white hover:bg-[#086644]/90">
            <Plus className="h-4 w-4 mr-2" />
            Đăng tin tức mới
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-[#086644]" />
            </div>
          ) : posts.length === 0 ? (
            <div className="py-12 text-center text-[#6B7280]">Chưa có tin tức nào.</div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <div className="inline-block min-w-full align-middle">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Nội dung</TableHead>
                      <TableHead>Tác giả</TableHead>
                      <TableHead>Tương tác</TableHead>
                      <TableHead>Ngày đăng</TableHead>
                      <TableHead className="pr-6">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="pl-6" style={{ maxWidth: '320px' }}>
                          {post.title && <p className="font-medium text-[#1F2937] truncate">{post.title}</p>}
                          <p className="text-sm text-[#6B7280] truncate">{post.content}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[#333333]">{post.author.business?.name || post.author.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {post.author.role === 'ADMIN' ? 'Admin' : 'Doanh nghiệp'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                            <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" />{post.likeCount}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{post.commentCount}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#6B7280] text-sm">
                          {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell className="pr-6">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(post)}>
                              <Pencil className="h-4 w-4 text-[#3B82F6]" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPost(post);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-[#DC2626]" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {!loading && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => fetchPosts(page - 1)}>
                Trước
              </Button>
              <span className="flex items-center px-3 text-sm text-[#6B7280]">
                Trang {page}/{pagination.totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => fetchPosts(page + 1)}>
                Sau
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Chỉnh sửa tin tức' : 'Đăng tin tức mới'}</DialogTitle>
            <DialogDescription>Nội dung sẽ hiển thị công khai cho tất cả người dùng.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="news-title">Tiêu đề (không bắt buộc)</Label>
              <Input
                id="news-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nhập tiêu đề..."
                maxLength={255}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="news-content">Nội dung *</Label>
              <Textarea
                id="news-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Nhập nội dung tin tức..."
                style={{ minHeight: '140px' }}
                maxLength={5000}
              />
            </div>
            <div className="space-y-2">
              <Label>Ảnh đính kèm (không bắt buộc)</Label>
              {(imageFile || formData.imageUrl) && (
                <div className="relative w-fit">
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl}
                    alt="preview"
                    className="h-32 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setFormData({ ...formData, imageUrl: '' });
                    }}
                    className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {!imageFile && !formData.imageUrl && (
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed p-4 text-sm text-[#6B7280] hover:bg-[#F4F6F8]">
                  <Upload className="h-4 w-4" />
                  Chọn ảnh
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={formLoading} className="bg-[#086644] text-white hover:bg-[#086644]/90">
              {formLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {imageUploading ? 'Đang tải ảnh...' : isEditMode ? 'Lưu thay đổi' : 'Đăng tin'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tin tức</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài viết này? Toàn bộ lượt thích và bình luận cũng sẽ bị xóa. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-[#DC2626] hover:bg-[#DC2626]/90 text-white">
              Xóa bài viết
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
