// ========================================================
// API Service Helper & Fetch Client
// ========================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * লোকাল স্টোরেজ থেকে লগইন টোকেন রিড করার ফাংশন
 */
export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('salonbook_token');
    }
    return null;
};

/**
 * সেন্ট্রাল ফেচ রিকোয়েস্ট ফাংশন (টোকেন হেডার সহ)
 */
export async function apiFetch<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; [key: string]: any }> {
    const token = getToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    // যদি ব্যবহারকারী লগইন করা থাকে তবে Authorization হেডার যোগ হবে
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        const response = await fetch(url, {
            ...options,
            headers,
        });

        let data: any = {};
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            data = { message: text || response.statusText || 'Unexpected server response' };
        }

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'রিকোয়েস্ট ব্যর্থ হয়েছে!',
                ...data
            };
        }

        return data;
    } catch (error: any) {
        console.error(`API Error on [${endpoint}]:`, error);
        return {
            success: false,
            message: error.message || 'সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি!'
        };
    }
}

/**
 * ImgBB এ সরাসরি ছবি আপলোড করার হেল্পার ফাংশন
 */
export async function uploadImageToImgBB(file: File): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '6d207e02198a847aa5ad0a933ff874b8'; // ডেমো/ডিফল্ট কি
    const formData = new FormData();
    formData.append('image', file);

    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (data.success) {
            return data.data.display_url;
        } else {
            throw new Error(data.error?.message || 'ছবি আপলোড ব্যর্থ হয়েছে');
        }
    } catch (error: any) {
        console.error('ImgBB Upload Error:', error);
        throw error;
    }
}
