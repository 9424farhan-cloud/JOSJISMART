import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { formatRupiah, formatDate, formatWaNumber } from '../../utils/formatters';
import {
  X,
  MessageCircle,
  Phone,
  Instagram,
  CheckCircle2,
  Copy,
  Check,
  Send,
  ExternalLink,
  MapPin,
  Package,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface OrderRespondModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, status: OrderStatus, notes?: string) => void;
}

export const OrderRespondModal: React.FC<OrderRespondModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const cleanPhone = order.customerPhone.replace(/[^\d]/g, '');
  const waTarget = cleanPhone.startsWith('0')
    ? '62' + cleanPhone.slice(1)
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : '62' + cleanPhone;

  const defaultMessage = `Halo Kak ${order.customerName}! 🌊\n\nTerima kasih telah berbelanja di *JOSJISMART*. Pesanan Anda dengan rincian berikut telah kami terima:\n\n• *No. Pesanan:* ${order.id}\n• *Total Pembayaran:* ${formatRupiah(order.total)}\n• *Metode:* ${order.paymentMethod}\n• *Kurir & Tujuan:* ${order.shippingCourier} ke ${order.shippingCity}\n\nPesanan Anda saat ini sedang kami persiapkan untuk segera dikirimkan. Ada yang bisa kami bantu kembali seputar pesanan ini, Kak? Terima kasih!`;

  const [customMsg, setCustomMsg] = useState(defaultMessage);

  const handleCopyMessage = () => {
    try {
      navigator.clipboard.writeText(customMsg);
      setCopied(true);
      showToast({
        type: 'success',
        title: 'Tersalin',
        message: 'Pesan konfirmasi berhasil disalin ke clipboard.',
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleQuickMarkProcessing = () => {
    if (onUpdateStatus) {
      onUpdateStatus(order.id, 'Diproses', 'Admin telah merespon pembeli.');
      showToast({
        type: 'success',
        title: 'Status Diperbarui',
        message: `Pesanan ${order.id} kini berstatus "Diproses".`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-ocean-50 dark:bg-ocean-950/70 border border-ocean-200 dark:border-ocean-800 flex items-center justify-center text-ocean-600 dark:text-ocean-400 shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-ocean-600 dark:text-ocean-400">
                #{order.id}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  order.status === 'Selesai'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : order.status === 'Diproses'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {order.status}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Respon Pembeli: {order.customerName}
            </h2>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
          {/* BUYER & ORDER SUMMARY BOX */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/60 pb-2">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  {order.customerName}
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  {order.customerPhone} {order.customerEmail ? `• ${order.customerEmail}` : ''}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Total Pesanan:</span>
                <span className="font-extrabold text-sm text-ocean-700 dark:text-ocean-300">
                  {formatRupiah(order.total)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
              <MapPin className="w-3.5 h-3.5 text-ocean-600 shrink-0 mt-0.5" />
              <span>
                {order.shippingAddress}, {order.shippingCity} ({order.shippingPostalCode})
              </span>
            </div>

            <div className="text-[11px] text-slate-500">
              Barang ({order.items.length} jenis):{' '}
              <strong className="text-slate-700 dark:text-slate-200">
                {order.items.map((it) => `${it.productName} (${it.quantity}x)`).join(', ')}
              </strong>
            </div>
          </div>

          {/* EDITABLE CONFIRMATION MESSAGE */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-ocean-600" />
                <span>Pesan Konfirmasi Otomatis ke Pembeli:</span>
              </label>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-[11px] text-ocean-600 dark:text-ocean-400 hover:underline flex items-center gap-1 font-semibold"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Tersalin' : 'Salin Pesan'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-ocean-500 leading-relaxed"
            />
          </div>

          {/* RESPONSE CHANNELS */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Pilih Saluran untuk Menghubungi Pembeli:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* WHATSAPP ACTION */}
              <a
                href={`https://wa.me/${waTarget}?text=${encodeURIComponent(customMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleQuickMarkProcessing}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Chat WhatsApp</span>
              </a>

              {/* TELEPHONE DIRECT ACTION */}
              <a
                href={`tel:${cleanPhone}`}
                className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Telepon Langsung ({order.customerPhone})</span>
              </a>

              {/* INSTAGRAM DM ADMIN */}
              <a
                href="https://ig.me/m/z4turu"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
              >
                <Instagram className="w-4 h-4" />
                <span>Buka DM IG (@z4turu)</span>
              </a>

              {/* QUICK UPDATE STATUS */}
              {order.status === 'Menunggu' && (
                <button
                  type="button"
                  onClick={handleQuickMarkProcessing}
                  className="py-3 px-4 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tandai Status "Diproses"</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Dibuat: {formatDate(order.createdAt)}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
