import React, { useEffect, useState } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import Link from 'next/link';

interface Device {
    tipe_intruksi?: number;
    volume?: number;
    durasi?: number;
    isActive?: number;
    end?: string;
}

export default function AksiPengairan(param: any) {
    const [device, setDevice] = useState<Device | null>(null);
    const { id_penanaman } = param

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
            const response = await axios.get(`/api/device/${parseInt(id_user)}`, axiosConfig);
            if (response.status === 200) {
                if (response.data && response.data.data && response.data.data.length > 0) {
                    const latestDevice = response.data.data[response.data.data.length - 1];  // Access the last element
                    console.log(latestDevice)
                    setDevice(latestDevice);  // Set the latest device data
                } else {
                    console.log('No data available or invalid data structure');
                }
            } else {
                console.log('Failed to fetch data:', response.status, response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="mt-4">
            <div className="font-bold text-[#57B492] py-2">Aksi Pengairan</div>
            <div className="bg-white p-4 flex flex-col gap-y-4 mb-12">

                {device ? (
                    <div className="flex flex-col gap-y-3">
                        <div className="">
                            <div className="text-sm text-[#57B492] font-semibold">Penyiraman terakhir</div>
                            <div className="">{device.end}</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col text-sm">
                                <div className="">Volume</div>
                                <div className="">Durasi</div>
                            </div>
                            <div className="flex flex-col text-sm items-end justify-end">
                                <div className="">{device.volume} L</div>
                                <div className="">{device.durasi} detik</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className=""></div>
                )}
                <div className="">
                    <div className="text-xs text-[#57B492]">Tidak ada rekomendasi atau aksi penyiraman selanjutnya.</div>
                </div>
                <div className="flex flex-col gap-y-2">
                    <div className="text-sm">Siram sekarang ?</div>
                    <Link href={'/main/manual/pengairan/run'} className='bg-[#57B492] text-center py-1 rounded-md text-white w-full'>Ya, Siram</Link>
                </div>
            </div>
        </div>
    )
}