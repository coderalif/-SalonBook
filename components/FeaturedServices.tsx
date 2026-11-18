'use client';

// ========================================================
// Featured Services Section (Dynamic Section 1)
// ডাটাবেজ থেকে অ্যাক্টিভ ন্যূনতম ৬টি ফিচারড সার্ভিস লোড করা
// ========================================================

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Clock, Tag, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export interface ServiceItem {
    _id: string;
    serviceName: string;
    category: string;
    description: string;
    price: number;
    duration: number;
    image: string;
    status: 'active' | 'inactive';
}

export default function FeaturedServices() {
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                setLoading(true);
                // ব্যাকএন্ড থেকে অন্তত ৬টি অ্যাক্টিভ সার্ভিস আনা
                const res = await apiFetch('/services?limit=6');
                if (res.success && res.services) {
                    setServices(res.services);
                } else {
                    setError('Failed to load featured services.');
                }
            } catch (err: any) {
                setError(err.message || 'Error connecting to server.');
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* সেকশন হেডার */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Featured Services</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Popular Salon Treatments
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base max-w-xl">
                            Handpicked luxury treatments crafted by our master stylists to elevate your style and well-being.
                        </p>
                    </div>

                    <Link
                        href="/services"
                        className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700 group"
                    >
                        View All Services
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* লোডিং স্কেলিটন */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-50 rounded-3xl p-4 animate-pulse space-y-4 border border-gray-100">
                                <div className="w-full h-52 bg-gray-200 rounded-2xl" />
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="h-6 bg-gray-200 rounded w-3/4" />
                                <div className="h-4 bg-gray-200 rounded w-full" />
                                <div className="h-10 bg-gray-200 rounded-xl" />
                            </div>
                        ))}
                    </div>
                )}

                {/* এরর স্টেট */}
                {!loading && error && (
                    <div className="p-8 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* সার্ভিস কার্ড গ্রিড */}
                {!loading && !error && services.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div
                                key={service._id}
                                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-rose-100 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    {/* সার্ভিস ইমেজ ও ক্যাটাগরি ব্যাজ */}
                                    <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                                        <img
                                            src={service.image}
                                            alt={service.serviceName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-gray-800 shadow-sm">
                                                <Tag className="w-3 h-3 text-rose-500" />
                                                {service.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* কার্ড বডি কন্টেন্ট */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                            <span className="flex items-center gap-1 text-gray-600 font-medium">
                                                <Clock className="w-3.5 h-3.5 text-rose-500" />
                                                {service.duration} mins
                                            </span>
                                            <span className="text-lg font-bold text-rose-600">
                                                ${service.price}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                                            {service.serviceName}
                                        </h3>

                                        <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>

                                {/* ভিউ ডিটেইলস বাটন */}
                                <div className="p-6 pt-0">
                                    <Link
                                        href={`/services/${service._id}`}
                                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white transition-all duration-200"
                                    >
                                        View Details
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* যদি কোনো সার্ভিস না থাকে */}
                {!loading && !error && services.length === 0 && (
                    <div className="text-center py-16 bg-gray-50 rounded-3xl">
                        <p className="text-gray-500 text-sm">No featured services found at the moment.</p>
                    </div>
                )}

            </div>
        </section>
    );
}
