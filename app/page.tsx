// ========================================================
// Home Page (প্রধান ল্যান্ডিং পেইজ)
// ========================================================

import React from 'react';
import HeroBanner from '@/components/HeroBanner';
import FeaturedServices from '@/components/FeaturedServices';
import CategoriesSection from '@/components/CategoriesSection';
import WhyChooseUs from '@/components/WhyChooseUs';

export default function HomePage() {
    return (
        <div className="space-y-0">
            {/* ১. হিরো ব্যানার সেকশন */}
            <HeroBanner />

            {/* ২. ডাইনামিক সেকশন ১: ফিচারড সার্ভিসেস (ডাটাবেজ থেকে অন্তত ৬টি অ্যাক্টিভ সার্ভিস) */}
            <FeaturedServices />

            {/* ৩. ডাইনামিক সেকশন ২: স্যালুন সার্ভিস ক্যাটাগরি তালিকা */}
            <CategoriesSection />

            {/* ৪. অতিরিক্ত কাস্টম সেকশন: হোয়াই চুজ সেলুনবুক / স্পেশাল সার্ভিস গ্যারান্টি */}
            <WhyChooseUs />
        </div>
    );
}
