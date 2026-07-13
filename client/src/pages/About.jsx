import { Link } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';

function About() {
  const { data: settings, isLoading } = useSettings();

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

  const aboutHeroImage = settings?.heroImage?.url || "/assets/images/about-1.jpg";

  return (
    <main className="mt-20">

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center px-6 md:px-16 bg-surface-container-low overflow-hidden">
        <div className="absolute inset-0 z-0 flex justify-end">
          <div
            className="w-full md:w-1/2 h-full bg-cover bg-center"
            style={{ backgroundImage: `url("${aboutHeroImage}")` }}
          ></div>
          <div className="absolute inset-0 hero-overlay hidden md:block"></div>
          <div className="absolute inset-0 bg-surface/60 md:hidden"></div>
        </div>

        <div className="relative z-10 max-w-xl">
          <span className="inline-block px-4 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-md mb-6 font-medium">
            Our Story
          </span>
          <h1 className="font-headline-xl text-headline-xl text-primary mb-6 leading-tight">
            Crafting Timeless Moments
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            {settings?.aboutText || "Where every stitch tells a story of love, heritage, and artisanal mastery."}
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="px-6 md:px-16 py-[96px] max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-8 font-bold">
              The Lil' Threadz Story
            </h2>
            <div className="space-y-6 text-on-surface-variant font-body-md leading-relaxed text-lg">
              <p>
                Founded by Priya, Lil' Threadz began in a small sunlit corner of a home studio, driven by a singular passion: to redefine bespoke organization and accessories through the lens of personal connection and heritage workmanship.
              </p>
              <p>
                What started as a hobby of repairing precious family textiles blossomed into an artisanal boutique atelier where we celebrate the "little threads" that connect generations. Each piece we create is designed to act as a protective sanctuary for your most valued treasures.
              </p>
            </div>

            {/* Mission & Vision cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                <span className="material-symbols-outlined text-secondary text-3xl mb-3">workspace_premium</span>
                <h3 className="font-headline-md text-primary mb-2 font-semibold">Our Mission</h3>
                <p className="text-on-surface-variant font-body-md text-sm">
                  To provide a bespoke tailoring experience that honors the individuality of every client, creating organizers that are as unique as their own journey.
                </p>
              </div>
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                <span className="material-symbols-outlined text-secondary text-3xl mb-3">visibility</span>
                <h3 className="font-headline-md text-primary mb-2 font-semibold">Our Vision</h3>
                <p className="text-on-surface-variant font-body-md text-sm">
                  To be the global standard for modern artisanal heritage, proving that slow fashion and luxury can coexist through ethical craftsmanship.
                </p>
              </div>
            </div>
          </div>

          {/* Double Photo Collage Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-md">
              <img src="/assets/images/about-2.jpg" alt="Atelier detail" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-md mt-8">
              <img src="/assets/images/about-3.jpg" alt="Artisan stitching" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing Quality Section */}
      <section className="bg-surface-container-low py-[96px] px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-label-md text-secondary uppercase tracking-[0.2em] block mb-4">
              Atelier Quality
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold mb-4">
              Manufacturing Quality
            </h2>
            <p className="font-body-lg text-on-surface-variant leading-relaxed">
              We focus on traditional production pipelines that refuse to cut corners, protecting both your garments and the earth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "The Craft",
                desc: "Garments and organizers constructed using hand-rolled hems, French seams, and bespoke pattern drafting tailored to custom measurements."
              },
              {
                title: "Premium Sourcing",
                desc: "We only use premium natural fibers—mulberry silk, organic linen, and long-staple cotton from certified heritage spinners."
              },
              {
                title: "The Needlework",
                desc: "Every seam is reinforced and all closures are hand-finished for unmatched durability, ensuring they last for generations."
              },
              {
                title: "Final Fitting",
                desc: "Before any custom order departs our atelier, it undergoes three levels of meticulous checks by Priya herself."
              }
            ].map((card, idx) => (
              <div key={idx} className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10">
                <span className="font-headline-xl text-3xl font-bold text-secondary-fixed-dim/60 block mb-4">
                  0{idx + 1}
                </span>
                <h3 className="font-headline-md text-primary mb-3 font-semibold">{card.title}</h3>
                <p className="text-on-surface-variant font-body-md">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Customers Trust Us */}
      <section className="px-6 md:px-16 py-[96px] max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left image */}
          <div className="aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
            <img src="/assets/images/about-4.jpg" alt="Finished bespoke box" className="w-full h-full object-cover" />
          </div>

          {/* Right text list */}
          <div>
            <span className="font-label-md text-secondary uppercase tracking-[0.2em] block mb-4">
              Our Values
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold mb-8">
              Why Customers Trust Us
            </h2>

            <div className="space-y-8 font-body-md text-on-surface-variant">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-secondary text-3xl shrink-0">shield_heart</span>
                <div>
                  <h4 className="font-headline-md text-primary font-semibold mb-1">Lifetime Warranty</h4>
                  <p className="leading-relaxed">
                    We stand by our seams. If any stitch or structural lining fails under normal usage, we will repair it at our atelier for life.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="material-symbols-outlined text-secondary text-3xl shrink-0">volunteer_activism</span>
                <div>
                  <h4 className="font-headline-md text-primary font-semibold mb-1">Ethical Promise</h4>
                  <p className="leading-relaxed">
                    Fair living wages, safe workspace environments, and zero-waste production principles guide every decision in our boutique.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="material-symbols-outlined text-secondary text-3xl shrink-0">design_services</span>
                <div>
                  <h4 className="font-headline-md text-primary font-semibold mb-1">Personal Design</h4>
                  <p className="leading-relaxed">
                    Enjoy direct design consultations with Priya for every customized or bespoke commission, ensuring your requirements are fully met.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-primary text-on-primary py-20 px-6 md:px-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg mb-6 italic">Ready to wear your story?</h2>
          <p className="font-body-lg text-on-primary-container/80 mb-10 leading-relaxed">
            Join the hundreds of clients who have chosen archival boutique quality over mass-produced fashion.
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-primary px-10 py-4 rounded-full font-body-lg font-semibold hover:bg-surface-container-low transition-all active:scale-95 shadow-lg"
          >
            Explore Collections
          </Link>
        </div>
      </section>

    </main>
  );
}

export default About;
