'use client';

// ========================================================
// Customer Dashboard Overview (পরিসংখ্যান ও সামারি)
// ========================================================

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { Calendar, Clock, CheckCircle2, XCircle, ArrowRight, Sparkles, Scissors } from 'lucide-react';

interface Stats {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
}

export default function CustomerDashboardOverview() {
    const { user } = useAuth();
    const [stats, setStats] = useState<Stats>({
        total: 0,
        pending: 0,
        confirmed: 0,
        cancelled: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await apiFetch('/appointments/stats/customer');
                if (res.success && res.stats) {
                    setStats(res.stats);
                }
            } catch (err) {
                console.error('Failed to load customer stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Total Appointments',
            count: stats.total,
            icon: Calendar,
            color: 'from-blue-500 to-indigo-600',
            bg: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'Pending Requests',
            count: stats.pending,
            icon: Clock,
            color: 'from-amber-500 to-orange-600',
            bg: 'bg-amber-50 text-amber-600',
        },
        {
            title: 'Confirmed Appointments',
            count: stats.confirmed,
            icon: CheckCircle2,
            color: 'from-emerald-500 to-teal-600',
            bg: 'bg-emerald-50 text-emerald-600',
        },
        {
            title: 'Cancelled Sessions',
            count: stats.cancelled,
            icon: XCircle,
            color: 'from-rose-500 to-red-600',
            bg: 'bg-rose-50 text-rose-600',
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* ওয়েলকাম ব্যানার */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 p-8 text-white shadow-xl">
                <div className="relative z-10 max-w-2xl space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" /> Customer Portal
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Hello, {user?.name.split(' ')[0]}! Welcome to your dashboard.
                    </h1>
                    <p className="text-sm text-rose-100">
                        Check your salon appointment schedules, review session confirmations, or settle payments for your upcoming treatments.
                    </p>
                </div>
            </div>

            {/* স্ট্যাটিস্টিকস কার্ড গ্রিড */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Appointment Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {statCards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.title}</p>
                                <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
                                    {loading ? '...' : card.count}
                                </h3>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* কুইক অ্যাকশন কার্ডস */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                            <Scissors className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Explore New Services</h3>
                        <p className="text-sm text-gray-500">
                            Looking for a fresh haircut, hair color, or skin rejuvenation? Check out our full service catalog.
                        </p>
                    </div>
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700"
                    >
                        Browse Catalog <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Manage My Appointments</h3>
                        <p className="text-sm text-gray-500">
                            Track the real-time status of your booking requests, cancel pending sessions, and pay for confirmed ones.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/customer/appointments"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700"
                    >
                        View My Bookings <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

        </div>
    );
}
