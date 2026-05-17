"use client";

import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { UserRole } from "@/types";
import { Eye, EyeOff, Hotel, Sparkles } from "lucide-react";
import PotteryWheel from "./PotteryWheel";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { login } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("guest");
  const [isLoading, setIsLoading] = useState(false);

  const roles: { value: UserRole; label: string; color: string }[] = [
    { value: "guest", label: "Misafir", color: "bg-terracotta-500" },
    { value: "instructor", label: "Eğitmen", color: "bg-olive-500" },
    { value: "manager", label: "Yönetici", color: "bg-clay-600" },
    { value: "finance", label: "Finans", color: "bg-ocher-500" },
    { value: "superadmin", label: "Sistem Yöneticisi", color: "bg-charcoal-700" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const demoUsers: Record<UserRole, { name: string; roomNumber?: string }> = {
      guest: { name: "Ahmet Yılmaz", roomNumber: "1205" },
      instructor: { name: "Barış Özarıkça" },
      manager: { name: "Hayri Ünal" },
      finance: { name: "Muhasebe Yetkilisi" },
      superadmin: { name: "IT Yöneticisi" },
    };

    const user = demoUsers[selectedRole];

    login({
      id: "u-" + Math.random().toString(36).substr(2, 9),
      name: user.name,
      email: email || "demo@otel.com",
      role: selectedRole,
      roomNumber: user.roomNumber,
      checkIn: "2026-04-28",
      checkOut: "2026-05-05",
      isActive: true,
    });

    setIsLoading(false);
    onLogin();
  };

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Visual */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-8">
          <div className="w-full max-w-md aspect-square relative">
            <div className="absolute inset-0 bg-gradient-to-br from-terracotta-100/50 to-sand-200/50 rounded-full blur-3xl" />
            <PotteryWheel />
          </div>
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl text-charcoal-800">
              Sanatın <span className="text-gradient-terracotta">Dokunuşu</span>
            </h2>
            <p className="text-charcoal-500 max-w-sm mx-auto leading-relaxed">
              Barış Özarıkça ve Hayri Ünal ile çocuklarınızın yaratıcılığını keşfedin
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="glass-panel p-8 sm:p-10 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-terracotta-400 to-ocher-500 flex items-center justify-center shadow-clay mb-4">
                <Hotel className="w-8 h-8 text-white" />
              </div>
              <h1 className="font-serif text-3xl text-charcoal-800">Hoş Geldiniz</h1>
              <p className="text-charcoal-500 text-sm">Gezici Sanat Atölyesi Portalı</p>
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-charcoal-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-terracotta-500" />
                Giriş Türü
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => setSelectedRole(role.value)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                      ${selectedRole === role.value
                        ? `${role.color} text-white shadow-lg scale-105`
                        : "bg-sand-100 text-charcoal-600 hover:bg-sand-200"
                      }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-charcoal-700">E-posta</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="misafir@otel.com"
                  className="input-luxury w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-charcoal-700">Şifre</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-luxury w-full pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 text-lg"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Giriş Yap"
                )}
              </button>
            </form>

            {/* KVKK Notice */}
            <div className="bg-sand-100 rounded-2xl p-4 text-xs text-charcoal-500 leading-relaxed">
              <p className="font-semibold text-charcoal-700 mb-1">🔒 KVKK Uyumlu Sistem</p>
              <p>Kimlik fotokopisi alınmaz. Sadece gerekli bilgiler işlenir. Verileriniz 5651 sayılı kanuna uygun saklanır.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
