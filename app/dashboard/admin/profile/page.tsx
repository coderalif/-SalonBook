'use client';

// ========================================================
// Admin Profile Page (অ্যাডমিন প্রোফাইল আপডেট)
// ========================================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch, uploadImageToImgBB } from '@/lib/api';
import { User, Mail, Phone, Image as ImageIcon, Shield, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProfilePage() {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhone(user.phone || '');
            setImage(user.image || '');
        }
    }, [user]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            toast.loading('Uploading photo to ImgBB...', { id: 'admin-img' });
            const url = await uploadImageToImgBB(file);
            setImage(url);
            toast.success('Admin avatar uploaded!', { id: 'admin-img' });
        } catch (error: any) {
            toast.error('Upload failed.', { id: 'admin-img' });
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            const res = await apiFetch('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify({
                    name: name.trim(),
                    phone: phone.trim(),
                    image,
                }),
            });

            if (res.success && res.user) {
                updateUser(res.user);
                toast.success('Administrator profile updated successfully!');
            } else {
                toast.error(res.message || 'Failed to update profile.');
            }
        } catch (error: any) {
            toast.error(error.message || 'Profile update error.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Administrator Profile
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage administrative credentials and notification contacts.
                </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
                        <img
                            src={image || 'https://i.ibb.co.com/4pDNDk1/avatar-placeholder.png'}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover border-4 border-amber-100 shadow-md"
                        />
                        <div className="space-y-2 text-center sm:text-left">
                            <h3 className="text-base font-bold text-gray-900">{user?.name}</h3>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                            <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                                <label className="cursor-pointer px-4 py-2 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-xl text-xs font-semibold transition-colors">
                                    {uploadingImage ? 'Uploading...' : 'Upload New Photo'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploadingImage}
                                        className="hidden"
                                    />
                                </label>
                                <span className="text-xs text-gray-400">or enter image URL below</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                Admin Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                Email Address (Non-editable)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    disabled
                                    value={user?.email || ''}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-100/70 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+880 1712-345678"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                Administrative Clearance
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    disabled
                                    value="Super Administrator"
                                    className="w-full pl-10 pr-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 font-bold uppercase cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                            Profile Image URL
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <ImageIcon className="w-4 h-4" />
                            </div>
                            <input
                                type="url"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                placeholder="https://..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold shadow-md transition-colors disabled:opacity-70 cursor-pointer"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" /> Save Admin Profile
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
