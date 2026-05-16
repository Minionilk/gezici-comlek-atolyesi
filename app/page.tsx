import FAQSection from "@/components/FAQSection";
import FormCardsSection from "@/components/FormCardsSection";
import GallerySection from "@/components/GallerySection";
import PotteryWheelHero from "@/components/PotteryWheelHero";
import Reveal from "@/components/Reveal";
import {
  CheckCircle2,
  HeartHandshake,
  Instagram,
  MapPin,
  Palette,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import fs from "node:fs";
import path from "node:path";

const whatsappUrl = "https://wa.me/905304902081";
const brandName = "Gezici Sanat Atölyesi";
const instagramUrl = "https://www.instagram.com/gezicisanatatolyesi/";
const instagramHandle = "@gezicisanatatolyesi";
const videoPath = "/media/atolye-video.mp4";
const instagramQrPath = "/social/instagram-qr.png";
const galleryDirectory = path.join(process.cwd(), "public", "galeri");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function publicFileExists(publicPath: string) {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", ...publicPath.split("/").filter(Boolean)));
  } catch {
    return false;
  }
}

function getGalleryImages() {
  try {
    return fs
      .readdirSync(galleryDirectory, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => imageExtensions.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, "tr"))
      .map((name) => ({
        name,
        src: `/galeri/${encodeURIComponent(name)}`,
      }));
  } catch {
    return [];
  }
}

const forms = [
  "Çanak formu",
  "Kap formu",
  "Yıldız formu",
  "Çiçek formu",
  "Vazo formu",
  "Özgün Kalp formu",
];

const heroBenefits = [
  {
    icon: Truck,
    title: "Yerinde mobil kurulum",
    text: "Çark, ekipman ve atölye düzeni etkinlik alanına taşınır.",
  },
  {
    icon: Sparkles,
    title: "Beyaz çamur deneyimi",
    text: "Formlar kırık beyaz çamurla daha temiz ve ferah görünür.",
  },
  {
    icon: ShieldCheck,
    title: "Önlük desteği",
    text: "Önlük desteği ile temiz ve kontrollü uygulama sağlıyoruz.",
  },
];

const processSteps = [
  {
    title: "Planlama",
    text: "Etkinlik alanı, yaş grubu, süre ve katılımcı akışı birlikte netleştirilir.",
  },
  {
    title: "Yerinde kurulum",
    text: "Seramik tornaları, beyaz çamur, önlük desteği ve gerekli ekipmanlarla alana arabayla geliriz.",
  },
  {
    title: "Çark deneyimi",
    text: "Katılımcılar yönlendirmemizle çömlekçi çarkında kendi formlarını üretir.",
  },
  {
    title: "Teslim ve boyama",
    text: "Pişirim hizmeti yoktur; ürünler teslim edilir ve istenirse sonradan boyanabilir.",
  },
];

const audiences = [
  "Anaokulları",
  "İlkokullar",
  "Ortaokullar",
  "Oteller",
  "Çocuk kulüpleri",
  "Kurumsal etkinlikler",
  "Festivaller",
  "Yetişkin workshopları",
];

const faqs = [
  ["Pişirim var mı?", "Hayır. Etkinlik çömlekçi çarkı deneyimi ve form üretimi odaklıdır."],
  ["Ürünler boyanabilir mi?", "Evet, ürünler sonradan istenirse boyanabilir."],
  ["Ekipmanları kim getiriyor?", "Seramik tornaları, kil ve gerekli ekipmanları biz getiriyoruz."],
  ["Kaç kişi geliyorsunuz?", "Barış Özarıkça ve Hayri Ünal olarak iki kişiyiz."],
  [
    "Çocuklar için güvenli mi?",
    "Yaş grubuna uygun yönlendirme, beyaz çamur ve önlük desteğiyle güvenli ve kontrollü şekilde yürütülür.",
  ],
  ["Yetişkinlere uygun mu?", "Evet. Rahatlatıcı, keyifli ve üretim odaklı bir workshop olarak uygulanır."],
];

