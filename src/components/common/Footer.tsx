import React from 'react';
import { Compass, Phone, Mail, MapPin, Shield, Truck, RefreshCw } from 'lucide-react';
import { StoreSettings } from '../../types';

interface FooterProps {
  settings: StoreSettings;
  setCurrentTab: (tab: 'home' | 'products' | 'categories' | 'about' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, setCurrentTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* VALUE HIGHLIGHTS */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-xl bg-ocean-950 border border-ocean-800/60 flex items-center justify-center text-ocean-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Pengiriman Cepat & Aman</h4>
                <p className="text-xs text-slate-400 mt-0.5">Dikirim ke seluruh Indonesia dengan kurir terpercaya.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-xl bg-ocean-950 border border-ocean-800/60 flex items-center justify-center text-ocean-400 shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Kualitas Terjamin</h4>
                <p className="text-xs text-slate-400 mt-0.5">Produk pilihan original yang dikurasi langsung oleh admin.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-xl bg-ocean-950 border border-ocean-800/60 flex items-center justify-center text-ocean-400 shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Layanan Ramah</h4>
                <p className="text-xs text-slate-400 mt-0.5">Konsultasi produk dan respon cepat via WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* BRAND */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="JOSJISMART Logo"
                className="w-10 h-10 object-contain rounded-xl shadow-xs"
              />
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white block">
                  JOSJI<span className="text-ocean-400">SMART</span>
                </span>
                <span className="text-[11px] text-slate-400 block -mt-0.5">
                  Toko Online Pilihan Terbaik
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Toko online bergaya pesisir tropis modern. Menghadirkan berbagai pilihan busana sejuk, gadget outdoor, aksesoris pantai, dan kebutuhan harian dengan kenyamanan berbelanja istimewa.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-ocean-400 shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-ocean-400 shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-ocean-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigasi</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setCurrentTab('home')}
                  className="hover:text-ocean-400 transition-colors"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('products')}
                  className="hover:text-ocean-400 transition-colors"
                >
                  Katalog Produk
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('categories')}
                  className="hover:text-ocean-400 transition-colors"
                >
                  Kategori
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('about')}
                  className="hover:text-ocean-400 transition-colors"
                >
                  Tentang Kami
                </button>
              </li>
            </ul>
          </div>

          {/* CUSTOMER SUPPORT */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Bantuan & Informasi</h5>
            <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
              <li>Jam Operasional: Setiap Hari 08.00 - 21.00 WIB</li>
              <li>Metode Pembayaran: Transfer Bank BCA / Mandiri, QRIS, & COD</li>
              <li>Pengiriman: JNE, SiCepat, J&T Express</li>
              <li className="pt-3">
                <a
                  href={`https://wa.me/${settings.phone.replace(/[^\d]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
                >
                  Hubungi Admin WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} JOSJISMART. Semua hak dilindungi undang-undang.</p>
          <p className="text-slate-400">Dirancang dengan tema Blue Ocean / Tropical Beach</p>
        </div>
      </div>
    </footer>
  );
};
