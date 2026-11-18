'use client';

// ========================================================
// Payment Cancel Page (Stripe পেমেন্ট বাতিল হলে)
// ========================================================

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowLeft, RefreshCw, Calendar } from 'lucide-react';

function CancelContent() {
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get('appointmentId');

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 text-center space-y-6 shadow-xl">
                
                <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border-4 border-amber-100">
                    <AlertCircle className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase">
                        Checkout Incomplete
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                        Payment Cancelled
                    </h1>
                    <p className="text-sm text-gray-500">
                        You cancelled the Stripe checkout process. No charges were made to your account.
                    </p>
                </div>

                <p className="text-xs text-gray-500 bg-gray-50 p-4 rounded-2xl border">
                    Your appointment is still reserved with Confirmed status. You can pay anytime from your customer dashboard before your appointment time.
                </p>

                <div className="flex flex-col gap-2 pt-2">
                    <Link
                        href="/dashboard/customer/appointments"
                        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-md transition-all"
                    >
                        <Calendar className="w-4 h-4" /> Return to My Appointments
                    </Link>

                    <Link
                        href="/"
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl text-gray-600 hover:text-gray-900 text-xs font-semibold"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Home Page
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentCancelPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <CancelContent />
        </Suspense>
    );
}