export default function HomePage() {
  const galleryImages = getGalleryImages();
  const hasWorkshopVideo = publicFileExists(videoPath);
  const hasInstagramQr = publicFileExists(instagramQrPath);

  return (
    <main className="min-h-screen overflow-hidden bg-cream text-clay-950">
      <section className="hero-section">
        <div className="hero-shell">
          <Reveal className="max-w-3xl pt-8 lg:pt-0">
            <div className="eyebrow">
              <Truck className="h-4 w-4" />
              Yerinde kurulan mobil seramik deneyimi
            </div>
            <h1 className="font-serif text-5xl leading-[0.98] text-clay-950 sm:text-6xl lg:text-7xl">
              {brandName}
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-semibold leading-relaxed text-terracotta-900 sm:text-2xl">
              Gezici Sanat Atölyesi ile yerinde kurulan yaratıcı seramik deneyimi
            </p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-clay-800 sm:text-lg">
              Barış Özarıkça ve Hayri Ünal olarak seramik tornalarımız ve ekipmanlarımızla
              okullara, otellere, kurumlara, çocuk kulüplerine, festival alanlarına ve özel
              etkinliklere geliyoruz. Çocuklar ve yetişkinler çömlekçi çarkında beyaz çamurla
              çanak, kap, yıldız, çiçek ve vazo gibi formlar üretir. Çocukların rahat
              çalışması için önlük desteği sağlıyoruz. Pişirim hizmeti yoktur; ürünler teslim
              edilir ve istenirse sonradan boyanabilir.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="button-primary" href="#galeri">
                Galeriye Bak
              </a>
              <a className="button-secondary" href={whatsappUrl} rel="noreferrer" target="_blank">
                WhatsApptan Yaz
              </a>
            </div>
          </Reveal>

          <PotteryWheelHero />
        </div>
      </section>

      <section className="hero-benefits-section">
        <div className="hero-benefits-shell">
          {heroBenefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <Reveal className="benefit-card" delay={index * 0.06} key={benefit.title}>
                <span>
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h2>{benefit.title}</h2>
                  <p>{benefit.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <Reveal as="section" className="section-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr]" id="hakkimizda">
        <div>
          <p className="section-kicker">Hakkımızda</p>
          <h2 className="section-title">Seramiği bulunduğunuz yere getiriyoruz.</h2>
        </div>
        <div className="grid gap-5 text-lg leading-8 text-clay-800">
          <p>
            Barış Özarıkça ve Hayri Ünal olarak iki seramik sanatçısıyız. Okul, otel, kurum
            ve etkinlik alanlarına mobil atölye düzeninde giderek çömlekçi çarkı deneyimi
            sunuyoruz.
          </p>
          <p>
            Çocuklar için el-göz koordinasyonu, odaklanma, psikomotor gelişim ve yaratıcılığı
            destekleyen kontrollü bir deneyim tasarlıyoruz. Yetişkinler için ise keyifli,
            rahatlatıcı ve üretim odaklı bir workshop akışı kuruyoruz.
          </p>
        </div>
      </Reveal>

      <FormCardsSection forms={forms} />

      <section className="bg-sand-50/75">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <p className="section-kicker">Neden bizi tercih etmelisiniz</p>
            <h2 className="section-title">Düzenli, zarif ve çocuklara uygun atölye akışı</h2>
          </Reveal>
          <div className="reason-grid">
            {[
              ["Kontrollü uygulama", "Yaş grubuna uygun yönlendirme ile çark deneyimini sakin ve güvenli tutarız."],
              ["Temiz çalışma düzeni", "Çocukların rahat çalışması için önlük desteği sağlıyoruz."],
              ["Beyaz çamur estetiği", "Üretimler kırık beyaz çamur tonuyla ferah, sade ve fotoğraflanabilir görünür."],
              ["Mobil ekipman", "Çarklar ve temel ekipmanlar etkinlik alanına düzenli şekilde kurulur."],
            ].map(([title, text], index) => (
              <Reveal className="reason-card" delay={index * 0.05} key={title}>
                <Palette className="h-5 w-5" />
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/70">
        <div className="section-shell">
          <Reveal className="section-heading">
            <p className="section-kicker">Etkinlik süreci</p>
            <h2 className="section-title">Basit, düzenli ve yerinde uygulanabilir akış</h2>
          </Reveal>
          <div className="grid gap-4 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <Reveal className="step-card" delay={index * 0.06} key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <GallerySection images={galleryImages} />

      <section className="bg-white/70">
        <div className="section-shell">
          <Reveal className="section-heading">
            <p className="section-kicker">Video</p>
            <h2 className="section-title">Atölyeden Kısa Bir Video</h2>
          </Reveal>
          <Reveal className="video-panel">
            {hasWorkshopVideo ? (
              <video controls muted playsInline preload="metadata">
                <source src={videoPath} type="video/mp4" />
                Tarayıcınız video etiketini desteklemiyor.
              </video>
            ) : (
              <div className="video-fallback">
                Video dosyası eklendiğinde bu alanda atölyeden kısa bir kayıt gösterilecek.
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <section className="section-shell">
        <Reveal className="section-heading">
          <p className="section-kicker">Kimler için uygun</p>
          <h2 className="section-title">Farklı yaş grupları ve etkinlik alanları</h2>
        </Reveal>
        <div className="audience-grid">
          {audiences.map((audience, index) => (
            <Reveal className="audience-pill" delay={index * 0.035} key={audience}>
              <CheckCircle2 className="h-5 w-5" />
              {audience}
            </Reveal>
          ))}
        </div>
      </section>

      <FAQSection faqs={faqs} />

      <Reveal as="section" className="section-shell" id="iletisim">
        <div className="contact-panel">
          <div>
            <p className="section-kicker">İletişim</p>
            <h2 className="section-title">Etkinlik için teklif alın</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-clay-800">
              Okul, otel, kurum, festival veya özel etkinliğiniz için katılımcı sayısı ve
              tarih bilgisiyle bize ulaşabilirsiniz.
            </p>
          </div>
          <div className="contact-links">
            <a href="tel:+905304902081">
              <Phone className="h-5 w-5" />
              0530 490 20 81
            </a>
            <a href={instagramUrl} rel="noreferrer" target="_blank">
              <Instagram className="h-5 w-5" />
              <span>
                Instagram’da bizi takip edin
                <small>{instagramHandle}</small>
              </span>
            </a>
            <a href={whatsappUrl} rel="noreferrer" target="_blank">
              <HeartHandshake className="h-5 w-5" />
              Etkinlik için teklif alın
            </a>
            {hasInstagramQr ? (
              <a className="instagram-qr-card" href={instagramUrl} rel="noreferrer" target="_blank">
                <img alt={`${instagramHandle} Instagram QR kodu`} src={instagramQrPath} />
                <span>
                  {brandName} Instagram
                  <small>{instagramHandle}</small>
                </span>
              </a>
            ) : null}
          </div>
        </div>
      </Reveal>

      <footer className="border-t border-terracotta-100 px-5 py-8 text-center text-sm text-clay-700">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <span>{brandName} - Barış Özarıkça & Hayri Ünal</span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {brandName}
          </span>
        </div>
      </footer>
    </main>
  );
}
