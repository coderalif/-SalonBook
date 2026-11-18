// ========================================================
// Footer Component (সবার নিচে প্রদর্শিত ফুটার)
// ========================================================

import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-950 text-gray-300 pt-16 pb-8 border-t border-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    
                    {/* কলাম ১: লোগো ও বর্ণনা */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">
                                SalonBook
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Your premier salon appointment booking destination. Experience premium beauty treatments, hair styling, skin therapies, and luxury wellness care by certified stylists.
                        </p>
                        {/* সোশ্যাল মিডিয়া লিঙ্ক */}
                        <div className="flex items-center gap-3 pt-2">
                            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-rose-600 transition-colors">
                                f
                            </a>
                            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-rose-600 transition-colors">
                                in
                            </a>
                            <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-rose-600 transition-colors">
                                tw
                            </a>
                        </div>
                    </div>

                    {/* কলাম ২: গুরুত্বপূর্ণ নেভিগেশন লিঙ্ক */}
                    <div>
                        <h3 className="text-white text-base font-semibold tracking-wider uppercase mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/" className="hover:text-rose-400 transition-colors">Home Page</Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-rose-400 transition-colors">Browse All Services</Link>
                            </li>
                            <li>
                                <Link href="/services?category=Haircut+%26+Styling" className="hover:text-rose-400 transition-colors">Hair Styling & Cuts</Link>
                            </li>
                            <li>
                                <Link href="/services?category=Facial+%26+Skincare" className="hover:text-rose-400 transition-colors">Facial & Skincare</Link>
                            </li>
                            <li>
                                <Link href="/services?category=Spa+%26+Massage" className="hover:text-rose-400 transition-colors">Spa & Relaxation</Link>
                            </li>
                        </ul>
                    </div>

                    {/* কলাম ৩: যোগাযোগের তথ্য */}
                    <div>
                        <h3 className="text-white text-base font-semibold tracking-wider uppercase mb-4">
                            Contact Info
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                <span>Road 12, Banani Luxury Block, Dhaka 1213, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-rose-500 shrink-0" />
                                <span>+880 1712-345678</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-rose-500 shrink-0" />
                                <span>support@salonbook.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* কলাম ৪: খোলার সময়সূচী */}
                    <div>
                        <h3 className="text-white text-base font-semibold tracking-wider uppercase mb-4">
                            Opening Hours
                        </h3>
                        <div className="space-y-2 text-sm text-gray-400">
                            <div className="flex items-center gap-2 text-rose-400 font-medium">
                                <Clock className="w-4 h-4" />
                                <span>Monday - Friday:</span>
                            </div>
                            <p className="pl-6 text-gray-300">09:00 AM - 09:00 PM</p>

                            <div className="flex items-center gap-2 text-rose-400 font-medium pt-2">
                                <Clock className="w-4 h-4" />
                                <span>Saturday - Sunday:</span>
                            </div>
                            <p className="pl-6 text-gray-300">10:00 AM - 08:00 PM</p>
                        </div>
                    </div>

                </div>

                {/* কপিরাইট সেকশন */}
                <div className="pt-8 mt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
                    <p>&copy; 2026 SalonBook Platform. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for your beauty and elegance
                    </p>
                </div>
            </div>
        </footer>
    );
}
