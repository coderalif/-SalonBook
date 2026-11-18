'use client';

// ========================================================
// Admin Manage Users Page (কাস্টমার একাউন্ট ও ব্লক/আনব্লক)
// ========================================================

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import {
    Users,
    ShieldAlert,
    ShieldCheck,
    UserCheck,
    Mail,
    Phone,
    Calendar,
    Loader2,
    Eye,
    X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CustomerUser {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    image?: string;
    role: string;
    isBlocked: boolean;
    createdAt: string;
}

export default function AdminManageUsersPage() {
    const [users, setUsers] = useState<CustomerUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<CustomerUser | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await apiFetch('/users');
            if (res.success && res.users) {
                setUsers(res.users);
            }
        } catch (error) {
            console.error('Failed to load users:', error);
            toast.error('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // ব্লক / আনব্লক টগল হ্যান্ডলার
    const handleToggleBlock = async (id: string, currentlyBlocked: boolean) => {
        const actionWord = currentlyBlocked ? 'unblock' : 'block';
        if (!confirm(`Are you sure you want to ${actionWord} this customer account?`)) return;

        try {
            setActionId(id);
            const res = await apiFetch(`/users/${id}/block-toggle`, {
                method: 'PATCH',
            });

            if (res.success) {
                toast.success(res.message || `Customer account has been ${actionWord}ed.`);
                fetchUsers();
            } else {
                toast.error(res.message || 'Failed to update block status.');
            }
        } catch (err: any) {
            toast.error(err.message || 'Block toggle failed.');
        } finally {
            setActionId(null);
        }
    };

    return (
        <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Registered Customers Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Monitor active customer accounts, review booking activities, or restrict suspended users.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                    <Loader2 className="w-8 h-8 text-rose-600 animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Loading customer accounts...</p>
                </div>
            ) : users.length > 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/70 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Contact Phone</th>
                                    <th className="px-6 py-4">Member Since</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Access Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((cust) => (
                                    <tr key={cust._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={cust.image || 'https://i.ibb.co.com/4pDNDk1/avatar-placeholder.png'}
                                                    alt={cust.name}
                                                    className="w-10 h-10 rounded-full object-cover border shrink-0"
                                                />
                                                <div>
                                                    <p className="font-bold text-gray-900">{cust.name}</p>
                                                    <p className="text-xs text-gray-400">{cust.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-600">
                                            {cust.phone || 'Not provided'}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-600">
                                            {new Date(cust.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                                    cust.isBlocked
                                                        ? 'bg-red-50 text-red-700 border border-red-200'
                                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                }`}
                                            >
                                                {cust.isBlocked ? (
                                                    <>
                                                        <ShieldAlert className="w-3.5 h-3.5" /> Blocked
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShieldCheck className="w-3.5 h-3.5" /> Active
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedUser(cust)}
                                                    className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                                    title="View Profile Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleToggleBlock(cust._id, cust.isBlocked)}
                                                    disabled={actionId === cust._id}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                                                        cust.isBlocked
                                                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                                    }`}
                                                >
                                                    {actionId === cust._id ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : cust.isBlocked ? (
                                                        'Unblock User'
                                                    ) : (
                                                        'Block User'
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4">
                    <Users className="w-12 h-12 text-gray-400 mx-auto" />
                    <h3 className="text-xl font-bold text-gray-900">No Customers Found</h3>
                    <p className="text-sm text-gray-500">No customers have registered on the platform yet.</p>
                </div>
            )}

            {/* ইউজার ডিটেইলস মডাল */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Customer Profile Details</h3>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 text-center">
                            <img
                                src={selectedUser.image || 'https://i.ibb.co.com/4pDNDk1/avatar-placeholder.png'}
                                alt={selectedUser.name}
                                className="w-20 h-20 rounded-full object-cover border-4 border-rose-100 mx-auto shadow-md"
                            />
                            <div>
                                <h4 className="text-lg font-bold text-gray-900">{selectedUser.name}</h4>
                                <p className="text-xs text-gray-500">{selectedUser.email}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-left pt-2">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-[11px] text-gray-400">Phone</p>
                                    <p className="text-xs font-semibold text-gray-800">{selectedUser.phone || 'N/A'}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-[11px] text-gray-400">Role</p>
                                    <p className="text-xs font-bold text-rose-600 uppercase">{selectedUser.role}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-[11px] text-gray-400">Registered On</p>
                                    <p className="text-xs font-semibold text-gray-800">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-[11px] text-gray-400">Account Access</p>
                                    <p className={`text-xs font-bold ${selectedUser.isBlocked ? 'text-red-600' : 'text-emerald-600'}`}>
                                        {selectedUser.isBlocked ? 'Blocked' : 'Active'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedUser(null)}
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
