'use client'
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";

interface LahanData {
    nama_penanaman?: string;
    keterangan?: string;
    tanggal_tanam?: string;
    tanggal_panen?: string;
    hst?: number;
    isActive?: number;
}

export default function PenanamanDetail() {
    const { id_penanaman } = useParams<{ id_penanaman: string }>();
    const [dataLahan, setDataLahan] = useState<LahanData | null>(null);

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

                const lahanData = await axios.get(`/api/penanaman/id/${id_penanaman}`, axiosConfig);
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
    }, [id_penanaman]); // Added id_lahan as a dependency

    // Define valid keys based on LahanData interface
    const validKeys = ['nama_penanaman', 'keterangan', 'tanggal_tanam', 'tanggal_panen', 'hst', 'isActive'];

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
                                    <div key={key} className="mb-1">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1)}
                                        </label>
                                        {key.includes('tanggal') ? (
                                            <input
                                                className="mt-1 block w-full px-4 py-2 rounded-md border border-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                type="date"
                                                defaultValue={value}
                                            />
                                        ) : key === 'isActive' ? (
                                            <select
                                                className="mt-1 block w-full px-4 py-2 rounded-md border border-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                defaultValue={value}
                                            >
                                                <option value={1}>Aktif</option>
                                                <option value={0}>Nonaktif</option>
                                            </select>
                                        ) : (
                                            <input
                                                className="mt-1 block w-full px-4 py-2 rounded-md border border-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                type="text"
                                                defaultValue={value}
                                            />
                                        )}
                                    </div>
                                ))}
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
