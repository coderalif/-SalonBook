'use client';

// ========================================================
// Admin Dashboard Overview (এডমিন ওভারভিউ ও পরিসংখ্যান)
// ========================================================

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import {
    Users,
    Scissors,
    Calendar,
    Clock,
    CheckCircle2,
    CreditCard,
    DollarSign,
    ArrowRight,
    Sparkles,
    Shield
} from 'lucide-react';

interface AdminStats {
    totalCustomers: number;
    totalActiveServices: number;
    totalAppointments: number;
    pendingAppointments: number;
    confirmedAppointments: number;
    successfulPaymentsCount: number;
    totalRevenue: number;
}

export default function AdminDashboardOverview() {
    const [stats, setStats] = useState<AdminStats>({
        totalCustomers: 0,
        totalActiveServices: 0,
        totalAppointments: 0,
        pendingAppointments: 0,
        confirmedAppointments: 0,
        successfulPaymentsCount: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                setLoading(true);
                const res = await apiFetch('/appointments/stats/admin');
                if (res.success && res.stats) {
                    setStats(res.stats);
                }
            } catch (err) {
                console.error('Failed to load admin stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminStats();
    }, []);

    const statCards = [
        {
            title: 'Registered Customers',
            count: stats.totalCustomers,
            icon: Users,
            color: 'from-blue-500 to-indigo-600',
            bg: 'bg-blue-50 text-blue-600',
            link: '/dashboard/admin/users',
        },
        {
            title: 'Active Salon Services',
            count: stats.totalActiveServices,
            icon: Scissors,
            color: 'from-purple-500 to-pink-600',
            bg: 'bg-purple-50 text-purple-600',
            link: '/dashboard/admin/services',
        },
        {
            title: 'Total Appointments',
            count: stats.totalAppointments,
            icon: Calendar,
            color: 'from-amber-500 to-orange-600',
            bg: 'bg-amber-50 text-amber-600',
            link: '/dashboard/admin/appointments',
        },
        {
            title: 'Pending Approvals',
            count: stats.pendingAppointments,
            icon: Clock,
            color: 'from-rose-500 to-red-600',
            bg: 'bg-rose-50 text-rose-600',
            link: '/dashboard/admin/appointments',
        },
        {
            title: 'Confirmed Bookings',
            count: stats.confirmedAppointments,
            icon: CheckCircle2,
            color: 'from-emerald-500 to-teal-600',
            bg: 'bg-emerald-50 text-emerald-600',
            link: '/dashboard/admin/appointments',
        },
        {
            title: 'Successful Payments',
            count: stats.successfulPaymentsCount,
            icon: CreditCard,
            color: 'from-teal-500 to-cyan-600',
            bg: 'bg-teal-50 text-teal-600',
            link: '/dashboard/admin/transactions',
        },
        {
            title: 'Total Gross Revenue',
            count: `$${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'from-emerald-600 to-green-700',
            bg: 'bg-green-50 text-green-700',
            link: '/dashboard/admin/transactions',
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* এডমিন হেডার ব্যানার */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8 text-white shadow-xl">
                <div className="relative z-10 max-w-2xl space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-500/30">
                        <Shield className="w-3.5 h-3.5" /> Administrator Control Center
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Platform Performance & Analytics
                    </h1>
                    <p className="text-sm text-gray-300">
                        Monitor appointments, manage salon services, review customer accounts, and audit Stripe payments in real-time.
                    </p>
                </div>
            </div>

            {/* মেট্রিক্স গ্রিড */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Operations Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {statCards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <Link
                                key={idx}
                                href={card.link}
                                className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-rose-100 transition-all block"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                                </div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.title}</p>
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                                    {loading ? '...' : card.count}
                                </h3>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* অ্যাডমিন কুইক এক্সেস মডিউলস */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Scissors className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-gray-900">Manage Services</h4>
                        <p className="text-xs text-gray-500">
                            Add new salon treatments, update prices, upload photos to ImgBB, and toggle active visibility.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/admin/services"
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                        Open Services Console <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-gray-900">Appointment Approvals</h4>
                        <p className="text-xs text-gray-500">
                            Review customer booking requests, confirm time slots, or cancel conflicting appointments.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/admin/appointments"
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                        Review Bookings <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-gray-900">Customer Security</h4>
                        <p className="text-xs text-gray-500">
                            View registered customer accounts and block or unblock accounts with a single toggle.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/admin/users"
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                        Manage Users <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

        </div>
    );
}
