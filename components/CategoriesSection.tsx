// ========================================================
// Categories Section (Dynamic Section 2)
// স্যালুন সার্ভিস ক্যাটাগরি ব্রাউজ ও এক্সপ্লোর করার সেকশন
// ========================================================

import React from 'react';
import Link from 'next/link';
import { Scissors, Sparkles, Smile, Flower2, HeartHandshake, Palette, Eye, ArrowRight } from 'lucide-react';

const categories = [
    {
        name: 'Haircut & Styling',
        description: 'Precision cuts, fades, trims & blowouts',
        icon: Scissors,
        color: 'from-rose-500 to-pink-500',
        bgLight: 'bg-rose-50 text-rose-600',
    },
    {
        name: 'Hair Coloring',
        description: 'Balayage, ombre, highlights & root touch-ups',
        icon: Palette,
        color: 'from-amber-500 to-orange-500',
        bgLight: 'bg-amber-50 text-amber-600',
    },
    {
        name: 'Hair Treatment',
        description: 'Keratin smoothing, deep conditioning & repair',
        icon: Sparkles,
        color: 'from-purple-500 to-indigo-500',
        bgLight: 'bg-purple-50 text-purple-600',
    },
    {
        name: 'Facial & Skincare',
        description: 'Hydra glow facials, anti-aging & skin peel',
        icon: Smile,
        color: 'from-emerald-500 to-teal-500',
        bgLight: 'bg-emerald-50 text-emerald-600',
    },
    {
        name: 'Makeup',
        description: 'Bridal makeover, glam party & evening looks',
        icon: Eye,
        color: 'from-pink-500 to-rose-500',
        bgLight: 'bg-pink-50 text-pink-600',
    },
    {
        name: 'Manicure & Pedicure',
        description: 'Gel nails, nail art, paraffin & spa pedicure',
        icon: Flower2,
        color: 'from-blue-500 to-cyan-500',
        bgLight: 'bg-blue-50 text-blue-600',
    },
    {
        name: 'Spa & Massage',
        description: 'Swedish therapy, hot stone & aromatherapy',
        icon: HeartHandshake,
        color: 'from-teal-500 to-emerald-500',
        bgLight: 'bg-teal-50 text-teal-600',
    },
];

export default function CategoriesSection() {
    return (
        <section className="py-20 bg-slate-50/60 border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <span className="px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-wider">
                        Explore by Category
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
                        Tailored Beauty Treatments
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base">
                        Choose from our specialized categories designed for your personal care and total relaxation.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((cat, idx) => {
                        const Icon = cat.icon;
                        return (
                            <Link
                                key={idx}
                                href={`/services?category=${encodeURIComponent(cat.name)}`}
                                className="group bg-white p-6 rounded-3xl border border-gray-200/70 hover:border-rose-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className={`w-12 h-12 rounded-2xl ${cat.bgLight} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                                            {cat.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                            {cat.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-rose-600 group-hover:gap-2 transition-all">
                                    <span>Browse Services</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
