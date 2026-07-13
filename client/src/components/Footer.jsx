import { Link } from 'react-router-dom';

function Footer() {
  const handleSubmitEmail = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our atelier updates!');
    e.target.reset();
  };

  return (
    <footer className="w-full border-t border-outline-variant bg-surface-container-low transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[40px] px-6 md:px-16 py-16 max-w-[1200px] mx-auto">
        
        {/* Brand Info */}
        <div className="col-span-1">
          <h3 className="font-headline-lg text-headline-lg text-secondary mb-6 italic font-bold">
            Lil' Threadz by Priya
          </h3>
          <p className="text-on-surface-variant font-body-md mb-8 leading-relaxed">
            Crafting archival organization solutions with heritage modernist principles. Protecting your treasures with elegance and artisanal care.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-secondary hover:border-secondary transition-colors"
            >
              <span className="material-symbols-outlined text-lg">camera_enhance</span>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-secondary hover:border-secondary transition-colors"
            >
              <span className="material-symbols-outlined text-lg">share</span>
            </a>
            <a
              href="mailto:hello@lilthreadz.com"
              className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-secondary hover:border-secondary transition-colors"
            >
              <span className="material-symbols-outlined text-lg">mail</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-headline-md text-headline-md text-primary mb-6">Shop & Explore</h4>
          <ul className="space-y-4 font-body-md">
            <li>
              <Link
                to="/products"
                className="text-on-surface-variant hover:text-secondary hover:underline decoration-on-tertiary-container decoration-2 underline-offset-4 transition-colors"
              >
                New Arrivals
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="text-on-surface-variant hover:text-secondary hover:underline decoration-on-tertiary-container decoration-2 underline-offset-4 transition-colors"
              >
                Saree Organizers
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="text-on-surface-variant hover:text-secondary hover:underline decoration-on-tertiary-container decoration-2 underline-offset-4 transition-colors"
              >
                Wholesale
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-on-surface-variant hover:text-secondary hover:underline decoration-on-tertiary-container decoration-2 underline-offset-4 transition-colors"
              >
                Care Guide
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter / Connect */}
        <div>
          <h4 className="font-headline-md text-headline-md text-primary mb-6">Connect</h4>
          <p className="text-on-surface-variant font-body-md mb-6">
            Subscribe for archival inspiration and new collection previews.
          </p>
          <form onSubmit={handleSubmitEmail} className="flex gap-2 mb-8">
            <input
              required
              className="bg-surface px-4 py-3 rounded-lg border border-outline-variant w-full focus:ring-2 focus:ring-secondary outline-none transition-all font-body-md text-primary"
              placeholder="Your Email"
              type="email"
            />
            <button
              type="submit"
              className="bg-primary text-on-primary px-6 py-3 rounded-lg hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
          <div className="flex gap-4 text-sm text-on-surface-variant font-label-md">
            <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-secondary transition-colors">Shipping & Returns</a>
          </div>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-16 py-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center opacity-70">
        <p className="text-label-md">© 2026 Lil' Threadz by Priya. Crafted with Care.</p>
        <div className="flex gap-[24px] mt-4 md:mt-0 text-label-md">
          <span>Heritage Modernism Aesthetic</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
