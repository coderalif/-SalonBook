import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'SalonBook - Premier Salon Appointment Booking Platform',
    description: 'Explore and book luxury salon services, haircuts, makeup, and wellness therapies with ease.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col bg-slate-50/50 text-gray-900 font-sans">
                <AuthProvider>
                    {/* টোস্ট নোটিফিকেশন কন্টেইনার */}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#18181b',
                                color: '#fff',
                                borderRadius: '12px',
                                fontSize: '14px',
                            },
                        }}
                    />
                    <Navbar />
                    <main className="flex-grow">{children}</main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}
