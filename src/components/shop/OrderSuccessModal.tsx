import React from 'react';
import { Order } from '../../types';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { CheckCircle, X, Package, MessageCircle, ArrowRight } from 'lucide-react';
import { bannerService } from '../../services/bannerService';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onContinueShopping: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onContinueShopping,
}) => {
  if (!order) return null;

  const settings = bannerService.getSettings();
  const waNumber = settings.phone.replace(/[^\d]/g, '');
  const waMessage = encodeURIComponent(
    `Halo Admin JOSJISMART! Saya baru saja membuat pesanan baru:\n\n*No. Pesanan:* ${order.id}\n*Nama:* ${order.customerName}\n*Total:* ${formatRupiah(order.total)}\n*Metode Pembayaran:* ${order.paymentMethod}\n\nMohon konfirmasi proses pesanan saya ya. Terima kasih!`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto p-6 sm:p-8 text-center">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SUCCESS ICON */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle className="w-10 h-10" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Pesanan Berhasil Dibuat!
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Terima kasih atas kepercayaan Anda berbelanja di JOSJISMART.
        </p>

        {/* ORDER DETAILS BOX */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-left text-xs space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">Nomor Pesanan:</span>
            <span className="font-mono font-bold text-ocean-600 dark:text-ocean-400">{order.id}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Tanggal:</span>
            <span className="text-slate-800 dark:text-slate-200">{formatDate(order.createdAt)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Status Pesanan:</span>
            <span className="px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              {order.status}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Penerima:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{order.customerName} ({order.customerPhone})</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Metode Pembayaran:</span>
            <span className="text-slate-800 dark:text-slate-200">{order.paymentMethod}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white">
            <span>Total Tagihan:</span>
            <span className="text-ocean-700 dark:text-ocean-300">{formatRupiah(order.total)}</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex flex-col gap-2.5">
          <a
            href={`https://wa.me/${waNumber}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Konfirmasi Cepat via WhatsApp</span>
          </a>

          <button
            onClick={() => {
              onClose();
              onContinueShopping();
            }}
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-ocean-600 hover:bg-ocean-700 text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Lanjut Belanja</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
