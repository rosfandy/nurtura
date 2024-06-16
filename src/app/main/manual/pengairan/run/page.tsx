'use client'
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DaftarPenanaman {
    id?: number;
    nama_penanaman?: string;
}

export default function Run() {
    const [DaftarPenanaman, setDaftarPenanaman] = useState<DaftarPenanaman[] | null>(null);
    const [formData, setFormData] = useState({
        id_penanaman: '',
        tanggal_pengairan: '',
        volume: '0',
        start: '',
        end: '',
        durasi: '0'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const id_user = Cookies.get('id_user');
        const token = Cookies.get('token');
        if (!id_user || !token) {
            toast.error('Authentication details are missing');
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
                toast.error(`Failed to fetch data: ${response.status}`);
            }
        } catch (error: any) {
            toast.error(`Error fetching data: ${error.message}`);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let newFormData = { ...formData, [name]: value };

        if (name === 'volume') {
            const volume = parseFloat(value);
            const durasi = isNaN(volume) ? 0 : (volume / 7) * 60;
            newFormData = { ...newFormData, durasi: durasi.toFixed(0) };
        }

        setFormData(newFormData);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = Cookies.get('token');
        if (!token) {
            toast.error('No authentication token found');
            return;
        }

        // Combine date with time for start and end before submission
        const combinedStartDatetime = `${formData.tanggal_pengairan} ${formData.start}`;
        const combinedEndDatetime = `${formData.tanggal_pengairan} ${formData.end}`;

        // Create a new object that includes the combined datetime values
        const submissionData = {
            ...formData,
            start: combinedStartDatetime,
            end: combinedEndDatetime
        };

        const axiosConfig = {
            headers: { 'Authorization': `Bearer ${token}` },
            validateStatus: (status: any) => status < 500
        };

        try {
            const response = await axios.post('/api/pengairan/input', submissionData, axiosConfig);
            if (response.status === 200) {
                toast.success('Success: Data added successfully');
                // Optionally reset form or update UI
            } else {
                toast.error(`Failed to post data: ${response.status}`);
            }
        } catch (error: any) {
            toast.error(`Error posting data: ${error.message}`);
        }
    };

    return (
        <div className="bg-[#F1F5F9] min-h-screen p-4">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <div className="font-bold text-[#57B492] py-2">Input Manual Pengairan</div>
            <div className="bg-white p-4 flex flex-col gap-y-4 mb-12">
                <form className="bg-white shadow rounded-md p-4" onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <div>Nama Penanaman</div>
                        <select
                            name='id_penanaman'
                            value={formData.id_penanaman}
                            onChange={handleChange}
                            className="w-full px-4 py-1 rounded-md border border-slate-300"
                        >
                            <option value="" disabled>Pilih Penanaman</option>
                            {DaftarPenanaman && DaftarPenanaman.map((item, index) => (
                                <option key={index} value={item.id}>{item.nama_penanaman}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-2">
                        <div>Tanggal Pengairan</div>
                        <input
                            name='tanggal_pengairan'
                            value={formData.tanggal_pengairan}
                            onChange={handleChange}
                            className="w-full px-4 py-1 rounded-md border border-slate-300"
                            type="date"
                        />
                    </div>
                    <div className="mb-2">
                        <div>Volume</div>
                        <div className="flex gap-x-2 items-center">
                            <input
                                name='volume'
                                value={formData.volume}
                                onChange={handleChange}
                                className="w-1/3 px-4 py-1 rounded-md border border-slate-300"
                                type="number"
                            />
                            L
                        </div>
                    </div>
                    <div className="mb-2">
                        <div>Waktu Pengairan</div>
                        <div className="flex w-full">
                            <div className="w-1/2">
                                <div>Mulai</div>
                                <input
                                    name='start'
                                    value={formData.start}
                                    onChange={handleChange}
                                    className="w-full px-4 py-1 rounded-md border border-slate-300"
                                    type="time"
                                />
                            </div>
                            <div className="w-1/2">
                                <div>Selesai</div>
                                <input
                                    name='end'
                                    value={formData.end}
                                    onChange={handleChange}
                                    className="w-full px-4 py-1 rounded-md border border-slate-300"
                                    type="time"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-2">
                        <div>Durasi</div>
                        <div className="flex gap-x-2 items-center">
                            <input
                                name='durasi'
                                value={formData.durasi}
                                className="w-1/3 px-4 py-1 rounded-md border border-slate-300"
                                type="number"
                                readOnly
                            />
                            Detik
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-2 items-center justify-center mt-6">
                        <button type="submit" className="bg-[#57B492] text-white px-4 py-1 rounded-md w-full">Tambah</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
