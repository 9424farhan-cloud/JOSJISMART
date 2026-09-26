import React, { useState } from 'react';
import { Product, Category } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Package,
} from 'lucide-react';

interface AdminProductsViewProps {
  products: Product[];
  categories: Category[];
  onOpenAddModal: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onPreviewProduct: (product: Product) => void;
  onQuickUpdateStock: (productId: string, newStock: number) => void;
}

export const AdminProductsView: React.FC<AdminProductsViewProps> = ({
  products,
  categories,
  onOpenAddModal,
  onEditProduct,
  onDeleteProduct,
  onPreviewProduct,
  onQuickUpdateStock,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || p.categoryId === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-5">
      {/* HEADER & ADD BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Kelola Katalog Produk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Total {products.length} produk tersimpan dalam database toko.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Produk</span>
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari nama atau deskripsi barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Foto</th>
                <th className="py-3.5 px-4">Nama Produk</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga</th>
                <th className="py-3.5 px-4">Stok</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p>Tidak ada produk yang cocok dengan pencarian.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr
                    key={prod.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-700/40 transition-colors"
                  >
                    {/* PHOTO */}
                    <td className="py-3 px-4">
                      <img
                        src={prod.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                    </td>

                    {/* NAME */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-xs">
                        {prod.name}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {prod.variants.length > 0 ? `${prod.variants.length} Varian` : 'Tanpa varian'}
                        {prod.isFeatured && ' • ⭐ Unggulan'}
                      </span>
                    </td>

                    {/* CATEGORY */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      <span className="px-2 py-1 rounded-md bg-ocean-50 dark:bg-ocean-950/60 text-ocean-700 dark:text-ocean-300 text-xs font-medium">
                        {prod.categoryName}
                      </span>
                    </td>

                    {/* PRICE */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {formatRupiah(prod.discountPrice ?? prod.price)}
                      </div>
                      {prod.discountPrice && (
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatRupiah(prod.price)}
                        </span>
                      )}
                    </td>

                    {/* STOCK (QUICK EDIT) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0}
                          value={prod.stock}
                          onChange={(e) =>
                            onQuickUpdateStock(prod.id, Math.max(0, parseInt(e.target.value) || 0))
                          }
                          className="w-16 px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-center font-bold"
                        />
                        <span className="text-[11px] text-slate-400">pcs</span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="py-3 px-4">
                      {prod.stock === 0 || prod.status === 'out_of_stock' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                          <AlertTriangle className="w-3 h-3" />
                          Habis
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          Tersedia
                        </span>
                      )}
                    </td>

                    {/* ACTION */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onPreviewProduct(prod)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-ocean-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Lihat Pratinjau Produk"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditProduct(prod)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Edit Produk"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(prod.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Hapus Produk"
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
    </div>
  );
};
