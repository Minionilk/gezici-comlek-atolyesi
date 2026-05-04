"use client";

import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { formatDate, formatPrice } from "@/lib/utils";
import { 
  Calendar, Clock, MapPin, Users, Search, Filter, 
  Heart, Cat, Moon, Star, ArrowRight, Check, X, AlertCircle 
} from "lucide-react";
import { WorkshopSession } from "@/types";

export default function Workshops() {
  const { sessions, currentUser, addReservation, reservations } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedSession, setSelectedSession] = useState<WorkshopSession | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.tags.some(t => t.includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === "all" || session.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleBook = (session: WorkshopSession) => {
    setSelectedSession(session);
    setGuestCount(1);
    setShowBookingModal(true);
    setBookingSuccess(false);
  };

  const confirmBooking = () => {
    if (!selectedSession || !currentUser) return;

    addReservation({
      userId: currentUser.id,
      sessionId: selectedSession.id,
      status: selectedSession.status === "waitlist" ? "waitlist" : "confirmed",
      guests: guestCount,
      totalPrice: selectedSession.price * guestCount,
    });

    setBookingSuccess(true);
    setTimeout(() => {
      setShowBookingModal(false);
      setSelectedSession(null);
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available": return { text: "Açık", class: "bg-olive-100 text-olive-700" };
      case "waitlist": return { text: "Bekleme Listesi", class: "bg-ocher-100 text-ocher-700" };
      case "full": return { text: "Dolu", class: "bg-red-100 text-red-700" };
      default: return { text: "Kapalı", class: "bg-charcoal-100 text-charcoal-600" };
    }
  };

  const getTagIcon = (tag: string) => {
    if (tag.includes("kalp")) return Heart;
    if (tag.includes("kedi")) return Cat;
    if (tag.includes("gece")) return Moon;
    if (tag.includes("yıldız")) return Star;
    return ArrowRight;
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal-800">Atölyeler</h1>
          <p className="text-charcoal-500 mt-1">Çömlekçi çarkı deneyimlerini keşfedin</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-charcoal-500 bg-white/60 rounded-2xl px-4 py-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(new Date().toISOString())}</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
          <input
            type="text"
            placeholder="Atölye, eğitmen veya tema ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-luxury w-full pl-12"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-charcoal-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-luxury py-2.5"
          >
            <option value="all">Tümü</option>
            <option value="available">Açık</option>
            <option value="waitlist">Bekleme</option>
            <option value="full">Dolu</option>
          </select>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSessions.map((session) => {
          const status = getStatusBadge(session.status);
          const isBooked = reservations.some(r => r.sessionId === session.id && r.userId === currentUser?.id);

          return (
            <div key={session.id} className="card-luxury group">
              {/* Image Area */}
              <div className="h-48 bg-gradient-to-br from-sand-200 via-clay-200 to-terracotta-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  {session.tags.map((tag, i) => {
                    const Icon = getTagIcon(tag);
                    return (
                      <div key={i} className="absolute" style={{
                        top: `${20 + (i * 25)}%`,
                        left: `${15 + (i * 20)}%`,
                        transform: `rotate(${i * 15}deg)`,
                      }}>
                        <Icon className="w-12 h-12 text-white/30" />
                      </div>
                    );
                  })}
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${status.class}`}>
                    {status.text}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-sm font-bold text-charcoal-700 shadow-soft">
                    {formatPrice(session.price)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-serif text-xl text-charcoal-800 mb-1">{session.title}</h3>
                  <p className="text-sm text-terracotta-600 font-medium">{session.instructor}</p>
                </div>

                <p className="text-sm text-charcoal-500 leading-relaxed">{session.description}</p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-charcoal-600">
                    <Calendar className="w-4 h-4 text-terracotta-400" />
                    <span>{formatDate(session.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-charcoal-600">
                    <Clock className="w-4 h-4 text-terracotta-400" />
                    <span>{session.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-charcoal-600">
                    <MapPin className="w-4 h-4 text-terracotta-400" />
                    <span className="truncate">{session.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-charcoal-600">
                    <Users className="w-4 h-4 text-terracotta-400" />
                    <span>{session.enrolled}/{session.capacity}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {session.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-sand-100 text-charcoal-600 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action */}
                <button
                  onClick={() => handleBook(session)}
                  disabled={session.status === "full" || isBooked}
                  className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all duration-300
                    ${session.status === "full" 
                      ? "bg-charcoal-100 text-charcoal-400 cursor-not-allowed" 
                      : isBooked
                        ? "bg-olive-100 text-olive-700 cursor-default"
                        : "btn-primary"
                    }`}
                >
                  {isBooked ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> Rezervasyon Yapıldı
                    </span>
                  ) : session.status === "full" ? (
                    "Kapasite Dolu"
                  ) : session.status === "waitlist" ? (
                    "Bekleme Listesine Katıl"
                  ) : (
                    "Rezervasyon Yap"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto rounded-full bg-sand-100 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-charcoal-400" />
          </div>
          <h3 className="font-serif text-xl text-charcoal-700 mb-2">Sonuç Bulunamadı</h3>
          <p className="text-charcoal-500">Farklı bir arama terimi deneyin</p>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
            {bookingSuccess ? (
              <div className="p-10 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-olive-100 flex items-center justify-center">
                  <Check className="w-10 h-10 text-olive-600" />
                </div>
                <h3 className="font-serif text-2xl text-charcoal-800">Rezervasyon Tamamlandı!</h3>
                <p className="text-charcoal-500">{selectedSession.title} atölyesine kaydınız başarıyla oluşturuldu.</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-sand-200 flex items-center justify-between">
                  <h3 className="font-serif text-xl text-charcoal-800">Rezervasyon Detayı</h3>
                  <button 
                    onClick={() => setShowBookingModal(false)}
                    className="w-8 h-8 rounded-full bg-sand-100 flex items-center justify-center hover:bg-sand-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6 space-y-5">
                  <div className="bg-sand-50 rounded-2xl p-4 space-y-2">
                    <h4 className="font-semibold text-charcoal-800">{selectedSession.title}</h4>
                    <p className="text-sm text-charcoal-500">{selectedSession.instructor}</p>
                    <p className="text-sm text-charcoal-500">{formatDate(selectedSession.date)} • {selectedSession.time}</p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-charcoal-700">Kişi Sayısı</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center hover:bg-sand-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-2xl font-bold text-charcoal-800 w-8 text-center">{guestCount}</span>
                      <button
                        onClick={() => setGuestCount(Math.min(selectedSession.capacity - selectedSession.enrolled, guestCount + 1))}
                        className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center hover:bg-sand-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-sand-200">
                    <span className="text-charcoal-600">Toplam</span>
                    <span className="text-2xl font-bold text-terracotta-600">{formatPrice(selectedSession.price * guestCount)}</span>
                  </div>

                  {selectedSession.status === "waitlist" && (
                    <div className="bg-ocher-50 rounded-xl p-3 flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-ocher-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-ocher-700">Bu atölye için bekleme listesine kaydolacaksınız. Yer açıldığında bildirim alacaksınız.</p>
                    </div>
                  )}

                  <button onClick={confirmBooking} className="btn-primary w-full">
                    {selectedSession.status === "waitlist" ? "Bekleme Listesine Katıl" : "Rezervasyonu Onayla"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
