import Layout from "@/components/layout/Layout";
import parliamentImg from "@/assets/parliament.jpg";
import heroSummitImg from "@/assets/hero-summit.jpg";
import economyImg from "@/assets/economy.jpg";
import defenseImg from "@/assets/defense.jpg";
import worldImg from "@/assets/world.jpg";
import liveStudioImg from "@/assets/live-studio.jpg";
import videoCityImg from "@/assets/video-city.jpg";
import videoFinanceImg from "@/assets/video-finance.jpg";
import videoStartupImg from "@/assets/video-startup.jpg";
import videoAgricultureImg from "@/assets/video-agriculture.jpg";
import { useState } from "react";
import { useParams } from "react-router-dom";

const filters = ["Tümü", "Son Dakika", "Bugün", "Bu Hafta"];

interface CategoryConfig {
  title: string;
  description: string;
  articles: { headline: string; img: string; date: string; tag: string }[];
}

const categories: Record<string, CategoryConfig> = {
  siyaset: {
    title: "SİYASET",
    description: "Türkiye siyasetinde günün öne çıkan gelişmeleri, analizler ve yorumlar.",
    articles: [
      { headline: "MHP Lideri Bahçeli: 'Türkiye'nin geleceği için kenetlenmeliyiz'", img: parliamentImg, date: "25 Mart 2026", tag: "SİYASET" },
      { headline: "Cumhurbaşkanı Erdoğan: Bölgesel istikrarın güvencesiyiz", img: heroSummitImg, date: "25 Mart 2026", tag: "SİYASET" },
      { headline: "Ana muhalefet partisinde 'tüzük' kurultayı hazırlığı", img: economyImg, date: "25 Mart 2026", tag: "SİYASET" },
      { headline: "Kabine toplantısı sonrası açıklama: Emekli maaşlarına ek düzenleme yolda", img: defenseImg, date: "24 Mart 2026", tag: "SİYASET" },
      { headline: "Yargı paketi meclis yolunda: Denetimli serbestlikte yeni kurallar", img: worldImg, date: "24 Mart 2026", tag: "SİYASET" },
      { headline: "Meclis'te yeni anayasa mesaisi başlıyor: Takvim belli oldu", img: liveStudioImg, date: "24 Mart 2026", tag: "SİYASET" },
    ],
  },
  ekonomi: {
    title: "EKONOMİ",
    description: "Piyasalar, finans, iş dünyası ve makroekonomi gelişmeleri.",
    articles: [
      { headline: "Merkez Bankası faiz kararını açıkladı: Piyasalar beklentiye geçti", img: videoFinanceImg, date: "25 Mart 2026", tag: "EKONOMİ" },
      { headline: "Borsa İstanbul'da yeni rekor: BIST 100 tarihi zirvede", img: economyImg, date: "25 Mart 2026", tag: "EKONOMİ" },
      { headline: "Enflasyonda düşüş trendi devam edecek mi? Uzmanlar değerlendirdi", img: heroSummitImg, date: "25 Mart 2026", tag: "EKONOMİ" },
      { headline: "Dış ticaret açığı daraldı: İhracat rakamları beklentilerin üstünde", img: liveStudioImg, date: "24 Mart 2026", tag: "EKONOMİ" },
      { headline: "Konut satışlarında yeni dönem: Kredi faiz oranları güncellendi", img: videoCityImg, date: "24 Mart 2026", tag: "EKONOMİ" },
      { headline: "Tarım sektöründe destek paketi açıklandı: Çiftçilere müjde", img: videoAgricultureImg, date: "23 Mart 2026", tag: "EKONOMİ" },
    ],
  },
  dunya: {
    title: "DÜNYA",
    description: "Uluslararası gündem, küresel gelişmeler ve dış politika haberleri.",
    articles: [
      { headline: "Gazze diplomasisi: Ankara'nın yeni arabuluculuk hamlesi", img: worldImg, date: "25 Mart 2026", tag: "DÜNYA" },
      { headline: "AB zirvesinde Türkiye gündemi: Gümrük Birliği güncellemesi masada", img: heroSummitImg, date: "25 Mart 2026", tag: "DÜNYA" },
      { headline: "NATO tatbikatında Türk komando birlikleri dikkat çekti", img: defenseImg, date: "25 Mart 2026", tag: "DÜNYA" },
      { headline: "ABD seçimlerinde son durum: Adaylar arasında fark kapanıyor", img: parliamentImg, date: "24 Mart 2026", tag: "DÜNYA" },
      { headline: "Rusya-Ukrayna müzakerelerinde yeni gelişme", img: liveStudioImg, date: "24 Mart 2026", tag: "DÜNYA" },
      { headline: "Türkiye-Afrika zirvesinde ticaret anlaşmaları imzalandı", img: videoStartupImg, date: "23 Mart 2026", tag: "DÜNYA" },
    ],
  },
  savunma: {
    title: "SAVUNMA",
    description: "Milli savunma sanayii, TSK operasyonları ve güvenlik gelişmeleri.",
    articles: [
      { headline: "KAAN uçuş testlerinde yeni aşama: Milli motor için tarih verildi", img: defenseImg, date: "25 Mart 2026", tag: "SAVUNMA" },
      { headline: "Türkiye–Körfez zirvesi: Savunma alanında 8 anlaşma imzalandı", img: heroSummitImg, date: "25 Mart 2026", tag: "SAVUNMA" },
      { headline: "Bayraktar TB3 SİHA'lar TCG Anadolu'dan ilk kez havalandı", img: liveStudioImg, date: "25 Mart 2026", tag: "SAVUNMA" },
      { headline: "Sınır ötesi operasyonda PKK'ya ağır darbe: 47 terörist etkisiz", img: videoCityImg, date: "24 Mart 2026", tag: "SAVUNMA" },
      { headline: "ASELSAN'dan yeni ihracat anlaşması: 3 ülkeyle imza atıldı", img: videoFinanceImg, date: "24 Mart 2026", tag: "SAVUNMA" },
      { headline: "Milli denizaltı projesi: REIS sınıfı 2027'de filoda", img: worldImg, date: "23 Mart 2026", tag: "SAVUNMA" },
    ],
  },
  video: {
    title: "VİDEO",
    description: "Gündemin en çarpıcı görüntüleri ve özel video içerikler.",
    articles: [
      { headline: "Cumhurbaşkanı Erdoğan'ın tarihi konuşması – Tam metin", img: heroSummitImg, date: "25 Mart 2026", tag: "VİDEO" },
      { headline: "KAAN'ın ilk uçuş görüntüleri: Kokpitten özel çekim", img: defenseImg, date: "25 Mart 2026", tag: "VİDEO" },
      { headline: "İstanbul Boğazı'nda nefes kesen kurtarma operasyonu", img: videoCityImg, date: "25 Mart 2026", tag: "VİDEO" },
      { headline: "Ekonomi masası: Merkez Bankası kararı ne anlama geliyor?", img: videoFinanceImg, date: "24 Mart 2026", tag: "VİDEO" },
      { headline: "Anadolu'nun tarım devrimi: Drone ile akıllı tarım", img: videoAgricultureImg, date: "24 Mart 2026", tag: "VİDEO" },
      { headline: "Başkent'te start-up fuarı: Girişimciler fikirlerini anlattı", img: videoStartupImg, date: "23 Mart 2026", tag: "VİDEO" },
    ],
  },
  yazarlar: {
    title: "YAZARLAR",
    description: "Meydan yazarlarının güncel köşe yazıları, analizler ve yorumlar.",
    articles: [
      { headline: "Türkiye'nin bölgesel liderlik vizyonu – Ahmet Kaya", img: parliamentImg, date: "25 Mart 2026", tag: "YORUM" },
      { headline: "Ekonomide yapısal dönüşümün şifreleri – Elif Demir", img: videoFinanceImg, date: "25 Mart 2026", tag: "ANALİZ" },
      { headline: "Savunma sanayiinde yerlilik oranı nereye gidiyor? – Mehmet Yılmaz", img: defenseImg, date: "25 Mart 2026", tag: "ANALİZ" },
      { headline: "Dış politikada denge arayışı – Fatma Şahin", img: worldImg, date: "24 Mart 2026", tag: "YORUM" },
      { headline: "Dijitalleşme ve Türkiye'nin geleceği – Hasan Öztürk", img: videoStartupImg, date: "24 Mart 2026", tag: "TEKNOLOJİ" },
      { headline: "Tarımda sürdürülebilirlik mümkün mü? – Zeynep Arslan", img: videoAgricultureImg, date: "23 Mart 2026", tag: "YORUM" },
    ],
  },
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeFilter, setActiveFilter] = useState("Tümü");

  const category = categories[slug || "siyaset"];

  if (!category) {
    return (
      <Layout>
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-20 text-center">
          <h1 className="text-4xl font-headline font-extrabold text-primary mb-4">Kategori Bulunamadı</h1>
          <p className="text-on-surface-variant">Aradığınız kategori mevcut değil.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-6 lg:py-10">
        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl lg:text-5xl font-headline font-extrabold tracking-tighter uppercase text-primary">{category.title}</h1>
            <div className="h-1 flex-1 bg-primary/20" />
          </div>
          <p className="text-on-surface-variant text-lg">{category.description}</p>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-xs font-extrabold uppercase tracking-widest transition-colors font-headline ${
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-low text-on-surface-variant hover:bg-surface-high"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {category.articles.map((article, i) => (
            <div key={i} className="group news-card">
              <div className="overflow-hidden mb-3">
                <img src={article.img} alt={article.headline} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={400} height={225} />
              </div>
              <span className="category-tag">{article.tag}</span>
              <h3 className="font-bold text-lg leading-tight mt-1 mb-2 news-card-headline font-headline">{article.headline}</h3>
              <span className="text-xs text-on-surface-variant">{article.date}</span>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2">
          <button className="bg-primary text-primary-foreground w-10 h-10 font-bold text-sm">1</button>
          {[2, 3, 4, 5].map((n) => (
            <button key={n} className="bg-surface-low text-on-surface-variant w-10 h-10 font-bold text-sm hover:bg-surface-high transition-colors">{n}</button>
          ))}
          <button className="bg-surface-low text-on-surface-variant px-4 h-10 font-bold text-sm hover:bg-surface-high transition-colors">Sonraki ›</button>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
