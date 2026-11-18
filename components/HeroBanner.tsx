// ========================================================
// Hero Banner Section (হোম পেইজের প্রধান ব্যানার)
// ========================================================

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star, CalendarCheck, ShieldCheck } from 'lucide-react';

export default function HeroBanner() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/60 via-amber-50/30 to-white py-16 sm:py-24">
            {/* ব্যাকগ্রাউন্ড ডেকোরেশন শেপ */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* বাম কলাম: টেক্সট এবং কল-টু-অ্যাকশন */}
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs sm:text-sm font-medium">
                            <Sparkles className="w-4 h-4 text-rose-600" />
                            <span>Premium Beauty & Wellness Care</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-tight">
                            Effortless Beauty, <br />
                            <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
                                Booked in Seconds.
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Discover top-tier salon treatments, bespoke hair styling, relaxing spa therapies, and expert skincare. Reserve your personalized appointment with certified beauty masters today.
                        </p>

                        {/* বাটনসমূহ */}
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                            <Link
                                href="/services"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-lg shadow-rose-600/20 hover:shadow-xl hover:shadow-rose-600/30 transition-all hover:-translate-y-0.5"
                            >
                                Explore Salon Services
                                <ArrowRight className="w-5 h-5" />
                            </Link>

                            <Link
                                href="/signup"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow transition-all"
                            >
                                Create Free Account
                            </Link>
                        </div>

                        {/* সোশ্যাল প্রুফ ব্যাজ */}
                        <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-600 border-t border-rose-100/60">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" alt="client" />
                                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="client" />
                                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="client" />
                                </div>
                                <div className="text-xs">
                                    <div className="flex text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <span className="font-semibold text-gray-800">4.9 / 5</span> (2,500+ Reviews)
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                Verified Stylists
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                <CalendarCheck className="w-4 h-4 text-rose-600" />
                                Instant Booking
                            </div>
                        </div>
                    </div>

                    {/* ডান কলাম: স্যালুন ব্যাকগ্রাউন্ড ও ফিচারড ইমেজ কার্ড */}
                    <div className="lg:col-span-5 relative">
                        <div className="relative mx-auto max-w-md lg:max-w-none">
                            {/* প্রধান ইমেজ */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800"
                                    alt="Luxury Salon Interior"
                                    className="w-full h-[420px] sm:h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <span className="px-2.5 py-1 rounded-md bg-rose-600/90 text-xs font-medium uppercase tracking-wider">
                                        Signature Experience
                                    </span>
                                    <h3 className="text-xl font-bold mt-2">Modern Styling & Therapeutic Care</h3>
                                    <p className="text-xs text-gray-200 mt-1">Book certified stylists with verified customer reviews.</p>
                                </div>
                            </div>

                            {/* ফ্লোটিং ব্যাজ ১ */}
                            <div className="absolute -top-6 -left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-rose-100 hidden sm:flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Top Rated</p>
                                    <p className="text-sm font-bold text-gray-900">#1 Salon in City</p>
                                </div>
                            </div>

                            {/* ফ্লোটিং ব্যাজ ২ */}
                            <div className="absolute -bottom-6 -right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-rose-100 hidden sm:flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                    <CalendarCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Safe & Easy</p>
                                    <p className="text-sm font-bold text-gray-900">Stripe Secured</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
