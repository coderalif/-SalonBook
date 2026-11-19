import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
        <html lang="en" className="h-full antialiased">
            <body className="min-h-full flex flex-col bg-slate-50/50 text-gray-900 font-sans">
                {/* Official Google Identity Services SDK */}
                <Script
                    src="https://accounts.google.com/gsi/client"
                    strategy="lazyOnload"
                    id="google-gsi-client"
                />
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
