"use client";

import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { formatDate } from "@/lib/utils";
import { Search, Filter, ShoppingBag, Package, CheckCircle, Truck, Clock, Edit3, Save, X } from "lucide-react";
import { PotteryPiece } from "@/types";

export default function PieceManagement() {
  const { pieces, updatePieceStatus, currentUser } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [editingPiece, setEditingPiece] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");

  const filteredPieces = pieces.filter((piece) => {
    const matchesSearch = piece.pieceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         piece.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || piece.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusOptions = [
    { value: "shaped", label: "Şekillendirildi", color: "bg-blue-100 text-blue-700" },
    { value: "drying", label: "Kurumada", color: "bg-ocher-100 text-ocher-700" },
    { value: "ready_for_pickup", label: "Teslime Hazır", color: "bg-olive-100 text-olive-700" },
    { value: "picked_up", label: "Teslim Alındı", color: "bg-green-100 text-green-700" },
    { value: "shipped", label: "Kargolandı", color: "bg-purple-100 text-purple-700" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "shaped": return ShoppingBag;
      case "drying": return Clock;
      case "ready_for_pickup": return Package;
      case "picked_up": return CheckCircle;
      case "shipped": return Truck;
      default: return ShoppingBag;
    }
  };

  const handleStatusChange = (pieceId: string, newStatus: PotteryPiece["status"]) => {
    updatePieceStatus(pieceId, newStatus);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal-800">Parça Yönetimi</h1>
          <p className="text-charcoal-500 mt-1">Tüm seramik eserlerin durum takibi</p>
        </div>
        <div className="text-sm text-charcoal-500 bg-white/60 rounded-2xl px-4 py-2">
          Toplam: <span className="font-bold text-charcoal-700">{pieces.length}</span> parça
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
          <input
            type="text"
            placeholder="Parça veya misafir ara..."
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
            <option value="all">Tüm Durumlar</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pieces Table */}
      <div className="card-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sand-50/80 border-b border-sand-200">
                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Parça</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Misafir</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Tarih</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Durum</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal-700">Notlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {filteredPieces.map((piece) => {
                const StatusIcon = getStatusIcon(piece.status);
                const currentStatus = statusOptions.find(s => s.value === piece.status);

                return (
                  <tr key={piece.id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-charcoal-500" />
                        </div>
                        <span className="font-medium text-charcoal-800">{piece.pieceName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal-600">{piece.userName}</td>
                    <td className="px-6 py-4 text-sm text-charcoal-500">{formatDate(piece.createdAt)}</td>
                    <td className="px-6 py-4">
                      <select
                        value={piece.status}
                        onChange={(e) => handleStatusChange(piece.id, e.target.value as PotteryPiece["status"])}
                        className={`text-sm font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer ${currentStatus?.color}`}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {editingPiece === piece.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            className="input-luxury py-1.5 text-sm w-48"
                            placeholder="Not ekle..."
                            autoFocus
                          />
                          <button 
                            onClick={() => setEditingPiece(null)}
                            className="w-7 h-7 rounded-lg bg-olive-100 text-olive-600 flex items-center justify-center"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setEditingPiece(null)}
                            className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-charcoal-500 truncate max-w-[150px]">
                            {piece.notes || "-"}
                          </span>
                          <button 
                            onClick={() => {
                              setEditingPiece(piece.id);
                              setEditNotes(piece.notes || "");
                            }}
                            className="w-7 h-7 rounded-lg bg-sand-100 text-charcoal-400 flex items-center justify-center hover:bg-sand-200 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPieces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-charcoal-500">Parça bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
}
