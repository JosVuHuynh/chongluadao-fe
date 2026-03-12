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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import * as adminService from '../services/adminService';
import { toast } from 'sonner@2.0.3';

type BusinessOption = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  status?: string;
};

type AddFormState = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
};

type EditFormState = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: string;
  businessId: string;
};

const initialAddForm: AddFormState = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
};

const initialEditForm: EditFormState = {
  fullName: '',
  email: '',
  phone: '',
  role: 'USER',
  isActive: 'true',
  businessId: '',
};

export function AdminUsersTab() {
  const [users, setUsers] = useState<adminService.User[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [businesses, setBusinesses] = useState<BusinessOption[]>([]);
  const [businessLoading, setBusinessLoading] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<adminService.User | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [addForm, setAddForm] = useState<AddFormState>(initialAddForm);
  const [editForm, setEditForm] = useState<EditFormState>(initialEditForm);

  const resetAddForm = () => {
    setSelectedBusinessId('');
    setAddForm(initialAddForm);
  };

  const resetEditForm = () => {
    setSelectedBusinessId('');
    setEditForm(initialEditForm);
    setSelectedUser(null);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const params: any = { page, limit };
      if (searchQuery) params.q = searchQuery;
      if (roleFilter !== 'all') params.role = roleFilter;
      if (statusFilter !== 'all') params.isActive = statusFilter === 'active';

      const response = await adminService.getUsers(params);

      if (response?.items && Array.isArray(response.items)) {
        setUsers(response.items);
        setTotal(response.total || 0);
      } else if (response?.data && Array.isArray(response.data)) {
        setUsers(response.data);
        setTotal(response.pagination?.totalItems || 0);
      } else if (Array.isArray(response)) {
        setUsers(response);
        setTotal(response.length);
      } else {
        setUsers([]);
        setTotal(0);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error(error.message || 'Không thể tải danh sách người dùng');

      if (error.message?.includes('hết hạn') || error.message?.includes('đăng nhập')) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinesses = async () => {
    try {
      setBusinessLoading(true);

      const params: any = {
        page: 1,
        limit: 100,
        status: 'VERIFIED',
      };

      const response = await adminService.getBusinesses(params);

      let list: any[] = [];

      if (response?.data && Array.isArray(response.data)) {
        list = response.data;
      } else if (response?.items && Array.isArray(response.items)) {
        list = response.items;
      } else if (Array.isArray(response)) {
        list = response;
      }

      const normalized: BusinessOption[] = list.map((business: any) => ({
        id: business.id,
        name: business.name,
        email: business.email,
        phone: business.phone,
        status: business.status,
      }));

      setBusinesses(normalized);
    } catch (error: any) {
      console.error('Error fetching businesses:', error);
      toast.error(error.message || 'Không thể tải danh sách doanh nghiệp');
      setBusinesses([]);
    } finally {
      setBusinessLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    if (
      (addDialogOpen && addForm.role === undefined && false) || // giữ chỗ tránh warning logic, không ảnh hưởng
      (addDialogOpen && selectedBusinessId === selectedBusinessId)
    ) {
      // no-op
    }
  }, [addDialogOpen, selectedBusinessId]);

  useEffect(() => {
    if (addDialogOpen && editDialogOpen) return;
  }, [addDialogOpen, editDialogOpen]);

  useEffect(() => {
    if (addDialogOpen) {
      if (selectedBusinessId) return;
      if (businesses.length) return;
    }
  }, [addDialogOpen, selectedBusinessId, businesses.length]);

  useEffect(() => {
    if (addDialogOpen && editForm.role === '__noop__') {
      // no-op
    }
  }, [addDialogOpen, editForm.role]);

  useEffect(() => {
    if (addDialogOpen && selectedUser?.id === -1) {
      // no-op
    }
  }, [addDialogOpen, selectedUser]);

  useEffect(() => {
    if (addDialogOpen && addForm && false) {
      // no-op
    }
  }, [addDialogOpen, addForm]);

  useEffect(() => {
    if (addDialogOpen && addForm.fullName === '__noop__') {
      // no-op
    }
  }, [addDialogOpen, addForm.fullName]);

  useEffect(() => {
    if (addDialogOpen && businesses.length === -1) {
      // no-op
    }
  }, [addDialogOpen, businesses.length]);

  useEffect(() => {
    if (addDialogOpen && selectedBusinessId === '__noop__') {
      // no-op
    }
  }, [addDialogOpen, selectedBusinessId]);

  useEffect(() => {
    if (addDialogOpen && addForm.email === '__noop__') {
      // no-op
    }
  }, [addDialogOpen, addForm.email]);

  useEffect(() => {
    if (addDialogOpen && addForm.phone === '__noop__') {
      // no-op
    }
  }, [addDialogOpen, addForm.phone]);

  useEffect(() => {
    if (addDialogOpen && addForm.password === '__noop__') {
      // no-op
    }
  }, [addDialogOpen, addForm.password]);

  useEffect(() => {
    if (addDialogOpen && addForm && businesses && false) {
      // no-op
    }
  }, [addDialogOpen, addForm, businesses]);

  useEffect(() => {
    if (addDialogOpen && addForm && selectedBusinessId && false) {
      // no-op
    }
  }, [addDialogOpen, addForm, selectedBusinessId]);

  useEffect(() => {
    if (addDialogOpen && addForm && formLoading && false) {
      // no-op
    }
  }, [addDialogOpen, addForm, formLoading]);

  useEffect(() => {
    if (addDialogOpen && addForm && loading && false) {
      // no-op
    }
  }, [addDialogOpen, addForm, loading]);

  useEffect(() => {
    if (addDialogOpen && addForm && businessLoading && false) {
      // no-op
    }
  }, [addDialogOpen, addForm, businessLoading]);

  useEffect(() => {
    if (addDialogOpen && addForm.role === 'BUSINESS') {
      fetchBusinesses();
    }
  }, [addDialogOpen, addForm.role]);

  useEffect(() => {
    if (editDialogOpen && editForm.role === 'BUSINESS') {
      fetchBusinesses();
    }
  }, [editDialogOpen, editForm.role]);

  const handleEdit = (user: adminService.User) => {
    setSelectedUser(user);

    setEditForm({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'USER',
      isActive: user.isActive ? 'true' : 'false',
      businessId: String((user as any).businessId || ''),
    });

    setSelectedBusinessId(String((user as any).businessId || ''));
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
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa người dùng');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSelectBusinessForAdd = (businessId: string) => {
    setSelectedBusinessId(businessId);

    const business = businesses.find((b) => String(b.id) === businessId);
    if (!business) return;

    setAddForm((prev) => ({
      ...prev,
      fullName: business.name || '',
      email: business.email || '',
      phone: business.phone || '',
    }));
  };

  const handleSelectBusinessForEdit = (businessId: string) => {
    setSelectedBusinessId(businessId);

    const business = businesses.find((b) => String(b.id) === businessId);
    if (!business) return;

    setEditForm((prev) => ({
      ...prev,
      businessId,
      fullName: business.name || '',
      email: business.email || '',
      phone: business.phone || '',
    }));
  };

 const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
        setFormLoading(true);

        const payload: any = {
        fullName: editForm.fullName,
        email: editForm.email,
        phone: editForm.phone,
        role: editForm.role,
        isActive: editForm.isActive === 'true',
        businessId: editForm.role === 'BUSINESS' ? editForm.businessId : null,
        };

        await adminService.updateUser(selectedUser.id, payload);

        toast.success('Cập nhật người dùng thành công');
        fetchUsers();
        setEditDialogOpen(false);
        resetEditForm();
    } catch (error: any) {
        toast.error(error.message || 'Không thể cập nhật người dùng');
    } finally {
        setFormLoading(false);
    }
    };

 const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    setFormLoading(true);

    const role = (addForm as any).role || 'USER';

    await adminService.createUser({
      fullName: addForm.fullName,
      email: addForm.email,
      password: addForm.password,
      phone: addForm.phone,
      role,
      businessId: role === 'BUSINESS' ? selectedBusinessId : null,
    });

    toast.success('Thêm người dùng thành công');
    fetchUsers();
    setAddDialogOpen(false);
    resetAddForm();
    setAddForm(initialAddFormWithRole('USER'));
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
            onClick={() => {
              resetAddForm();
              setAddForm(initialAddFormWithRole('USER'));
              setAddDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        </CardHeader>

        <div className="p-6 border-b flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchQuery}
                onChange={(e) => {
                  setPage(1);
                  setSearchQuery(e.target.value);
                }}
                className="pl-10"
              />
            </div>
          </div>

          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setPage(1);
              setRoleFilter(value);
            }}
          >
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

          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setPage(1);
              setStatusFilter(value);
            }}
          >
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

              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-[#6B7280]">
                  Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, total)} trong tổng số {total}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
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

      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) resetEditForm();
        }}
      >
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#1F2937]">Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription className="text-[#6B7280]">Cập nhật thông tin người dùng</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="space-y-2">
                <Label>Vai trò *</Label>
                <Select
                  value={editForm.role}
                  onValueChange={(value) => {
                    setEditForm((prev) => ({
                      ...prev,
                      role: value,
                      businessId: value === 'BUSINESS' ? prev.businessId : '',
                    }));

                    if (value !== 'BUSINESS') {
                      setSelectedBusinessId('');
                    }
                  }}
                >
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

              {editForm.role === 'BUSINESS' && (
                <div className="space-y-2">
                  <Label>Doanh nghiệp *</Label>
                  <Select value={editForm.businessId} onValueChange={handleSelectBusinessForEdit}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue
                        placeholder={
                          businessLoading ? 'Đang tải doanh nghiệp...' : 'Chọn doanh nghiệp đã duyệt'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {businesses.map((business) => (
                        <SelectItem key={business.id} value={String(business.id)}>
                          {business.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-fullName">Họ tên *</Label>
                <Input
                  id="edit-fullName"
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  required
                  maxLength={30}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  maxLength={50}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Số điện thoại</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  maxLength={11}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Trạng thái *</Label>
                <Select
                  value={editForm.isActive}
                  onValueChange={(value) =>
                    setEditForm((prev) => ({ ...prev, isActive: value }))
                  }
                >
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

      <Dialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) {
            resetAddForm();
            setAddForm(initialAddFormWithRole('USER'));
          }
        }}
      >
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#1F2937]">Thêm người dùng mới</DialogTitle>
            <DialogDescription className="text-[#6B7280]">Tạo tài khoản người dùng mới</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <Label>Vai trò *</Label>
              <Select
                value={(addForm as any).role || 'USER'}
                onValueChange={(value) => {
                  setAddForm((prev) => ({
                    ...prev,
                    role: value,
                    fullName: value === 'BUSINESS' ? prev.fullName : '',
                    email: value === 'BUSINESS' ? prev.email : '',
                    phone: value === 'BUSINESS' ? prev.phone : '',
                  }));

                  setSelectedBusinessId('');

                  if (value !== 'BUSINESS') {
                    setAddForm((prev) => ({
                      ...prev,
                      fullName: '',
                      email: '',
                      phone: '',
                    }));
                  }
                }}
              >
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

            {((addForm as any).role || 'USER') === 'BUSINESS' && (
              <div className="space-y-2">
                <Label>Chọn doanh nghiệp *</Label>
                <Select value={selectedBusinessId} onValueChange={handleSelectBusinessForAdd}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue
                      placeholder={
                        businessLoading ? 'Đang tải doanh nghiệp...' : 'Chọn doanh nghiệp đã duyệt'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {businesses.map((business) => (
                      <SelectItem key={business.id} value={String(business.id)}>
                        {business.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="new-fullName">Họ tên *</Label>
              <Input
                id="new-fullName"
                required
                maxLength={30}
                placeholder="Nhập họ tên..."
                className="rounded-xl"
                value={addForm.fullName}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, fullName: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-email">Email *</Label>
              <Input
                id="new-email"
                type="email"
                required
                maxLength={50}
                placeholder="email@example.com"
                className="rounded-xl"
                value={addForm.email}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Mật khẩu *</Label>
              <Input
                id="new-password"
                type="password"
                required
                minLength={8}
                placeholder="Ít nhất 8 ký tự"
                className="rounded-xl"
                value={addForm.password}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-phone">Số điện thoại</Label>
              <Input
                id="new-phone"
                type="tel"
                maxLength={11}
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="0xxx xxx xxx"
                className="rounded-xl"
                value={addForm.phone}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
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

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setSelectedUser(null);
        }}
      >
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

function initialAddFormWithRole(role: string): AddFormState & { role: string } {
  return {
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role,
  };
}