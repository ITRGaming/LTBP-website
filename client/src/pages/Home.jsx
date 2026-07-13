import { Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';

function Home() {
  const navigate = useNavigate();

  // Best Sellers (Premium Storage Boxes, Custom Diaper Pouches, Vanity Roll-Ups)
  const bestSellers = products.filter(p => [7, 8, 9].includes(p.id));

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <main className="mt-20">

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center px-6 md:px-16 bg-surface-container-low overflow-hidden">
        <div className="absolute inset-0 z-0 flex justify-end">
          <div
            className="w-full md:w-3/5 h-full bg-cover bg-center"
            style={{ backgroundImage: 'url("/assets/images/hero.jpg")' }}
          ></div>
          {/* Overlay to fade details */}
          <div className="absolute inset-0 hero-overlay hidden md:block"></div>
          <div className="absolute inset-0 bg-surface/60 md:hidden"></div>
        </div>

        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-4 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-md mb-6 font-medium">
            Established Heritage
          </span>
          <h1 className="font-headline-xl text-headline-xl text-primary mb-6 leading-tight">
            Artisanal Elegance for Your Organized Life
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 leading-relaxed max-w-xl">
            Customized fabric organizers, pouches, and travel essentials crafted with heritage and care. Bringing a sense of serenity to your daily rituals through tactile luxury.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="bg-primary text-on-primary px-10 py-4 rounded-full font-body-lg hover:bg-primary-container transition-all active:scale-95 shadow-md font-semibold text-center"
            >
              Explore Products
            </Link>
            <Link
              to="/about"
              className="bg-surface-container-highest text-primary px-10 py-4 rounded-full font-body-lg hover:bg-secondary-container transition-all active:scale-95 font-semibold text-center"
            >
              Our Heritage
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-6 md:px-16 py-[96px] max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <span className="font-label-md text-secondary uppercase tracking-[0.2em] block mb-4">
            Curated Selections
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold">
            Browse by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
          {[
            { name: 'Travel Pouches', img: '/assets/images/category-travel.jpg', api: 'Travel Essentials' },
            { name: 'Home Storage', img: '/assets/images/category-home.jpg', api: 'Home Storage' },
            { name: 'Vanity Organizers', img: '/assets/images/category-vanity.jpg', api: 'Vanity Organizers' },
            { name: 'Quilted Bags', img: '/assets/images/category-bags.jpg', api: 'Drawer Organizers' } // Map to category Drawer Organizers for visual fidelity
          ].map((cat) => (
            <div
              key={cat.name}
              className="group cursor-pointer"
              onClick={() => handleCategoryClick(cat.api)}
            >
              <div className="aspect-[4/5] rounded-xl overflow-hidden mb-6 relative shadow-sm hover:shadow-xl transition-shadow duration-500">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url("${cat.img}")` }}
                ></div>
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-surface text-primary px-6 py-2 rounded-full font-label-md font-semibold">
                    Discover
                  </span>
                </div>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary text-center font-semibold">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Difference / Promise Section */}
      <section class="bg-surface-container-low py-[96px] px-[64px]">
        <div class="flex flex-col lg:flex-row gap-[24px]">
          <div class="lg:w-1/3 mb-8 lg:mb-0">
            <span class="font-label-md text-secondary uppercase tracking-[0.2em] block mb-4">Our Promise</span>
            <h2 class="font-headline-lg text-headline-lg text-primary mb-8">The Lil' Threadz Difference</h2>
            <p class="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">Every piece is a labor of love, blending traditional techniques with modern utility to protect what you value most.</p>
          </div>
          <div class="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/10 hover:border-secondary/30 hover:shadow-md transition-all duration-300">
              <span class="material-symbols-outlined text-secondary text-4xl mb-4">verified</span>
              <h4 class="font-headline-md text-headline-md text-primary mb-2">Premium Quality</h4>
              <p class="text-on-surface-variant font-body-md">Sourced from the finest local textiles and durable reinforcements.</p>
            </div>
            <div class="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/10 hover:border-secondary/30 hover:shadow-md transition-all duration-300">
              <span class="material-symbols-outlined text-secondary text-4xl mb-4">auto_fix_high</span>
              <h4 class="font-headline-md text-headline-md text-primary mb-2">Custom Embroidery</h4>
              <p class="text-on-surface-variant font-body-md">Personalize your organizers with bespoke monograms and names.</p>
            </div>
            <div class="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/10 hover:border-secondary/30 hover:shadow-md transition-all duration-300">
              <span class="material-symbols-outlined text-secondary text-4xl mb-4">palette</span>
              <h4 class="font-headline-md text-headline-md text-primary mb-2">Multiple Colors</h4>
              <p class="text-on-surface-variant font-body-md">A wide palette of heritage-inspired shades to match your decor.</p>
            </div>
            <div class="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/10 hover:border-secondary/30 hover:shadow-md transition-all duration-300">
              <span class="material-symbols-outlined text-secondary text-4xl mb-4">aspect_ratio</span>
              <h4 class="font-headline-md text-headline-md text-primary mb-2">Various Sizes</h4>
              <p class="text-on-surface-variant font-body-md">From tiny pill pouches to expansive storage boxes for every need.</p>
            </div>
            <div class="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/10 hover:border-secondary/30 hover:shadow-md transition-all duration-300">
              <span class="material-symbols-outlined text-secondary text-4xl mb-4">diamond</span>
              <h4 class="font-headline-md text-headline-md text-primary mb-2">Durable Materials</h4>
              <p class="text-on-surface-variant font-body-md">Designed to last generations with reinforced seams and quality zippers.</p>
            </div>
            <div class="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/10 hover:border-secondary/30 hover:shadow-md transition-all duration-300">
              <span class="material-symbols-outlined text-secondary text-4xl mb-4">potted_plant</span>
              <h4 class="font-headline-md text-headline-md text-primary mb-2">Handmade Finish</h4>
              <p class="text-on-surface-variant font-body-md">Each stitch is placed by hand, ensuring a unique soul in every product.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section class="px-[64px] py-[96px]">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="font-label-md text-secondary uppercase tracking-[0.2em] block mb-4">
              The Favorites
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Best Selling Products
            </h2>
          </div>
          <Link
            to="/products"
            className="text-primary font-bold border-b-2 border-secondary-container pb-1 hover:text-secondary transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          {bestSellers.map((product) => (
            <div key={product.id} className="flex flex-col group">
              <div className="aspect-square bg-surface-container rounded-xl overflow-hidden mb-6 relative">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url("${product.image}")` }}
                ></div>
                {product.badge && (
                  <div className="absolute top-4 left-4 bg-surface-bright/90 backdrop-blur px-4 py-1 rounded-full text-label-md text-primary shadow-sm">
                    {product.badge}
                  </div>
                )}
              </div>
              <h4 className="font-headline-md text-headline-md text-primary">
                {product.title}
              </h4>
              <p className="text-on-surface-variant mb-4 font-body-md">
                {product.description}
              </p>
              <div className="flex gap-2">
                {product.colors.map((color, colorIdx) => (
                  <span
                    key={colorIdx}
                    className="w-6 h-6 rounded-full border border-black/10 ring-offset-2 ring-1 ring-transparent hover:ring-secondary transition-all"
                    style={{ backgroundColor: color }}
                    title={product.colorsNames ? product.colorsNames[colorIdx] : ''}
                  ></span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tailored / Process Section */}
      <section className="py-[96px] px-[64px] bg-secondary-container/30">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <span className="font-label-md text-secondary uppercase tracking-[0.2em] block mb-4">
            The Journey
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-6">
            Tailored Just For You
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Our simple five-step process to bring your vision to life.
          </p>
        </div>

        <div className="relative max-w-[1200px] mx-auto px-10">
          {/* Horizontal line for desktop steps */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-[2px] bg-secondary/10"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-[40px] relative z-10">
            {[
              { num: '01', title: 'Choose Product', desc: 'Browse our curated catalog of handcrafted forms.' },
              { num: '02', title: 'Select Size', desc: 'Determine dimensions that fit your specific treasures.' },
              { num: '03', title: 'Select Color', desc: 'Choose from our palette of archival-safe textiles.' },
              { num: '04', title: 'Add Name', desc: 'Inscribe your story with custom embroidery details.' },
              { num: '05', title: 'Order Now', desc: 'Reach out to finalize your bespoke creation.' }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 font-headline-md shadow-lg group-hover:scale-110 transition-transform ${idx % 2 === 0 ? 'bg-primary text-on-primary' : 'bg-secondary text-on-secondary'
                  }`}>
                  {step.num}
                </div>
                <h4 className="font-headline-md text-headline-md text-primary mb-2 ">
                  {step.title}
                </h4>
                <p className="text-on-surface-variant font-body-md">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Small Testimonials Preview */}
      <section className="py-[96px] px-[64px] overflow-hidden bg-surface">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-[24px]">
          <div className="max-w-xl text-center md:text-left">
            <span className="font-label-md text-secondary uppercase tracking-[0.2em] block mb-4">
              Kind Words
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Our Clients Love Lil' Threadz
            </h2>
          </div>
          <Link
            to="/testimonials"
            className="text-primary font-bold border-b-2 border-secondary-container pb-1 hover:text-secondary transition-colors"
          >
            Read All Reviews
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          {[
            {
              quote: "The quality of the quilting is unlike anything I've found in stores. It feels so protective and looks absolutely stunning in my closet.",
              author: "Anjali R.",
              role: "Custom Saree Bags",
              color: "bg-soft-pink/30"
            },
            {
              quote: "Ordered diaper pouches for my baby shower gifts and everyone was obsessed. The personalized embroidery was the perfect touch.",
              author: "Sarah M.",
              role: "Gifting Collection",
              color: "bg-lavender/30"
            },
            {
              quote: "The travel pouches have changed the way I pack. They keep my jewelry and delicate items safe and organized. A true investment.",
              author: "Meera K.",
              role: "Travel Essentials",
              color: "bg-brand-sage/40"
            }
          ].map((test, index) => (
            <div
              key={index}
              className="bg-surface-container-low p-10 rounded-xl border border-outline-variant/20 flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex text-secondary mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-lg italic text-primary leading-relaxed mb-8">
                  "{test.quote}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${test.color}`}></div>
                <div>
                  <p className="font-bold text-primary">{test.author}</p>
                  <p className="text-on-surface-variant text-sm">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram Inspiration Section */}
      <section className="py-[96px] px-[64px] bg-surface-container-lowest">
        <div className="text-center mb-16">
          <span className="font-label-md text-secondary uppercase tracking-[0.2em] block mb-4">
            Follow Our Journey
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary ">
            Inspired Living @LilThreadz
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="aspect-square relative group overflow-hidden rounded-lg">
              <div
                className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundImage: `url("/assets/images/instagram-${num}.jpg")` }}
              ></div>
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-3xl">camera_enhance</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box / WhatsApp Banner */}
      <section className="px-[64px] mb-[96px]">
        <div className="bg-soft-pink/30 rounded-xl p-16 md:p-24 flex flex-col items-center text-center relative overflow-hidden border border-soft-pink">
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-lavender/40 blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-secondary-container/40 blur-3xl"></div>

          <h2 className="font-headline-lg text-headline-lg text-primary mb-6 relative z-10 ">
            Looking for customized organizers?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-2xl relative z-10 leading-relaxed">
            Let's create something unique for you. From special sizes to personalized monograms, we craft pieces that tell your story.
          </p>

          <div className="flex flex-wrap justify-center gap-6 relative z-10">
            <a
              href="https://wa.me/919876543210?text=Hello%20Priya,%20I'm%20interested%20in%20customizing%20some%20organizers!"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-10 py-4 rounded-full font-body-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-100 font-semibold"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.284l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.181-2.587-5.768-5.764-5.768zm3.393 8.24c-.15.423-.743.763-1.07.811-.258.038-.59.06-.948-.054-.247-.079-.561-.181-.968-.355-1.728-.744-2.853-2.483-2.939-2.598-.087-.114-.708-.94-.708-1.792 0-.853.447-1.272.607-1.442.16-.17.348-.212.463-.212.115 0 .231.001.332.005.107.004.248-.041.389.297.143.344.491 1.197.533 1.282.043.085.07.184.014.3-.056.115-.085.188-.17.286-.085.099-.178.22-.254.294-.085.085-.175.176-.075.347.1.171.444.733.953 1.185.656.584 1.21.765 1.38.852.171.085.271.071.371-.043.1-.114.426-.498.54-.669.114-.17.228-.142.384-.085.156.057.994.469 1.165.554.17.085.284.128.326.198.043.07.043.41-.107.832z"></path>
              </svg>
              WhatsApp
            </a>
            <Link
              to="/contact"
              className="bg-primary text-on-primary px-10 py-4 rounded-full font-body-lg hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/10 font-semibold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

export default Home;
