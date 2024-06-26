'use client'
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'; // Corrected import for Next.js router
import dynamic from 'next/dynamic';

const CityMap = dynamic(() => import('@/app/components/MapInput'), {
    ssr: false  // Disable server-side rendering for this component
});

interface DaftarLahan {
    id?: number;
    nama_lahan?: string;
}

export default function TambahLahan() {
    const [daftarLahan, setDaftarLahan] = useState<DaftarLahan[] | null>(null);
    const [formData, setFormData] = useState({
        nama_lahan: '',
        deskripsi: '',
        longitude: 0,
        latitude: 0
    });
    const router = useRouter();
    const [city, setCity] = useState('');
    const [inputCity, setInputCity] = useState('');
    const [longitude, setLong] = useState<number | null>(null);
    const [latitude, setLat] = useState<number | null>(null);

    const handleCitySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCity(inputCity);
    };

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Consolidate form data with longitude and latitude before submission
        const updatedFormData = {
            ...formData,
            longitude: longitude || 0,
            latitude: latitude || 0,
            id_user: Cookies.get('id_user')
        };
        console.log(updatedFormData);

        try {
            const response = await axios.post('/api/lahan/', updatedFormData, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            console.log(response.data);
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
            <div className="font-bold text-[#57B492] py-2">Tambah Lahan</div>
            <form className="bg-white shadow rounded-md p-4" onSubmit={handleSubmit}>
                <div className="mb-2">
                    <div>Nama Lahan</div>
                    <input
                        name='nama_lahan'
                        className="w-full px-4 py-1 rounded-md border border-slate-300"
                        type="text"
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-2">
                    <div>Keterangan</div>
                    <textarea
                        name='deskripsi'
                        className="w-full px-4 py-1 rounded-md border border-slate-300"
                        onChange={handleChange}
                    />
                </div>
                <div className="pb-2">
                    {/* Maps Component with Input City */}
                    <div>Maps</div>
                    <div className="border-slate-300 border w-full flex items-center justify-between rounded-md">
                        <input
                            type="text"
                            value={inputCity}
                            className='w-2/3 px-4 py-1 rounded-md focus:outline-none '
                            onChange={(e) => setInputCity(e.target.value)}
                            placeholder="Enter city name"
                        />
                        <div className="w-1/3 flex justify-end">
                            <button className='rounded-md w-3/4 py-1 text-white text-sm bg-[#57B492]' onClick={handleCitySubmit} type="button">Search</button>
                        </div>
                    </div>
                    <div className="pt-2">
                        <CityMap city={city} longitude={setLong} latitude={setLat} />
                    </div>
                </div>
                <div className="flex gap-x-2">
                    <div className="mb-2">
                        <div>Longitude</div>
                        <input
                            disabled
                            value={longitude ?? 0}
                            name='longitude'
                            className="w-full px-4 py-1 rounded-md border border-slate-300"
                            type="text"
                        />
                    </div>
                    <div className="mb-2">
                        <div>Latitude</div>
                        <input
                            disabled
                            value={latitude ?? 0}
                            name='latitude'
                            className="w-full px-4 py-1 rounded-md border border-slate-300"
                            type="number"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-y-2 items-center justify-center mt-6">
                    <button type="submit" className="bg-[#57B492] text-white px-4 py-1 rounded-md w-full">Tambah</button>
                </div>
            </form>
        </div>
    );
}
