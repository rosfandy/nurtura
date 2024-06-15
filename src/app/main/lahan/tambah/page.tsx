'use client'
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'; // This will be used for redirecting
import dynamic from 'next/dynamic';

const CityMap = dynamic(() => import('@/app/components/Map'), {
    ssr: false  // Disable server-side rendering for this component
});

interface DaftarLahan {
    id?: number;
    nama_lahan?: string;
}

export default function TambahLahan() {
    const [DaftarLahan, setDaftarLahan] = useState<DaftarLahan[] | null>(null);
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

    useEffect(() => {
        if (city) fetchCityCoordinates();
    }, [city])

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

    const fetchCityCoordinates = async () => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?city=${city}&format=json&limit=1`);
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                const newPos: [number, number] = [parseFloat(lat), parseFloat(lon)];
                setLong(parseFloat(lon))
                setLat(parseFloat(lat))
            }
        } catch (error) {
            console.error('Error fetching city coordinates:', error);
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            id_user: Cookies.get('id_user'),
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            longitude: longitude || 0, // Menetapkan nilai default sebagai 0 jika `longitude` adalah null
            latitude: latitude || 0,   // Menetapkan nilai default sebagai 0 jika `latitude` adalah null
        }));
    }, [longitude, latitude]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log(formData)
        try {
            const response = await axios.post('/api/lahan/', formData, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            console.log(response.data)
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
                        onChange={handleChange} // Add handleChange here
                    />
                </div>
                <div className="mb-2">
                    <div>Keterangan</div>
                    <textarea
                        name='deskripsi'
                        className="w-full px-4 py-1 rounded-md border border-slate-300"
                        onChange={handleChange} // Add handleChange here
                    />
                </div>
                <div className="pb-2">
                    {/* MAPS WITH INPUT KOTA */}
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
                            <button className='rounded-md w-3/4 py-1 text-white text-sm bg-[#57B492]' onClick={handleCitySubmit} type="submit">Search</button>
                        </div>
                    </div>
                    <div className="pt-2">
                        <CityMap city={city} longitude={setLong} latitude={setLat} dataLong={longitude} dataLat={latitude} />
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
                            onChange={handleChange} // Add handleChange here
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
                            onChange={handleChange} // Add handleChange here
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
