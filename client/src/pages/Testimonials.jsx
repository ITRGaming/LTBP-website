import React from 'react';
import { useTestimonials } from '../hooks/useTestimonials';

export default function Testimonials() {
  const { data: testimonials, isLoading, error } = useTestimonials();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-label-md tracking-wider uppercase text-on-surface-variant text-sm animate-pulse">
            Loading Reviews...
          </p>
        </div>
      </div>
    );
  }

  const list = testimonials || [];

  return (
    <main className="pt-32 pb-24 max-w-[1200px] mx-auto px-6 md:px-16 font-body-md">
      {/* Header */}
      <section className="mb-16 text-center max-w-3xl mx-auto border-b border-surface-container-highest pb-8">
        <span className="font-label-md text-label-md uppercase tracking-[0.2em] text-secondary mb-4 block">
          Client Appreciations
        </span>
        <h1 className="font-headline-xl text-headline-xl mb-4 font-bold">
          Kind Words & Testimonials
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Hear from our clients who have chosen archival boutique quality organizers to protect their precious keepsakes.
        </p>
      </section>

      {/* Testimonials Grid */}
      {list.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-low/30 rounded-2xl border border-outline-variant/20">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">
            forum
          </span>
          <h3 className="font-headline-md text-primary mb-2">No reviews shared yet</h3>
          <p className="text-on-surface-variant font-body-md">
            Be the first to share your experience after ordering a customized organizer!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((test) => {
            const rating = test.rating || 5;
            const sourceColors = {
              'WhatsApp': 'bg-green-100/50 text-green-600',
              'Instagram DM': 'bg-secondary-container/40 text-secondary',
              'Instagram Story': 'bg-secondary-container/60 text-secondary',
              'Text': 'bg-surface-container-high text-on-surface-variant'
            };
            const badgeColor = sourceColors[test.source] || 'bg-surface-container-high';
            const avatarUrl = test.image?.url;

            return (
              <div
                key={test._id}
                className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/20 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex text-secondary">
                      {[...Array(rating)].map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined text-[20px]"
                          style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${badgeColor}`}>
                      {test.source}
                    </span>
                  </div>
                  <p className="font-body-lg italic text-primary leading-relaxed mb-8">
                    "{test.message}"
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t border-outline-variant/20 pt-6">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={test.customerName}
                      className="w-12 h-12 rounded-full object-cover border border-outline-variant/20"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold">
                      {test.customerName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-primary">{test.customerName}</p>
                    <p className="text-on-surface-variant text-xs opacity-70">
                      Verified Client
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
