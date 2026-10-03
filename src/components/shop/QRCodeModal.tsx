import React, { useState } from 'react';
import {
  X,
  QrCode,
  Download,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  Share2,
  Smartphone,
  ShieldCheck,
  Clock,
  Sparkles,
  Instagram,
} from 'lucide-react';
import { formatRupiah, formatWaNumber } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'qris' | 'whatsapp' | 'share';
  orderId?: string;
  amount?: number;
  customerName?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'qris',
  orderId,
  amount,
  customerName,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'qris' | 'whatsapp' | 'share'>(initialTab);
  const [copied, setCopied] = useState(false);
  const [customAmount, setCustomAmount] = useState<number | ''>(amount ?? '');

  if (!isOpen) return null;

  const currentAmount = typeof customAmount === 'number' && customAmount > 0 
    ? customAmount 
    : (amount ?? 150000);

  const displayOrderId = orderId || `JOSJI-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const storeUrl = typeof window !== 'undefined' ? window.location.href : 'https://josjismart.com';
  const waNumber = '6285723691588';

  // Dynamic QR Code Payloads
  const qrisPayload = `00020101021226670014ID.GO.QRIS.WWW01189360099800000000010214ID102026857236910303UME51440014ID.CO.QRIS.WWW0215ID102026857236910303UME520454995303360540${currentAmount}5802ID5910JOSJISMART6013KOTA JAKARTA 61051011062${displayOrderId}6304`;
  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo Admin JOSJISMART! Saya ingin konfirmasi pembayaran QRIS / bertanya seputar toko (No. Pesanan: ${displayOrderId}).`)}`;

  // QR URLs (primary with fallback)
  const getQrUrl = (data: string) => `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(data)}&margin=8`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast({
      type: 'success',
      title: 'Tersalin',
      message: `${label} berhasil disalin ke clipboard.`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = (imageUrl: string, filename: string) => {
    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showToast({
          type: 'success',
          title: 'QR Code Diunduh',
          message: 'Gambar QR Code berhasil disimpan ke perangkat Anda.',
        });
      })
      .catch(() => {
        window.open(imageUrl, '_blank');
      });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto p-5 sm:p-7">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean-50 dark:bg-ocean-950/70 border border-ocean-200 dark:border-ocean-800 text-ocean-700 dark:text-ocean-300 text-xs font-bold mb-2">
            <QrCode className="w-4 h-4 text-ocean-600 dark:text-ocean-400" />
            <span>Fitur QR Interaktif JOSJISMART</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Scan QR Code
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pindai menggunakan aplikasi m-Banking, E-Wallet, atau WhatsApp Anda
          </p>
        </div>

        {/* TABS */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('qris')}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'qris'
                ? 'bg-white dark:bg-slate-700 text-ocean-700 dark:text-ocean-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>QRIS Bayar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'whatsapp'
                ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Instagram className="w-3.5 h-3.5 text-pink-500" />
            <span>QR Instagram</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('share')}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'share'
                ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-purple-500" />
            <span>Bagikan Toko</span>
          </button>
        </div>

        {/* TAB 1: QRIS PEMBAYARAN */}
        {activeTab === 'qris' && (
          <div className="space-y-4">
            {/* QRIS CARD */}
            <div className="relative p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/80 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700 text-center shadow-md">
              {/* QRIS BRAND HEADER */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black tracking-tighter text-rose-600 dark:text-rose-500 font-mono">
                      QRIS
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Nasional
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    JOSJISMART STORE
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">NMID: ID10202685723691</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Terverifikasi
                  </span>
                </div>
              </div>

              {/* QR IMAGE */}
              <div className="relative inline-block p-3 rounded-2xl bg-white border border-slate-200 shadow-inner mx-auto mb-3">
                <img
                  src={getQrUrl(qrisPayload)}
                  alt="QRIS JOSJISMART"
                  className="w-52 h-52 sm:w-60 sm:h-60 object-contain mx-auto rounded-lg"
                  loading="lazy"
                />
                {/* Center Badge */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border-2 border-ocean-600 flex items-center justify-center shadow-md text-base">
                    🌊
                  </div>
                </div>
              </div>

              {/* AMOUNT & ORDER DETAILS */}
              <div className="mt-1 bg-ocean-50/80 dark:bg-ocean-950/60 p-3 rounded-xl border border-ocean-100 dark:border-ocean-900/60">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Nomor Tagihan:</span>
                  <span className="font-mono font-bold text-ocean-700 dark:text-ocean-300">
                    {displayOrderId}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>Total Bayar:</span>
                  <span className="text-base text-ocean-700 dark:text-ocean-300">
                    {formatRupiah(currentAmount)}
                  </span>
                </div>
              </div>

              {/* SUPPORTED LOGOS TEXT */}
              <p className="mt-3 text-[10px] text-slate-400 leading-tight">
                Mendukung semua pembayaran: <strong>BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, LinkAja</strong>, dan aplikasi bank apapun yang memiliki fitur Scan QRIS.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDownloadQr(getQrUrl(qrisPayload), `QRIS-JOSJISMART-${displayOrderId}`)}
                className="py-2.5 px-3 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4 text-ocean-600" />
                <span>Simpan QRIS</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopy(currentAmount.toString(), 'Nominal Pembayaran')}
                className="py-2.5 px-3 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>Salin Nominal</span>
              </button>
            </div>

            <a
              href="https://ig.me/m/z4turu"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Instagram className="w-4 h-4" />
              <span>Konfirmasi Pembayaran ke Instagram (@z4turu)</span>
            </a>
          </div>
        )}

        {/* TAB 2: QR INSTAGRAM ADMIN */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-4 text-center">
            <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-50/50 to-pink-50/40 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-pink-200 dark:border-pink-900/60">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Scan untuk DM Admin Instagram
              </h3>
              <p className="text-xs text-pink-700 dark:text-pink-400 font-mono font-bold mb-3">
                Username: @z4turu
              </p>

              {/* QR IMAGE */}
              <div className="p-3 rounded-2xl bg-white border border-pink-100 shadow-inner inline-block mx-auto mb-3">
                <img
                  src={getQrUrl('https://www.instagram.com/z4turu/')}
                  alt="QR Instagram JOSJISMART"
                  className="w-52 h-52 sm:w-60 sm:h-60 object-contain mx-auto rounded-lg"
                />
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                Buka kamera HP atau scanner Instagram Anda, lalu arahkan ke kode QR di atas untuk langsung terhubung dengan admin Instagram @z4turu.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleCopy('@z4turu', 'Username Instagram')}
                className="py-2.5 px-3 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Salin @z4turu</span>
              </button>

              <a
                href="https://ig.me/m/z4turu"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka Chat IG</span>
              </a>
            </div>
          </div>
        )}

        {/* TAB 3: QR BAGIKAN TOKO */}
        {activeTab === 'share' && (
          <div className="space-y-4 text-center">
            <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border-2 border-purple-200 dark:border-purple-900/60">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Scan untuk Buka Toko JOSJISMART di Ponsel
              </h3>
              <p className="text-xs text-purple-700 dark:text-purple-400 font-medium mb-3 truncate max-w-xs mx-auto">
                {storeUrl}
              </p>

              {/* QR IMAGE */}
              <div className="p-3 rounded-2xl bg-white border border-purple-100 shadow-inner inline-block mx-auto mb-3">
                <img
                  src={getQrUrl(storeUrl)}
                  alt="QR Link Toko JOSJISMART"
                  className="w-52 h-52 sm:w-60 sm:h-60 object-contain mx-auto rounded-lg"
                />
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                Scan kode QR ini menggunakan kamera ponsel keluarga, teman, atau pelanggan untuk langsung mengunjungi katalog belanja JOSJISMART.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(storeUrl, 'Link Toko')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <Copy className="w-4 h-4" />
              <span>Salin Link Website Toko</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
