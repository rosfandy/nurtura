'use client'
import { useEffect, useState } from 'react';
import SplashScreen from './components/SplashScreen';
import { useRouter } from 'next/navigation';

export default function Page() {
    const [loading, setLoading] = useState(true);
    const router = useRouter(); // Inisialisasi useRouter

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            router.push('/main/dashboard');
        }, 2000);  // Durasi splash screen adalah 2000 ms atau 2 detik

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <SplashScreen />;
    }

    return (
        <main />
    )
}
