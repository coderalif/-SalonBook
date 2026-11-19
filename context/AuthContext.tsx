'use client';

// ========================================================
// Authentication Context & Provider
// ========================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/api';

export interface User {
    id: string;
    _id?: string;
    name: string;
    email: string;
    image?: string;
    phone?: string;
    role: 'customer' | 'admin';
    isBlocked: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    isAdmin: boolean;
    isCustomer: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string, image?: string) => Promise<boolean>;
    googleLogin: (name: string, email: string, image?: string) => Promise<boolean>;
    logout: () => void;
    updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    // পেজ রিলোড করার পরও লগইন স্টেট ধরে রাখা (Persist Auth)
    useEffect(() => {
        const storedToken = localStorage.getItem('salonbook_token');
        const storedUser = localStorage.getItem('salonbook_user');

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                
                // ব্যাকএন্ড থেকে লেটেস্ট প্রোফাইল তথ্য ভেরিফাই করা
                apiFetch('/auth/me').then((res) => {
                    if (res.success && res.user) {
                        setUser(res.user);
                        localStorage.setItem('salonbook_user', JSON.stringify(res.user));
                    } else if (res.message && res.message.includes('স্থগিত')) {
                        // যদি ইউজার ব্লক হয়ে যায়
                        logout();
                        toast.error('আপনার অ্যাকাউন্টটি ব্লক করা হয়েছে!');
                    }
                }).catch(() => {
                    // নেটওয়ার্ক সমস্যা হলে সংরক্ষিত ইউজার ব্যবহার করা হবে
                });
            } catch (err) {
                console.error('Failed to parse stored user:', err);
                localStorage.removeItem('salonbook_user');
                localStorage.removeItem('salonbook_token');
            }
        }
        setLoading(false);
    }, []);

    // ১. সাধারণ ইমেইল ও পাসওয়ার্ড দিয়ে লগইন
    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setLoading(true);
            const res = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            if (res.success && res.token && res.user) {
                setToken(res.token);
                setUser(res.user);
                localStorage.setItem('salonbook_token', res.token);
                localStorage.setItem('salonbook_user', JSON.stringify(res.user));

                toast.success('স্বাগতম! আপনি সফলভাবে লগইন করেছেন।');

                // যদি পূর্ববর্তী পেইজে রিডাইরেক্ট রিকোয়েস্ট থাকে (?redirect=...)
                const redirectParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') : null;

                if (redirectParam && res.user.role === 'customer') {
                    router.push(redirectParam);
                } else if (res.user.role === 'admin') {
                    router.push('/dashboard/admin');
                } else {
                    router.push('/dashboard/customer');
                }
                return true;
            } else {
                toast.error(res.message || 'ভুল ইমেইল বা পাসওয়ার্ড!');
                return false;
            }
        } catch (error: any) {
            toast.error(error.message || 'লগইন করতে ব্যর্থ হয়েছে!');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ২. নতুন কাস্টমার রেজিস্ট্রেশন (সাইনআপ)
    const register = async (name: string, email: string, password: string, image?: string): Promise<boolean> => {
        try {
            setLoading(true);
            const res = await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, image }),
            });

            if (res.success && res.token && res.user) {
                setToken(res.token);
                setUser(res.user);
                localStorage.setItem('salonbook_token', res.token);
                localStorage.setItem('salonbook_user', JSON.stringify(res.user));

                toast.success('রেজিস্ট্রেশন সফল হয়েছে!');
                const redirectParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') : null;
                router.push(redirectParam || '/dashboard/customer');
                return true;
            } else {
                toast.error(res.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে!');
                return false;
            }
        } catch (error: any) {
            toast.error(error.message || 'সার্ভারে সমস্যা হয়েছে!');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ৩. গুগল লগইন / সাইনআপ সিমুলেশন
    const googleLogin = async (name: string, email: string, image?: string): Promise<boolean> => {
        try {
            setLoading(true);
            const res = await apiFetch('/auth/google', {
                method: 'POST',
                body: JSON.stringify({ name, email, image }),
            });

            if (res.success && res.token && res.user) {
                setToken(res.token);
                setUser(res.user);
                localStorage.setItem('salonbook_token', res.token);
                localStorage.setItem('salonbook_user', JSON.stringify(res.user));

                toast.success('গুগল লগইন সফল হয়েছে!');
                const redirectParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') : null;

                if (redirectParam && res.user.role === 'customer') {
                    router.push(redirectParam);
                } else if (res.user.role === 'admin') {
                    router.push('/dashboard/admin');
                } else {
                    router.push('/dashboard/customer');
                }
                return true;
            } else {
                toast.error(res.message || 'গুগল লগইন ব্যর্থ হয়েছে!');
                return false;
            }
        } catch (error: any) {
            toast.error(error.message || 'গুগল লগইন করতে সমস্যা হয়েছে!');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ৪. লগআউট ফাংশন
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('salonbook_token');
        localStorage.removeItem('salonbook_user');
        toast.success('আপনি সফলভাবে লগআউট করেছেন।');
        router.push('/signin');
    };

    // ৫. ইউজারের তথ্য আপডেট
    const updateUser = (updatedUser: Partial<User>) => {
        if (user) {
            const newUser = { ...user, ...updatedUser };
            setUser(newUser as User);
            localStorage.setItem('salonbook_user', JSON.stringify(newUser));
        }
    };

    const isAdmin = user?.role === 'admin';
    const isCustomer = user?.role === 'customer';

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAdmin,
                isCustomer,
                login,
                register,
                googleLogin,
                logout,
                updateUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
