import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useSettings } from '../hooks/useSettings';
import ImageFallback from '../components/ImageFallback';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State variables for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  // Detail Modal state
  const [customizingProduct, setCustomizingProduct] = useState(null);
  const [modalSize, setModalSize] = useState('Classic');
  const [modalColor, setModalColor] = useState('');
  const [modalName, setModalName] = useState('');

  // Extract query params from URL (e.g. from homepage category clicks)
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategories([catParam]);
      // Clear url param once read to allow clicking other checkboxes naturally
      setSearchParams({});
    }
  }, [searchParams]);

  // Load site settings for branding/contact details
  const { data: settings } = useSettings();

  // Load products from backend with search and category inputs
  // Note: SelectedCategories is an array, we can join or query individual if API supports.
  // Our backend getAllProducts supports category filter string. If multiple categories are checked,
  // we can filter them on the client to preserve multi-select functionality.
  const { data: productsData, isLoading, error } = useProducts({
    search: searchQuery,
  });

  const productsList = productsData?.products || [];

  // Categories list
  const categoriesList = [
    "Drawer Organizers",
    "Wardrobe Solutions",
    "Jewelry Cases",
    "Travel Essentials",
    "Home Storage",
    "Vanity Organizers"
  ];

  // Sizes list
  const sizesList = ["Petite", "Classic", "Grand"];

  // Colors list
  const colorsList = [
    { name: "Linen Beige", hex: "#E8DCC4" },
    { name: "Sage Mist", hex: "#B8D8BA" },
    { name: "Soft Lavender", hex: "#C9B1D0" },
    { name: "Blush Rose", hex: "#F5C2C7" },
    { name: "Pure Ivory", hex: "#FDFBFF" }
  ];

  // Toggle category checkboxes
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedSize(null);
    setSelectedColor(null);
  };

  // Filtering Logic (Client-side category, size and color filtering)
  const filteredProducts = productsList.filter(product => {
    // 1. Category filter
    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    // 2. Size filter
    const matchesSize = selectedSize === null ||
      product.availableSizes?.includes(selectedSize) ||
      product.size === selectedSize;

    // 3. Color filter
    // We match by hex or color name. In the backend, colors are stored as strings (e.g. Hex or name)
    const matchesColor = selectedColor === null ||
      product.availableColors?.some(c => c.toLowerCase() === selectedColor.toLowerCase()) ||
      product.availableColors?.includes(selectedColor);

    return matchesCategory && matchesSize && matchesColor;
  });

  // Open customization modal
  const openCustomizationModal = (product) => {
    setCustomizingProduct(product);
    setModalSize(product.availableSizes?.[0] || 'Classic');
    setModalColor(product.availableColors?.[0] || '');
    setModalName('');
  };

  // Launch WhatsApp order URL
  const handleWhatsAppOrder = () => {
    if (!customizingProduct) return;
    const phone = settings?.whatsapp || "919876543210"; // Priya's WhatsApp
    const message = `Hello Priya! I want to order a customized creation:%0A%0A` +
      `*Product:* ${customizingProduct.name}%0A` +
      `*Size Chosen:* ${modalSize}%0A` +
      `*Color Chosen:* ${modalColor}%0A` +
      `*Personalized Name/Monogram:* ${modalName || 'None'}`;

    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
    setCustomizingProduct(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-label-md tracking-wider uppercase text-on-surface-variant text-sm animate-pulse">
            Loading Atelier...
          </p>
        </div>
      </div>
    );
  }


  return (
    <main className="pt-32 pb-24 max-w-[1200px] mx-auto px-6 md:px-16">

      {/* Header */}
      <header className="mb-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-surface-container-highest pb-8">
          <div className="max-w-xl">
            <h1 className="font-headline-xl text-headline-xl mb-4 font-bold">Our Collections</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Carefully curated organizers for the modern home, blending artisanal craftsmanship with functional elegance.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80 group">
            <input
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-secondary focus:border-transparent text-body-md transition-all font-body-md text-primary"
              placeholder="Search our atelier..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
          </div>
        </div>
      </header>

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px]">

        {/* Filters Sidebar */}
        <aside className="md:col-span-3 space-y-10">

          {/* Categories */}
          <div>
            <h3 className="font-label-md text-label-md tracking-widest uppercase mb-6 text-primary border-l-2 border-brand-sage pl-3 font-semibold">
              Category
            </h3>
            <div className="space-y-3">
              {categoriesList.map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    className="rounded text-brand-lavender focus:ring-brand-lavender border-outline-variant w-5 h-5 cursor-pointer accent-secondary"
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  />
                  <span className="font-body-md text-on-surface-variant group-hover:text-primary transition-colors">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="font-label-md text-label-md tracking-widest uppercase mb-6 text-primary border-l-2 border-secondary-container pl-3 font-semibold">
              Size
            </h3>
            <div className="flex flex-wrap gap-2">
              {sizesList.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 border rounded-lg font-label-md text-label-md transition-all font-semibold ${selectedSize === size
                    ? 'border-secondary bg-secondary-container/30 text-primary'
                    : 'border-outline-variant/60 hover:border-secondary hover:bg-secondary-container/10 text-on-surface-variant'
                    }`}
                  onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="font-label-md text-label-md tracking-widest uppercase mb-6 text-primary border-l-2 border-soft-pink pl-3 font-semibold">
              Color Palette
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {colorsList.map((col) => (
                <button
                  key={col.hex}
                  className={`w-8 h-8 rounded-full border border-black/5 hover:scale-110 transition-transform ${selectedColor === col.hex
                    ? 'ring-2 ring-offset-2 ring-secondary scale-110'
                    : ''
                    }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                  onClick={() => setSelectedColor(selectedColor === col.hex ? null : col.hex)}
                ></button>
              ))}
            </div>
          </div>

          {/* Reset Filters */}
          {(searchQuery || selectedCategories.length > 0 || selectedSize || selectedColor) && (
            <button
              onClick={handleClearFilters}
              className="w-full py-3 border border-dashed border-outline hover:border-primary text-on-surface-variant hover:text-primary rounded-xl font-label-md uppercase tracking-wider text-sm transition-all"
            >
              Clear Filters
            </button>
          )}

          {/* Bespoke fit banner */}
          <div className="pt-8">
            <div className="p-6 bg-surface-container-low rounded-2xl relative overflow-hidden group border border-outline-variant/10">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl">architecture</span>
              </div>
              <h4 className="font-headline-md text-headline-md mb-2 font-semibold">Bespoke Fitting</h4>
              <p className="font-body-md text-on-surface-variant mb-4">
                Can't find the perfect size? Our artisans specialize in custom dimensions.
              </p>
              <Link
                to="/contact"
                className="font-label-md text-label-md uppercase tracking-wider text-primary underline decoration-secondary decoration-2 underline-offset-8"
              >
                Start Designing
              </Link>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="md:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-surface-container-low/30 rounded-2xl border border-outline-variant/20">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">
                search_off
              </span>
              <h3 className="font-headline-md text-primary mb-2">No matching pieces found</h3>
              <p className="text-on-surface-variant font-body-md mb-6">
                Try clearing your active filters or searching for something else.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-md uppercase tracking-wider hover:bg-primary-container transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
              {filteredProducts.map((product) => {
                const mainImageUrl = product.images?.[0]?.url;
                return (
                  <div
                    key={product._id}
                    className="group flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden product-card-shadow border border-surface-container-high transition-all duration-500 hover:shadow-lg"
                  >
                    <Link to={`/products/${product.slug}`} className="relative aspect-[4/5] overflow-hidden block">
                      {mainImageUrl ? (
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          alt={product.name}
                          src={mainImageUrl}
                        />
                      ) : (
                        <ImageFallback className="w-full h-full" text={product.name} />
                      )}
                      {product.isFeatured && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 rounded-full font-label-md text-[10px] uppercase tracking-widest text-primary bg-secondary-container">
                            Best Seller
                          </span>
                        </div>
                      )}
                    </Link>

                    <div className="p-6 flex flex-col flex-grow">
                      <Link to={`/products/${product.slug}`} className="hover:underline decoration-secondary">
                        <h3 className="font-headline-md text-headline-md mb-2 font-semibold text-primary">{product.name}</h3>
                      </Link>
                      <p className="font-body-md text-on-surface-variant mb-6 line-clamp-2">
                        {product.shortDescription || product.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-headline-md text-primary font-bold">
                          {product.price ? `$${product.price.toFixed(2)}` : 'Contact for Quote'}
                        </span>
                        <button
                          onClick={() => openCustomizationModal(product)}
                          className="flex items-center gap-2 font-label-md text-label-md uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors font-semibold"
                        >
                          Customize
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Bespoke Customization & Checkout Dialog Modal */}
      {customizingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-sm transition-opacity"
            onClick={() => setCustomizingProduct(null)}
          ></div>

          {/* Dialog Container */}
          <div className="relative bg-surface rounded-3xl w-full max-w-xl shadow-2xl p-6 md:p-10 z-10 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto border border-outline-variant/20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="font-label-md text-secondary uppercase tracking-[0.15em] block mb-1">
                  Bespoke Atelier Consultation
                </span>
                <h3 className="font-headline-lg text-headline-lg text-primary font-bold leading-tight">
                  {customizingProduct.name}
                </h3>
              </div>
              <button
                className="material-symbols-outlined text-on-surface-variant hover:text-primary flex items-center justify-center p-2 rounded-full hover:bg-surface-container-low"
                onClick={() => setCustomizingProduct(null)}
              >
                close
              </button>
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* Product Image */}
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-sm">
                {customizingProduct.images?.[0]?.url ? (
                  <img
                    className="w-full h-full object-cover"
                    src={customizingProduct.images[0].url}
                    alt={customizingProduct.name}
                  />
                ) : (
                  <ImageFallback className="w-full h-full" text={customizingProduct.name} />
                )}
              </div>

              {/* Form Options */}
              <div className="space-y-5">
                <p className="font-body-md text-on-surface-variant line-clamp-4">
                  {customizingProduct.shortDescription || customizingProduct.description}
                </p>
                <div className="text-xl font-bold font-headline-md text-primary">
                  Base Price: {customizingProduct.price ? `$${customizingProduct.price.toFixed(2)}` : 'Quote Needed'}
                </div>

                {/* 1. Size Choice */}
                <div>
                  <h4 className="font-label-md tracking-wider uppercase text-on-surface-variant text-xs mb-2 font-semibold">
                    1. Choose Size
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(customizingProduct.availableSizes && customizingProduct.availableSizes.length > 0
                      ? customizingProduct.availableSizes
                      : sizesList
                    ).map((size) => (
                      <button
                        key={size}
                        className={`px-3 py-1.5 border rounded-lg font-label-md text-xs font-semibold ${modalSize === size
                          ? 'border-secondary bg-secondary-container/30 text-primary'
                          : 'border-outline-variant/60 text-on-surface-variant'
                          }`}
                        onClick={() => setModalSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Color Choice */}
                <div>
                  <h4 className="font-label-md tracking-wider uppercase text-on-surface-variant text-xs mb-2 font-semibold">
                    2. Choose Color
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(customizingProduct.availableColors && customizingProduct.availableColors.length > 0
                      ? customizingProduct.availableColors
                      : colorsList.map(c => c.hex)
                    ).map((color, idx) => {
                      return (
                        <button
                          key={color}
                          className={`w-7 h-7 rounded-full border border-black/5 ${modalColor === color
                            ? 'ring-2 ring-offset-1 ring-secondary scale-105'
                            : ''
                            }`}
                          style={{ backgroundColor: color.startsWith('#') ? color : undefined }}
                          title={color}
                          onClick={() => setModalColor(color)}
                        >
                          {!color.startsWith('#') && (
                            <span className="text-[10px] text-primary truncate max-w-full block px-0.5">
                              {color.substring(0, 3)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-body-md text-outline italic block mt-1">
                    Selected: {modalColor}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Name personalization */}
            <div className="mb-8 border-t border-outline-variant/20 pt-6">
              <h4 className="font-label-md tracking-wider uppercase text-on-surface-variant text-xs mb-3 font-semibold">
                3. Add Custom Name / Monogram embroidery
              </h4>
              <input
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-body-md outline-none focus:ring-2 focus:ring-secondary focus:border-transparent font-body-md text-primary"
                placeholder="Type your name or monogram here (e.g., 'Anjali', 'AMR')"
                type="text"
                value={modalName}
                onChange={(e) => setModalName(e.target.value)}
                maxLength={20}
              />
              <span className="text-xs text-outline font-body-md mt-1 block">
                Up to 20 letters. Placed by hand at our atelier.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleWhatsAppOrder}
                className="flex-1 bg-[#25D366] text-white py-3.5 rounded-full font-body-lg flex items-center justify-center gap-2 hover:brightness-105 active:scale-95 transition-all shadow-md font-semibold"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.284l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.181-2.587-5.768-5.764-5.768zm3.393 8.24c-.15.423-.743.763-1.07.811-.258.038-.59.06-.948-.054-.247-.079-.561-.181-.968-.355-1.728-.744-2.853-2.483-2.939-2.598-.087-.114-.708-.94-.708-1.792 0-.853.447-1.272.607-1.442.16-.17.348-.212.463-.212.115 0 .231.001.332.005.107.004.248-.041.389.297.143.344.491 1.197.533 1.282.043.085.07.184.014.3-.056.115-.085.188-.17.286-.085.099-.178.22-.254.294-.085.085-.175.176-.075.347.1.171.444.733.953 1.185.656.584 1.21.765 1.38.852.171.085.271.071.371-.043.1-.114.426-.498.54-.669.114-.17.228-.142.384-.085.156.057.994.469 1.165.554.17.085.284.128.326.198.043.07.043.41-.107.832z"></path>
                </svg>
                Order on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

export default Products;
