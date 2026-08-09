import { useState, useEffect } from 'react';
import { getProducts, saveProduct, deleteProduct, toggleProductVisibility, getProductTypes, addProductType } from '../../services/dataStore';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';

const emptyMessage = 'Please fill in the required product details before saving.';

const defaultProduct = {
  id: '',
  name: '',
  category: 'Veg',
  productType: '',
  quantityType: 'Weight',
  pricePerUnit: 0,
  variants: [],
  spiceLevel: 'Medium',
  description: '',
  ingredients: '',
  shelfLife: '',
  discountPrice: 0,
  bulkPrice: 0,
  stockQuantity: 0,
  inStock: false,
  bestSeller: false,
  newArrival: false,
  visible: true,
  image: '',
  additionalImages: []
};

const measurementTypes = ['Weight', 'Volume', 'Pieces', 'Box', 'Size', 'Custom'];

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(defaultProduct);
  const [previewImages, setPreviewImages] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [newType, setNewType] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setProducts(await getProducts());
      setProductTypes(getProductTypes());
    };
    loadProducts();
  }, []);

  const handleAddType = (e) => {
    e.preventDefault();
    if (newType.trim() && !productTypes.includes(newType.trim())) {
      addProductType(newType.trim());
      setProductTypes(getProductTypes());
      setNewType('');
    }
  };

  const refreshProducts = async () => setProducts(await getProducts());

  const handleEdit = (product) => {
    setFormData({
      ...product,
      quantityType: product.quantityType || 'Weight',
      pricePerUnit: Number(product.pricePerUnit ?? product.weights?.[0]?.price) || 0,
      variants: Array.isArray(product.variants)
        ? product.variants
        : Array.isArray(product.weights)
        ? product.weights.map((w) => ({ label: w.weight, price: w.price }))
        : [],
    });
    setPreviewImages(product.additionalImages || []);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setFormData(defaultProduct);
    setPreviewImages([]);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const success = await deleteProduct(id);
      if (success) {
        await refreshProducts();
      } else {
        window.alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError('');

    if (!formData.name.trim() || !formData.description.trim() || !formData.image.trim() || Number(formData.pricePerUnit) <= 0) {
      setSaveError('Please fill in all required product details and set a valid unit price.');
      return;
    }

    setIsSaving(true);
    try {
      // Prepare payload: ensure `variants` are present and legacy `weights` are derived
      const payload = {
        ...formData,
        additionalImages: previewImages.filter(Boolean),
        inStock: Number(formData.stockQuantity) > 0,
        // ensure backend compatibility: map variants -> weights will be handled by dataStore
      };
      await saveProduct(payload);
      await refreshProducts();
      setIsEditing(false);
      setSaveError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save product right now.';
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleVariantChange = (index, field, value) => {
    const next = [...(formData.variants || [])];
    next[index] = { ...(next[index] || {}), [field]: field === 'price' ? Number(value) : value };
    setFormData({ ...formData, variants: next });
  };

  const addVariantRow = () => {
    setFormData({ ...formData, variants: [...(formData.variants || []), { label: '', price: 0 }] });
  };

  const removeVariantRow = (index) => {
    const next = (formData.variants || []).filter((_, idx) => idx !== index);
    setFormData({ ...formData, variants: next });
  };

  const handleVisibilityToggle = async (id) => {
    await toggleProductVisibility(id);
    await refreshProducts();
  };

  if (isEditing) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-brand-cream border border-brand-gold/20 rounded-3xl p-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-serif text-brand-black">{formData.id ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="text-brand-black/60 mt-1">Update product details, pricing, stock and images. Changes reflect on customer pages immediately.</p>
          </div>
          <button onClick={() => setIsEditing(false)} className="text-brand-black/70 hover:text-brand-black">
            <X size={26} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <label className="block text-sm text-brand-cream/70">Product Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-brand-cream border border-brand-gold/30 rounded-2xl px-4 py-3 text-brand-black"
              />


              <label className="block text-sm text-brand-cream/70">Product Type</label>
              <select
                required
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                className="w-full bg-brand-cream border border-brand-gold/30 rounded-2xl px-4 py-3 text-brand-black"
              >
                <option value="">Select Type</option>
                {productTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  placeholder="Add new type (e.g. Masalas)"
                  className="flex-1 bg-brand-cream border border-brand-gold/30 rounded-2xl px-4 py-2 text-brand-black"
                />
                <button type="button" onClick={handleAddType} className="bg-brand-gold text-brand-black rounded-2xl px-4 py-2 font-semibold">Add</button>
              </div>

              <label className="block text-sm text-brand-cream/70 mt-4">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-brand-cream border border-brand-gold/30 rounded-2xl px-4 py-3 text-brand-black"
              >
                <option>Veg</option>
                <option>Non-Veg</option>
              </select>

              <label className="block text-sm text-brand-cream/70">Spice Level</label>
              <select
                value={formData.spiceLevel}
                onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value })}
                className="w-full bg-brand-cream border border-brand-gold/30 rounded-2xl px-4 py-3 text-brand-black"
              >
                <option>Mild</option>
                <option>Medium</option>
                <option>Hot</option>
                <option>Extra Hot</option>
              </select>

              <label className="block text-sm text-brand-cream/70">Main Image URL</label>
              <input
                required
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-brand-cream border border-brand-gold/30 rounded-2xl px-4 py-3 text-brand-black"
                placeholder="https://"
              />

              <div className="grid grid-cols-1 gap-4">
                <label className="block text-sm text-brand-cream/70">Additional Image URLs</label>
                <textarea
                  rows={3}
                  value={previewImages.join('\n')}
                  onChange={(e) => setPreviewImages(e.target.value.split('\n').map((url) => url.trim()))}
                  className="w-full bg-brand-cream border border-brand-gold/30 rounded-2xl px-4 py-3 text-brand-black resize-none"
                  placeholder="One URL per line"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm text-brand-cream/70">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-brand-cream border border-brand-gold/30 rounded-2xl px-4 py-3 text-brand-black resize-none"
              />

              <label className="block text-sm text-brand-cream/70">Ingredients</label>
              <textarea
                rows={2}
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                className="w-full bg-brand-cream border border-brand-gold/30 rounded-2xl px-4 py-3 text-brand-black resize-none"
              />

              <label className="block text-sm text-brand-cream/70">Shelf Life</label>
              <input
                type="text"
                value={formData.shelfLife}
                onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                className="w-full bg-brand-cream border border-brand-gold/30 rounded-2xl px-4 py-3 text-brand-black"
                placeholder="e.g. 6 months"
              />

              <div className="grid grid-cols-2 gap-4">
                <label className="block text-sm text-brand-cream/70">Discount Price</label>
                <input
                  type="number"
                  min="0"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                  className="w-full bg-brand-cream border border-brand-gold/30 rounded-2xl px-4 py-3 text-brand-black"
                />
              </div>

              <label className="block text-sm text-brand-cream/70">Bulk Order Price</label>
              <input
                type="number"
                min="0"
                value={formData.bulkPrice}
                onChange={(e) => setFormData({ ...formData, bulkPrice: Number(e.target.value) })}
                className="w-full bg-brand-cream border border-brand-gold/30 rounded-2xl px-4 py-3 text-brand-black"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
              <div>
                <label className="block text-sm text-brand-cream/70 mb-2">Measurement Type</label>
                <select
                  value={formData.quantityType}
                  onChange={(e) => setFormData({ ...formData, quantityType: e.target.value })}
                  className="w-full bg-brand-cream border border-brand-gold/30 rounded-2xl px-4 py-3 text-brand-black"
                >
                  {measurementTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-brand-cream/70 mb-2">Unit Price</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.pricePerUnit}
                  onChange={(e) => setFormData({ ...formData, pricePerUnit: Number(e.target.value) })}
                  className="w-full bg-brand-cream border border-brand-gold/30 rounded-2xl px-4 py-3 text-brand-black"
                />
              </div>
            </div>
            <p className="text-xs text-brand-cream/60">New products use a unit-based pricing model. Legacy products with existing variants will continue to work.</p>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-brand-cream/70 mb-2">Variants (Pack options)</label>
            <div className="space-y-2">
              {(formData.variants || []).map((v, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Label (e.g. 250g, 500ml, 6 Pieces)"
                    value={v.label}
                    onChange={(e) => handleVariantChange(idx, 'label', e.target.value)}
                    className="flex-1 bg-brand-cream border border-brand-gold/30 rounded-2xl px-3 py-2 text-brand-black"
                  />
                  <input
                    type="number"
                    min="0"
                    value={v.price}
                    onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                    className="w-28 bg-brand-cream border border-brand-gold/30 rounded-2xl px-3 py-2 text-brand-black"
                  />
                  <button type="button" onClick={() => removeVariantRow(idx)} className="text-sm text-rose-600">Remove</button>
                </div>
              ))}
              <div>
                <button type="button" onClick={addVariantRow} className="px-3 py-2 rounded-2xl bg-brand-gold text-brand-black font-semibold">Add Variant</button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-brand-cream/70 mb-2">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value), inStock: Number(e.target.value) > 0 })}
                className="w-full bg-brand-cream border border-brand-gold/30 rounded-2xl px-4 py-3 text-brand-black"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="block text-sm text-brand-cream/70">Visibility</label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, visible: true })}
                  className={`rounded-2xl px-4 py-3 border ${formData.visible ? 'border-brand-gold bg-brand-gold/10 text-brand-black' : 'border-white/10 text-brand-cream'}`}
                >
                  Visible
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, visible: false })}
                  className={`rounded-2xl px-4 py-3 border ${!formData.visible ? 'border-brand-red bg-brand-red/10 text-brand-red' : 'border-white/10 text-brand-cream'}`}
                >
                  Hidden
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 text-brand-cream/70">
              <input
                type="checkbox"
                checked={formData.bestSeller}
                onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                className="h-5 w-5 rounded border border-brand-gold/30 bg-brand-cream/10"
              />
              Best Seller
            </label>
            <label className="flex items-center gap-3 text-brand-cream/70">
              <input
                type="checkbox"
                checked={formData.newArrival}
                onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                className="h-5 w-5 rounded border border-brand-gold/30 bg-brand-cream/10"
              />
              New Arrival
            </label>
            <label className="flex items-center gap-3 text-brand-cream/70">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked, stockQuantity: e.target.checked ? formData.stockQuantity || 1 : 0 })}
                className="h-5 w-5 rounded border border-brand-gold/30 bg-brand-cream/10"
              />
              In Stock
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-sm text-brand-cream/70 mb-2">Preview Image</p>
              <div className="rounded-3xl border border-brand-gold/20 overflow-hidden bg-brand-cream h-44 flex items-center justify-center">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-brand-cream/50">No image URL provided</div>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-brand-cream/70 mb-2">Additional Images</p>
              <div className="grid grid-cols-2 gap-3">
                {previewImages.filter(Boolean).map((src, index) => (
                  <img key={index} src={src} alt={`Extra ${index + 1}`} className="h-24 w-full object-cover rounded-2xl border border-white/10" />
                ))}
              </div>
            </div>
          </div>

          {saveError ? (
            <div className="rounded-2xl border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-sm text-brand-red">
              {saveError}
            </div>
          ) : null}

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-serif text-brand-cream">Manage Products</h2>
          <p className="text-brand-cream/60 mt-2">Add, edit, and update all store products with pricing, stock, and visibility settings.</p>
        </div>
        <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
          <Button variant="outline" onClick={handleCreate} className="py-2.5 px-5 bg-brand-gold text-brand-black hover:bg-brand-gold-light font-bold flex items-center gap-2 rounded-2xl shadow-md">
            <Plus size={18} /> Add New Product
          </Button>
        </motion.div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-brand-matte">
        <table className="w-full text-left text-sm text-brand-cream/80">
          <thead className="text-xs uppercase bg-brand-gold/10 border-b border-brand-gold/20 text-brand-black">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Primary Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <motion.tr 
                key={product.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/10 hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <img src={product.image} className="w-14 h-14 object-cover rounded-xl" alt={product.name} />
                </td>
                <td className="px-6 py-4 font-medium text-brand-cream">{product.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.category === 'Veg' ? 'bg-green-900/60 text-green-300' : 'bg-red-900/60 text-red-300'}`}>
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4">{product.pricePerUnit ? `₹${product.pricePerUnit} / ${product.quantityType || 'Unit'}` : Array.isArray(product.weights) && product.weights[0] ? `${product.weights[0].weight} · ₹${product.weights[0].price}` : '—'}</td>
                <td className="px-6 py-4">{product.stockQuantity}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${product.visible ? 'bg-brand-gold/10 text-brand-gold' : 'bg-brand-red/10 text-brand-red'}`}>
                    {product.visible ? 'Visible' : 'Hidden'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex flex-wrap justify-end gap-2">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleVisibilityToggle(product.id)} className="rounded-2xl border border-brand-gold/20 bg-brand-gold/10 px-3 py-2 text-xs font-semibold text-brand-black hover:bg-brand-gold/20 transition-colors">
                    {product.visible ? 'Hide' : 'Show'}
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleEdit(product)} className="rounded-2xl bg-brand-gold/10 px-3 py-2 text-xs font-semibold text-brand-gold hover:bg-brand-gold/20 transition-colors flex items-center gap-2">
                    <Edit2 size={14} /> Edit
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleDelete(product.id)} className="rounded-2xl bg-brand-red/10 px-3 py-2 text-xs font-semibold text-brand-red hover:bg-brand-red/20 transition-colors flex items-center gap-2">
                    <Trash2 size={14} /> Delete
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;
