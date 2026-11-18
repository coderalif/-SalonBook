'use client';

// ========================================================
// Admin Manage Appointments Page
// এডমিন কর্তৃক সমস্ত বুকিং রিভিউ, কনফার্মেশন ও ক্যান্সলেশন
// ========================================================

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import {
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    User,
    Mail,
    Phone,
    Eye,
    Check,
    Ban,
    Loader2,
    X,
    Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminAppointmentItem {
    _id: string;
    serviceId: {
        _id: string;
        serviceName: string;
        category: string;
        image: string;
        price: number;
        duration: number;
    } | null;
    customerId: {
        _id: string;
        name: string;
        email: string;
        phone?: string;
        image?: string;
    } | null;
    appointmentDate: string;
    timeSlot: string;
    message?: string;
    servicePrice: number;
    paymentStatus: 'unpaid' | 'paid';
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
}

export default function AdminManageAppointmentsPage() {
    const [appointments, setAppointments] = useState<AdminAppointmentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [actionId, setActionId] = useState<string | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<AdminAppointmentItem | null>(null);

    const fetchAllAppointments = async () => {
        try {
            setLoading(true);
            const res = await apiFetch('/appointments/admin/all');
            if (res.success && res.appointments) {
                setAppointments(res.appointments);
            }
        } catch (error) {
            console.error('Failed to load appointments:', error);
            toast.error('Failed to load appointment records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllAppointments();
    }, []);

    // ১. অ্যাপয়েন্টমেন্ট কনফার্ম করা (শুধুমাত্র Pending অবস্থায়)
    const handleConfirm = async (id: string) => {
        try {
            setActionId(id);
            const res = await apiFetch(`/appointments/admin/${id}/confirm`, {
                method: 'PATCH',
            });

            if (res.success) {
                toast.success('Appointment confirmed successfully!');
                fetchAllAppointments();
            } else {
                toast.error(res.message || 'Failed to confirm appointment.');
            }
        } catch (err: any) {
            toast.error(err.message || 'Error confirming appointment.');
        } finally {
            setActionId(null);
        }
    };

    // ২. অ্যাপয়েন্টমেন্ট বাতিল করা (Pending বা Confirmed অবস্থায়)
    const handleCancel = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this appointment?')) return;

        try {
            setActionId(id);
            const res = await apiFetch(`/appointments/admin/${id}/cancel`, {
                method: 'PATCH',
            });

            if (res.success) {
                toast.success('Appointment marked as cancelled.');
                fetchAllAppointments();
            } else {
                toast.error(res.message || 'Failed to cancel appointment.');
            }
        } catch (err: any) {
            toast.error(err.message || 'Error cancelling appointment.');
        } finally {
            setActionId(null);
        }
    };

    // স্ট্যাটাস ফিল্টারিং
    const filteredAppointments = appointments.filter((app) => {
        if (filterStatus === 'all') return true;
        return app.status === filterStatus;
    });

    return (
        <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Appointment Requests & Scheduling
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Review customer bookings, confirm slots, or cancel unserviceable appointments.
                    </p>
                </div>

                {/* ফিল্টার ট্যাব */}
                <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-gray-200 self-start sm:self-auto">
                    {['all', 'pending', 'confirmed', 'cancelled'].map((st) => (
                        <button
                            key={st}
                            onClick={() => setFilterStatus(st)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors cursor-pointer ${
                                filterStatus === st
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            {st}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                    <Loader2 className="w-8 h-8 text-rose-600 animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Loading appointments...</p>
                </div>
            ) : filteredAppointments.length > 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/70 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Service</th>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Payment</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredAppointments.map((item) => {
                                    const canConfirm = item.status === 'pending';
                                    const canCancel = item.status === 'pending' || item.status === 'confirmed';

                                    return (
                                        <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                            {/* কাস্টমার */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.customerId?.image || 'https://i.ibb.co.com/4pDNDk1/avatar-placeholder.png'}
                                                        alt={item.customerId?.name || 'Customer'}
                                                        className="w-10 h-10 rounded-full object-cover border shrink-0"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-gray-900">{item.customerId?.name || 'Customer'}</p>
                                                        <p className="text-xs text-gray-400">{item.customerId?.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* সার্ভিস */}
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900">{item.serviceId?.serviceName || 'Custom Service'}</p>
                                                <span className="text-[11px] text-rose-600 font-medium">{item.serviceId?.category}</span>
                                            </td>

                                            {/* তারিখ ও স্লট */}
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900">{item.appointmentDate}</p>
                                                <p className="text-xs text-gray-500">{item.timeSlot}</p>
                                            </td>

                                            {/* ফি */}
                                            <td className="px-6 py-4 font-bold text-gray-900">
                                                ${item.servicePrice}
                                            </td>

                                            {/* বুকিং অবস্থা */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                                        item.status === 'confirmed'
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : item.status === 'pending'
                                                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>

                                            {/* পেমেন্ট অবস্থা */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${
                                                        item.paymentStatus === 'paid'
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    {item.paymentStatus}
                                                </span>
                                            </td>

                                            {/* অ্যাকশন বাটনসমূহ */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedAppointment(item)}
                                                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>

                                                    {canConfirm && (
                                                        <button
                                                            onClick={() => handleConfirm(item._id)}
                                                            disabled={actionId === item._id}
                                                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                                                            title="Confirm Appointment"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    {canCancel && (
                                                        <button
                                                            onClick={() => handleCancel(item._id)}
                                                            disabled={actionId === item._id}
                                                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                                                            title="Cancel Appointment"
                                                        >
                                                            <Ban className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto" />
                    <h3 className="text-xl font-bold text-gray-900">No Appointments in this Category</h3>
                    <p className="text-sm text-gray-500">There are currently no bookings with status &ldquo;{filterStatus}&rdquo;.</p>
                </div>
            )}

            {/* ডিটেইলস মডাল */}
            {selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Appointment Record</h3>
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="p-4 bg-gray-50 rounded-2xl space-y-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Details</p>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={selectedAppointment.customerId?.image || 'https://i.ibb.co.com/4pDNDk1/avatar-placeholder.png'}
                                        alt="Customer"
                                        className="w-12 h-12 rounded-full object-cover border"
                                    />
                                    <div>
                                        <p className="font-bold text-gray-900">{selectedAppointment.customerId?.name}</p>
                                        <p className="text-xs text-gray-500">{selectedAppointment.customerId?.email}</p>
                                        {selectedAppointment.customerId?.phone && (
                                            <p className="text-xs text-gray-500">{selectedAppointment.customerId?.phone}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-2xl space-y-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Service Reserved</p>
                                <p className="font-bold text-gray-900">{selectedAppointment.serviceId?.serviceName}</p>
                                <p className="text-xs text-rose-600">{selectedAppointment.serviceId?.category}</p>
                                <div className="flex justify-between text-xs text-gray-600 pt-2 border-t border-gray-200">
                                    <span>Date: <strong>{selectedAppointment.appointmentDate}</strong></span>
                                    <span>Slot: <strong>{selectedAppointment.timeSlot}</strong></span>
                                    <span>Fee: <strong>${selectedAppointment.servicePrice}</strong></span>
                                </div>
                            </div>

                            {selectedAppointment.message && (
                                <div className="p-3 bg-rose-50/50 rounded-xl">
                                    <p className="text-xs text-rose-800 font-semibold mb-1">Customer Note:</p>
                                    <p className="text-xs text-gray-700 italic">&ldquo;{selectedAppointment.message}&rdquo;</p>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
                                <span>Requested On: {new Date(selectedAppointment.createdAt).toLocaleString()}</span>
                                <span className="font-bold uppercase text-gray-700">Payment: {selectedAppointment.paymentStatus}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedAppointment(null)}
                            className="w-full py-3 bg-gray-100 text-gray-800 rounded-xl text-xs font-semibold hover:bg-gray-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
