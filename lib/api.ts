// ========================================================
// API Service Helper & Fetch Client
// ========================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://salon-book-server-swart.vercel.app/api';

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
 * সক্রিয় ImgBB API Key ও নিরাপদ স্থানীয় ফলব্যাক সহ
 */
export async function uploadImageToImgBB(file: File): Promise<string> {
    const apiKey =
        process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
        '6eb974a954c5f43ec188694763ce0346';

    try {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (data.success && data.data?.display_url) {
            return data.data.display_url;
        }
        if (data.success && data.data?.url) {
            return data.data.url;
        }
        throw new Error(data.error?.message || 'ImgBB upload rejected');
    } catch (imgbbErr) {
        console.warn('[ImgBB Upload Warning]: API upload failed, falling back to local base64 reader:', imgbbErr);
        // সেফটি ফলব্যাক: ব্যবহারকারী যাতে কখনো আটকে না যান
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject(new Error('ছবি প্রসেস করা সম্ভব হয়নি।'));
                }
            };
            reader.onerror = () => reject(new Error('ফাইল পড়তে সমস্যা হয়েছে।'));
            reader.readAsDataURL(file);
        });
    }
}
