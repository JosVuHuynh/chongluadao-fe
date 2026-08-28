import {
  LayoutDashboard,
  Users,
  Building2,
  AlertTriangle,
  FileText,
  ShoppingCart,
  DollarSign,
  LogOut,
  Store,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Toaster } from "sonner";

import logoImage from "figma:asset/2e2b9f150b66714e8750e5a4fcd8bac815716ee5.png";
import { AdminUsersTab } from "./AdminUsersTab";
import { AdminReportsTab } from "./AdminReportsTab";
import { AdminBusinessesTab } from "./AdminBusinessesTab";
import { AdminNewsTab } from "./AdminNewsTab";
import { AdminShopsTab } from "./AdminShopsTab";
import { AdminProductsTab } from "./AdminProductsTab";
import { AdminOverviewTab } from "./AdminOverviewTab";

interface AdminDashboardProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function AdminDashboard({ onNavigate, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: "overview", icon: LayoutDashboard, label: "Tổng quan" },
    { id: "users", icon: Users, label: "Người dùng" },
    { id: "reports", icon: AlertTriangle, label: "Tố cáo" },
    { id: "businesses", icon: Building2, label: "Doanh nghiệp" },
    { id: "news", icon: FileText, label: "Tin tức" },
    { id: "shop", icon: Store, label: "Cửa hàng" },
    { id: "product", icon: ShoppingCart, label: "Sản phẩm" },
    { id: "finance", icon: DollarSign, label: "Tài chính" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      <aside
        className={`
          ${sidebarCollapsed ? "w-[80px]" : "w-[240px]"}
          fixed top-0 z-50 flex min-h-screen flex-col border-r bg-white transition-all duration-300
          lg:sticky lg:z-auto
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between p-6">
          <button onClick={() => onNavigate?.("home")} className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <img src={logoImage} alt="ChongLuaDaoJP Logo" className="h-10 w-10 flex-shrink-0 object-contain" />
            {!sidebarCollapsed && <span className="whitespace-nowrap text-[#086644]">Admin Panel</span>}
          </button>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="group hidden h-7 w-7 items-center justify-center rounded-lg bg-[#F5F5F5] transition-all hover:bg-[#086644] hover:text-white lg:flex"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <ScrollArea className="flex-1 px-4">
          <nav className="space-y-1 pb-4">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full rounded-xl px-4 py-3 transition-all ${
                  activeTab === item.id ? "bg-[#086644] text-white shadow-md" : "text-[#6B7280] hover:bg-[#F5F5F5]"
                } ${sidebarCollapsed ? "flex justify-center" : "flex items-center gap-3"}`}
                title={sidebarCollapsed ? item.label : ""}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="whitespace-nowrap text-sm">{item.label}</span>}
              </button>
            ))}
          </nav>
        </ScrollArea>

        <div className="border-t p-4">
          <Button variant="outline" className={`w-full gap-2 ${sidebarCollapsed ? "px-2" : ""}`} onClick={() => onLogout?.()}>
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Đăng xuất</span>}
          </Button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b bg-white px-4 py-4 sm:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileSidebarOpen(true)} className="rounded-lg p-2 hover:bg-[#F5F5F5] lg:hidden">
                <Menu className="h-6 w-6 text-[#6B7280]" />
              </button>

              <div>
                <h1 className="text-xl text-[#086644] sm:text-2xl">Bảng điều khiển quản trị</h1>
                <p className="hidden text-xs text-[#6B7280] sm:block sm:text-sm">Quản lý shop, sản phẩm và dữ liệu hệ thống.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="bg-[#A8E6CF] px-3 py-1 text-xs text-[#086644] sm:px-4 sm:text-sm">Admin</Badge>
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A8E6CF] to-[#086644] text-white sm:h-10 sm:w-10">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-6 overflow-auto p-4 sm:p-6 lg:p-8">
          {activeTab === "overview" && <AdminOverviewTab />}

          {activeTab === "users" && <AdminUsersTab />}
          {activeTab === "reports" && <AdminReportsTab />}
          {activeTab === "businesses" && <AdminBusinessesTab />}

          {activeTab === "news" && <AdminNewsTab />}

          {activeTab === "shop" && <AdminShopsTab />}
          {activeTab === "product" && <AdminProductsTab />}

          {activeTab === "finance" && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="mb-4 text-6xl">🚧</div>
                <h3 className="mb-2 text-[#1F2937]">Đang phát triển</h3>
                <p className="text-[#6B7280]">Tính năng tài chính sẽ làm sau khi xong shop và product.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Toaster position="top-right" richColors />
    </div>
  );
}
