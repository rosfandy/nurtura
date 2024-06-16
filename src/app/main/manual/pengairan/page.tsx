'use client'
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'; // This will be used for redirecting
import AksiPengairan from './sub_page/aksi';
import SopPengairan from './sub_page/sop';

interface DaftarPenanaman {
    id?: number;
    nama_penanaman?: string;
}

export default function ManualPengairan() {
    const [DaftarPenanaman, setDaftarPenanaman] = useState<DaftarPenanaman[] | null>(null);
    const [id_penanaman, setIdPenanaman] = useState(0)
    const [selected, setSelected] = useState('ideal');

    const handleClick = (option: any) => {
        setSelected(option);
    };

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


    return (
        <div className="bg-[#F1F5F9] min-h-screen text-black py-4 px-8 mb-12">
            <div className="font-bold text-[#57B492] py-2">Manual Pengairan</div>
            <div className="flex w-full bg-white">
                <div
                    className={`cursor-pointer w-1/2 text-center px-2 py-1 text-sm rounded-md ${selected === 'ideal' ? 'text-white bg-[#57B492]' : ''
                        }`}
                    onClick={() => handleClick('ideal')}
                >
                    Ideal Pengairan
                </div>
                <div
                    className={`cursor-pointer w-1/2 text-center px-2 py-1 text-sm rounded-md ${selected === 'aksi' ? 'text-white bg-[#57B492]' : ''
                        }`}
                    onClick={() => handleClick('aksi')}
                >
                    Aksi Pengairan
                </div>
            </div>

            {DaftarPenanaman ? (
                selected == 'ideal' ? (
                    <div className="">
                        <SopPengairan penanaman={DaftarPenanaman} setIdPenanaman={setIdPenanaman} />
                    </div>
                ) : (
                    <div className="">
                        <AksiPengairan id_penanaman={id_penanaman} />
                    </div>
                )
            ) : (
                <div className="">Tidak ada data</div>
            )
            }
        </div>
    )
}