import React, { useState } from 'react';
import { useContact } from '../hooks/useContact';
import { useSettings } from '../hooks/useSettings';

export default function Contact() {
    const { data: settings } = useSettings();
    const contactMutation = useContact();

    // Form State handling controlled inputs
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        inquiryType: 'Bespoke Commission',
        message: ''
    });

    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Accordion Multi-Toggle State tracking active key indices
    const [activeFaq, setActiveFaq] = useState(null);

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitSuccess(false);
        setSubmitError('');

        // Prepare payload mapping
        const payload = {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            message: `[Inquiry: ${formData.inquiryType}] ${formData.message}`
        };

        contactMutation.mutate(payload, {
            onSuccess: () => {
                setSubmitSuccess(true);
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    inquiryType: 'Bespoke Commission',
                    message: ''
                });
            },
            onError: (err) => {
                const errMsg = err.response?.data?.message || 'Failed to submit inquiry. Please try again.';
                setSubmitError(errMsg);
            }
        });
    };

    // Static Configuration Array matching the DOM text contents
    const faqData = [
        {
            question: "How long does the bespoke process typically take?",
            answer: "A custom heirloom typically takes between 4 to 6 weeks from the initial consultation to final delivery. This allows time for thoughtful design iterations, fabric sourcing, and our intensive hand-embroidery process."
        },
        {
            question: "Do you offer international shipping for custom pieces?",
            answer: "Yes, we ship our creations globally. We use specialized couriers to ensure your piece arrives safely and is fully insured during its journey to you."
        },
        {
            question: "Can I incorporate vintage materials from my family collection?",
            answer: "Absolutely. We specialize in \"re-weaving history\" and love incorporating heirloom fabrics, lace, or buttons into new designs. This is discussed during our initial bespoke consultation."
        }
    ];

    return (
        <main className="pt-32 pb-24 max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-[64px] font-sans">

            {/* HEADER SECTION */}
            <section className="mb-16 text-center max-w-3xl mx-auto">
                <span className="font-label-md text-label-md uppercase tracking-[0.2em] text-secondary mb-4 block">
                    Get in Touch
                </span>
                <h1 className="font-headline-xl text-headline-xl mb-6 font-serif">
                    Let’s begin your bespoke journey
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed font-light">
                    Whether you're dreaming of a custom heirloom or have questions about our artisanal process,
                    we're here to help you weave magic.
                </p>
            </section>

            {/* DUAL COLUMN INTERACTIVE CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                {/* LEFT COMPONENT: The Precise Send Inquiry Form Container */}
                <div className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-10 rounded-card ambient-shadow border border-surface-container-highest/50">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Input Row Grid Container */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant block">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Priya Sharma"
                                    required
                                    className="w-full bg-transparent border-b border-outline-variant focus:border-brand-lavender focus:ring-0 py-3 transition-colors placeholder:text-outline-variant focus:outline-none text-on-surface"
                                />
                            </div>

                            {/* Email Address */}
                            <div className="space-y-2">
                                <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant block">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="priya@example.com"
                                    required
                                    className="w-full bg-transparent border-b border-outline-variant focus:border-brand-lavender focus:ring-0 py-3 transition-colors placeholder:text-outline-variant focus:outline-none text-on-surface"
                                />
                            </div>
                        </div>

                        {/* Input Row 2 Grid Container */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant block">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                    required
                                    className="w-full bg-transparent border-b border-outline-variant focus:border-brand-lavender focus:ring-0 py-3 transition-colors placeholder:text-outline-variant focus:outline-none text-on-surface"
                                />
                            </div>

                            {/* Inquiry Type Dropdown Select wrapper */}
                            <div className="space-y-2 relative">
                                <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant block">
                                    Inquiry Type
                                </label>
                                <select
                                    name="inquiryType"
                                    value={formData.inquiryType}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b border-outline-variant focus:border-brand-lavender focus:ring-0 py-3 transition-colors text-on-surface focus:outline-none appearance-none cursor-pointer"
                                >
                                    <option value="Bespoke Commission">Bespoke Commission</option>
                                    <option value="Order Status">Order Status</option>
                                    <option value="Press &amp; Collaboration">Press &amp; Collaboration</option>
                                    <option value="General Question">General Question</option>
                                </select>
                                <div className="absolute right-2 bottom-4 pointer-events-none text-on-surface-variant text-xs">
                                    ▼
                                </div>
                            </div>
                        </div>

                        {/* Message Area */}
                        <div className="space-y-2">
                            <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant block">
                                Your Message
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell us about the dream piece you'd like us to create..."
                                rows="5"
                                required
                                className="w-full bg-transparent border-b border-outline-variant focus:border-brand-lavender focus:ring-0 py-3 transition-colors placeholder:text-outline-variant focus:outline-none resize-none leading-relaxed text-on-surface"
                            />
                        </div>

                        {submitSuccess && (
                            <div className="bg-green-100/50 border border-green-600/30 text-green-600 p-4 rounded-xl text-sm font-medium">
                                Thank you for your inquiry! We will get back to you shortly.
                            </div>
                        )}

                        {submitError && (
                            <div className="bg-red-100/50 border border-red-600/30 text-red-600 p-4 rounded-xl text-sm font-medium">
                                {submitError}
                            </div>
                        )}

                        {/* Form Execution Action Button */}
                        <button
                            type="submit"
                            disabled={contactMutation.isPending}
                            className="w-full bg-brand-lavender text-primary font-label-md uppercase tracking-widest py-5 rounded-full hover:brightness-105 transition-all shadow-sm font-medium disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {contactMutation.isPending ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    Sending...
                                </>
                            ) : (
                                'Send Inquiry'
                            )}
                        </button>
                    </form>
                </div>

                {/* RIGHT COMPONENT: The Atelier Address Meta Content Layout */}
                <div className="lg:col-span-5 space-y-12 lg:pl-4">
                    <div className="space-y-8">

                        {/* Direct Mail Channel */}
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 rounded-full bg-brand-sage/20 flex items-center justify-center text-secondary shrink-0">
                                <span className="material-symbols-outlined">mail</span>
                            </div>
                            <div>
                                <h4 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-1">Email the Atelier</h4>
                                <a className="font-headline-md text-headline-md hover:text-brand-lavender transition-colors font-serif" href="mailto:hello@lilthreadz.com">
                                    hello@lilthreadz.com
                                </a>
                            </div>
                        </div>

                        {/* Direct WhatsApp Channel */}
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 rounded-full bg-brand-lavender/20 flex items-center justify-center text-secondary shrink-0">
                                <span className="material-symbols-outlined">chat_bubble</span>
                            </div>
                            <div>
                                <h4 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-1">Direct via WhatsApp</h4>
                                <a className="font-headline-md text-headline-md hover:text-brand-lavender transition-colors font-serif" href="https://wa.me" target="_blank" rel="noopener noreferrer">
                                    +91 98765 43210
                                </a>
                            </div>
                        </div>

                        {/* Instagram Profile Channel */}
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 rounded-full bg-brand-blush/20 flex items-center justify-center text-secondary shrink-0">
                                <span className="material-symbols-outlined">camera_enhance</span>
                            </div>
                            <div>
                                <h4 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-1">Follow our Story</h4>
                                <a className="font-headline-md text-headline-md hover:text-brand-lavender transition-colors font-serif" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                    @lilthreadz.priya
                                </a>
                            </div>
                        </div>

                    </div>

                    <hr className="border-surface-container-highest" />

                    {/* Operational Hours and Local Metadata Fields */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-4">Studio Hours</h4>
                            <ul className="space-y-2 font-body-md text-on-surface font-light text-sm">
                                <li>Mon — Fri: 10am - 6pm</li>
                                <li>Sat: 11am - 4pm</li>
                                <li className="text-outline-variant italic">Sun: Resting &amp; Designing</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-4">Studio Address</h4>
                            <address className="not-italic font-body-md text-on-surface leading-relaxed font-light text-sm">
                                12/A Weaver's Lane<br />
                                Artisan District<br />
                                Jaipur, Rajasthan 302001
                            </address>
                        </div>
                    </div>
                </div>
            </div>

            {/* ACCORDION FAQ SECTION COMPONENT */}
            <section className="mt-32 max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <span className="font-label-md text-label-md uppercase tracking-[0.2em] text-secondary mb-4 block">
                        Common Questions
                    </span>
                    <h2 className="font-headline-lg text-headline-lg font-serif">
                        You might be wondering
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqData.map((item, index) => {
                        const isOpen = activeFaq === index;
                        return (
                            <div
                                key={index}
                                className="accordion-item bg-surface-container-low rounded-xl overflow-hidden border border-surface-container-highest/30 transition-all duration-300"
                            >
                                {/* Header Toggle Click Hook */}
                                <button
                                    type="button"
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                >
                                    <span className="font-body-lg font-medium text-on-surface">
                                        {item.question}
                                    </span>
                                    <span
                                        className={`material-symbols-outlined accordion-icon transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                                            }`}
                                    >
                                        expand_more
                                    </span>
                                </button>

                                {/* Collapsible content wrapper */}
                                <div
                                    className={`accordion-content overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40' : 'max-h-0'
                                        }`}
                                >
                                    <div className="px-6 pb-6 text-on-surface-variant leading-relaxed font-light text-sm">
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

        </main>
    );
}
