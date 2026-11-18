'use client';

// ========================================================
// Service Details & Appointment Booking Page
// Dynamic Route: /services/[id]
// ========================================================

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Clock, Tag, Sparkles, Calendar, CheckCircle2, AlertCircle, ArrowLeft, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { ServiceItem } from '@/components/FeaturedServices';

// পূর্বনির্ধারিত সুবিধাজনক টাইম স্লট তালিকা
const TIME_SLOTS = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM',
];

export default function ServiceDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAdmin, isCustomer } = useAuth();
    const serviceId = params?.id as string;

    const [service, setService] = useState<ServiceItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // বুকিং ফর্ম স্টেট
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [message, setMessage] = useState('');
    const [bookingSubmitting, setBookingSubmitting] = useState(false);

    // সার্ভিস তথ্য ফেচ করা
    useEffect(() => {
        if (!serviceId) return;

        const fetchService = async () => {
            try {
                setLoading(true);
                const res = await apiFetch(`/services/${serviceId}`);
                if (res.success && res.service) {
                    setService(res.service);
                } else {
                    setError(res.message || 'Service not found.');
                }
            } catch (err: any) {
                setError(err.message || 'Error loading service.');
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [serviceId]);

    // বুকিং বাটন ক্লিক হ্যান্ডলার (লগইন ভ্যালিডেশন)
    const handleOpenBooking = () => {
        if (!user) {
            toast.error('Please sign in to book an appointment.');
            router.push(`/signin?redirect=/services/${serviceId}`);
            return;
        }

        if (isAdmin) {
            toast.error('Admins cannot book customer appointments. Please use a customer account.');
            return;
        }

        if (service?.status !== 'active') {
            toast.error('This service is currently inactive and cannot be booked.');
            return;
        }

        setIsBookingOpen(true);
    };

    // বুকিং সাবমিট হ্যান্ডলার
    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!appointmentDate || !timeSlot) {
            toast.error('Please select both date and time slot.');
            return;
        }

        try {
            setBookingSubmitting(true);
            const res = await apiFetch('/appointments', {
                method: 'POST',
                body: JSON.stringify({
                    serviceId,
                    appointmentDate,
                    timeSlot,
                    message,
                }),
            });

            if (res.success) {
                toast.success('Appointment request submitted successfully!');
                setIsBookingOpen(false);
                // কাস্টমার অ্যাপয়েন্টমেন্ট পেইজে পাঠানো
                router.push('/dashboard/customer/appointments');
            } else {
                toast.error(res.message || 'Failed to submit booking request.');
            }
        } catch (err: any) {
            toast.error(err.message || 'An error occurred during booking.');
        } finally {
            setBookingSubmitting(false);
        }
    };

    // আজকের তারিখ নির্ধারণ (যাতে পেছনের তারিখ সিলেক্ট না করা যায়)
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-slate-50/50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ব্যাক বাটন */}
                <div className="mb-6">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-rose-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to All Services
                    </Link>
                </div>

                {/* লোডিং অবস্থা */}
                {loading && (
                    <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
                        <Loader2 className="w-10 h-10 text-rose-500 animate-spin mb-4" />
                        <p className="text-gray-500 text-sm font-medium">Loading service details...</p>
                    </div>
                )}

                {/* এরর অবস্থা (যেমন অবৈধ আইডি বা ডিলিট হওয়া সার্ভিস) */}
                {!loading && error && (
                    <div className="bg-white rounded-3xl p-12 shadow-sm border border-red-100 text-center max-w-lg mx-auto space-y-4">
                        <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                            <AlertCircle className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Service Not Available</h2>
                        <p className="text-sm text-gray-500">{error}</p>
                        <Link
                            href="/services"
                            className="inline-block px-6 py-2.5 rounded-full bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
                        >
                            Browse Other Services
                        </Link>
                    </div>
                )}

                {/* সার্ভিস বিস্তারিত বিবরণ কার্ড */}
                {!loading && !error && service && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                            
                            {/* বাম কলাম: সার্ভিস ছবি */}
                            <div className="lg:col-span-6 relative min-h-[350px] sm:min-h-[450px] bg-gray-100">
                                <img
                                    src={service.image}
                                    alt={service.serviceName}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-6 left-6">
                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-gray-900 shadow-md">
                                        <Tag className="w-3.5 h-3.5 text-rose-600" />
                                        {service.category}
                                    </span>
                                </div>
                                {service.status !== 'active' && (
                                    <div className="absolute top-6 right-6">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md">
                                            Currently Unavailable
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* ডান কলাম: বিবরণ, মূল্য ও বুকিং বাটন */}
                            <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5 text-sm font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                                            <Clock className="w-4 h-4" />
                                            {service.duration} Minutes Session
                                        </span>
                                        <span className="text-3xl font-extrabold text-gray-950">
                                            ${service.price}
                                        </span>
                                    </div>

                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                                        {service.serviceName}
                                    </h1>

                                    <div className="border-t border-gray-100 pt-4">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                            Treatment Overview
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                                            {service.description}
                                        </p>
                                    </div>

                                    {/* সার্ভিসের বিশেষ সুবিধা তালিকা */}
                                    <div className="pt-2 space-y-2 text-xs sm:text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <span>Certified master stylist assigned to your session</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <span>Hospital-grade sanitized station and tools</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <span>Complimentary organic scalp/skin assessment</span>
                                        </div>
                                    </div>
                                </div>

                                {/* বুকিং কল-টু-অ্যাকশন */}
                                <div className="pt-6 border-t border-gray-100">
                                    <button
                                        onClick={handleOpenBooking}
                                        disabled={service.status !== 'active'}
                                        className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-lg shadow-rose-600/20 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        {service.status === 'active' ? 'Book Appointment Now' : 'Service Currently Inactive'}
                                    </button>

                                    {!user && (
                                        <p className="text-center text-xs text-gray-500 mt-2">
                                            You will be asked to sign in to confirm your booking.
                                        </p>
                                    )}
                                </div>

                            </div>

                        </div>
                    </div>
                )}

                {/* বুকিং মডাল (Appointment Booking Modal) */}
                {isBookingOpen && service && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
                            
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Request Appointment</h3>
                                    <p className="text-xs text-rose-600 font-medium mt-0.5">{service.serviceName} (${service.price})</p>
                                </div>
                                <button
                                    onClick={() => setIsBookingOpen(false)}
                                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleBookingSubmit} className="space-y-4">
                                {/* তারিখ নির্বাচন */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Appointment Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        min={today}
                                        required
                                        value={appointmentDate}
                                        onChange={(e) => setAppointmentDate(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>

                                {/* টাইম স্লট নির্বাচন */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Available Time Slot <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        required
                                        value={timeSlot}
                                        onChange={(e) => setTimeSlot(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer text-gray-700"
                                    >
                                        <option value="">Select a time slot</option>
                                        {TIME_SLOTS.map((slot, index) => (
                                            <option key={index} value={slot}>
                                                {slot}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* অতিরিক্ত মেসেজ (Optional) */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Additional Message or Requests (Optional)
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Any specific preferences or requests for your stylist..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                                    />
                                </div>

                                {/* মূল্য সারাংশ */}
                                <div className="p-4 bg-rose-50/70 rounded-2xl flex items-center justify-between text-sm">
                                    <span className="text-gray-700 font-medium">Service Fee (Pay upon Admin confirmation):</span>
                                    <span className="text-lg font-bold text-rose-700">${service.price}</span>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsBookingOpen(false)}
                                        className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={bookingSubmitting}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors disabled:opacity-70 cursor-pointer"
                                    >
                                        {bookingSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                                            </>
                                        ) : (
                                            'Confirm Request'
                                        )}
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
