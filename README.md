# Gezici Sanat Atölyesi

## Kurulum

```bash
npm install
npm run dev
```

## Teknolojiler

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Lucide React (Icons)

## Özellikler

### Misafir (Guest)
- Atölye rezervasyonu
- Kendi parçalarını görüntüleme
- AI Konsiyerj ile etkileşim
- Bildirimler
- Profil yönetimi

### Eğitmen (Instructor)
- Parça durumu güncelleme
- Yoklama ve not ekleme
- Envanter görüntüleme

### Yönetici (Manager)
- Atölye programı oluşturma
- Bekleme listesi yönetimi
- Envanter yönetimi
- Parça takibi

### Finans (Finance)
- Gelir/gider raporları
- Rezervasyon analizi
- Fatura takibi

### Süper Admin (Super Admin)
- Kullanıcı yönetimi
- RBAC yapılandırması
- Sistem ayarları

## Tasarım Sistemi

- **Renkler**: Sand, Terracotta, Olive, Clay, Charcoal
- **Fontlar**: DM Serif Display (başlıklar), Nunito (gövde)
- **UI**: Soft UI, Mobile-first, Touch-friendly
- **Animasyonlar**: Clay-press etkileşimi, smooth transitions

## KVKK Uyumluluğu

- Kimlik fotokopisi alınmaz
- Veri minimizasyonu
- Açık rıza mekanizması
- Otomatik veri imha

## Not

Bu proje statik export için yapılandırılmıştır. `next.config.js` içinde `output: 'export'` ayarı mevcuttur.
