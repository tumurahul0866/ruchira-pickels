import { useState, useEffect } from 'react';
import { refreshProducts as fetchLatestProducts, saveProduct, deleteProduct, toggleProductVisibility, getProductTypes, addProductType, deleteProductType, getComboProductUnit, getProductVariants } from '../../services/dataStore';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';

const defaultProduct = {
  id: '',
  name: '',
  category: 'Veg',
  productType: '',
  comboProductIds: [],
  comboProductQuantities: {},
  comboProductVariants: {},
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

const getComboMembers = (combo, products) => {
  const selectedIds = Array.isArray(combo.comboProductIds) ? combo.comboProductIds.map(String) : [];
  const expandedProducts = Array.isArray(combo.comboProducts) ? combo.comboProducts : [];
  return selectedIds.map((id) => {
    const product = products.find((candidate) => String(candidate.id) === id);
    const expandedProduct = expandedProducts.find((candidate) => String(candidate.id) === id);
    if (!product && !expandedProduct) return null;

    const source = product || expandedProduct;
    const variants = getProductVariants(source);
    const variantLabel = combo.comboProductVariants?.[id] ||
      expandedProduct?.variantLabel ||
      variants[0]?.label ||
      '';
    const selectedVariant = variants.find((variant) => variant.label === variantLabel) || variants[0];
    return {
      ...source,
      ...expandedProduct,
      variantLabel,
      price: Number(expandedProduct?.price) || selectedVariant?.price || 0,
      quantity: Number(combo.comboProductQuantities?.[id]) || 1,
      unit: getComboProductUnit(source),
    };
  }).filter(Boolean);
};

const ManageProducts = ({ mode = 'products' }) => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(defaultProduct);
  const [previewImages, setPreviewImages] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [newType, setNewType] = useState('');
  const [productTypeError, setProductTypeError] = useState('');
  const [comboProductCategory, setComboProductCategory] = useState('All categories');
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setProducts(await fetchLatestProducts());
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

  const handleDeleteProductType = async (type) => {
    const assignedCount = products.filter(
      (product) => String(product.productType || '').trim().toLowerCase() === type.trim().toLowerCase()
    ).length;
    if (assignedCount > 0) {
      setProductTypeError(`Reassign the ${assignedCount} product${assignedCount === 1 ? '' : 's'} using "${type}" before deleting it.`);
      return;
    }
    if (!window.confirm(`Delete the product type "${type}"?`)) return;

    setProductTypeError('');
    try {
      setProductTypes(await deleteProductType(type));
    } catch (error) {
      setProductTypeError(error instanceof Error ? error.message : 'Unable to delete this product type.');
    }
  };

  const refreshProducts = async () => setProducts(await fetchLatestProducts());

  const handleEdit = (product) => {
    setFormData({
      ...product,
      quantityType: product.quantityType || 'Weight',
      comboProductIds: Array.isArray(product.comboProductIds)
        ? product.comboProductIds.map(String)
        : Array.isArray(product.comboProducts)
        ? product.comboProducts.map((includedProduct) => String(includedProduct.id))
        : [],
      comboProductQuantities: product.comboProductQuantities &&
        typeof product.comboProductQuantities === 'object' &&
        Object.keys(product.comboProductQuantities).length > 0
        ? product.comboProductQuantities
        : Object.fromEntries((product.comboProducts || []).map((includedProduct) => [
          String(includedProduct.id),
          Number(includedProduct.quantity) || 1,
        ])),
      comboProductVariants: product.comboProductVariants &&
        typeof product.comboProductVariants === 'object' &&
        Object.keys(product.comboProductVariants).length > 0
        ? product.comboProductVariants
        : Object.fromEntries((product.comboProducts || []).map((includedProduct) => [
          String(includedProduct.id),
          includedProduct.variantLabel || getProductVariants(
            products.find((candidate) => String(candidate.id) === String(includedProduct.id)) || includedProduct
          )[0]?.label || '',
        ])),
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

  const handleCreateCombo = () => {
    setFormData({
      ...defaultProduct,
      category: 'Combo',
      productType: 'Combos',
      comboProductIds: [],
      comboProductVariants: {},
      quantityType: 'Combo',
      spiceLevel: 'N/A',
      description: 'A hand-picked combo of our favourite products.',
    });
    setPreviewImages([]);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const success = await deleteProduct(id);
        if (!success) throw new Error('Failed to delete product.');
        await refreshProducts();
      } catch (error) {
        window.alert(error instanceof Error ? error.message : 'Failed to delete product. Please try again.');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError('');

    const isCombo = formData.productType === 'Combos';
    if (isCombo && new Set(formData.comboProductIds.map(String)).size < 2) {
      setSaveError('Select at least two different products for this combo.');
      return;
    }
    if (isCombo) {
      const productsWithoutValidPack = formData.comboProductIds
        .map(String)
        .map((id) => selectableProducts.find((product) => String(product.id) === id))
        .filter((product) => product && !getProductVariants(product).some(
          (variant) => variant.label === formData.comboProductVariants?.[String(product.id)]
        ));
      if (productsWithoutValidPack.length > 0) {
        setSaveError(`Choose a pack size for each included product: ${productsWithoutValidPack.map((product) => product.name).join(', ')}.`);
        return;
      }
    }
    if (!formData.name.trim() || !formData.description.trim() || !formData.image.trim() || Number(formData.pricePerUnit) <= 0) {
      setSaveError('Please fill in all required product details and set a valid unit price.');
      return;
    }

    setIsSaving(true);
    try {
      // Prepare payload: ensure `variants` are present and legacy `weights` are derived
      const payload = {
        ...formData,
        category: isCombo ? 'Combo' : formData.category,
        productType: isCombo ? 'Combos' : formData.productType,
        quantityType: isCombo ? 'Combo' : formData.quantityType,
        comboProductIds: isCombo ? [...new Set(formData.comboProductIds.map(String))] : [],
        comboProductQuantities: isCombo
          ? Object.fromEntries([...new Set(formData.comboProductIds.map(String))].map((id) => [
            id,
            Math.max(1, Math.floor(Number(formData.comboProductQuantities?.[id]) || 1)),
          ]))
          : {},
        comboProductVariants: isCombo
          ? Object.fromEntries([...new Set(formData.comboProductIds.map(String))].map((id) => [
            id,
            String(formData.comboProductVariants?.[id] || ''),
          ]))
          : {},
        variants: isCombo ? [] : formData.variants,
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

  const isCombo = formData.productType === 'Combos';
  const isCombosPage = mode === 'combos';
  const listedProducts = isCombosPage
    ? products.filter((product) => String(product.productType || '').trim().toLowerCase() === 'combos')
    : products.filter((product) => String(product.productType || '').trim().toLowerCase() !== 'combos');
  const selectableProducts = products.filter((product) => (
    String(product.id) !== String(formData.id) &&
    String(product.productType || '').trim().toLowerCase() !== 'combos'
  ));
  const comboProductCategories = [...new Set(selectableProducts.map((product) => product.category).filter(Boolean))];
  const filteredComboProducts = comboProductCategory === 'All categories'
    ? selectableProducts
    : selectableProducts.filter((product) => product.category === comboProductCategory);
  const selectedComboIds = formData.comboProductIds.map(String);
  const allFilteredProductsSelected = filteredComboProducts.length > 0 &&
    filteredComboProducts.every((product) => selectedComboIds.includes(String(product.id)));

  const toggleComboProduct = (productId, checked) => {
    const id = String(productId);
    const nextIds = checked
      ? [...new Set([...selectedComboIds, id])]
      : selectedComboIds.filter((selectedId) => selectedId !== id);
    const nextQuantities = { ...formData.comboProductQuantities };
    const nextVariants = { ...formData.comboProductVariants };
    if (checked) {
      if (!Number(nextQuantities[id])) nextQuantities[id] = 1;
      if (!nextVariants[id]) nextVariants[id] = '';
    } else {
      delete nextQuantities[id];
      delete nextVariants[id];
    }
    setFormData({
      ...formData,
      comboProductIds: nextIds,
      comboProductQuantities: nextQuantities,
      comboProductVariants: nextVariants,
    });
  };

  const toggleFilteredComboProducts = () => {
    const visibleIds = filteredComboProducts.map((product) => String(product.id));
    const nextIds = allFilteredProductsSelected
      ? selectedComboIds.filter((id) => !visibleIds.includes(id))
      : [...new Set([...selectedComboIds, ...visibleIds])];
    const nextQuantities = Object.fromEntries(nextIds.map((id) => [
      id,
      Number(formData.comboProductQuantities?.[id]) || 1,
    ]));
    const nextVariants = Object.fromEntries(nextIds.map((id) => [
      id,
      formData.comboProductVariants?.[id] || '',
    ]));
    setFormData({
      ...formData,
      comboProductIds: nextIds,
      comboProductQuantities: nextQuantities,
      comboProductVariants: nextVariants,
    });
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
            <h2 className="text-3xl font-serif text-brand-black">
              {isCombo ? (formData.id ? 'Edit Combo' : 'Create Product Combo') : (formData.id ? 'Edit Product' : 'Add New Product')}
            </h2>
            <p className="text-brand-black/60 mt-1">
              {isCombo
                ? 'Choose products for this bundle, set one combo price, and manage its stock.'
                : 'Update product details, pricing, stock and images. Changes reflect on customer pages immediately.'}
            </p>
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


              {isCombo ? (
                <div className="rounded-2xl border border-brand-gold/30 bg-brand-gold/10 px-4 py-3 text-sm font-bold text-brand-black">
                  Product Type: Combos
                </div>
              ) : (
                <>
                  <label className="block text-sm text-brand-cream/70">Product Type</label>
                  <select
                    required
                    value={formData.productType}
                    onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                    className="w-full bg-brand-cream border border-brand-gold/30 rounded-2xl px-4 py-3 text-brand-black"
                  >
                    <option value="">Select Type</option>
                    {productTypes.filter((type) => type.trim().toLowerCase() !== 'combos').map((type) => (
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
                  {productTypeError && (
                    <p role="alert" className="mt-2 text-xs font-semibold text-red-700">{productTypeError}</p>
                  )}
                  <div className="mt-3 space-y-2">
                    {productTypes
                      .filter((type) => type.trim().toLowerCase() !== 'combos')
                      .map((type) => {
                        const assignedCount = products.filter(
                          (product) => String(product.productType || '').trim().toLowerCase() === type.trim().toLowerCase()
                        ).length;
                        return (
                          <div key={type} className="flex items-center justify-between gap-3 rounded-xl border border-brand-gold/20 bg-white/60 px-3 py-2 text-sm text-brand-black">
                            <span>{type}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-brand-black/55">
                                {assignedCount > 0 ? `Used by ${assignedCount} product${assignedCount === 1 ? '' : 's'}` : 'Unused'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteProductType(type)}
                                disabled={assignedCount > 0}
                                aria-label={`Delete product type ${type}`}
                                title={assignedCount > 0 ? 'Reassign products before deleting this type' : `Delete ${type}`}
                                className="rounded-lg p-2 text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
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
                </>
              )}

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
              {isCombo && (
                <fieldset className="space-y-2 rounded-2xl border border-brand-gold/30 p-4">
                  <legend className="px-2 text-sm font-bold text-brand-black">Select multiple products for this combo</legend>
                  {selectableProducts.length > 0 && (
                    <>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <select
                          value={comboProductCategory}
                          onChange={(event) => setComboProductCategory(event.target.value)}
                          className="min-w-0 flex-1 rounded-xl border border-brand-gold/30 bg-white px-3 py-2 text-sm text-brand-black"
                          aria-label="Filter combo products by category"
                        >
                          <option>All categories</option>
                          {comboProductCategories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={toggleFilteredComboProducts}
                          className="rounded-xl border border-brand-gold/40 px-3 py-2 text-xs font-bold text-brand-black hover:bg-brand-gold/10"
                        >
                          {allFilteredProductsSelected ? 'Clear visible products' : 'Select all visible'}
                        </button>
                      </div>
                      <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                        {filteredComboProducts.map((product) => (
                    <div key={product.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-brand-gold/15 bg-white/50 px-3 py-2 text-sm text-brand-black">
                      <input
                        id={`combo-product-${product.id}`}
                        type="checkbox"
                        checked={selectedComboIds.includes(String(product.id))}
                        onChange={(event) => toggleComboProduct(product.id, event.target.checked)}
                        className="h-4 w-4 accent-brand-gold"
                      />
                      <label htmlFor={`combo-product-${product.id}`} className="min-w-0 flex-1 cursor-pointer">
                        <span className="block truncate">{product.name}</span>
                        <span className="block text-[11px] text-brand-black/55">{product.productType} · {product.category}</span>
                      </label>
                      {selectedComboIds.includes(String(product.id)) && (
                        <label className="flex items-center gap-2 text-xs font-semibold">
                          Pack and price
                          <select
                            required
                            value={formData.comboProductVariants?.[String(product.id)] || ''}
                            onChange={(event) => setFormData({
                              ...formData,
                              comboProductVariants: {
                                ...formData.comboProductVariants,
                                [String(product.id)]: event.target.value,
                              },
                            })}
                            className="max-w-52 rounded-lg border border-brand-gold/30 bg-white px-2 py-1 text-brand-black"
                            aria-label={`Pack and price for ${product.name}`}
                          >
                            <option value="" disabled>Select pack size</option>
                            {getProductVariants(product).map((variant) => (
                              <option key={variant.label} value={variant.label}>
                                {variant.label} - ₹{variant.price}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                    </div>
                        ))}
                        {filteredComboProducts.length === 0 && (
                          <p className="py-3 text-center text-sm text-brand-black/60">No products in this category.</p>
                        )}
                      </div>
                    </>
                  )}
                  {selectableProducts.length === 0 && (
                    <p className="text-sm text-brand-black/60">Add regular products before creating a combo.</p>
                  )}
                  <p className="text-xs text-brand-black/60">
                    {selectedComboIds.length} selected total; choose at least two products.
                  </p>
                </fieldset>
              )}
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
              {!isCombo && (
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
              )}
              <div>
                <label className="block text-sm text-brand-cream/70 mb-2">{isCombo ? 'Combo Price' : 'Unit Price'}</label>
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
            {!isCombo && <p className="text-xs text-brand-cream/60">New products use a unit-based pricing model. Legacy products with existing variants will continue to work.</p>}
          </div>

          {!isCombo && <div className="mt-4">
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
          </div>}

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
              {isSaving ? 'Saving...' : isCombo ? 'Save Combo' : 'Save Product'}
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
          <h2 className="text-3xl font-serif text-brand-cream">{isCombosPage ? 'Manage Combos' : 'Manage Products'}</h2>
          <p className="text-brand-cream/60 mt-2">
            {isCombosPage
              ? 'Create and manage product bundles with selected products and a combo price.'
              : 'Add, edit, and update all store products with pricing, stock, and visibility settings.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {!isCombosPage && (
            <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
              <Button variant="outline" onClick={handleCreate} className="py-2.5 px-5 bg-brand-gold text-brand-black hover:bg-brand-gold-light font-bold flex items-center gap-2 rounded-2xl shadow-md">
                <Plus size={18} /> Add New Product
              </Button>
            </motion.div>
          )}
          <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
            <Button variant="outline" onClick={handleCreateCombo} className="py-2.5 px-5 border border-brand-gold/40 text-brand-gold hover:bg-brand-gold/10 font-bold flex items-center gap-2 rounded-2xl shadow-md">
              <Plus size={18} /> Add Combo
            </Button>
          </motion.div>
        </div>
      </div>

      {isCombosPage ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {listedProducts.map((combo) => {
            const includedProducts = getComboMembers(combo, products);
            const hasSavedMembers = Array.isArray(combo.comboProducts) && combo.comboProducts.length > 0 ||
              Array.isArray(combo.comboProductIds) && combo.comboProductIds.length > 0;
            return (
              <article key={combo.id} className="overflow-hidden rounded-3xl border border-white/10 bg-brand-matte">
                <div className="flex gap-4 p-4">
                  <img
                    src={combo.image}
                    alt={combo.name}
                    className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate font-serif text-lg font-bold text-brand-cream">{combo.name}</h3>
                      <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${combo.visible !== false ? 'bg-brand-gold/10 text-brand-gold' : 'bg-brand-red/10 text-brand-red'}`}>
                        {combo.visible !== false ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-brand-cream/65">
                      Combo price: ₹{combo.pricePerUnit || combo.weights?.[0]?.price || 0}
                    </p>
                    <p className="mt-1 text-xs text-brand-cream/50">
                      {includedProducts.length > 0
                        ? `${includedProducts.length} included ${includedProducts.length === 1 ? 'product' : 'products'}`
                        : hasSavedMembers
                        ? 'Saved products could not be matched'
                        : 'No included products saved'}
                    </p>
                  </div>
                </div>
                {includedProducts.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-4 pb-4">
                    {includedProducts.map((product) => (
                      <span key={product.id} className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/5 py-1 pl-1 pr-2 text-xs text-brand-cream/80">
                        <img src={product.image} alt="" className="h-6 w-6 rounded-full object-cover" />
                        <span className="max-w-48 truncate">
                          {product.name || product.productType || product.category}
                          {product.variantLabel ? ` · ${product.variantLabel}` : ''}
                          {product.price ? ` · ₹${product.price}` : ''}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 border-t border-white/10 p-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(combo)}
                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-gold px-4 py-2 text-sm font-bold text-brand-black hover:bg-brand-gold-light"
                  >
                    <Edit2 size={15} /> Edit Combo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(combo.id)}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-brand-red/30 bg-brand-red/10 px-4 py-2 text-sm font-semibold text-brand-red hover:bg-brand-red/20"
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVisibilityToggle(combo.id)}
                    className="min-h-10 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-brand-cream/75 hover:bg-white/5"
                  >
                    {combo.visible !== false ? 'Hide' : 'Show'}
                  </button>
                </div>
              </article>
            );
          })}
          {listedProducts.length === 0 && (
            <div className="col-span-full rounded-3xl border border-white/10 bg-brand-matte px-6 py-12 text-center text-sm text-brand-cream/60">
              No combos yet. Select Add Combo to create your first bundle.
            </div>
          )}
        </div>
      ) : (
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
            {listedProducts.map((product, index) => (
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
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.productType === 'Combos' ? 'bg-brand-gold/20 text-brand-gold' : product.category === 'Veg' ? 'bg-green-900/60 text-green-300' : 'bg-red-900/60 text-red-300'}`}>
                    {product.productType === 'Combos' ? 'Combo' : product.category}
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
                    <Edit2 size={14} /> {isCombosPage ? 'Edit Combo' : 'Edit'}
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleDelete(product.id)} className="rounded-2xl bg-brand-red/10 px-3 py-2 text-xs font-semibold text-brand-red hover:bg-brand-red/20 transition-colors flex items-center gap-2">
                    <Trash2 size={14} /> Delete
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {listedProducts.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-brand-cream/60">
            No products have been added yet.
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default ManageProducts;
