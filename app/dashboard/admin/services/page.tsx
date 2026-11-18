'use client';

// ========================================================
// Admin Manage Services Page (সার্ভিস CRUD ও ImgBB আপলোড)
// ========================================================

import React, { useState, useEffect } from 'react';
import { apiFetch, uploadImageToImgBB } from '@/lib/api';
import {
    Scissors,
    Plus,
    Edit2,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Loader2,
    Clock,
    Tag,
    Image as ImageIcon,
    X,
    Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ServiceItem } from '@/components/FeaturedServices';

const CATEGORY_OPTIONS = [
    'Haircut & Styling',
    'Hair Coloring',
    'Hair Treatment',
    'Facial & Skincare',
    'Makeup',
    'Manicure & Pedicure',
    'Spa & Massage',
];

export default function AdminManageServicesPage() {
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);

    // মডাল স্টেট
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceItem | null>(null);

    // ফর্ম ফিল্ডস
    const [serviceName, setServiceName] = useState('');
    const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [duration, setDuration] = useState<number | ''>('');
    const [image, setImage] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');

    const [uploadingImage, setUploadingImage] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    // সকল সার্ভিস লোড করা (Active এবং Inactive উভয়ই)
    const fetchAllServices = async () => {
        try {
            setLoading(true);
            const res = await apiFetch('/services/admin/all');
            if (res.success && res.services) {
                setServices(res.services);
            }
        } catch (error) {
            console.error('Failed to load admin services:', error);
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllServices();
    }, []);

    // নতুন সার্ভিস বা এডিটের জন্য মডাল ওপেন
    const handleOpenModal = (service?: ServiceItem) => {
        if (service) {
            setEditingService(service);
            setServiceName(service.serviceName);
            setCategory(service.category);
            setDescription(service.description);
            setPrice(service.price);
            setDuration(service.duration);
            setImage(service.image);
            setStatus(service.status);
        } else {
            setEditingService(null);
            setServiceName('');
            setCategory(CATEGORY_OPTIONS[0]);
            setDescription('');
            setPrice('');
            setDuration('');
            setImage('');
            setStatus('active');
        }
        setIsModalOpen(true);
    };

    // ImgBB-তে ইমেজ আপলোড হ্যান্ডলার
    const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            toast.loading('Uploading service photo to ImgBB...', { id: 'service-img' });
            const uploadedUrl = await uploadImageToImgBB(file);
            setImage(uploadedUrl);
            toast.success('Service photo uploaded successfully!', { id: 'service-img' });
        } catch (error: any) {
            toast.error('Image upload failed. Please try again.', { id: 'service-img' });
        } finally {
            setUploadingImage(false);
        }
    };

    // সার্ভিস সেভ (Add বা Update)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!image) {
            toast.error('Please upload an image for the service via ImgBB.');
            return;
        }

        if (Number(price) <= 0 || Number(duration) <= 0) {
            toast.error('Price and duration must be positive numbers.');
            return;
        }

        try {
            setSubmitting(true);
            const endpoint = editingService ? `/services/${editingService._id}` : '/services';
            const method = editingService ? 'PUT' : 'POST';

            const res = await apiFetch(endpoint, {
                method,
                body: JSON.stringify({
                    serviceName: serviceName.trim(),
                    category,
                    description: description.trim(),
                    price: Number(price),
                    duration: Number(duration),
                    image,
                    status,
                }),
            });

            if (res.success) {
                toast.success(editingService ? 'Service updated successfully!' : 'New service created successfully!');
                setIsModalOpen(false);
                fetchAllServices();
            } else {
                toast.error(res.message || 'Operation failed.');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred.');
        } finally {
            setSubmitting(false);
        }
    };

    // স্ট্যাটাস টগল (Active / Inactive)
    const handleToggleStatus = async (id: string) => {
        try {
            setActionLoadingId(id);
            const res = await apiFetch(`/services/${id}/status`, {
                method: 'PATCH',
            });
            if (res.success) {
                toast.success(res.message || 'Status updated!');
                fetchAllServices();
            } else {
                toast.error(res.message || 'Failed to toggle status.');
            }
        } catch (err: any) {
            toast.error(err.message || 'Error updating status.');
        } finally {
            setActionLoadingId(null);
        }
    };

    // সার্ভিস ডিলিট করা
    const handleDeleteService = async (id: string) => {
        if (!confirm('Are you sure you want to permanently delete this salon service?')) return;

        try {
            setActionLoadingId(id);
            const res = await apiFetch(`/services/${id}`, {
                method: 'DELETE',
            });
            if (res.success) {
                toast.success('Service deleted successfully!');
                fetchAllServices();
            } else {
                toast.error(res.message || 'Failed to delete service.');
            }
        } catch (err: any) {
            toast.error(err.message || 'Delete error.');
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Salon Services Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Add, modify, activate, or archive treatments available on the public catalog.
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-md hover:shadow-lg self-start sm:self-auto cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Add New Service
                </button>
            </div>

            {/* সার্ভিস টেবিল */}
            {loading ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                    <Loader2 className="w-8 h-8 text-rose-600 animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Loading catalog...</p>
                </div>
            ) : services.length > 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/70 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Service</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Duration</th>
                                    <th className="px-6 py-4">Visibility</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {services.map((service) => (
                                    <tr key={service._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={service.image}
                                                    alt={service.serviceName}
                                                    className="w-12 h-12 rounded-xl object-cover border shrink-0"
                                                />
                                                <div>
                                                    <p className="font-bold text-gray-900">{service.serviceName}</p>
                                                    <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{service.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-gray-600">
                                            {service.category}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            ${service.price}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-600">
                                            {service.duration} mins
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(service._id)}
                                                disabled={actionLoadingId === service._id}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                                                    service.status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                                                }`}
                                            >
                                                {service.status === 'active' ? (
                                                    <>
                                                        <ToggleRight className="w-4 h-4 text-emerald-600" /> Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <ToggleLeft className="w-4 h-4 text-gray-400" /> Inactive
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(service)}
                                                    className="p-2 rounded-xl text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                    title="Edit Service"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteService(service._id)}
                                                    disabled={actionLoadingId === service._id}
                                                    className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Delete Service"
                                                >
                                                    <Trash2 className="w-4 h-4" />
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
                    <Scissors className="w-12 h-12 text-gray-400 mx-auto" />
                    <h3 className="text-xl font-bold text-gray-900">No Services Registered</h3>
                    <p className="text-sm text-gray-500">Create your first salon service now.</p>
                </div>
            )}

            {/* অ্যাড / এডিট সার্ভিস মডাল */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative max-h-[92vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingService ? 'Update Service Information' : 'Add New Salon Service'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* সার্ভিসের নাম */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                    Service Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={serviceName}
                                    onChange={(e) => setServiceName(e.target.value)}
                                    placeholder="e.g. Balayage Hair Gloss Treatment"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            {/* ক্যাটাগরি */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-700 cursor-pointer"
                                >
                                    {CATEGORY_OPTIONS.map((cat, i) => (
                                        <option key={i} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* দাম এবং সময়সীমা */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                        Price (USD $) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        required
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                                        placeholder="45"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                        Duration (Mins) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="5"
                                        required
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : '')}
                                        placeholder="60"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>
                            </div>

                            {/* বিবরণ */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Detailed overview of the treatment..."
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                                />
                            </div>

                            {/* ইমেজ আপলোড (ImgBB - Not Image URL) */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                    Service Image (Upload Image; Not Image URL) <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 border-2 border-dashed border-rose-200 hover:border-rose-400 rounded-xl text-xs font-semibold text-rose-700 transition-colors">
                                        <ImageIcon className="w-4 h-4" />
                                        {uploadingImage ? 'Uploading to ImgBB...' : 'Choose Image File to Upload'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageFileChange}
                                            disabled={uploadingImage}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                {image && (
                                    <div className="mt-2 flex items-center gap-3 p-2 bg-gray-50 rounded-xl border">
                                        <img src={image} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                                        <div className="overflow-hidden">
                                            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                                                <Check className="w-3.5 h-3.5" /> Uploaded to ImgBB
                                            </p>
                                            <p className="text-[10px] text-gray-400 truncate max-w-xs">{image}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* স্ট্যাটাস নির্বাচন */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                    Service Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-700 cursor-pointer"
                                >
                                    <option value="active">Active (Visible for customer booking)</option>
                                    <option value="inactive">Inactive (Hidden from public catalog)</option>
                                </select>
                            </div>

                            {/* বাটনসমূহ */}
                            <div className="flex gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || uploadingImage}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md disabled:opacity-50 cursor-pointer"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        editingService ? 'Update Service' : 'Save Service'
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
