import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { data: settings } = useSettings();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const businessName = settings?.businessName || "Lil' Threadz by Priya";
  const logoUrl = settings?.logo?.url || "/assets/images/logo.png";
  const instagramUrl = settings?.instagram || "https://www.instagram.com/lilthreadz_bypriya/";
  const whatsappPhone = settings?.whatsapp || "919876543210";
  const whatsappUrl = `https://wa.me/${whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello Priya, I'm interested in customizing a fabric organizer!")}`;

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/10 transition-all duration-300">
        <div className="flex justify-between items-center w-full px-6 md:px-16 py-4 max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              aria-label="Open menu"
              className="md:hidden text-primary scale-95 active:scale-100 transition-transform flex items-center justify-center"
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logoUrl}
                alt={businessName}
                className="h-12 w-12 object-contain rounded-full border border-outline-variant/20"
              />
              <span className="font-headline-md text-primary hidden sm:block italic font-bold">
                {businessName}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-[24px] items-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `font-label-md text-label-md tracking-widest uppercase transition-all duration-300 hover:text-primary ${isActive
                    ? 'text-primary border-b-2 border-secondary-container pb-1 font-semibold'
                    : 'text-on-surface-variant hover:opacity-70'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-label-md text-label-md tracking-widest uppercase text-on-surface-variant hover:text-primary transition-all duration-300 hover:opacity-70"
            >
              Instagram
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-container-low"
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping bag"
            >
              shopping_bag
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-5 py-2.5 rounded-full font-body-md flex items-center gap-2 transition-all duration-200 active:scale-95 hover:brightness-110 shadow-sm"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.284l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.181-2.587-5.768-5.764-5.768zm3.393 8.24c-.15.423-.743.763-1.07.811-.258.038-.59.06-.948-.054-.247-.079-.561-.181-.968-.355-1.728-.744-2.853-2.483-2.939-2.598-.087-.114-.708-.94-.708-1.792 0-.853.447-1.272.607-1.442.16-.17.348-.212.463-.212.115 0 .231.001.332.005.107.004.248-.041.389.297.143.344.491 1.197.533 1.282.043.085.07.184.014.3-.056.115-.085.188-.17.286-.085.099-.178.22-.254.294-.085.085-.175.176-.075.347.1.171.444.733.953 1.185.656.584 1.21.765 1.38.852.171.085.271.071.371-.043.1-.114.426-.498.54-.669.114-.17.228-.142.384-.085.156.057.994.469 1.165.554.17.085.284.128.326.198.043.07.043.41-.107.832z"></path>
              </svg>
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>


      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Drawer content */}
          <div className="relative w-80 max-w-[85%] bg-surface h-full shadow-2xl p-6 flex flex-col z-10 animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-8">
              <span className="font-headline-md text-primary italic font-bold">{businessName}</span>
              <button
                className="material-symbols-outlined text-on-surface-variant hover:text-primary flex items-center justify-center p-2 rounded-full hover:bg-surface-container-low"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                close
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `font-label-md text-lg tracking-widest uppercase transition-all duration-300 ${isActive
                      ? 'text-primary border-l-4 border-secondary-container pl-3 font-semibold'
                      : 'text-on-surface-variant hover:text-primary pl-0'
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-label-md text-lg tracking-widest uppercase text-on-surface-variant hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Instagram
              </a>
            </nav>

            <div className="mt-auto pt-6 border-t border-outline-variant/30 flex flex-col gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white py-3 rounded-full font-body-md flex items-center justify-center gap-2 hover:brightness-105 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined">chat</span> Chat via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Bag / Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          ></div>

          {/* Drawer Content */}
          <div className="relative w-96 max-w-[90%] bg-surface h-full shadow-2xl p-8 flex flex-col z-10 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8 border-b border-outline-variant/20 pb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">shopping_bag</span>
                <h3 className="font-headline-md text-primary">Your Atelier Bag</h3>
              </div>
              <button
                className="material-symbols-outlined text-on-surface-variant hover:text-primary flex items-center justify-center p-2 rounded-full hover:bg-surface-container-low"
                onClick={() => setIsCartOpen(false)}
              >
                close
              </button>
            </div>

            {/* Empty State */}
            <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">
                workspace_premium
              </span>
              <h4 className="font-headline-md text-primary mb-2">Atelier is empty</h4>
              <p className="text-on-surface-variant font-body-md mb-8">
                Our pieces are custom-crafted to order. Browse our products to begin your personalized commission.
              </p>
              <Link
                to="/products"
                className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-md uppercase tracking-wider hover:bg-primary-container transition-all"
                onClick={() => setIsCartOpen(false)}
              >
                Browse Collections
              </Link>
            </div>

            <div className="pt-6 border-t border-outline-variant/30 text-center opacity-70">
              <p className="text-sm font-label-md">Lil' Threadz by Priya — Handcrafted Heirloom</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
