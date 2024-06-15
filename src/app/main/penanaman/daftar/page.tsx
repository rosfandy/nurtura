'use client'
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import Link from "next/link";

interface DaftarPenanaman {
    id?: number;
    nama_penanaman?: string;
}

export default function DaftarPenanaman() {
    const [dataPenanaman, setDataPenanaman] = useState<DaftarPenanaman[] | null>(null);
    const penanamanIcon = <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 19.5437C20.5563 28.0875 12.3063 22.9187 12.3063 22.9187C9.77502 28.0312 5.59377 31.3187 0.76877 31.3375C-0.23748 31.3375 -0.26873 29.8125 0.76877 29.8125C4.79377 29.7937 8.30002 27.1437 10.5938 22.9312C8.02502 23.925 3.18127 24.675 0.49377 17.7937C7.30627 14.9875 10.4375 18.4937 11.6375 20.6375C12.2563 19.1125 12.7 17.4562 12.9875 15.6562C12.9875 15.6562 4.25627 17.025 3.64377 9.525C11.0875 6.53125 13.1813 14.3187 13.1813 14.3187C13.2813 13.275 13.3875 11.0312 13.3875 10.9812C13.3875 10.9812 6.74377 6.375 11.0063 0.65625C18.7938 3.34375 14.8438 10.8062 14.8438 10.8062C14.875 10.9062 14.875 12.2937 14.8438 12.8937C14.8438 12.8937 17.6688 7.33125 23.3688 9.3C23.1063 17.675 14.5 15.95 14.5 15.95C14.225 17.6625 13.8 19.2875 13.25 20.7937C13.25 20.7937 18.4375 15.0562 24 19.5437Z" fill="#57B492" />
    </svg>;

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

                const response = await axios.get(`/api/penanaman/${id_user}`, axiosConfig);
                if (response.status === 200 && response.data.data) {
                    setDataPenanaman(response.data.data);
                } else {
                    console.log('Non-200 status:', response.status, response.data);
                }
            } catch (error: any) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-[#F1F5F9] min-h-screen text-black py-4 px-8">
            <div className="flex justify-between items-center pb-2">
                <div className="font-bold text-[#57B492] py-2">Daftar Penanaman</div>
                <div>
                    <button className="bg-[#57B492] text-white rounded-md px-4 py-1">Tambah</button>
                </div>
            </div>
            <div className="bg-white shadow rounded-xl p-4 flex flex-col gap-y-6">
                {dataPenanaman && dataPenanaman.length > 0 ? (
                    dataPenanaman.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div>{penanamanIcon}</div>
                            <div>{item.nama_penanaman}</div>
                            <div>
                                <Link href={`/main/penanaman/detail/${item.id}`} className="bg-[#57B492] text-white px-4 rounded-xl text-sm py-1">Detail</Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4">Tidak ada data penanaman.</div>
                )}
            </div>
        </div>
    );
}
