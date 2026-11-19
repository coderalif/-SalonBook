'use client';

// ========================================================
// Google Auth Modal (প্রফেশনাল গুগল একাউন্ট সিলেক্টর)
// ========================================================

import React, { useState } from 'react';
import { X, User, Plus, Loader2 } from 'lucide-react';

interface GoogleAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (name: string, email: string, image: string) => Promise<void>;
    isSubmitting: boolean;
}

export default function GoogleAuthModal({
    isOpen,
    onClose,
    onSelect,
    isSubmitting,
}: GoogleAuthModalProps) {
    const [customEmail, setCustomEmail] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);

    if (!isOpen) return null;

    // ডিফল্ট প্রস্তুতকৃত গুগল অ্যাকাউন্টসমূহ (কুইক ওয়ান-ক্লিক লগইন)
    const presetAccounts = [
        {
            name: 'Alif Hosen',
            email: 'mdalifhosen876@gmail.com',
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        },
        {
            name: 'Sarah Jenkins',
            email: 'sarah.jenkins@gmail.com',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        },
    ];

    const handleCustomSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customEmail || !customEmail.includes('@')) return;
        const generatedName = customEmail.split('@')[0].replace('.', ' ');
        const formattedName = generatedName.charAt(0).toUpperCase() + generatedName.slice(1);
        await onSelect(
            formattedName,
            customEmail.trim().toLowerCase(),
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 sm:p-7 relative border border-gray-100">
                
                {/* ক্লোজ বাটন */}
                <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="absolute top-5 right-5 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* গুগল হেডার */}
                <div className="text-center space-y-2 mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm mx-auto">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Choose a Google Account</h3>
                    <p className="text-xs text-gray-500">to continue to <strong>SalonBook Platform</strong></p>
                </div>

                {isSubmitting ? (
                    <div className="py-10 text-center space-y-3">
                        <Loader2 className="w-8 h-8 text-rose-600 animate-spin mx-auto" />
                        <p className="text-xs text-gray-500 font-medium">Authenticating with Google...</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {/* ওয়ান-ক্লিক অ্যাকাউন্ট লিস্ট */}
                        {presetAccounts.map((acc, i) => (
                            <button
                                key={i}
                                onClick={() => onSelect(acc.name, acc.email, acc.image)}
                                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-rose-50/70 border border-transparent hover:border-rose-100 transition-all text-left cursor-pointer group"
                            >
                                <img
                                    src={acc.image}
                                    alt={acc.name}
                                    className="w-10 h-10 rounded-full object-cover border"
                                />
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold text-gray-900 group-hover:text-rose-600 truncate">{acc.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{acc.email}</p>
                                </div>
                            </button>
                        ))}

                        {/* অন্য অ্যাকাউন্ট ব্যবহারের অপশন */}
                        {!showCustomInput ? (
                            <button
                                onClick={() => setShowCustomInput(true)}
                                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 border border-transparent transition-all text-left cursor-pointer text-gray-600"
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-700">Use another Google account</p>
                                    <p className="text-[11px] text-gray-400">Enter custom email address</p>
                                </div>
                            </button>
                        ) : (
                            <form onSubmit={handleCustomSubmit} className="pt-2 space-y-2">
                                <input
                                    type="email"
                                    required
                                    autoFocus
                                    placeholder="Enter your Gmail address..."
                                    value={customEmail}
                                    onChange={(e) => setCustomEmail(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCustomInput(false)}
                                        className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                <div className="pt-5 mt-4 border-t border-gray-100 text-center">
                    <p className="text-[10px] text-gray-400">
                        To continue, Google will share your name, email address, and profile picture with SalonBook.
                    </p>
                </div>

            </div>
        </div>
    );
}
