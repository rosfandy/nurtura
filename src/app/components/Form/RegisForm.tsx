'use client'
import { useState } from 'react';
import axios from 'axios';
import { redirect, useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';

export default function RegisForm() {
    const [nama, setNama] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const router = useRouter(); // Import useRouter jika belum

    const handleRegis = async (event: any) => {
        event.preventDefault(); // Mencegah reload halaman
        try {
            if (password == confirmPw) {
                const response = await axios.post('/api/auth/register', {
                    nama,
                    username,
                    email,
                    password
                });

                if (response.status === 200) {
                    toast.success('Register berhasil !');
                    router.refresh(); // dirty fix, but it works
                    router.push('/auth/login');
                } else {
                    // Handle jika login tidak berhasil
                    console.log('Regis gagal:', response.data.message);
                }
            } else {
                console.log('password tidak sama')
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
                    <form className="flex flex-col gap-y-2" onSubmit={handleRegis}>
                        <div>
                            <input className="text-black border border-[#E8ECF4] w-full rounded-md px-4 py-2" placeholder="nama" type="nama" name="nama" id="nama" value={nama} onChange={(e) => setNama(e.target.value)} />
                        </div>
                        <div>
                            <input className="text-black border border-[#E8ECF4] w-full rounded-md px-4 py-2" placeholder="username" type="username" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div>
                            <input className="text-black border border-[#E8ECF4] w-full rounded-md px-4 py-2" placeholder="email" type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <input className="text-black border border-[#E8ECF4] w-full rounded-md px-4 py-2" placeholder="password" type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div>
                            <input className="text-black border border-[#E8ECF4] w-full rounded-md px-4 py-2" placeholder="konfirmasi password" type="password" name="confirmPw" id="confirmPw" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
                        </div>
                        <div className="flex justify-between py-4">
                            <Link href={'/auth/login'} className="cursor-pointer text-black/50 text-xs font-semibold">Sudah memiliki akun?</Link>
                        </div>
                        <button type="submit" className="bg-[#57B492] rounded-md text-white p-2">Daftar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
