import React, { useState, useEffect } from 'react';
import { Product, Category, Specification, ProductVariant, ProductStatus } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  X,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Check,
  Package,
} from 'lucide-react';

interface AdminProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  initialProduct?: Product | null;
  onSave: (productData: any) => void;
}

export const AdminProductFormModal: React.FC<AdminProductFormModalProps> = ({
  isOpen,
  onClose,
  categories,
  initialProduct,
  onSave,
}) => {
  const { showToast } = useToast();

  // Basic info
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [discountPrice, setDiscountPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>(200);
  const [status, setStatus] = useState<ProductStatus>('available');
  const [isFeatured, setIsFeatured] = useState(false);
  const [description, setDescription] = useState('');

  // Images
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Specifications
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantOptions, setNewVariantOptions] = useState('');

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setCategoryId(initialProduct.categoryId);
      setPrice(initialProduct.price);
      setDiscountPrice(initialProduct.discountPrice ?? '');
      setStock(initialProduct.stock);
      setWeight(initialProduct.weight);
      setStatus(initialProduct.status);
      setIsFeatured(initialProduct.isFeatured);
      setDescription(initialProduct.description);
      setImages([...initialProduct.images]);
      setSpecifications(initialProduct.specifications ? [...initialProduct.specifications] : []);
      setVariants(initialProduct.variants ? [...initialProduct.variants] : []);
    } else {
      setName('');
      setCategoryId(categories[0]?.id || '');
      setPrice('');
      setDiscountPrice('');
      setStock(10);
      setWeight(200);
      setStatus('available');
      setIsFeatured(false);
      setDescription('');
      setImages([
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      ]);
      setSpecifications([
        { label: 'Bahan', value: 'Katun Alami Kualitas Ekspor' },
        { label: 'Garansi', value: 'Garansi Tukar 7 Hari' },
      ]);
      setVariants([]);
    }
  }, [initialProduct, categories, isOpen]);

  if (!isOpen) return null;

  // Handle local image file upload with size & format validation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSizeBytes = 3 * 1024 * 1024; // 3MB

    if (!allowedTypes.includes(file.type)) {
      showToast({
        type: 'error',
        title: 'Format File Tidak Didukung',
        message: 'Gunakan format JPG, PNG, atau WebP.',
      });
      return;
    }

    if (file.size > maxSizeBytes) {
      showToast({
        type: 'error',
        title: 'Ukuran Terlalu Besar',
        message: 'Maksimum ukuran foto produk adalah 3 MB.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setImages((prev) => [...prev, result]);
        showToast({
          type: 'success',
          title: 'Foto Berhasil Diunggah',
          message: 'Foto produk berhasil ditambahkan ke galeri.',
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSpecification = () => {
    if (!newSpecKey.trim() || !newSpecVal.trim()) return;
    setSpecifications((prev) => [...prev, { label: newSpecKey.trim(), value: newSpecVal.trim() }]);
    setNewSpecKey('');
    setNewSpecVal('');
  };

  const handleRemoveSpecification = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    if (!newVariantName.trim() || !newVariantOptions.trim()) return;
    const optionsArray = newVariantOptions
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setVariants((prev) => [
      ...prev,
      { name: newVariantName.trim(), options: optionsArray },
    ]);
    setNewVariantName('');
    setNewVariantOptions('');
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast({ type: 'warning', title: 'Nama Produk Wajib Diisi' });
      return;
    }

    if (price === '' || Number(price) <= 0) {
      showToast({ type: 'warning', title: 'Harga Produk Wajib Valid' });
      return;
    }

    if (images.length === 0) {
      showToast({ type: 'warning', title: 'Minimal unggah 1 foto produk' });
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId) || categories[0];

    const productPayload = {
      name: name.trim(),
      categoryId: selectedCategory?.id || 'cat-general',
      categoryName: selectedCategory?.name || 'Umum',
      price: Number(price),
      discountPrice: discountPrice !== '' && Number(discountPrice) > 0 ? Number(discountPrice) : undefined,
      stock: Number(stock) || 0,
      weight: Number(weight) || 0,
      status,
      isFeatured,
      description: description.trim(),
      images,
      specifications,
      variants,
    };

    onSave(productPayload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* HEADER */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-ocean-100 dark:bg-ocean-950 text-ocean-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {initialProduct ? 'Edit Informasi Produk' : 'Tambah Produk Baru'}
              </h2>
              <p className="text-xs text-slate-500">Kelola rincian stok, harga, foto, dan deskripsi toko</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-4 sm:p-6 md:p-8 space-y-6">
          
          {/* SECTION: FOTO PRODUK */}
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Galeri Foto Produk *
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Unggah file dari perangkat (maks. 3MB) atau tambahkan URL gambar langsung.
            </p>

            {/* PREVIEW THUMBNAILS */}
            <div className="flex flex-wrap gap-3 mb-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group"
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute inset-0 bg-rose-900/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Hapus foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* UPLOAD BUTTON */}
              <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-ocean-500 flex flex-col items-center justify-center text-slate-400 hover:text-ocean-600 cursor-pointer transition-colors">
                <Upload className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-semibold">Upload</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* ADD VIA URL */}
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Atau tempel tautan gambar (https://...)"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                + Tambah URL
              </button>
            </div>
          </div>

          {/* SECTION: BASIC INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Produk *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Kemeja Linen Tropis Ocean Breeze"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kategori *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status Ketersediaan
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              >
                <option value="available">Tersedia (Ready Stock)</option>
                <option value="preorder">Pre-Order</option>
                <option value="out_of_stock">Stok Habis</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Harga Normal (Rp) *
              </label>
              <input
                type="number"
                required
                min={0}
                placeholder="Contoh: 250000"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Harga Diskon (Rp, Opsional)
              </label>
              <input
                type="number"
                min={0}
                placeholder="Kosongkan jika tidak diskon"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Jumlah Stok (Pcs) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Berat Produk (Gram) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={weight}
                onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <div className="sm:col-span-2 pt-1 flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeaturedToggle"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-ocean-600 focus:ring-ocean-500"
              />
              <label htmlFor="isFeaturedToggle" className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                Tampilkan sebagai Produk Unggulan di Halaman Utama (Featured)
              </label>
            </div>
          </div>

          {/* SECTION: DESKRIPSI (WRITTEN NATURALLY BY ADMIN) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Deskripsi Lengkap Produk *
              </label>
              <span className="text-[11px] text-slate-400">
                Ditulis oleh admin (tanpa generator AI otomatis)
              </span>
            </div>
            <textarea
              required
              rows={4}
              placeholder="Tuliskan keunggulan, bahan, detail pemakaian, dan anjuran perawatan produk secara alami..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500 leading-relaxed"
            />
          </div>

          {/* SECTION: SPESIFIKASI */}
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Spesifikasi Produk (Key - Value)
            </label>
            <div className="space-y-2 mb-3">
              {specifications.map((spec, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 w-1/3 truncate">
                    {spec.label}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 flex-1 truncate">
                    {spec.value}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecification(i)}
                    className="p-1 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Label (mis: Bahan)"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                className="w-1/3 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
              <input
                type="text"
                placeholder="Nilai (mis: 100% Linen)"
                value={newSpecVal}
                onChange={(e) => setNewSpecVal(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
              <button
                type="button"
                onClick={handleAddSpecification}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                + Tambah
              </button>
            </div>
          </div>

          {/* SECTION: VARIAN */}
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Pilihan Varian (Ukuran / Warna / dsb)
            </label>
            <div className="space-y-2 mb-3">
              {variants.map((v, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mr-2">
                      {v.name}:
                    </span>
                    <span className="text-slate-500">
                      {v.options.join(', ')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(i)}
                    className="p-1 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nama Varian (mis: Ukuran)"
                value={newVariantName}
                onChange={(e) => setNewVariantName(e.target.value)}
                className="w-1/3 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
              <input
                type="text"
                placeholder="Opsi dipisah koma (mis: S, M, L, XL)"
                value={newVariantOptions}
                onChange={(e) => setNewVariantOptions(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                + Tambah
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Produk</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
