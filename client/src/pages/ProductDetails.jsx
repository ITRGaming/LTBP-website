import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductDetails } from '../hooks/useProductDetails';
import { useSettings } from '../hooks/useSettings';
import ImageFallback from '../components/ImageFallback';
import { resolveImageUrl } from '../utils/imageUrl';

export default function ProductDetails() {
  const { slug } = useParams();
  const { data: product, isLoading, error } = useProductDetails(slug);
  const { data: settings } = useSettings();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [embroideryName, setEmbroideryName] = useState('');

  // Handle Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-label-md tracking-wider uppercase text-on-surface-variant text-sm animate-pulse">
            Loading Details...
          </p>
        </div>
      </div>
    );
  }

  // Handle Error/Empty State
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">
          explore_off
        </span>
        <h2 className="font-headline-lg text-primary mb-2">Piece Not Found</h2>
        <p className="text-on-surface-variant font-body-md mb-8 max-w-md">
          The requested creation details cannot be fetched. It may have been retired or updated.
        </p>
        <Link
          to="/products"
          className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-md uppercase tracking-wider hover:bg-primary-container transition-all"
        >
          Browse Collections
        </Link>
      </div>
    );
  }

  // Default color and size options if not defined
  const sizes = product.availableSizes || [];
  const colors = product.availableColors || [];
  const mainImage = resolveImageUrl(product.images?.[activeImageIndex]?.url);

  // Initialize selected values if empty
  if (!selectedSize && sizes.length > 0) setSelectedSize(sizes[0]);
  if (!selectedColor && colors.length > 0) setSelectedColor(colors[0]);

  // Generate WhatsApp message and redirect
  const handleWhatsAppOrder = () => {
    const phone = settings?.whatsapp || "919876543210";
    const message = `Hello Priya! I want to order a customized creation:%0A%0A` +
      `*Product:* ${product.name}%0A` +
      `*Size Chosen:* ${selectedSize || 'Standard'}%0A` +
      `*Color Chosen:* ${selectedColor || 'Standard'}%0A` +
      `*Personalized Name/Monogram:* ${embroideryName || 'None'}`;

    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <main className="pt-32 pb-24 max-w-[1200px] mx-auto px-6 md:px-16 font-body-md">
      {/* Back button */}
      <Link to="/products" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-12 font-semibold font-label-md uppercase tracking-wider">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Collections
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column: Image Slider */}
        <div className="lg:col-span-6 space-y-6">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-surface-container border border-surface-container-high shadow-md">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageFallback className="w-full h-full" text={product.name} />
            )}
          </div>

          {/* Thumbnail strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === index ? 'border-secondary scale-95 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={resolveImageUrl(img.url)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Specifications & Booking Form */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <span className="font-label-md text-secondary uppercase tracking-[0.2em] block mb-2">
              {product.category}
            </span>
            <h1 className="font-headline-xl text-headline-xl text-primary font-bold mb-4">
              {product.name}
            </h1>
            <p className="font-headline-md text-secondary font-bold text-2xl">
              {product.price ? `$${product.price.toFixed(2)}` : 'Contact for Quote'}
            </p>
          </div>

          <hr className="border-outline-variant/30" />

          {/* Details */}
          <div className="space-y-4">
            <h3 className="font-label-md tracking-wider uppercase text-xs font-semibold text-primary">
              Description & Details
            </h3>
            <p className="text-on-surface-variant leading-relaxed text-lg">
              {product.description}
            </p>
            {product.material && (
              <p className="text-on-surface-variant font-light">
                <strong className="font-semibold text-primary">Material: </strong> {product.material}
              </p>
            )}
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-label-md tracking-wider uppercase text-xs font-semibold text-primary">
                Key Features
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-on-surface-variant text-sm">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <hr className="border-outline-variant/30" />

          {/* Customization Options */}
          <div className="space-y-6 bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10">
            <h3 className="font-headline-md text-primary font-semibold text-lg">
              Tailor Your Order
            </h3>

            {/* 1. Size Choice */}
            {sizes.length > 0 && (
              <div>
                <h4 className="font-label-md tracking-wider uppercase text-on-surface-variant text-xs mb-3 font-semibold">
                  1. Choose Size
                </h4>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 border rounded-lg font-label-md text-xs font-semibold transition-all ${
                        selectedSize === size
                          ? 'border-secondary bg-secondary-container/30 text-primary'
                          : 'border-outline-variant/60 text-on-surface-variant hover:border-secondary'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Color Choice */}
            {colors.length > 0 && (
              <div>
                <h4 className="font-label-md tracking-wider uppercase text-on-surface-variant text-xs mb-3 font-semibold">
                  2. Choose Color
                </h4>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border border-black/5 ${
                        selectedColor === color ? 'ring-2 ring-offset-2 ring-secondary scale-105' : ''
                      }`}
                      style={{ backgroundColor: color.startsWith('#') ? color : undefined }}
                      title={color}
                      onClick={() => setSelectedColor(color)}
                    >
                      {!color.startsWith('#') && (
                        <span className="text-[10px] text-primary truncate max-w-full block px-1">
                          {color.substring(0, 3)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-outline italic mt-1 block">
                  Selected: {selectedColor}
                </span>
              </div>
            )}

            {/* 3. Name personalization */}
            <div>
              <h4 className="font-label-md tracking-wider uppercase text-on-surface-variant text-xs mb-3 font-semibold">
                3. Add Custom Name / Monogram embroidery
              </h4>
              <input
                className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-3 text-body-md outline-none focus:ring-2 focus:ring-secondary focus:border-transparent font-body-md text-primary"
                placeholder="Type your name or monogram here (e.g., 'Anjali')"
                type="text"
                value={embroideryName}
                onChange={(e) => setEmbroideryName(e.target.value)}
                maxLength={20}
              />
              <span className="text-xs text-outline font-body-md mt-1 block">
                Placed by hand at our boutique atelier.
              </span>
            </div>

            {/* Submit on WhatsApp */}
            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] text-white py-4 rounded-full font-body-lg flex items-center justify-center gap-2 hover:brightness-105 active:scale-95 transition-all shadow-md font-semibold"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.284l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.181-2.587-5.768-5.764-5.768zm3.393 8.24c-.15.423-.743.763-1.07.811-.258.038-.59.06-.948-.054-.247-.079-.561-.181-.968-.355-1.728-.744-2.853-2.483-2.939-2.598-.087-.114-.708-.94-.708-1.792 0-.853.447-1.272.607-1.442.16-.17.348-.212.463-.212.115 0 .231.001.332.005.107.004.248-.041.389.297.143.344.491 1.197.533 1.282.043.085.07.184.014.3-.056.115-.085.188-.17.286-.085.099-.178.22-.254.294-.085.085-.175.176-.075.347.1.171.444.733.953 1.185.656.584 1.21.765 1.38.852.171.085.271.071.371-.043.1-.114.426-.498.54-.669.114-.17.228-.142.384-.085.156.057.994.469 1.165.554.17.085.284.128.326.198.043.07.043.41-.107.832z"></path>
              </svg>
              Customize & Order via WhatsApp
            </button>
          </div>

        </div>

      </div>

    </main>
  );
}
