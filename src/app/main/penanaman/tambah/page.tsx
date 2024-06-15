'use client'
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'; // This will be used for redirecting

interface DaftarLahan {
    id?: number;
    nama_lahan?: string;
}

export default function TambahPenanaman() {
    const [DaftarLahan, setDaftarLahan] = useState<DaftarLahan[] | null>(null);
    const [formData, setFormData] = useState({
        nama_penanaman: '',
        keterangan: '',
        id_lahan: '',
        jenis_tanaman: '',
        tanggal_tanam: ''
    });
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const id_user = Cookies.get('id_user');
        const token = Cookies.get('token');
        if (!id_user || !token) {
            console.log('Authentication details are missing');
            return;
        }

        const axiosConfig = {
            headers: { 'Authorization': `Bearer ${token}` },
            validateStatus: (status: any) => status < 500
        };

        try {
            const response = await axios.get(`/api/lahan/${id_user}`, axiosConfig);
            if (response.status === 200) {
                setDaftarLahan(response.data.data);
            } else {
                console.log('Failed to fetch data:', response.status, response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            id_user: Cookies.get('id_user'),
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log(formData)
        try {
            const response = await axios.post('/api/penanaman/', formData, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            if (response.status === 200) {
                toast.success('Penanaman berhasil ditambahkan!');
                router.push('/main/dashboard');
            } else {
                toast.error('Gagal menambahkan penanaman.');
            }
        } catch (error) {
            toast.error('Error saat menambahkan penanaman.');
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="bg-[#F1F5F9] min-h-screen text-black py-4 px-8">
            <ToastContainer />
            <div className="font-bold text-[#57B492] py-2">Tambah Penanaman</div>
            <form className="bg-white shadow rounded-md p-4" onSubmit={handleSubmit}>
                <div className="mb-2">
                    <div>Nama Penanaman</div>
                    <input
                        name='nama_penanaman'
                        className="w-full px-4 py-1 rounded-md border border-slate-300"
                        type="text"
                        onChange={handleChange} // Add handleChange here
                    />
                </div>
                <div className="mb-2">
                    <div>Keterangan</div>
                    <textarea
                        name='keterangan'
                        className="w-full px-4 py-1 rounded-md border border-slate-300"
                        onChange={handleChange} // Add handleChange here
                    />
                </div>
                <div className="mb-2">
                    <div>Pilih Lahan</div>
                    <select
                        name='id_lahan' // Ensure you have a `name` attribute that matches the state
                        className="w-full px-4 py-1 rounded-md border border-slate-300"
                        onChange={handleChange} // Add handleChange here
                    >
                        <option value="" disabled selected>Pilih Lahan</option>
                        {DaftarLahan && DaftarLahan.map((item, index) => (
                            <option key={index} value={item.id}>
                                {item.nama_lahan}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <div>Jenis Tanaman</div>
                    <select
                        name='jenis_tanaman' // Ensure you have a `name` attribute that matches the state
                        className="w-full px-4 py-1 rounded-md border border-slate-300"
                        onChange={handleChange} // Add handleChange here
                    >
                        <option value="" disabled selected>Pilih Tanaman</option>
                        <option value="bawang_merah">Bawang Merah</option>
                    </select>
                </div>
                <div className="mb-2">
                    <div>Tanggal Tanam</div>
                    <input
                        name='tanggal_tanam'
                        className="w-full px-4 py-1 rounded-md border border-slate-300"
                        type="date"
                        onChange={handleChange} // Add handleChange here
                    />
                </div>
                <div className="flex flex-col gap-y-2 items-center justify-center mt-6">
                    <button type="submit" className="bg-[#57B492] text-white px-4 py-1 rounded-md w-full">Tambah</button>
                </div>
            </form>

        </div>
    );
}
