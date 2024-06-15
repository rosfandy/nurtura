'use client'
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import Link from "next/link";

interface DaftarLahan {
    id?: number;
    nama_lahan?: string;
}

export default function DaftarLahan() {
    const [DaftarLahan, setDaftarLahan] = useState<DaftarLahan[] | null>(null);
    const lahanIcon = <svg width="30" height="26" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.75 6.09375C8.75 8.86641 12.5573 13.8074 14.2292 15.8438C14.6302 16.3312 15.375 16.3312 15.7708 15.8438C17.4427 13.8074 21.25 8.86641 21.25 6.09375C21.25 2.72695 18.4531 0 15 0C11.5469 0 8.75 2.72695 8.75 6.09375ZM8.33333 10.1766C8.15104 9.82617 7.98438 9.47578 7.83333 9.13047C7.80729 9.06953 7.78125 9.00352 7.75521 8.94258L1.71354 6.58633C0.890627 6.26641 0 6.85547 0 7.71875V21.4703C0 21.968 0.3125 22.4148 0.786457 22.6027L8.33333 25.543V10.1766ZM22.8333 7.02305C22.7083 7.73906 22.4583 8.46016 22.1667 9.13047C22.0156 9.47578 21.849 9.82617 21.6667 10.1766V22.943L28.2865 25.5277C29.1094 25.8477 30 25.2586 30 24.3953V10.6438C30 10.1461 29.6875 9.69922 29.2135 9.51133L22.8281 7.02305H22.8333ZM12.9271 16.8594C12.2031 15.9758 11.0677 14.5387 10 12.9492V25.609L20 22.8211V12.9492C18.9323 14.5387 17.7969 15.9758 17.0729 16.8594C16.0052 18.1594 13.9948 18.1594 12.9271 16.8594ZM15 7.71875C14.4475 7.71875 13.9176 7.50474 13.5269 7.12381C13.1362 6.74288 12.9167 6.22622 12.9167 5.6875C12.9167 5.14878 13.1362 4.63212 13.5269 4.25119C13.9176 3.87026 14.4475 3.65625 15 3.65625C15.5525 3.65625 16.0824 3.87026 16.4731 4.25119C16.8638 4.63212 17.0833 5.14878 17.0833 5.6875C17.0833 6.22622 16.8638 6.74288 16.4731 7.12381C16.0824 7.50474 15.5525 7.71875 15 7.71875Z" fill="#57B492" />
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

                const response = await axios.get(`/api/lahan/user/${id_user}`, axiosConfig);
                if (response.status === 200 && response.data.data) {
                    setDaftarLahan(response.data.data);
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
                {DaftarLahan && DaftarLahan.length > 0 ? (
                    DaftarLahan.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div>{lahanIcon}</div>
                            <div>{item.nama_lahan}</div>
                            <div>
                                <Link href={`/main/lahan/detail/${item.id}`} className="bg-[#57B492] text-white px-4 rounded-xl text-sm py-1">Detail</Link>
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
