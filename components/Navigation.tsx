"use client";

import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { 
  Menu, X, Home, Calendar, ShoppingBag, Package, 
  MessageCircle, Bell, User, LogOut, Shield, CreditCard 
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, logout, notifications } = useStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const guestNav = [
    { id: "home", label: "Ana Sayfa", icon: Home },
    { id: "workshops", label: "Atölyeler", icon: Calendar },
    { id: "my-pieces", label: "Parçalarım", icon: ShoppingBag },
    { id: "ai-concierge", label: "AI Konsiyerj", icon: MessageCircle },
    { id: "notifications", label: "Bildirimler", icon: Bell, badge: unreadCount },
    { id: "profile", label: "Profil", icon: User },
  ];

  const instructorNav = [
    { id: "home", label: "Ana Sayfa", icon: Home },
    { id: "workshops", label: "Atölyeler", icon: Calendar },
    { id: "pieces", label: "Parça Yönetimi", icon: ShoppingBag },
    { id: "inventory", label: "Envanter", icon: Package },
    { id: "notifications", label: "Bildirimler", icon: Bell, badge: unreadCount },
    { id: "profile", label: "Profil", icon: User },
  ];

  const managerNav = [
    { id: "home", label: "Ana Sayfa", icon: Home },
    { id: "workshops", label: "Atölye Yönetimi", icon: Calendar },
    { id: "pieces", label: "Parça Yönetimi", icon: ShoppingBag },
    { id: "inventory", label: "Envanter", icon: Package },
    { id: "finance", label: "Finans", icon: CreditCard },
    { id: "notifications", label: "Bildirimler", icon: Bell, badge: unreadCount },
    { id: "profile", label: "Profil", icon: User },
  ];

  const adminNav = [
    { id: "home", label: "Ana Sayfa", icon: Home },
    { id: "workshops", label: "Atölye Yönetimi", icon: Calendar },
    { id: "pieces", label: "Parça Yönetimi", icon: ShoppingBag },
    { id: "inventory", label: "Envanter", icon: Package },
    { id: "finance", label: "Finans", icon: CreditCard },
    { id: "users", label: "Kullanıcılar", icon: Shield },
    { id: "notifications", label: "Bildirimler", icon: Bell, badge: unreadCount },
    { id: "profile", label: "Profil", icon: User },
  ];

  const getNavItems = () => {
    switch (currentUser?.role) {
      case "instructor": return instructorNav;
      case "manager": return managerNav;
      case "finance": return managerNav;
      case "superadmin": return adminNav;
      default: return guestNav;
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-sand-200/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-terracotta-400 to-ocher-500 flex items-center justify-center shadow-clay">
              <span className="text-white font-serif text-lg font-bold">S</span>
            </div>
            <div>
              <h1 className="font-serif text-lg text-charcoal-800 leading-tight">Gezici Sanat Atölyesi</h1>
              <p className="text-xs text-charcoal-500">{currentUser?.role === "guest" ? "Misafir Portalı" : "Yönetim Portalı"}</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-11 h-11 rounded-2xl bg-sand-100 flex items-center justify-center active:scale-95 transition-transform"
          >
            {mobileOpen ? <X className="w-5 h-5 text-charcoal-700" /> : <Menu className="w-5 h-5 text-charcoal-700" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-sand-50 pt-20 px-4 pb-8 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-300",
                  activeTab === item.id
                    ? "bg-terracotta-500 text-white shadow-clay"
                    : "bg-white text-charcoal-700 hover:bg-sand-100 shadow-soft"
                )}
              >
                <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : "text-charcoal-500")} />
                <span className="font-medium">{item.label}</span>
                {item.badge ? (
                  <span className={cn(
                    "ml-auto text-xs font-bold px-2 py-1 rounded-full",
                    activeTab === item.id ? "bg-white text-terracotta-600" : "bg-terracotta-100 text-terracotta-600"
                  )}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
            <button
              onClick={() => {
                logout();
                onTabChange("login");
              }}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left bg-red-50 text-red-600 hover:bg-red-100 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Çıkış Yap</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 bg-white/80 backdrop-blur-md border-r border-sand-200/60 flex-col z-50">
        {/* Logo Area */}
        <div className="p-6 border-b border-sand-200/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-terracotta-400 to-ocher-500 flex items-center justify-center shadow-clay">
              <span className="text-white font-serif text-xl font-bold">S</span>
            </div>
            <div>
              <h1 className="font-serif text-xl text-charcoal-800 leading-tight">Gezici Sanat Atölyesi</h1>
              <p className="text-xs text-charcoal-500">Kapalı Devre Portal</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        {currentUser && (
          <div className="px-6 py-4 border-b border-sand-200/40">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sand-300 to-clay-300 flex items-center justify-center shadow-soft">
                <span className="text-charcoal-700 font-bold text-sm">{getInitials(currentUser.name)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-charcoal-800 truncate">{currentUser.name}</p>
                <p className="text-xs text-charcoal-500 capitalize">{currentUser.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-300 group",
                activeTab === item.id
                  ? "bg-terracotta-500 text-white shadow-clay"
                  : "text-charcoal-600 hover:bg-sand-100 hover:text-charcoal-800"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                activeTab === item.id ? "text-white" : "text-charcoal-400 group-hover:text-charcoal-600"
              )} />
              <span className="font-medium text-sm">{item.label}</span>
              {item.badge ? (
                <span className={cn(
                  "ml-auto text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center",
                  activeTab === item.id ? "bg-white text-terracotta-600" : "bg-terracotta-100 text-terracotta-600"
                )}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sand-200/40">
          <button
            onClick={() => {
              logout();
              onTabChange("login");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-charcoal-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Çıkış Yap</span>
          </button>
        </div>
      </aside>
    </>
  );
}
