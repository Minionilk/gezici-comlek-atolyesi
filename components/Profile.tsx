"use client";

import { useStore } from "@/hooks/useStore";
import { getInitials, formatDate } from "@/lib/utils";
import { User, Mail, Hotel, Calendar, Shield, LogOut, Edit3, Check, X } from "lucide-react";
import { useState } from "react";

interface ProfileProps {
  onLogout: () => void;
}

export default function Profile({ onLogout }: ProfileProps) {
  const { currentUser, logout, switchRole } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");

  const handleSave = () => {
    setIsEditing(false);
    // In real app, would update user in store/API
  };

  const roleLabels: Record<string, string> = {
    guest: "Misafir",
    instructor: "Seramik Eğitmeni",
    manager: "Atölye Yöneticisi",
    finance: "Finans / Muhasebe",
    superadmin: "Sistem Yöneticisi",
  };

  const roleColors: Record<string, string> = {
    guest: "bg-terracotta-100 text-terracotta-700",
    instructor: "bg-olive-100 text-olive-700",
    manager: "bg-clay-100 text-clay-700",
    finance: "bg-ocher-100 text-ocher-700",
    superadmin: "bg-charcoal-100 text-charcoal-700",
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div>
        <h1 className="font-serif text-3xl text-charcoal-800">Profil</h1>
        <p className="text-charcoal-500 mt-1">Hesap bilgileriniz ve ayarlar</p>
      </div>

      {/* Profile Card */}
      <div className="card-luxury p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-terracotta-300 to-ocher-400 flex items-center justify-center shadow-clay">
            <span className="text-white font-serif text-3xl font-bold">
              {getInitials(currentUser?.name || "")}
            </span>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="font-serif text-2xl text-charcoal-800">{currentUser?.name}</h2>
            <span className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-medium ${roleColors[currentUser?.role || "guest"]}`}>
              {roleLabels[currentUser?.role || "guest"]}
            </span>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-11 h-11 rounded-2xl bg-sand-100 text-charcoal-600 flex items-center justify-center hover:bg-sand-200 transition-colors"
          >
            {isEditing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="card-luxury p-6 space-y-4">
          <h3 className="font-serif text-lg text-charcoal-800 flex items-center gap-2">
            <User className="w-5 h-5 text-terracotta-500" />
            Kişisel Bilgiler
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-charcoal-500">Ad Soyad</label>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-luxury w-full mt-1"
                />
              ) : (
                <p className="font-medium text-charcoal-800">{currentUser?.name}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-charcoal-500">E-posta</label>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-luxury w-full mt-1"
                />
              ) : (
                <p className="font-medium text-charcoal-800">{currentUser?.email}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> Kaydet
            </button>
          )}
        </div>

        <div className="card-luxury p-6 space-y-4">
          <h3 className="font-serif text-lg text-charcoal-800 flex items-center gap-2">
            <Hotel className="w-5 h-5 text-terracotta-500" />
            Konaklama Bilgileri
          </h3>

          <div className="space-y-4">
            {currentUser?.roomNumber && (
              <div>
                <label className="text-sm text-charcoal-500">Oda Numarası</label>
                <p className="font-medium text-charcoal-800">{currentUser.roomNumber}</p>
              </div>
            )}

            {currentUser?.checkIn && (
              <div>
                <label className="text-sm text-charcoal-500">Giriş Tarihi</label>
                <p className="font-medium text-charcoal-800">{formatDate(currentUser.checkIn)}</p>
              </div>
            )}

            {currentUser?.checkOut && (
              <div>
                <label className="text-sm text-charcoal-500">Çıkış Tarihi</label>
                <p className="font-medium text-charcoal-800">{formatDate(currentUser.checkOut)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role Switch (Demo) */}
      <div className="card-luxury p-6 space-y-4">
        <h3 className="font-serif text-lg text-charcoal-800 flex items-center gap-2">
          <Shield className="w-5 h-5 text-terracotta-500" />
          Rol Değiştir (Demo)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(roleLabels).map(([role, label]) => (
            <button
              key={role}
              onClick={() => switchRole(role as any)}
              className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                currentUser?.role === role
                  ? "bg-terracotta-500 text-white shadow-clay"
                  : "bg-sand-100 text-charcoal-600 hover:bg-sand-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* KVKK Info */}
      <div className="bg-sand-100 rounded-3xl p-6 space-y-3">
        <h3 className="font-semibold text-charcoal-700 flex items-center gap-2">
          <Shield className="w-5 h-5 text-olive-600" />
          KVKK ve Veri Gizliliği
        </h3>
        <p className="text-sm text-charcoal-500 leading-relaxed">
          Kişisel verileriniz 6698 sayılı KVKK kapsamında korunmaktadır. Kimlik fotokopisi alınmaz. 
          Verileriniz yalnızca otel içi kullanım için işlenir ve yasal sürelerde otomatik olarak silinir.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 bg-white rounded-full text-charcoal-600">Veri Minimizasyonu</span>
          <span className="px-3 py-1 bg-white rounded-full text-charcoal-600">Açık Rıza</span>
          <span className="px-3 py-1 bg-white rounded-full text-charcoal-600">5651 Sayılı Kanun</span>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          onLogout();
        }}
        className="w-full py-4 rounded-2xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Çıkış Yap
      </button>
    </div>
  );
}
