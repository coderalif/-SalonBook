'use client';

// ========================================================
// Payment Success Page (Stripe পেমেন্ট নিশ্চিতকরণ)
// ========================================================

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { CheckCircle2, Calendar, Clock, ArrowRight, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState<any>(null);

    useEffect(() => {
        if (!sessionId) {
            setLoading(false);
            return;
        }

        // স্ট্রাইপ সেশন ভেরিফাই করা এবং পেমেন্ট স্ট্যাটাস নিশ্চিত করা
        apiFetch(`/payments/verify-session/${sessionId}`)
            .then((res) => {
                if (res.success && res.appointment) {
                    setAppointment(res.appointment);
                }
            })
            .catch((err) => {
                console.error('Session verify failed:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [sessionId]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-emerald-100 shadow-xl shadow-emerald-50 text-center space-y-6">
                
                {/* সাকসেস আইকন */}
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-100 animate-in zoom-in">
                    <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase">
                        <ShieldCheck className="w-3.5 h-3.5" /> Payment Verified
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                        Payment Successful!
                    </h1>
                    <p className="text-sm text-gray-500">
                        Thank you! Your salon appointment has been confirmed and paid in full.
                    </p>
                </div>

                {loading ? (
                    <div className="py-6 flex justify-center items-center gap-2 text-xs text-gray-400">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        <span>Verifying appointment details...</span>
                    </div>
                ) : appointment ? (
                    <div className="bg-gray-50/80 rounded-2xl p-4 text-left space-y-2 text-xs text-gray-600 border border-gray-100">
                        <p className="font-bold text-gray-900 text-sm">{appointment.serviceId?.serviceName}</p>
                        <div className="flex justify-between">
                            <span>Appointment Date:</span>
                            <span className="font-semibold text-gray-800">{appointment.appointmentDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Time Slot:</span>
                            <span className="font-semibold text-gray-800">{appointment.timeSlot}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-900">
                            <span>Total Paid:</span>
                            <span className="text-emerald-600">${appointment.servicePrice}</span>
                        </div>
                    </div>
                ) : (
                    <p className="text-xs text-gray-400">Your appointment status has been updated to Paid.</p>
                )}

                <div className="pt-2">
                    <Link
                        href="/dashboard/customer/appointments"
                        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md transition-all"
                    >
                        View My Appointments <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Verifying payment...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
