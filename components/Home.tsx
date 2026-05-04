"use client";

import { useStore } from "@/hooks/useStore";
import { formatDate, formatPrice } from "@/lib/utils";
import { 
  Calendar, Users, ShoppingBag, TrendingUp, Clock, 
  MapPin, Star, ArrowRight, Sparkles, Heart, Cat, Moon 
} from "lucide-react";
import PotteryWheel from "./PotteryWheel";

interface HomeProps {
  onTabChange: (tab: string) => void;
}

export default function Home({ onTabChange }: HomeProps) {
  const { currentUser, sessions, reservations, pieces, notifications } = useStore();

  const myReservations = reservations.filter((r) => r.userId === currentUser?.id);
  const myPieces = pieces.filter((p) => p.userId === currentUser?.id);
  const upcomingSessions = sessions.filter((s) => s.status !== "closed").slice(0, 4);
  const unreadNotifications = notifications.filter((n) => !n.read);

  const stats = [
    { label: "Toplam Atölye", value: sessions.length, icon: Calendar, color: "bg-terracotta-100 text-terracotta-600" },
    { label: "Aktif Rezervasyon", value: myReservations.length, icon: Users, color: "bg-olive-100 text-olive-600" },
    { label: "Parçalarım", value: myPieces.length, icon: ShoppingBag, color: "bg-clay-100 text-clay-600" },
    { label: "Bildirimler", value: unreadNotifications.length, icon: Star, color: "bg-ocher-100 text-ocher-600" },
  ];

  const quickActions = [
    { label: "Atölye Rezervasyonu", icon: Calendar, tab: "workshops", color: "from-terracotta-400 to-terracotta-500" },
    { label: "Parçalarımı Gör", icon: ShoppingBag, tab: "my-pieces", color: "from-olive-400 to-olive-500" },
    { label: "AI Konsiyerj", icon: Sparkles, tab: "ai-concierge", color: "from-clay-400 to-clay-500" },
  ];

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sand-100 via-sand-50 to-white p-6 sm:p-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-terracotta-100/40 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-olive-100/30 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft border border-sand-200/60">
              <Sparkles className="w-4 h-4 text-terracotta-500" />
              <span className="text-sm font-medium text-charcoal-600">2026 Sezonu Açıldı</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal-800 leading-tight">
              Çamurun <br />
              <span className="text-gradient-terracotta">Sihirli Dünyası</span>
            </h1>

            <p className="text-charcoal-500 text-lg leading-relaxed max-w-lg">
              Profesyonel eğitmenler eşliğinde çocuklarınızın yaratıcılığını keşfedin. 
              Her anı unutulmaz kılan çömlekçi çarkı deneyimi sizi bekliyor.
            </p>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => onTabChange("workshops")}
                className="btn-primary flex items-center gap-2"
              >
                Atölyelere Göz At
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onTabChange("ai-concierge")}
                className="btn-secondary flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                AI Konsiyerj
              </button>
            </div>

            {/* Instructor badges */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-terracotta-200 border-2 border-white flex items-center justify-center text-xs font-bold text-terracotta-700">BÖ</div>
                <div className="w-10 h-10 rounded-full bg-olive-200 border-2 border-white flex items-center justify-center text-xs font-bold text-olive-700">HÜ</div>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-charcoal-700">Barış Özarıkça & Hayri Ünal</p>
                <p className="text-charcoal-500">Profesyonel Seramik Sanatçıları</p>
              </div>
            </div>
          </div>

          <div className="relative h-80 lg:h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-br from-terracotta-50/50 to-sand-100/50 rounded-3xl" />
            <PotteryWheel />
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="card-luxury p-5 space-y-3">
            <div className={`w-11 h-11 rounded-2xl ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal-800">{stat.value}</p>
              <p className="text-sm text-charcoal-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="grid sm:grid-cols-3 gap-4">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => onTabChange(action.tab)}
            className="group relative overflow-hidden rounded-3xl p-6 text-left transition-all duration-500 hover:shadow-clay hover:-translate-y-1"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-90`} />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <div className="relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{action.label}</p>
                <p className="text-white/70 text-sm mt-1">Hemen erişin →</p>
              </div>
            </div>
          </button>
        ))}
      </section>

      {/* Upcoming Workshops */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-charcoal-800">Yaklaşan Atölyeler</h2>
          <button 
            onClick={() => onTabChange("workshops")}
            className="text-terracotta-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
          >
            Tümünü Gör <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="card-luxury group cursor-pointer" onClick={() => onTabChange("workshops")}>
              <div className="h-40 bg-gradient-to-br from-sand-200 to-clay-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  {session.tags.includes("kalp") && <Heart className="w-16 h-16 text-terracotta-300/50" />}
                  {session.tags.includes("kedi") && <Cat className="w-16 h-16 text-olive-300/50" />}
                  {session.tags.includes("gece") && <Moon className="w-16 h-16 text-ocher-300/50" />}
                  {!session.tags.some(t => ["kalp", "kedi", "gece"].includes(t)) && <Sparkles className="w-16 h-16 text-clay-300/50" />}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold
                    ${session.status === "available" ? "bg-olive-100 text-olive-700" : ""}
                    ${session.status === "waitlist" ? "bg-ocher-100 text-ocher-700" : ""}
                    ${session.status === "full" ? "bg-red-100 text-red-700" : ""}
                  `}>
                    {session.status === "available" ? "Açık" : session.status === "waitlist" ? "Bekleme" : "Dolu"}
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-serif text-lg text-charcoal-800 line-clamp-1">{session.title}</h3>
                <div className="space-y-2 text-sm text-charcoal-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-terracotta-400" />
                    <span>{formatDate(session.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-terracotta-400" />
                    <span>{session.time} ({session.duration} dk)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-terracotta-400" />
                    <span className="truncate">{session.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-terracotta-400" />
                    <span>{session.enrolled}/{session.capacity} kişi</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-bold text-terracotta-600">{formatPrice(session.price)}</span>
                  <button className="w-10 h-10 rounded-xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center group-hover:bg-terracotta-500 group-hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* My Pieces Preview */}
      {myPieces.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl text-charcoal-800">Son Parçalarım</h2>
            <button 
              onClick={() => onTabChange("my-pieces")}
              className="text-terracotta-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              Tümünü Gör <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myPieces.slice(0, 3).map((piece) => (
              <div key={piece.id} className="card-luxury p-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sand-300 to-clay-300 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-7 h-7 text-charcoal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-charcoal-800 truncate">{piece.pieceName}</h4>
                  <p className="text-sm text-charcoal-500">{formatDate(piece.createdAt)}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium
                    ${piece.status === "shaped" ? "bg-blue-100 text-blue-700" : ""}
                    ${piece.status === "drying" ? "bg-ocher-100 text-ocher-700" : ""}
                    ${piece.status === "ready_for_pickup" ? "bg-olive-100 text-olive-700" : ""}
                    ${piece.status === "picked_up" ? "bg-green-100 text-green-700" : ""}
                  `}>
                    {piece.status === "shaped" ? "Şekillendirildi" : 
                     piece.status === "drying" ? "Kurumada" : 
                     piece.status === "ready_for_pickup" ? "Teslime Hazır" : "Teslim Alındı"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
