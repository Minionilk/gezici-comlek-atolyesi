"use client";

import { useStore } from "@/hooks/useStore";
import { formatPrice, formatDate } from "@/lib/utils";
import { CreditCard, TrendingUp, TrendingDown, DollarSign, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function Finance() {
  const { reservations, sessions, inventory, currentUser } = useStore();

  const totalRevenue = reservations.reduce((sum, r) => sum + r.totalPrice, 0);
  const totalReservations = reservations.length;
  const avgOrderValue = totalReservations > 0 ? totalRevenue / totalReservations : 0;
  const inventoryValue = inventory.reduce((sum, i) => sum + (i.quantity * i.price), 0);

  const recentTransactions = reservations.slice(-10).reverse();

  const stats = [
    { 
      label: "Toplam Gelir", 
      value: formatPrice(totalRevenue), 
      icon: DollarSign, 
      color: "bg-olive-100 text-olive-600",
      trend: "+12%"
    },
    { 
      label: "Rezervasyon Sayısı", 
      value: totalReservations.toString(), 
      icon: CreditCard, 
      color: "bg-terracotta-100 text-terracotta-600",
      trend: "+5"
    },
    { 
      label: "Ortalama Sipariş", 
      value: formatPrice(avgOrderValue), 
      icon: TrendingUp, 
      color: "bg-ocher-100 text-ocher-600",
      trend: "+8%"
    },
    { 
      label: "Envanter Değeri", 
      value: formatPrice(inventoryValue), 
      icon: TrendingDown, 
      color: "bg-clay-100 text-clay-600",
      trend: "-3%"
    },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div>
        <h1 className="font-serif text-3xl text-charcoal-800">Finans Yönetimi</h1>
        <p className="text-charcoal-500 mt-1">Gelir, gider ve rezervasyon analizi</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="card-luxury p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className={`w-11 h-11 rounded-2xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold flex items-center gap-1 ${
                stat.trend.startsWith("+") ? "text-olive-600" : "text-red-600"
              }`}>
                {stat.trend.startsWith("+") ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal-800">{stat.value}</p>
              <p className="text-sm text-charcoal-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="card-luxury overflow-hidden">
        <div className="p-6 border-b border-sand-200">
          <h3 className="font-serif text-xl text-charcoal-800">Son İşlemler</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sand-50/80 border-b border-sand-200">
                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Tarih</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Atölye</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Misafir</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Kişi</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Durum</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-charcoal-700">Tutar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {recentTransactions.map((transaction) => {
                const session = sessions.find(s => s.id === transaction.sessionId);
                return (
                  <tr key={transaction.id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-charcoal-600">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-charcoal-800">
                      {session?.title || "Bilinmiyor"}
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal-600">
                      {transaction.userId === currentUser?.id ? currentUser?.name : "Misafir"}
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal-600">
                      {transaction.guests} kişi
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.status === "confirmed" ? "bg-olive-100 text-olive-700" :
                        transaction.status === "waitlist" ? "bg-ocher-100 text-ocher-700" :
                        transaction.status === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-charcoal-100 text-charcoal-600"
                      }`}>
                        {transaction.status === "confirmed" ? "Onaylandı" :
                         transaction.status === "waitlist" ? "Bekleme" :
                         transaction.status === "cancelled" ? "İptal" : "Tamamlandı"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-charcoal-800 text-right">
                      {formatPrice(transaction.totalPrice)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {recentTransactions.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-10 h-10 text-charcoal-300 mx-auto mb-3" />
            <p className="text-charcoal-500">Henüz işlem bulunmuyor</p>
          </div>
        )}
      </div>
    </div>
  );
}
