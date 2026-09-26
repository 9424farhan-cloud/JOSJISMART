import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/orderService';
import { bannerService } from '../../services/bannerService';
import { formatRupiah } from '../../utils/formatters';
import { Order } from '../../types';
import {
  X,
  Truck,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Tag,
  AlertCircle,
} from 'lucide-react';

interface CheckoutModalProps {
  onSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onSuccess }) => {
  const { items, subtotal, clearCart, checkoutOpen, setCheckoutOpen } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const settings = bannerService.getSettings();

  // Form State
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingPostalCode, setShippingPostalCode] = useState('');
  const [shippingCourier, setShippingCourier] = useState('JNE Regular (2-3 hari)');
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank BCA');
  const [orderNotes, setOrderNotes] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!checkoutOpen) return null;

  // Courier Rates (simulated realistic Indonesian shipping)
  const courierOptions = [
    { id: 'jne_reg', name: 'JNE Regular (2-3 hari)', cost: 18000 },
    { id: 'sicepat_best', name: 'SiCepat BEST (1-2 hari)', cost: 24000 },
    { id: 'jnt_ez', name: 'J&T Express (2-3 hari)', cost: 19000 },
    { id: 'pos_kilat', name: 'Pos Indonesia Kilat (3-4 hari)', cost: 15000 },
  ];

  const selectedCourierObj = courierOptions.find((c) => c.name === shippingCourier) || courierOptions[0];
  const isFreeShipping = subtotal >= settings.freeShippingMinAmount;
  const shippingCost = isFreeShipping ? 0 : selectedCourierObj.cost;
  const totalAmount = Math.max(0, subtotal - appliedDiscount + shippingCost);

  const handleApplyPromo = () => {
    if (!promoCodeInput.trim()) return;
    if (settings.promoActive && promoCodeInput.trim().toUpperCase() === settings.promoCode.toUpperCase()) {
      const discount = Math.round((subtotal * settings.promoDiscountPercent) / 100);
      setAppliedDiscount(discount);
      showToast({
        type: 'success',
        title: 'Kupon Berhasil Diterapkan!',
        message: `Diskon ${settings.promoDiscountPercent}% (${formatRupiah(discount)}) berhasil dipotong.`,
      });
    } else {
      showToast({
        type: 'error',
        title: 'Kode Promo Tidak Valid',
        message: 'Periksa kembali kode promo yang Anda masukkan.',
      });
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim() || !shippingCity.trim()) {
      showToast({
        type: 'warning',
        title: 'Data Belum Lengkap',
        message: 'Mohon lengkapi nama, nomor telepon, alamat, dan kota pengiriman.',
      });
      return;
    }

    if (items.length === 0) {
      showToast({
        type: 'error',
        title: 'Keranjang Kosong',
        message: 'Tambahkan setidaknya 1 produk sebelum melakukan checkout.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        price: i.product.discountPrice ?? i.product.price,
        quantity: i.quantity,
        image: i.product.images[0],
        selectedVariants: i.selectedVariants,
      }));

      const newOrder = orderService.createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        shippingAddress: shippingAddress.trim(),
        shippingCity: shippingCity.trim(),
        shippingPostalCode: shippingPostalCode.trim() || '00000',
        shippingCourier,
        shippingCost,
        paymentMethod,
        items: orderItems,
        subtotal,
        discount: appliedDiscount,
        total: totalAmount,
        notes: orderNotes.trim() || undefined,
      });

      clearCart();
      setCheckoutOpen(false);
      onSuccess(newOrder);

      showToast({
        type: 'success',
        title: 'Pesanan Berhasil Dibuat!',
        message: `Nomor Pesanan: ${newOrder.id}. Terima kasih telah berbelanja!`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Gagal Membuat Pesanan',
        message: err.message || 'Terjadi gangguan saat memproses pesanan.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* HEADER */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-ocean-100 dark:bg-ocean-950 text-ocean-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Checkout Pesanan
              </h2>
              <p className="text-xs text-slate-500">Lengkapi data pengiriman dan pilih metode pembayaran</p>
            </div>
          </div>
          <button
            onClick={() => setCheckoutOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto flex-1 p-4 sm:p-6 md:p-8 space-y-6">
          {/* SECTION 1: CUSTOMER DATA */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-ocean-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              Informasi Pembeli & Penerima
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rian Pratama"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor WhatsApp / HP *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email (Opsional, untuk konfirmasi resi)
                </label>
                <input
                  type="email"
                  placeholder="email@contoh.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: SHIPPING ADDRESS */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-ocean-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              Alamat Pengiriman
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alamat Lengkap & Patokan Jalan *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan..."
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kota / Kabupaten *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jakarta Selatan"
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    placeholder="12345"
                    value={shippingPostalCode}
                    onChange={(e) => setShippingPostalCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: COURIER SELECTION */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-ocean-600 text-white text-xs flex items-center justify-center font-bold">3</span>
              Pilihan Jasa Ekspedisi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {courierOptions.map((courier) => {
                const isSelected = shippingCourier === courier.name;
                const costDisplay = isFreeShipping ? 'Gratis Ongkir' : formatRupiah(courier.cost);

                return (
                  <label
                    key={courier.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-ocean-600 bg-ocean-50/60 dark:bg-ocean-950/40 ring-1 ring-ocean-600'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="courier"
                        checked={isSelected}
                        onChange={() => setShippingCourier(courier.name)}
                        className="text-ocean-600 focus:ring-ocean-500"
                      />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {courier.name}
                      </span>
                    </div>
                    <span className={`text-xs font-bold ${isFreeShipping ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}`}>
                      {costDisplay}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: PAYMENT METHOD (SIMULATION) */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-ocean-600 text-white text-xs flex items-center justify-center font-bold">4</span>
              Metode Pembayaran (Simulasi Resmi)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {['Transfer Bank BCA', 'QRIS Instan', 'Bayar di Tempat (COD)'].map((method) => {
                const isSelected = paymentMethod === method;
                return (
                  <label
                    key={method}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-ocean-600 bg-ocean-50/60 dark:bg-ocean-950/40 ring-1 ring-ocean-600'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={isSelected}
                      onChange={() => setPaymentMethod(method)}
                      className="text-ocean-600 focus:ring-ocean-500"
                    />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {method}
                    </span>
                  </label>
                );
              })}
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              * Mode simulasi transaksi: instruksi pembayaran akan otomatis tercatat di sistem toko tanpa memotong saldo nyata.
            </p>
          </div>

          {/* SECTION 5: PROMO CODE & NOTES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kupon Promo Diskon
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Contoh: SEABREEZE"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs uppercase text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                >
                  Terapkan
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Catatan Tambahan untuk Admin
              </label>
              <input
                type="text"
                placeholder="Contoh: Packing kado, telepon dulu sebelum antar"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>
          </div>

          {/* ORDER ITEMS SUMMARY ACCORDION */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
            <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-700">
              <span>Ringkasan {items.length} Barang</span>
              <span>Subtotal</span>
            </div>
            {items.map((i, idx) => (
              <div key={idx} className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="truncate max-w-[240px]">
                  {i.quantity}x {i.product.name}
                </span>
                <span className="font-medium">
                  {formatRupiah((i.product.discountPrice ?? i.product.price) * i.quantity)}
                </span>
              </div>
            ))}

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Subtotal Barang:</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Potongan Kupon Promo:</span>
                  <span>-{formatRupiah(appliedDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Ongkos Kirim ({shippingCourier.split(' ')[0]}):</span>
                <span>{isFreeShipping ? 'GRATIS' : formatRupiah(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-extrabold text-ocean-700 dark:text-ocean-300 pt-1 border-t border-slate-200 dark:border-slate-700">
                <span>Total Pembayaran:</span>
                <span>{formatRupiah(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-ocean-600 hover:bg-ocean-700 active:scale-[0.99] text-white shadow-lg shadow-ocean-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{isSubmitting ? 'Memproses Pesanan...' : 'KONFIRMASI & BUAT PESANAN'}</span>
            </button>
            <p className="mt-2 text-center text-[11px] text-slate-400">
              Dengan mengonfirmasi pesanan, Anda setuju dengan ketentuan belanja terpercaya JOSJISMART.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
