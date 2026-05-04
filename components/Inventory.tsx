"use client";

import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { Search, Package, AlertTriangle, Plus, Minus, Edit3, Save, X, ShoppingCart } from "lucide-react";

export default function Inventory() {
  const { inventory, updateInventory } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState(0);

  const categories = [...new Set(inventory.map((i) => i.category))];

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity <= minStock * 0.5) return { label: "Kritik", color: "bg-red-100 text-red-700", icon: AlertTriangle };
    if (quantity <= minStock) return { label: "Düşük", color: "bg-ocher-100 text-ocher-700", icon: AlertTriangle };
    return { label: "Yeterli", color: "bg-olive-100 text-olive-700", icon: Package };
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal-800">Envanter Yönetimi</h1>
          <p className="text-charcoal-500 mt-1">Atölye malzeme ve stok takibi</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-charcoal-500 bg-white/60 rounded-2xl px-4 py-2">
            Toplam: <span className="font-bold text-charcoal-700">{inventory.length}</span> ürün
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
          <input
            type="text"
            placeholder="Malzeme ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-luxury w-full pl-12"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input-luxury py-2.5"
        >
          <option value="all">Tüm Kategoriler</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Inventory Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInventory.map((item) => {
          const stockStatus = getStockStatus(item.quantity, item.minStock);
          const StatusIcon = stockStatus.icon;
          const isLow = item.quantity <= item.minStock;

          return (
            <div key={item.id} className={`card-luxury p-6 space-y-4 ${isLow ? "border-ocher-300/50" : ""}`}>
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-2xl ${stockStatus.color} flex items-center justify-center`}>
                  <StatusIcon className="w-6 h-6" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg text-charcoal-800">{item.name}</h3>
                <p className="text-sm text-charcoal-500">{item.category}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-charcoal-500">Mevcut Stok</span>
                  {editingItem === item.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditQuantity(Math.max(0, editQuantity - 1))}
                        className="w-7 h-7 rounded-lg bg-sand-100 flex items-center justify-center hover:bg-sand-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-charcoal-800">{editQuantity}</span>
                      <button
                        onClick={() => setEditQuantity(editQuantity + 1)}
                        className="w-7 h-7 rounded-lg bg-sand-100 flex items-center justify-center hover:bg-sand-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          updateInventory(item.id, editQuantity);
                          setEditingItem(null);
                        }}
                        className="w-7 h-7 rounded-lg bg-olive-100 text-olive-600 flex items-center justify-center"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold ${isLow ? "text-ocher-600" : "text-charcoal-800"}`}>
                        {item.quantity}
                      </span>
                      <span className="text-sm text-charcoal-500">{item.unit}</span>
                      <button
                        onClick={() => {
                          setEditingItem(item.id);
                          setEditQuantity(item.quantity);
                        }}
                        className="w-7 h-7 rounded-lg bg-sand-100 text-charcoal-400 flex items-center justify-center hover:bg-sand-200 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-full bg-sand-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.quantity <= item.minStock * 0.5 ? "bg-red-400" :
                      item.quantity <= item.minStock ? "bg-ocher-400" : "bg-olive-400"
                    }`}
                    style={{ width: `${Math.min(100, (item.quantity / (item.minStock * 3)) * 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-charcoal-500">Min. Stok: {item.minStock} {item.unit}</span>
                  <span className="text-charcoal-500">Birim: {item.price}₺</span>
                </div>
              </div>

              {item.supplier && (
                <div className="pt-3 border-t border-sand-100 flex items-center gap-2 text-sm text-charcoal-500">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Tedarikçi: {item.supplier}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
          <p className="text-charcoal-500">Malzeme bulunamadı</p>
        </div>
      )}
    </div>
  );
}
