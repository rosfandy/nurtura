'use client'
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import dynamic from 'next/dynamic';

const CityMap = dynamic(() => import('@/app/components/Map'), {
    ssr: false  // Disable server-side rendering for this component
});

interface LahanData {
    nama_lahan?: string;
    deskripsi?: string;
    longitude?: string;
    latitude?: string;
}

export default function LahanDetail() {
    const { id_lahan } = useParams<{ id_lahan: string }>();
    const [dataLahan, setDataLahan] = useState<LahanData | null>(null);
    const [city, setCity] = useState('');
    const [inputCity, setInputCity] = useState('');
    const [longitude, setLong] = useState<number | null>(null);
    const [latitude, setLat] = useState<number | null>(null);

    const handleCitySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCity(inputCity);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id_user = Cookies.get('id_user');
                const token = Cookies.get('token');

                if (!id_user || !token) {
                    console.log('Authentication details are missing');
                    return;
                }

                const axiosConfig = {
                    headers: { 'Authorization': `Bearer ${token}` },
                    validateStatus: function (status: number) {
                        return status < 500; // Allow anything less than 500 to not throw an error
                    }
                };

                const lahanData = await axios.get(`/api/lahan/${id_lahan}`, axiosConfig);
                if (lahanData.status !== 200) {
                    console.log('Non-200 status:', lahanData.status, lahanData.data);
                    return;
                }
                setDataLahan(lahanData.data.data[0]);
            } catch (error: any) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id_lahan]); // Added id_lahan as a dependency

    // Define valid keys based on LahanData interface
    const validKeys = ['nama_lahan', 'deskripsi'];

    return (
        <div className="bg-[#F1F5F9] min-h-screen p-4">
            <div className="font-bold text-[#57B492] py-2">Informasi Lahan</div>
            <div className="bg-white p-4 flex flex-col gap-y-6">
                {dataLahan ? (
                    <>
                        <div className="flex flex-col gap-y-2">
                            {Object.entries(dataLahan)
                                .filter(([key]) => validKeys.includes(key))  // Filter entries based on valid keys
                                .map(([key, value]) => (
                                    <div key={key}>
                                        <div className="">{key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1)}</div>
                                        <input className="w-full px-4 py-1 rounded-md border border-slate-300" defaultValue={value} type="text" />
                                    </div>
                                ))}
                        </div>
                        <div className="">
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
                                <CityMap city={city} longitude={setLong} latitude={setLat} dataLong={dataLahan.longitude} dataLat={dataLahan.latitude} />
                            </div>
                        </div>
                        <div className="flex gap-x-2">
                            <div className="mb-2">
                                <div>Longitude</div>
                                <input
                                    value={longitude ?? dataLahan.longitude}
                                    name='longitude'
                                    className="w-full px-4 py-1 rounded-md border border-slate-300"
                                    type="number"
                                    onChange={(e) => setLong(Number(e.target.value))}
                                />
                            </div>
                            <div className="mb-2">
                                <div>Latitude</div>
                                <input
                                    value={latitude ?? dataLahan.latitude}
                                    name='latitude'
                                    className="w-full px-4 py-1 rounded-md border border-slate-300"
                                    type="number"
                                    onChange={(e) => setLat(Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="flex gap-x-2 items-center justify-center px-4">
                            <button className="bg-white border-slate-300 border px-4 py-1 rounded-md w-[50%]">Ubah</button>
                            <button className="bg-red-500 text-white px-4 py-1 rounded-md w-[50%]">Hapus</button>
                        </div>
                    </>
                ) : (
                    <div>Loading...</div> // Display loading or handle no data
                )}
            </div>
        </div>
    );
}
