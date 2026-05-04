"use client";

import { useStore } from "@/hooks/useStore";
import { getInitials } from "@/lib/utils";
import { Shield, Users, UserCheck, UserX, Search, Filter } from "lucide-react";
import { useState } from "react";

export default function UsersManagement() {
  const { currentUser } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");

  // Demo users list
  const demoUsers = [
    { id: "u-1", name: "Ahmet Yılmaz", email: "ahmet@otel.com", role: "guest", roomNumber: "1205", isActive: true },
    { id: "u-2", name: "Zeynep Kaya", email: "zeynep@otel.com", role: "guest", roomNumber: "1206", isActive: true },
    { id: "u-3", name: "Mehmet Demir", email: "mehmet@otel.com", role: "guest", roomNumber: "1207", isActive: true },
    { id: "u-4", name: "Barış Özarıkça", email: "baris@seramik.com", role: "instructor", isActive: true },
    { id: "u-5", name: "Hayri Ünal", email: "hayri@seramik.com", role: "instructor", isActive: true },
    { id: "u-6", name: "Atölye Yöneticisi", email: "yonetici@otel.com", role: "manager", isActive: true },
    { id: "u-7", name: "Muhasebe", email: "muhasebe@otel.com", role: "finance", isActive: true },
    { id: "u-8", name: "IT Admin", email: "admin@otel.com", role: "superadmin", isActive: true },
  ];

  const filteredUsers = demoUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  const roleConfig: Record<string, { label: string; color: string }> = {
    guest: { label: "Misafir", color: "bg-terracotta-100 text-terracotta-700" },
    instructor: { label: "Eğitmen", color: "bg-olive-100 text-olive-700" },
    manager: { label: "Yönetici", color: "bg-clay-100 text-clay-700" },
    finance: { label: "Finans", color: "bg-ocher-100 text-ocher-700" },
    superadmin: { label: "Süper Admin", color: "bg-charcoal-100 text-charcoal-700" },
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal-800">Kullanıcı Yönetimi</h1>
          <p className="text-charcoal-500 mt-1">Sistem kullanıcıları ve yetki yönetimi</p>
        </div>
        <div className="text-sm text-charcoal-500 bg-white/60 rounded-2xl px-4 py-2">
          Toplam: <span className="font-bold text-charcoal-700">{demoUsers.length}</span> kullanıcı
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
          <input
            type="text"
            placeholder="Kullanıcı ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-luxury w-full pl-12"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-charcoal-400" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="input-luxury py-2.5"
          >
            <option value="all">Tüm Roller</option>
            <option value="guest">Misafir</option>
            <option value="instructor">Eğitmen</option>
            <option value="manager">Yönetici</option>
            <option value="finance">Finans</option>
            <option value="superadmin">Süper Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sand-50/80 border-b border-sand-200">
                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Kullanıcı</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">E-posta</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Rol</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Oda</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {filteredUsers.map((user) => {
                const role = roleConfig[user.role];
                return (
                  <tr key={user.id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sand-300 to-clay-300 flex items-center justify-center">
                          <span className="text-charcoal-700 font-bold text-sm">{getInitials(user.name)}</span>
                        </div>
                        <span className="font-medium text-charcoal-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${role.color}`}>
                        {role.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal-600">{user.roomNumber || "-"}</td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1 text-sm text-olive-600">
                          <UserCheck className="w-4 h-4" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-sm text-red-600">
                          <UserX className="w-4 h-4" /> Pasif
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-charcoal-300 mx-auto mb-3" />
            <p className="text-charcoal-500">Kullanıcı bulunamadı</p>
          </div>
        )}
      </div>

      {/* RBAC Info */}
      <div className="bg-sand-100 rounded-3xl p-6 space-y-3">
        <h3 className="font-semibold text-charcoal-700 flex items-center gap-2">
          <Shield className="w-5 h-5 text-terracotta-600" />
          Rol Tabanlı Erişim Kontrolü (RBAC)
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <div className="bg-white rounded-xl p-3">
            <p className="font-semibold text-charcoal-700">Misafir</p>
            <p className="text-charcoal-500">Kendi rezervasyon ve parçalarını görüntüleme</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="font-semibold text-charcoal-700">Eğitmen</p>
            <p className="text-charcoal-500">Parça yönetimi, yoklama, not ekleme</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="font-semibold text-charcoal-700">Yönetici</p>
            <p className="text-charcoal-500">Program oluşturma, envanter, bekleme listesi</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="font-semibold text-charcoal-700">Finans</p>
            <p className="text-charcoal-500">Fatura, ödeme ve gelir raporları</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="font-semibold text-charcoal-700">Süper Admin</p>
            <p className="text-charcoal-500">Tam sistem erişimi, kullanıcı yönetimi</p>
          </div>
        </div>
      </div>
    </div>
  );
}
