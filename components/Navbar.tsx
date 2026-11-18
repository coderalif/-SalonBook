'use client';

// ========================================================
// Navbar Component (Responsive Navigation with Role Support)
// ========================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Menu, X, User as UserIcon, LogOut, LayoutDashboard, Calendar, Scissors } from 'lucide-react';

export default function Navbar() {
    const { user, isAdmin, isCustomer, logout } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // অ্যাক্টিভ লিঙ্ক চেক করার ফাংশন
    const isActive = (path: string) => pathname === path;

    // ড্যাশবোর্ড লিঙ্ক নির্ধারণ (Admin বনাম Customer)
    const dashboardLink = isAdmin ? '/dashboard/admin' : '/dashboard/customer';

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                    
                    {/* লোগো ও ব্র্যান্ড নাম */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                                SalonBook
                            </span>
                            <span className="text-[10px] tracking-widest text-gray-400 font-medium uppercase -mt-1">
                                Beauty & Wellness
                            </span>
                        </div>
                    </Link>

                    {/* ডেক্সটপ নেভিগেশন লিঙ্কসমূহ */}
                    <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
                        <Link
                            href="/"
                            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                                isActive('/')
                                    ? 'bg-rose-50 text-rose-600 font-semibold'
                                    : 'text-gray-700 hover:text-rose-600 hover:bg-rose-50/50'
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/services"
                            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                                isActive('/services')
                                    ? 'bg-rose-50 text-rose-600 font-semibold'
                                    : 'text-gray-700 hover:text-rose-600 hover:bg-rose-50/50'
                            }`}
                        >
                            Browse Services
                        </Link>

                        {/* যদি কাস্টমার লগইন থাকে তবে My Appointments লিঙ্ক দেখানো */}
                        {user && isCustomer && (
                            <Link
                                href="/dashboard/customer/appointments"
                                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                                    isActive('/dashboard/customer/appointments')
                                        ? 'bg-rose-50 text-rose-600 font-semibold'
                                        : 'text-gray-700 hover:text-rose-600 hover:bg-rose-50/50'
                                }`}
                            >
                                My Bookings
                            </Link>
                        )}
                    </nav>

                    {/* ডেক্সটপ অথেন্টিকেশন স্টেট (লগইন বনাম সাইনইন বাটন) */}
                    <div className="hidden md:flex items-center space-x-3">
                        {user ? (
                            <div className="relative">
                                {/* ইউজার প্রোফাইল বাটন ও ড্রপডাউন ট্রিগার */}
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-rose-200 hover:border-rose-400 hover:shadow-sm transition-all focus:outline-none"
                                >
                                    <img
                                        src={user.image || 'https://i.ibb.co.com/4pDNDk1/avatar-placeholder.png'}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full object-cover border border-rose-200"
                                    />
                                    <div className="text-left hidden lg:block">
                                        <p className="text-xs font-semibold text-gray-800 leading-tight">
                                            {user.name.split(' ')[0]}
                                        </p>
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                                            isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </button>

                                {/* ড্রপডাউন মেনু */}
                                {dropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                                        onMouseLeave={() => setDropdownOpen(false)}
                                    >
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>

                                        <Link
                                            href={dashboardLink}
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                        >
                                            <LayoutDashboard className="w-4 h-4 text-rose-500" />
                                            {isAdmin ? 'Admin Dashboard' : 'Customer Dashboard'}
                                        </Link>

                                        {isCustomer && (
                                            <Link
                                                href="/dashboard/customer/appointments"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                            >
                                                <Calendar className="w-4 h-4 text-rose-500" />
                                                My Appointments
                                            </Link>
                                        )}

                                        <Link
                                            href={`${dashboardLink}/profile`}
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                        >
                                            <UserIcon className="w-4 h-4 text-rose-500" />
                                            My Profile
                                        </Link>

                                        <div className="border-t border-gray-100 my-1"></div>

                                        <button
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                logout();
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    href="/signin"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-sm hover:shadow transition-all"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* মোবাইল মেনু বাটন (Hamburger) */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-gray-600 hover:text-rose-600 hover:bg-rose-50 focus:outline-none"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* মোবাইল ড্রয়ার মেনু */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-rose-100 px-4 pt-2 pb-6 space-y-3">
                    <Link
                        href="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-base font-medium ${
                            isActive('/') ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-gray-700'
                        }`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/services"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-base font-medium ${
                            isActive('/services') ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-gray-700'
                        }`}
                    >
                        Browse Services
                    </Link>

                    {user ? (
                        <div className="pt-4 border-t border-gray-100 space-y-2">
                            <div className="flex items-center gap-3 px-3 py-2 bg-rose-50/50 rounded-xl">
                                <img
                                    src={user.image || 'https://i.ibb.co.com/4pDNDk1/avatar-placeholder.png'}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full object-cover border border-rose-200"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>

                            <Link
                                href={dashboardLink}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-rose-50"
                            >
                                📊 Dashboard ({user.role})
                            </Link>

                            <Link
                                href={`${dashboardLink}/profile`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-rose-50"
                            >
                                👤 My Profile
                            </Link>

                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    logout();
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" /> Log Out
                            </button>
                        </div>
                    ) : (
                        <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                            <Link
                                href="/signin"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-center py-2.5 rounded-lg border border-rose-200 text-sm font-medium text-rose-600 hover:bg-rose-50"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-center py-2.5 rounded-lg bg-rose-600 text-sm font-medium text-white hover:bg-rose-700"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
