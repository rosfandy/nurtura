'use client'
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'; // This will be used for redirecting

interface DaftarPenanaman {
    id?: number;
    nama_penanaman?: string;
}

interface PlantDataItem {
    id: string;
    url: string;
    detection: string;
    accuration: number;
    posisi: string;
    updated_at: string;
}

export default function Deteksi() {
    const [DaftarPenanaman, setDaftarPenanaman] = useState<DaftarPenanaman[] | null>(null);
    const [SelectedPenanaman, setSelectedPenanaman] = useState(0);
    const [Tanaman, setTanaman] = useState(0);
    const [PlantData, setPlantData] = useState<PlantDataItem[] | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const [SelectedPlantIndex, setSelectedPlantIndex] = useState<number | 0>(0);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (Tanaman && SelectedPenanaman) {
            console.log(Tanaman)
            fetchTanaman();
        }
    }, [Tanaman, SelectedPenanaman]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        if (name == 'penanaman') setSelectedPenanaman(value)
        if (name == 'tanaman') setTanaman(value)
        console.log(value)
    };

    const handlePlantSelect = (index: number) => {
        setSelectedPlantIndex(index);
    };

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
                console.log(response.data.data)
                setDaftarPenanaman(response.data.data);
            } else {
                console.log('Failed to fetch data:', response.status, response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchTanaman = async () => {
        setIsLoading(true)
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
            const response = await axios.get(`/api/tanaman/${SelectedPenanaman}/${Tanaman}`, axiosConfig);
            if (response.status === 200) {
                setIsLoading(false)
                console.log(response.data.data)
                setPlantData(response.data.data);
            } else {
                console.log('Failed to fetch data:', response.status, response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    return (
        <div className="bg-[#F1F5F9] min-h-screen text-black p-4">
            <div className="font-bold text-[#57B492] py-2">Tinggi Tanaman</div>
            <div className="pb-2 text-sm">Pilih jenis tanaman untuk melakukan pengecekan kondisi pada tanaman</div>
            <div className="font-bold text-[#57B492] py-2">Jenis Tanaman</div>
            <div className="flex gap-x-2 pb-4 max-w-full">
                <div className="bg-white shadow rounded-md px-2 text-xs py-1">
                    <select name="tanaman" id="" onChange={handleChange}>
                        <option value="" disabled selected>Pilih tanaman</option>
                        <option value="bawang_merah" >Bawang Merah</option>
                    </select>
                </div>
                <div className="bg-white shadow rounded-md px-2 text-xs py-1">
                    <select name="penanaman" id="" onChange={handleChange}>
                        <option value="" disabled selected>Pilih penanaman</option>
                        {DaftarPenanaman && DaftarPenanaman.map((item, index) => (
                            <option key={index} value={item.id}>
                                {item.nama_penanaman}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="bg-white shadow rounded-md p-4">
                {isLoading ? (
                    <div className="">Fetching Data...</div>
                ) : (
                    PlantData ? (
                        <div className="">
                            <div className="flex gap-x-2 justify-center">
                                {PlantData && PlantData.map((item, index) => (
                                    <button
                                        key={index}
                                        className={`rounded text-white px-3 py-1 text-sm ${SelectedPlantIndex === index ? 'bg-[#57B492]' : 'bg-gray-400'
                                            }`}
                                        onClick={() => handlePlantSelect(index)}>
                                        {item.id}
                                    </button>
                                ))}

                            </div>
                            {SelectedPlantIndex !== null && (
                                <div className="">
                                    <div className="flex justify-center pt-4">
                                        <img className='rounded-xl w-auto h-[30vh]' src={PlantData[SelectedPlantIndex].url} alt="" />
                                    </div>
                                    <div className="flex w-full px-4">
                                        <div className="flex flex-col w-1/2 items-start justify-start py-4 font-light text-sm">
                                            <div className="">Hasil deteksi</div>
                                            <div className="">Akurasi</div>
                                            <div className="">Tanggal</div>
                                            <div className="">Pukul</div>
                                        </div>
                                        <div className="flex flex-col w-1/2 items-end justify-end py-4 font-semibold text-sm">
                                            <div>{PlantData[SelectedPlantIndex].detection}</div>
                                            <div>{PlantData[SelectedPlantIndex].accuration} %</div>
                                            <div className='flex items-end justify-end '>
                                                <div>
                                                    {PlantData[SelectedPlantIndex] && new Date(PlantData[SelectedPlantIndex].updated_at).toLocaleString('id-ID', {
                                                        weekday: 'long', // "Senin"
                                                        month: 'long', // "Juli"
                                                        day: 'numeric', // "19"
                                                    }).replace('pukul', '')}
                                                </div>
                                            </div>
                                            <div className='flex items-end justify-end '>
                                                <div>
                                                    {PlantData[SelectedPlantIndex] && new Date(PlantData[SelectedPlantIndex].updated_at).toLocaleString('id-ID', {
                                                        hour: '2-digit', // "02"
                                                        minute: '2-digit', // "00"
                                                        second: '2-digit', // "00"
                                                        hour12: false // use 24-hour format
                                                    }).replace('pukul', '')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="">Pilih Tanaman dan Penanaman   </div>
                    )
                )
                }
            </div>
        </div>
    )
}