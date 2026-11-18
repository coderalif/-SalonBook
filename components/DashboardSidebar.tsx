'use client';

// ========================================================
// Dashboard Sidebar Navigation (Role-Based)
// ========================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard,
    Calendar,
    Scissors,
    Users,
    Receipt,
    UserCheck,
    LogOut,
    Sparkles,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';

export default function DashboardSidebar() {
    const { user, isAdmin, isCustomer, logout } = useAuth();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    // কাস্টমার নেভিগেশন আইটেমসমূহ
    const customerLinks = [
        {
            name: 'Dashboard Overview',
            href: '/dashboard/customer',
            icon: LayoutDashboard,
        },
        {
            name: 'My Appointments',
            href: '/dashboard/customer/appointments',
            icon: Calendar,
        },
        {
            name: 'My Profile',
            href: '/dashboard/customer/profile',
            icon: UserCheck,
        },
    ];

    // অ্যাডমিন নেভিগেশন আইটেমসমূহ
    const adminLinks = [
        {
            name: 'Admin Overview',
            href: '/dashboard/admin',
            icon: LayoutDashboard,
        },
        {
            name: 'Manage Services',
            href: '/dashboard/admin/services',
            icon: Scissors,
        },
        {
            name: 'Manage Appointments',
            href: '/dashboard/admin/appointments',
            icon: Calendar,
        },
        {
            name: 'Manage Users',
            href: '/dashboard/admin/users',
            icon: Users,
        },
        {
            name: 'Payment Transactions',
            href: '/dashboard/admin/transactions',
            icon: Receipt,
        },
        {
            name: 'My Profile',
            href: '/dashboard/admin/profile',
            icon: UserCheck,
        },
    ];

    const currentLinks = isAdmin ? adminLinks : customerLinks;

    return (
        <>
            {/* মোবাইল টগল বাটন */}
            <div className="lg:hidden p-4 bg-white border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-rose-600" />
                    <span className="font-bold text-gray-900 text-sm">
                        {isAdmin ? 'Admin Console' : 'Customer Portal'}
                    </span>
                </div>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 rounded-lg bg-gray-50 text-gray-700 hover:text-rose-600"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* সাইডবার কন্টেইনার */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
                    mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
                }`}
            >
                <div>
                    {/* সাইডবার হেডার */}
                    <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                        <img
                            src={user?.image || 'https://i.ibb.co.com/4pDNDk1/avatar-placeholder.png'}
                            alt={user?.name || 'User'}
                            className="w-11 h-11 rounded-full object-cover border-2 border-rose-200"
                        />
                        <div className="overflow-hidden">
                            <h4 className="text-sm font-bold text-gray-900 truncate">{user?.name}</h4>
                            <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                                    isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                                }`}
                            >
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    {/* নেভিগেশন লিঙ্কসমূহ */}
                    <nav className="p-4 space-y-1.5">
                        <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Menu
                        </p>
                        {currentLinks.map((item, idx) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={idx}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-medium transition-all ${
                                        active
                                            ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-600/20'
                                            : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50/60'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-400'}`} />
                                        <span>{item.name}</span>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 opacity-70 ${active ? 'inline' : 'hidden'}`} />
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* সাইডবার ফুটার ও লগআউট বাটন */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
