'use client';

// ========================================================
// Customer My Appointments Page
// কাস্টমারের নিজস্ব বুকিং তালিকা, ক্যানসেল ও স্ট্রাইপ পেমেন্ট
// ========================================================

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import {
    Calendar,
    Clock,
    CreditCard,
    Ban,
    Eye,
    AlertCircle,
    CheckCircle,
    XCircle,
    Loader2,
    Sparkles,
    Tag,
    X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AppointmentItem {
    _id: string;
    serviceId: {
        _id: string;
        serviceName: string;
        category: string;
        image: string;
        price: number;
        duration: number;
    } | null;
    appointmentDate: string;
    timeSlot: string;
    message?: string;
    servicePrice: number;
    paymentStatus: 'unpaid' | 'paid';
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
}

export default function MyAppointmentsPage() {
    const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [payingId, setPayingId] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null);

    // অ্যাপয়েন্টমেন্ট তালিকা লোড করা
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await apiFetch('/appointments/my-appointments');
            if (res.success && res.appointments) {
                setAppointments(res.appointments);
            }
        } catch (error) {
            console.error('Failed to load appointments:', error);
            toast.error('Failed to fetch your appointments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // ১. অ্যাপয়েন্টমেন্ট বাতিল করা (শুধুমাত্র Pending অবস্থায়)
    const handleCancel = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this pending appointment?')) return;

        try {
            setCancellingId(id);
            const res = await apiFetch(`/appointments/cancel/${id}`, {
                method: 'PATCH',
            });

            if (res.success) {
                toast.success('Appointment cancelled successfully.');
                fetchAppointments();
            } else {
                toast.error(res.message || 'Failed to cancel appointment.');
            }
        } catch (error: any) {
            toast.error(error.message || 'Cancellation error.');
        } finally {
            setCancellingId(null);
        }
    };

    // ২. কনফার্মড অ্যাপয়েন্টমেন্টের পেমেন্ট করা (Stripe Checkout)
    const handlePayNow = async (appointmentId: string) => {
        try {
            setPayingId(appointmentId);
            toast.loading('Redirecting to secure Stripe Checkout...', { id: 'stripe-pay' });

            const res = await apiFetch('/payments/create-checkout-session', {
                method: 'POST',
                body: JSON.stringify({ appointmentId }),
            });

            if (res.success && res.url) {
                // স্ট্রাইপ পেমেন্ট পেজে রিডাইরেক্ট
                window.location.href = res.url;
            } else {
                toast.error(res.message || 'Unable to initiate payment.', { id: 'stripe-pay' });
            }
        } catch (error: any) {
            toast.error(error.message || 'Payment initiation failed.', { id: 'stripe-pay' });
        } finally {
            setPayingId(null);
        }
    };

    // স্ট্যাটাস ব্যাজ রেন্ডার ফাংশন
    const renderStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                );
            case 'confirmed':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" /> Confirmed
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" /> Cancelled
                    </span>
                );
            default:
                return null;
        }
    };

    // পেমেন্ট ব্যাজ রেন্ডার ফাংশন
    const renderPaymentBadge = (paymentStatus: string) => {
        if (paymentStatus === 'paid') {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5" /> Paid
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                <Clock className="w-3.5 h-3.5" /> Unpaid
            </span>
        );
    };

    return (
        <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        My Salon Appointments
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        View status, cancel pending requests, or pay online for confirmed sessions.
                    </p>
                </div>
                <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors self-start sm:self-auto"
                >
                    <Sparkles className="w-4 h-4" /> Book Another Service
                </Link>
            </div>

            {/* লোডার */}
            {loading ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                    <Loader2 className="w-8 h-8 text-rose-600 animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Loading your appointments...</p>
                </div>
            ) : appointments.length > 0 ? (
                <div className="space-y-4">
                    {appointments.map((item) => {
                        const service = item.serviceId;
                        const canCancel = item.status === 'pending';
                        const canPay = item.status === 'confirmed' && item.paymentStatus === 'unpaid';

                        return (
                            <div
                                key={item._id}
                                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                            >
                                {/* সার্ভিস এবং বুকিং বিবরণ */}
                                <div className="flex items-start sm:items-center gap-4">
                                    <img
                                        src={service?.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200'}
                                        alt={service?.serviceName || 'Service'}
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border shrink-0"
                                    />
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold">
                                                {service?.category || 'Salon Service'}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                Booked on {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                            {service?.serviceName || 'Salon Service'}
                                        </h3>

                                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-1">
                                            <span className="flex items-center gap-1 font-medium">
                                                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                                                Date: <strong>{item.appointmentDate}</strong>
                                            </span>
                                            <span className="flex items-center gap-1 font-medium">
                                                <Clock className="w-3.5 h-3.5 text-rose-500" />
                                                Slot: <strong>{item.timeSlot}</strong>
                                            </span>
                                            <span className="font-bold text-gray-900 text-sm">
                                                ${item.servicePrice}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* স্ট্যাটাস ও অ্যাকশন বাটনসমূহ */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                                    <div className="flex items-center gap-2">
                                        {renderStatusBadge(item.status)}
                                        {renderPaymentBadge(item.paymentStatus)}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* বিস্তারিত দেখার বাটন */}
                                        <button
                                            onClick={() => setSelectedAppointment(item)}
                                            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
                                        >
                                            <Eye className="w-4 h-4" /> Details
                                        </button>

                                        {/* ক্যানসেল বাটন (শুধুমাত্র Pending অবস্থায়) */}
                                        {canCancel && (
                                            <button
                                                onClick={() => handleCancel(item._id)}
                                                disabled={cancellingId === item._id}
                                                className="px-3.5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                            >
                                                {cancellingId === item._id ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <Ban className="w-3.5 h-3.5" />
                                                )}
                                                Cancel
                                            </button>
                                        )}

                                        {/* পে নাও বাটন (কনফার্মড এবং আনপেইড হলে) */}
                                        {canPay && (
                                            <button
                                                onClick={() => handlePayNow(item._id)}
                                                disabled={payingId === item._id}
                                                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                            >
                                                {payingId === item._id ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <CreditCard className="w-3.5 h-3.5" />
                                                )}
                                                Pay Now (${item.servicePrice})
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                        <Calendar className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No Appointments Found</h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto">
                        You have not booked any salon sessions yet. Browse our treatments and book your first session today!
                    </p>
                    <Link
                        href="/services"
                        className="inline-block px-6 py-3 rounded-full bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
                    >
                        Browse Services
                    </Link>
                </div>
            )}

            {/* অ্যাপয়েন্টমেন্ট ডিটেইলস মডাল */}
            {selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Appointment Information</h3>
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-3">
                                <img
                                    src={selectedAppointment.serviceId?.image}
                                    alt="Service"
                                    className="w-14 h-14 rounded-xl object-cover border"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900">{selectedAppointment.serviceId?.serviceName}</h4>
                                    <p className="text-xs text-rose-600">{selectedAppointment.serviceId?.category}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-400">Date</p>
                                    <p className="font-semibold text-gray-800">{selectedAppointment.appointmentDate}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-400">Time Slot</p>
                                    <p className="font-semibold text-gray-800">{selectedAppointment.timeSlot}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-400">Service Fee</p>
                                    <p className="font-bold text-rose-600">${selectedAppointment.servicePrice}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-400">Duration</p>
                                    <p className="font-semibold text-gray-800">{selectedAppointment.serviceId?.duration} mins</p>
                                </div>
                            </div>

                            {selectedAppointment.message && (
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-400 mb-1">Your Note</p>
                                    <p className="text-xs text-gray-700 italic">&ldquo;{selectedAppointment.message}&rdquo;</p>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-2">
                                <div>
                                    <p className="text-xs text-gray-400">Booking Status</p>
                                    <div className="mt-1">{renderStatusBadge(selectedAppointment.status)}</div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Payment</p>
                                    <div className="mt-1">{renderPaymentBadge(selectedAppointment.paymentStatus)}</div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedAppointment(null)}
                            className="w-full py-3 bg-gray-100 text-gray-800 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
