'use client';

// ========================================================
// Sign Up Page (নতুন কাস্টমার রেজিস্ট্রেশন)
// ========================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { uploadImageToImgBB } from '@/lib/api';
import { Sparkles, User as UserIcon, Mail, Lock, Image as ImageIcon, UserPlus, Loader2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import GoogleAuthModal from '@/components/GoogleAuthModal';
import { requestGoogleLogin } from '@/lib/googleAuth';

export default function SignUpPage() {
    const { register, googleLogin, loading } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

    // পাসওয়ার্ড ভ্যালিডেশন শর্তাবলী
    const hasMinLength = password.length >= 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

    // ইমেজ আপলোড হ্যান্ডলার (ImgBB)
    const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            toast.loading('Uploading profile image to ImgBB...', { id: 'img-upload' });
            const uploadedUrl = await uploadImageToImgBB(file);
            setImageUrl(uploadedUrl);
            toast.success('Image uploaded successfully!', { id: 'img-upload' });
        } catch (error: any) {
            toast.error('Image upload failed. You can paste an image URL instead.', { id: 'img-upload' });
        } finally {
            setUploadingImage(false);
        }
    };

    // সাবমিট হ্যান্ডলার
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isPasswordValid) {
            toast.error('Please fulfill all password requirements.');
            return;
        }

        setIsSubmitting(true);
        await register(name, email, password, imageUrl || undefined);
        setIsSubmitting(false);
    };

    // সরাসরি গুগল পপআপ চালু করা অথবা মডাল খোলা
    const handleGoogleSignUpClick = async () => {
        try {
            setIsSubmitting(true);
            const profile = await requestGoogleLogin();
            await googleLogin(profile.name, profile.email, profile.picture);
        } catch (error: any) {
            console.warn('Direct Google Popup failed/blocked, opening selector modal:', error);
            setIsGoogleModalOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // গুগল অ্যাকাউন্ট নির্বাচন হ্যান্ডলার (মডাল থেকে)
    const handleGoogleSelect = async (selectedName: string, selectedEmail: string, selectedImage: string) => {
        setIsSubmitting(true);
        const success = await googleLogin(selectedName, selectedEmail, selectedImage);
        setIsSubmitting(false);
        if (success) {
            setIsGoogleModalOpen(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-rose-100/50 border border-rose-100">
                
                {/* হেডার */}
                <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-2xl bg-rose-50 text-rose-600 mb-1">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Create an Account
                    </h2>
                    <p className="text-sm text-gray-500">
                        Join SalonBook to easily book and manage your appointments
                    </p>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {/* নাম */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <UserIcon className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Ayesha Rahman"
                                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all bg-gray-50/50 hover:bg-white"
                            />
                        </div>
                    </div>

                    {/* ইমেইল */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all bg-gray-50/50 hover:bg-white"
                            />
                        </div>
                    </div>

                    {/* পাসওয়ার্ড */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a strong password"
                                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all bg-gray-50/50 hover:bg-white"
                            />
                        </div>

                        {/* পাসওয়ার্ড রিকোয়ারমেন্টস চেকলিস্ট */}
                        <div className="mt-2.5 p-3 rounded-xl bg-gray-50/80 border border-gray-100 space-y-1.5 text-xs">
                            <p className="font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Password Requirements:</p>
                            <div className="flex items-center gap-2 text-gray-600">
                                {hasMinLength ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                                ) : (
                                    <X className="w-3.5 h-3.5 text-gray-300" />
                                )}
                                <span className={hasMinLength ? 'text-emerald-700 font-medium' : ''}>
                                    At least 6 characters
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                {hasUppercase ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                                ) : (
                                    <X className="w-3.5 h-3.5 text-gray-300" />
                                )}
                                <span className={hasUppercase ? 'text-emerald-700 font-medium' : ''}>
                                    At least 1 uppercase letter (A-Z)
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                {hasLowercase ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                                ) : (
                                    <X className="w-3.5 h-3.5 text-gray-300" />
                                )}
                                <span className={hasLowercase ? 'text-emerald-700 font-medium' : ''}>
                                    At least 1 lowercase letter (a-z)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* প্রোফাইল ইমেজ (ঐচ্ছিক - ImgBB আপলোড) */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Profile Picture (Optional)
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="Image URL or upload a file..."
                                    className="block w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50/50"
                                />
                            </div>
                            <label className="flex items-center justify-center px-4 py-2.5 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer shrink-0">
                                <span>Upload</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageFileChange}
                                    disabled={uploadingImage}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {imageUrl && (
                            <div className="mt-2 flex items-center gap-2">
                                <img src={imageUrl} alt="Avatar preview" className="w-8 h-8 rounded-full object-cover border" />
                                <span className="text-[11px] text-gray-500 truncate max-w-xs">{imageUrl}</span>
                            </div>
                        )}
                    </div>

                    {/* সাবমিট বাটন */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !isPasswordValid || loading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer pt-3"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4" /> Sign Up
                            </>
                        )}
                    </button>

                    {/* সোশ্যাল সাইনআপ */}
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-gray-400 font-medium">Or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignUpClick}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                        Sign Up with Google
                    </button>
                </form>

                <div className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/signin" className="font-semibold text-rose-600 hover:text-rose-700 hover:underline">
                        Sign In here
                    </Link>
                </div>
            </div>

            {/* গুগল অথ সিলেক্টর মডাল */}
            <GoogleAuthModal
                isOpen={isGoogleModalOpen}
                onClose={() => setIsGoogleModalOpen(false)}
                onSelect={handleGoogleSelect}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
