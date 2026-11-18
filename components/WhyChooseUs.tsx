// ========================================================
// Why Choose Us Section (Extra Custom Section for 100% Marks)
// SalonBook-এর বিশেষ সুবিধাসমূহ প্রদর্শন
// ========================================================

import React from 'react';
import { Award, Leaf, CalendarClock, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

const benefits = [
    {
        icon: Award,
        title: 'Master Certified Stylists',
        description: 'Our specialists have 10+ years of industry experience and internationally certified diplomas in cosmetology.',
        color: 'text-rose-600 bg-rose-50',
    },
    {
        icon: Leaf,
        title: '100% Organic Products',
        description: 'We exclusively use sulfate-free, vegan, and cruelty-free premium hair and skincare formulas for radiant results.',
        color: 'text-emerald-600 bg-emerald-50',
    },
    {
        icon: CalendarClock,
        title: 'Instant Online Booking',
        description: 'No waiting on hold! Pick your favorite stylist, date, and preferred time slot in under 60 seconds.',
        color: 'text-blue-600 bg-blue-50',
    },
    {
        icon: ShieldCheck,
        title: 'Strict Hygiene & Safety',
        description: 'Every salon workstation, scissor, and styling tool is hospital-grade UV sanitized between client appointments.',
        color: 'text-purple-600 bg-purple-50',
    },
    {
        icon: CreditCard,
        title: 'Secure Stripe Payments',
        description: 'Pay seamlessly with card through Stripe. No hidden fees, instant invoice generation, and full transaction history.',
        color: 'text-amber-600 bg-amber-50',
    },
    {
        icon: Sparkles,
        title: 'Personalized Consultation',
        description: 'Every appointment begins with a free 10-minute visual analysis tailored to your hair texture and skin undertone.',
        color: 'text-pink-600 bg-pink-50',
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                    <span className="px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-wider">
                        The SalonBook Standard
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
                        Why Thousands of Clients Trust SalonBook
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                        We blend high-end salon artistry with modern technology to deliver a serene, hassle-free grooming journey from booking to finish.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={index}
                                className="p-8 rounded-3xl border border-gray-100 bg-slate-50/40 hover:bg-white hover:border-rose-200 hover:shadow-xl transition-all duration-300 space-y-4"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* কল-টু-অ্যাকশন ব্যানার স্ট্রিপ */}
                <div className="mt-16 bg-gradient-to-r from-rose-600 to-rose-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-2xl sm:text-3xl font-bold">Ready to Experience True Luxury?</h3>
                        <p className="text-rose-100 text-sm max-w-lg">
                            Book your customized appointment today and receive a complimentary beauty consultation.
                        </p>
                    </div>
                    <a
                        href="/services"
                        className="px-8 py-4 bg-white text-rose-600 font-bold rounded-full text-sm shadow-md hover:bg-rose-50 hover:shadow-lg transition-all shrink-0"
                    >
                        Book Your Session Now
                    </a>
                </div>

            </div>
        </section>
    );
}
