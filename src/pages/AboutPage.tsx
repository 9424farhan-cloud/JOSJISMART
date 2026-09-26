import React from 'react';
import { StoreSettings } from '../types';
import {
  Compass,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  HeartHandshake,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';

interface AboutPageProps {
  settings: StoreSettings;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings }) => {
  const faqs = [
    {
      q: 'Apakah seluruh produk di JOSJISMART original dan baru?',
      a: 'Ya, 100% original. Kami mengurasi langsung setiap barang dari produsen dan mitra terpercaya sebelum diinput ke katalog oleh Gaza admin.',
    },
    {
      q: 'Bagaimana prosedur konfirmasi pesanan setelah checkout?',
      a: 'Setelah checkout selesai, Anda dapat langsung mengonfirmasi nomor pesanan melalui tombol WhatsApp admin yang tersedia. Admin kami akan segera menyiapkan paket Anda.',
    },
    {
      q: 'Apakah bisa melakukan penukaran ukuran jika kemeja/sandal tidak muat?',
      a: 'Tentu bisa. Kami menyediakan garansi penukaran ukuran dalam waktu 7 hari sejak pesanan diterima, asalkan tag label masih utuh dan produk belum digunakan beraktivitas.',
    },
    {
      q: 'Berapa lama estimasi pengiriman pesanan?',
      a: 'Pengiriman reguler berkisar antara 2-3 hari kerja untuk wilayah Jawa dan kota besar, serta 3-5 hari kerja untuk luar pulau.',
    },
  ];

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* HEADER HERO */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-ocean-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tentang JOSJISMART
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Menghadirkan gaya hidup pesisir tropis yang santai, berkualitas tinggi, dan dapat diandalkan setiap hari.
          </p>
        </div>

        {/* STORY CARD */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-5 leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-300">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Kisah & Komitmen Kami
          </h2>
          <p>
            JOSJISMART bermula dari gagasan sederhana: menciptakan toko online bernuansa pantai tropis yang tidak hanya menjual barang, tetapi juga menghadirkan pengalaman belanja yang transparan, bersahabat, dan manusiawi.
          </p>
          <p>
            Semua barang yang kami pajang — mulai dari pakaian linen bernapas sejuk, kacamata polarized penahan silau laut, hingga perlengkapan kedap air — telah melalui seleksi cermat. Kami menghindari deskripsi buatan otomatis demi memastikan pembeli mendapatkan informasi yang akurat dan jujur.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Produk Terkurasi</h4>
                <p className="text-xs text-slate-500 mt-0.5">Dicek fisik sebelum masuk kemasan pengiriman.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="w-6 h-6 text-ocean-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Kemasan Rapi</h4>
                <p className="text-xs text-slate-500 mt-0.5">Dilapisi bubble wrap tebal tahan benturan.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <HeartHandshake className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Pelayanan Ramah</h4>
                <p className="text-xs text-slate-500 mt-0.5">Dipandu langsung oleh admin Gaza via WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>

        {/* STORE CONTACT & LOCATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Informasi Kontak & Lokasi Toko
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-ocean-600 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-ocean-600 shrink-0" />
                <span>WhatsApp: {settings.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-ocean-600 shrink-0" />
                <span>Email: {settings.email}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.phone.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Admin Gaza via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* HOURS */}
          <div className="p-6 sm:p-8 rounded-3xl bg-ocean-50/70 dark:bg-ocean-950/40 border border-ocean-100 dark:border-ocean-900/60 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Jam Operasional & Pengiriman
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <li>• <strong>Layanan Chat & CS:</strong> Senin – Minggu (08.00 – 21.00 WIB)</li>
              <li>• <strong>Batas Order Kirim Hari Ini:</strong> 15.00 WIB (Senin – Sabtu)</li>
              <li>• <strong>Hari Libur Nasional:</strong> Pengiriman menyesuaikan jadwal operasional kurir</li>
              <li>• <strong>Dukungan Ekspedisi:</strong> JNE, SiCepat, J&T Express, & Pos Indonesia</li>
            </ul>
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-ocean-600" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-2"
              >
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{faq.q}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
