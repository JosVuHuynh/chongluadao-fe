import { useState, useEffect } from 'react';
import { Users, Pencil, Trash2, Plus, Search, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import * as adminService from '../services/adminService';
import { toast } from 'sonner@2.0.3';

export function AdminUsersTab() {
  const [users, setUsers] = useState<adminService.User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<adminService.User | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit };
      if (searchQuery) params.q = searchQuery;
      if (roleFilter !== 'all') params.role = roleFilter;
      if (statusFilter !== 'all') params.isActive = statusFilter === 'active';
      
      const response = await adminService.getUsers(params);
      setUsers(response.items);
      setTotal(response.total);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error(error.message || 'Không thể tải danh sách người dùng');
      
      // If session expired, redirect to login
      if (error.message?.includes('hết hạn') || error.message?.includes('đăng nhập')) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchQuery, roleFilter, statusFilter]);

  const handleEdit = (user: adminService.User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDelete = (user: adminService.User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      setFormLoading(true);
      await adminService.deleteUser(selectedUser.id);
      toast.success('Xóa người dùng thành công');
      fetchUsers();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa người dùng');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;

    const formData = new FormData(e.currentTarget);
    try {
      setFormLoading(true);
      await adminService.updateUser(selectedUser.id, {
        fullName: formData.get('fullName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        role: formData.get('role') as string,
        isActive: formData.get('isActive') === 'true',
      });
      toast.success('Cập nhật người dùng thành công');
      fetchUsers();
      setEditDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Không thể cập nhật người dùng');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      setFormLoading(true);
      await adminService.createUser({
        fullName: formData.get('fullName') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        phone: formData.get('phone') as string,
        role: formData.get('role') as string,
      });
      toast.success('Thêm người dùng thành công');
      fetchUsers();
      setAddDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Không thể thêm người dùng');
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? 'bg-[#D1FAE5] text-[#065F46]'
      : 'bg-[#E5E7EB] text-[#6B7280]';
  };

  const getRoleBadge = (role: string) => {
    if (role === 'ADMIN') return 'bg-[#E0E7FF] text-[#4338CA]';
    if (role === 'BUSINESS') return 'bg-[#DBEAFE] text-[#1E40AF]';
    return 'bg-[#F3F4F6] text-[#6B7280]';
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b space-y-0 pb-4">
          <CardTitle className="text-[#1F2937]">Quản lý người dùng</CardTitle>
          <Button 
            className="bg-[#086644] text-white hover:bg-[#086644]/90"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        </CardHeader>
        
        {/* Filters */}
        <div className="p-6 border-b flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="BUSINESS">Doanh nghiệp</SelectItem>
              <SelectItem value="USER">Người dùng</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-[#086644]" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Users className="h-16 w-16 text-[#E5E7EB] mb-4" />
              <p className="text-[#6B7280]">Không tìm thấy người dùng</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-6">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-[#6B7280] pl-6">Tên</TableHead>
                          <TableHead className="text-[#6B7280]">Email</TableHead>
                          <TableHead className="text-[#6B7280]">Vai trò</TableHead>
                          <TableHead className="text-[#6B7280]">Trạng thái</TableHead>
                          <TableHead className="text-[#6B7280] pr-6">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="text-[#1F2937] pl-6">{user.fullName}</TableCell>
                            <TableCell className="text-[#6B7280]">{user.email}</TableCell>
                            <TableCell>
                              <Badge className={getRoleBadge(user.role)}>{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadge(user.isActive)}>
                                {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                              </Badge>
                            </TableCell>
                            <TableCell className="pr-6">
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEdit(user)}
                                  className="hover:bg-[#DBEAFE]"
                                >
                                  <Pencil className="h-4 w-4 text-[#3B82F6]" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDelete(user)}
                                  className="hover:bg-[#FEE2E2]"
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
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-[#6B7280]">
                  Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, total)} trong tổng số {total}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page * limit >= total}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#1F2937]">Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription className="text-[#6B7280]">Cập nhật thông tin người dùng</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ tên *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  defaultValue={selectedUser.fullName}
                  required
                  maxLength={30}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={selectedUser.email}
                  required
                  maxLength={30}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={selectedUser.phone || ''}
                  maxLength={11}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Vai trò *</Label>
                <Select name="role" defaultValue={selectedUser.role}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="BUSINESS">Doanh nghiệp</SelectItem>
                    <SelectItem value="USER">Người dùng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isActive">Trạng thái *</Label>
                <Select name="isActive" defaultValue={selectedUser.isActive.toString()}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Hoạt động</SelectItem>
                    <SelectItem value="false">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#086644] hover:bg-[#086644]/90 text-white"
                  disabled={formLoading}
                >
                  {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Lưu'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#1F2937]">Thêm người dùng mới</DialogTitle>
            <DialogDescription className="text-[#6B7280]">Tạo tài khoản người dùng mới</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-fullName">Họ tên *</Label>
              <Input
                id="new-fullName"
                name="fullName"
                required
                maxLength={30}
                placeholder="Nhập họ tên..."
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">Email *</Label>
              <Input
                id="new-email"
                name="email"
                type="email"
                required
                maxLength={30}
                placeholder="email@example.com"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Mật khẩu *</Label>
              <Input
                id="new-password"
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="Ít nhất 8 ký tự"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-phone">Số điện thoại</Label>
              <Input
                id="new-phone"
                name="phone"
                type="tel"
                maxLength={11}
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="0xxx xxx xxx"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-role">Vai trò *</Label>
              <Select name="role" defaultValue="USER">
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="BUSINESS">Doanh nghiệp</SelectItem>
                  <SelectItem value="USER">Người dùng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button 
                type="submit" 
                className="bg-[#086644] hover:bg-[#086644]/90 text-white"
                disabled={formLoading}
              >
                {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Thêm'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng "{selectedUser?.fullName}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={formLoading}
              className="bg-[#DC2626] hover:bg-[#DC2626]/90"
            >
              {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}