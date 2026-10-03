import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { formatRupiah, formatDate } from '../../utils/formatters';
import {
  ShoppingBag,
  Search,
  Eye,
  Trash2,
  X,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { OrderRespondModal } from './OrderRespondModal';

interface AdminOrdersViewProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const AdminOrdersView: React.FC<AdminOrdersViewProps> = ({
  orders,
  onUpdateStatus,
  onDeleteOrder,
}) => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [respondOrder, setRespondOrder] = useState<Order | null>(null);
  const [notesInput, setNotesInput] = useState('');

  const statusOptions: OrderStatus[] = ['Menunggu', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'];

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    onUpdateStatus(orderId, newStatus);
    showToast({
      type: 'success',
      title: 'Status Pesanan Diubah',
      message: `Status pesanan ${orderId} kini menjadi "${newStatus}".`,
    });
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleSaveNotes = () => {
    if (!selectedOrder) return;
    onUpdateStatus(selectedOrder.id, selectedOrder.status, notesInput);
    setSelectedOrder({ ...selectedOrder, notes: notesInput });
    showToast({
      type: 'success',
      title: 'Catatan Pesanan Disimpan',
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Kelola Pesanan Pelanggan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Perbarui proses pengemasan, pengiriman, dan status pembayaran pesanan masuk.
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari ID pesanan, nama pembeli, atau nomor telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
        >
          <option value="all">Semua Status</option>
          {statusOptions.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">No. Pesanan</th>
                <th className="py-3.5 px-4">Pelanggan</th>
                <th className="py-3.5 px-4">Kurir & Kota</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status Pesanan</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p>Tidak ada pesanan yang sesuai.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-700/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-ocean-600 dark:text-ocean-400">
                      {ord.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {ord.customerName}
                      </div>
                      <span className="text-[11px] text-slate-400">{ord.customerPhone}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      <div>{ord.shippingCity}</div>
                      <span className="text-[10px] text-slate-400">{ord.shippingCourier}</span>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                      {formatRupiah(ord.total)}
                    </td>

                    {/* STATUS DROPDOWN SELECTOR */}
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          handleStatusChange(ord.id, e.target.value as OrderStatus)
                        }
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                          ord.status === 'Selesai'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                            : ord.status === 'Dikirim'
                            ? 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300'
                            : ord.status === 'Dibatalkan'
                            ? 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-slate-400">
                      {formatDate(ord.createdAt)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setRespondOrder(ord)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95"
                          title="Respon & Hubungi Pembeli"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Respon</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setNotesInput(ord.notes || '');
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-ocean-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Rincian Lengkap Pesanan"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteOrder(ord.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Hapus Pesanan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAIL INVOICE MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
              <div>
                <span className="font-mono text-xs font-bold text-ocean-600">
                  INVOICE: {selectedOrder.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Rincian Pesanan
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* CUSTOMER & SHIPPING BOX */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <span>{selectedOrder.customerName}</span>
                  <span className="text-slate-400 font-normal">({selectedOrder.customerPhone})</span>
                </div>
                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-ocean-600 shrink-0 mt-0.5" />
                  <span>
                    {selectedOrder.shippingAddress}, {selectedOrder.shippingCity} ({selectedOrder.shippingPostalCode})
                  </span>
                </div>
                <div className="text-slate-500 pt-1 text-xs">
                  Kurir: <strong>{selectedOrder.shippingCourier}</strong> • Pembayaran: <strong>{selectedOrder.paymentMethod}</strong>
                </div>
              </div>

              {/* ITEMS LIST */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border-y border-slate-100 dark:border-slate-800 py-2">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={it.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{it.productName}</p>
                        <span className="text-[11px] text-slate-400">
                          {it.quantity}x @ {formatRupiah(it.price)}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatRupiah(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* TOTALS */}
              <div className="space-y-1 text-xs pt-1">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>{formatRupiah(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Diskon Kupon:</span>
                    <span>-{formatRupiah(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Ongkos Kirim:</span>
                  <span>{formatRupiah(selectedOrder.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-ocean-700 dark:text-ocean-300 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Tagihan:</span>
                  <span>{formatRupiah(selectedOrder.total)}</span>
                </div>
              </div>

              {/* STATUS & NOTES */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ubah Status:
                  </label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Catatan Internal Admin / Resi Kurir:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Contoh: Resi SiCepat: 004128919283"
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
                    />
                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      className="px-4 py-2 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white font-bold text-xs"
                    >
                      Simpan Catatan
                    </button>
                  </div>
                </div>

                {/* QUICK ACTION TO RESPOND */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRespondOrder(selectedOrder);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Hubungi & Respon Pembeli ({selectedOrder.customerName})</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* RESPOND MODAL */}
      <OrderRespondModal
        order={respondOrder}
        onClose={() => setRespondOrder(null)}
        onUpdateStatus={(orderId, status, notes) => {
          onUpdateStatus(orderId, status, notes);
          if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder({ ...selectedOrder, status, notes: notes ?? selectedOrder.notes });
          }
        }}
      />
    </div>
  );
};
