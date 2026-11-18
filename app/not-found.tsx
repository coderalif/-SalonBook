// ========================================================
// Custom 404 Not Found Page (অজানা পেজ হ্যান্ডলার)
// ========================================================

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-xl">
                <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border-4 border-rose-100">
                    <Search className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                    <span className="text-4xl font-extrabold text-rose-600">404</span>
                    <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
                    <p className="text-sm text-gray-500">
                        The beauty treatment or page you are looking for doesn&apos;t exist or has been relocated.
                    </p>
                </div>

                <div className="pt-2">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-md transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return to SalonBook Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
