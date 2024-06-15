'use client'
import { useState } from 'react';
import axios from 'axios';
import { redirect, useRouter } from 'next/navigation';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter(); // Import useRouter jika belum

    const handleLogin = async (event: any) => {
        event.preventDefault(); // Mencegah reload halaman
        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password
            });

            if (response.data.success) {
                console.log(response.data.token);
                router.refresh(); // dirty fix, but it works
                router.push('/main/dashboard');
            } else {
                // Handle jika login tidak berhasil
                console.log('Login gagal:', response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="p-4">
            <div className="bg-white shadow-sm rounded-xl p-4">
                <div className="flex flex-col">
                    <div className="flex justify-center text-center pb-8">
                        <h1 className="text-black font-bold text-xl max-w-[100%]">Hello, selamat datang kembali!</h1>
                    </div>
                    <form className="flex flex-col gap-y-2" onSubmit={handleLogin}>
                        <div>
                            <input className="text-black border border-[#E8ECF4] w-full rounded-md px-4 py-2" placeholder="email" type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <input className="text-black border border-[#E8ECF4] w-full rounded-md px-4 py-2" placeholder="password" type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="flex justify-between py-4">
                            <span className="cursor-pointer text-black/50 text-xs font-semibold">Belum memiliki akun?</span>
                            <span className="cursor-pointer text-black/50 text-xs font-semibold">Lupa kata sandi?</span>
                        </div>
                        <button type="submit" className="bg-[#57B492] rounded-md text-white p-2">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
