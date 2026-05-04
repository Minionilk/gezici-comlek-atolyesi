"use client";

import { useStore } from "@/hooks/useStore";
import { formatDate } from "@/lib/utils";
import { ShoppingBag, Package, CheckCircle, Truck, Clock, AlertCircle } from "lucide-react";

export default function MyPieces() {
  const { pieces, currentUser } = useStore();
  const myPieces = pieces.filter((p) => p.userId === currentUser?.id);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "shaped":
        return { 
          label: "Şekillendirildi", 
          icon: ShoppingBag, 
          color: "bg-blue-100 text-blue-700",
          desc: "Eseriniz şekillendirildi ve kurumaya bırakıldı"
        };
      case "drying":
        return { 
          label: "Kurumada", 
          icon: Clock, 
          color: "bg-ocher-100 text-ocher-700",
          desc: "Eseriniz hava kuruması sürecinde"
        };
      case "ready_for_pickup":
        return { 
          label: "Teslime Hazır", 
          icon: Package, 
          color: "bg-olive-100 text-olive-700",
          desc: "Eserinizi atölyeden teslim alabilirsiniz"
        };
      case "picked_up":
        return { 
          label: "Teslim Alındı", 
          icon: CheckCircle, 
          color: "bg-green-100 text-green-700",
          desc: "Eseriniz teslim alındı"
        };
      case "shipped":
        return { 
          label: "Kargolandı", 
          icon: Truck, 
          color: "bg-purple-100 text-purple-700",
          desc: "Eseriniz kargoya verildi"
        };
      default:
        return { 
          label: "Bilinmiyor", 
          icon: AlertCircle, 
          color: "bg-charcoal-100 text-charcoal-600",
          desc: ""
        };
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div>
        <h1 className="font-serif text-3xl text-charcoal-800">Parçalarım</h1>
        <p className="text-charcoal-500 mt-1">Oluşturduğunuz seramik eserlerin durumu</p>
      </div>

      {/* Status Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {["shaped", "drying", "ready_for_pickup", "picked_up", "shipped"].map((status) => {
          const config = getStatusConfig(status);
          return (
            <div key={status} className={`${config.color} rounded-2xl p-3 text-center`}>
              <config.icon className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs font-medium">{config.label}</p>
            </div>
          );
        })}
      </div>

      {/* Pieces Grid */}
      {myPieces.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {myPieces.map((piece) => {
            const status = getStatusConfig(piece.status);
            return (
              <div key={piece.id} className="card-luxury overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-sand-200 via-clay-200 to-terracotta-100 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center shadow-soft">
                    <ShoppingBag className="w-10 h-10 text-charcoal-400" />
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif text-xl text-charcoal-800">{piece.pieceName}</h3>
                    <p className="text-sm text-charcoal-500 mt-1">{formatDate(piece.createdAt)}</p>
                  </div>

                  <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl ${status.color}`}>
                    <status.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{status.label}</span>
                  </div>

                  <p className="text-sm text-charcoal-500">{status.desc}</p>

                  {piece.notes && (
                    <div className="bg-sand-50 rounded-xl p-3">
                      <p className="text-sm text-charcoal-600 italic">"{piece.notes}"</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto rounded-full bg-sand-100 flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 text-charcoal-400" />
          </div>
          <h3 className="font-serif text-xl text-charcoal-700 mb-2">Henüz Parça Yok</h3>
          <p className="text-charcoal-500">Atölyelere katılarak ilk eserinizi oluşturun</p>
        </div>
      )}
    </div>
  );
}
