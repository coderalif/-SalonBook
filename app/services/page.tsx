'use client';

// ========================================================
// Browse Services Page (সার্ভিস ব্রাউজিং, সার্চ, ফিল্টার ও সর্টিং)
// ========================================================

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Search, Filter, ArrowUpDown, Clock, Tag, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { ServiceItem } from '@/components/FeaturedServices';

function ServicesContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || 'All';

    const [services, setServices] = useState<ServiceItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [sortBy, setSortBy] = useState(''); // '' | 'lowToHigh' | 'highToLow'
    const [loading, setLoading] = useState(true);

    // ১. ব্যাকএন্ড থেকে স্বতন্ত্র ক্যাটাগরি তালিকা আনা
    useEffect(() => {
        apiFetch('/services/categories').then((res) => {
            if (res.success && res.categories) {
                setCategories(['All', ...res.categories]);
            }
        });
    }, []);

    // ২. ফিল্টার ও সার্চ অনুযায়ী সার্ভিস ফেচ করা
    const fetchServices = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            if (search.trim()) params.append('search', search.trim());
            if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
            if (sortBy) params.append('sort', sortBy);

            const queryString = params.toString() ? `?${params.toString()}` : '';
            const res = await apiFetch(`/services${queryString}`);

            if (res.success && res.services) {
                setServices(res.services);
            }
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setLoading(false);
        }
    };

    // সার্চ, ক্যাটাগরি বা সর্টিং পরিবর্তন হলে স্বয়ংক্রিয়ভাবে ডাটা লোড হবে
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchServices();
        }, 300); // 300ms ডিবউন্স

        return () => clearTimeout(timer);
    }, [search, selectedCategory, sortBy]);

    // ফিল্টার রিসেট
    const handleResetFilters = () => {
        setSearch('');
        setSelectedCategory('All');
        setSortBy('');
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* পেজ হেডার */}
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                    <span className="px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-wider">
                        Full Catalog
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
                        Explore Salon Services
                    </h1>
                    <p className="text-gray-500 text-sm sm:text-base">
                        Browse our complete suite of styling, beauty, and rejuvenating treatments. Filter, sort, and book your session in moments.
                    </p>
                </div>

                {/* ফিল্টার বার: সার্চ, ক্যাটাগরি এবং সর্টিং */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-10 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        
                        {/* ১. সার্চ বার (Search by Name) */}
                        <div className="md:col-span-5 relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Search className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search treatments (e.g. Haircut, Facial)..."
                                className="w-full pl-11 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                            />
                        </div>

                        {/* ২. ক্যাটাগরি ড্রপডাউন (Category Filter) */}
                        <div className="md:col-span-4 relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Filter className="w-4 h-4" />
                            </div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-gray-700 cursor-pointer"
                            >
                                <option value="All">All Categories</option>
                                {categories
                                    .filter((c) => c !== 'All')
                                    .map((category, idx) => (
                                        <option key={idx} value={category}>
                                            {category}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* ৩. প্রাইস সর্টিং (Sort by Price: Low to High / High to Low) */}
                        <div className="md:col-span-3 relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <ArrowUpDown className="w-4 h-4" />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-gray-700 cursor-pointer"
                            >
                                <option value="">Sort by Price</option>
                                <option value="lowToHigh">Price: Low to High</option>
                                <option value="highToLow">Price: High to Low</option>
                            </select>
                        </div>

                    </div>

                    {/* সক্রিয় ফিল্টার ও রিসেট বাটন */}
                    {(search || selectedCategory !== 'All' || sortBy) && (
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                            <span>
                                Showing results for {selectedCategory !== 'All' ? `"${selectedCategory}"` : 'all categories'}
                                {search ? ` matching "${search}"` : ''}
                            </span>
                            <button
                                onClick={handleResetFilters}
                                className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* সার্ভিস কার্ড গ্রিড */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl p-4 animate-pulse space-y-4 border border-gray-100">
                                <div className="w-full h-56 bg-gray-200 rounded-2xl" />
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="h-6 bg-gray-200 rounded w-3/4" />
                                <div className="h-4 bg-gray-200 rounded w-full" />
                                <div className="h-10 bg-gray-200 rounded-xl" />
                            </div>
                        ))}
                    </div>
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div
                                key={service._id}
                                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-rose-100 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                                        <img
                                            src={service.image}
                                            alt={service.serviceName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-gray-800 shadow-sm">
                                                <Tag className="w-3 h-3 text-rose-500" />
                                                {service.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                            <span className="flex items-center gap-1 text-gray-600 font-medium">
                                                <Clock className="w-3.5 h-3.5 text-rose-500" />
                                                {service.duration} mins
                                            </span>
                                            <span className="text-xl font-bold text-rose-600">
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
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No Services Found</h3>
                        <p className="text-sm text-gray-500 max-w-md mx-auto">
                            We couldn&apos;t find any salon services matching your current filters. Try searching with different keywords or reset filters.
                        </p>
                        <button
                            onClick={handleResetFilters}
                            className="px-6 py-2.5 bg-rose-600 text-white rounded-full text-xs font-semibold hover:bg-rose-700 transition-colors"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default function ServicesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading services...</div>}>
            <ServicesContent />
        </Suspense>
    );
}
