'use client'
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'; // This will be used for redirecting

interface DaftarPenanaman {
    id?: number;
    nama_penanaman?: string;
}

export default function ManualTinggi() {
    const [DaftarPenanaman, setDaftarPenanaman] = useState<DaftarPenanaman[] | null>(null);
    const [formData, setFormData] = useState({
        id_penanaman: 0,
        tanggal_pencatatan: '',
        tinggi: 0,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const router = useRouter();

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
            const response = await axios.get(`/api/penanaman/${id_user}`, axiosConfig);
            if (response.status === 200) {
                setDaftarPenanaman(response.data.data);
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
            const response = await axios.post('/api/penanaman/tinggi', formData, {
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
        <div className="bg-[#F1F5F9] min-h-screen text-black py-4 px-8 mb-12">
            <ToastContainer />
            <div className="font-bold text-[#57B492] py-2">Tinggi Tanaman</div>
            <form className="bg-white shadow rounded-md p-4" onSubmit={handleSubmit}>
                <div className="mb-2 flex flex-col gap-y-1">
                    <div>Nama Penanaman</div>
                    <select
                        name='id_penanaman' // Ensure you have a `name` attribute that matches the state
                        className="w-full px-4 py-1 rounded-md border border-slate-300"
                        onChange={handleChange} // Add handleChange here
                    >
                        <option value="" disabled selected>Pilih Penanaman</option>
                        {DaftarPenanaman && DaftarPenanaman.map((item, index) => (
                            <option key={index} value={item.id}>
                                {item.nama_penanaman}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-2 flex flex-col gap-y-1">
                    <div>Tanggal Pencatatan</div>
                    <input
                        name='tanggal_pencatatan'
                        className="w-full px-4 py-1 rounded-md border border-slate-300"
                        type="date"
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-2 flex flex-col gap-y-1">
                    <div>Tinggi Tanaman</div>
                    <div className="flex items-center gap-x-2">
                        <input
                            name='tinggi_tanaman'
                            className="w-1/3 px-4 py-1 rounded-md border border-slate-300"
                            type="number"
                            onChange={handleChange}
                        />
                        <div className="">mm</div>
                    </div>
                </div>
                <div className="flex flex-col gap-y-2 items-center justify-center mt-6">
                    <button type="submit" className="bg-[#57B492] text-white px-4 py-1 rounded-md w-full">Submit</button>
                </div>
            </form>
        </div>
    )
}