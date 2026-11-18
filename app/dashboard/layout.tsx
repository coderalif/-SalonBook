'use client';

// ========================================================
// Dashboard Layout (সেন্ট্রাল প্রটেক্টেড ড্যাশবোর্ড লেআউট)
// ========================================================

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, isAdmin, isCustomer } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            // ১. যদি ইউজার লগইন না থাকে, তবে সাইনইন পেইজে রিডাইরেক্ট
            if (!user) {
                router.replace(`/signin?redirect=${pathname}`);
                return;
            }

            // ২. রোল ভেরিফিকেশন ও প্রিভেনশন:
            // "Users must not be able to access another role's dashboard by manually changing the URL"
            if (pathname.startsWith('/dashboard/admin') && user.role !== 'admin') {
                router.replace('/dashboard/customer');
                return;
            }

            if (pathname.startsWith('/dashboard/customer') && user.role !== 'customer') {
                router.replace('/dashboard/admin');
                return;
            }
        }
    }, [user, loading, pathname, router]);

    // লোডিং স্টেট প্রদর্শন
    if (loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
                <p className="text-sm font-medium text-gray-500">Verifying session and permissions...</p>
            </div>
        );
    }

    // যদি ইউজার না থাকে তবে রিডাইরেক্ট না হওয়া পর্যন্ত অপেক্ষা
    if (!user) {
        return null;
    }

    // যদি অ্যাকাউন্ট ব্লক করা থাকে
    // রিকোয়ারমেন্ট: "Blocked users must not access protected platform features"
    if (user.isBlocked) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-red-200 text-center shadow-xl space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Account Suspended</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Your account has been temporarily blocked by the administrator. You cannot access dashboard features or book appointments.
                    </p>
                    <p className="text-xs text-gray-400">Please contact support@salonbook.com for assistance.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/60 flex flex-col lg:flex-row">
            {/* সাইডবার নেভিগেশন */}
            <DashboardSidebar />

            {/* মূল ড্যাশবোর্ড কনটেন্ট এরিয়া */}
            <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
