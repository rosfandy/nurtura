import React, { useEffect, useState } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'; // This will be used for redirecting

interface SopPengairan {
    nama?: string;
    max?: number;
    min?: number;
    id_penanaman?: number;
}

type IndexToNameKeys = '0' | '1' | '2';
interface FormData {
    [key: string]: any;  // This can be more specific based on your actual data types
}

export default function SopPengairanComponent(param: any) {
    const { penanaman, setIdPenanaman } = param
    const [sopPengairan, setSopPengairan] = useState<SopPengairan[] | null>(null);
    const [selectedPenanaman, setSelectedPenanaman] = useState('');
    const [isEditable, setIsEditable] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchData();
    }, [selectedPenanaman]);

    const handleChange = (e: any) => {
        setSelectedPenanaman(e.target.value);
        setIdPenanaman(e.target.value)
        setSopPengairan(null);  // Reset the SopPengairan state when changing selection
    }

    const indexToName: Record<IndexToNameKeys, string> = {
        "0": "temperature",
        "1": "humidity",
        "2": "soil_moisture"
    };

    interface SensorData {
        nama: string;
        min?: string;
        max?: string;
        id_penanaman: number;
    }
    // Function to transform data
    function transformData(data: Record<string, string>, id_penanaman: number): SensorData[] {
        const result: SensorData[] = [];

        Object.keys(data).forEach(key => {
            const value = data[key];
            const index = key.slice(-1) as IndexToNameKeys;  // Ensure index is of type IndexToNameKeys
            const property = key.slice(0, 3) as 'min' | 'max';  // Assert property is 'min' or 'max'

            // Find or create the correct object
            let obj = result.find(item => item.nama === indexToName[index]);
            if (!obj) {
                obj = { nama: indexToName[index], id_penanaman: id_penanaman };
                result.push(obj);
            }

            // Set the min or max property
            obj[property] = value;
        });

        return result;
    }

    const router = useRouter();

    const handleInputChange = (name: string, value: string | number, index: number | string) => {
        const newData: FormData = { ...formData };
        newData[name + index] = value;
        setFormData(newData);
    };

    const handleEditClick = (event: any) => {
        event.preventDefault();
        setIsEditable(true);
    };

    const handleSaveClick = async (event: any) => {
        event.preventDefault();
        setIsEditable(false);
        const transformedData = transformData(formData, parseInt(selectedPenanaman));
        const token = Cookies.get('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        for (const item of transformedData) {
            try {
                const response = await axios.post(`/api/pengairan/sop`, item, { headers });
                if (response.status === 200) {
                    toast.success(`Sop berhasil diupdate untuk ${item.nama}!`);
                    router.refresh()
                    router.push('/main/manual/pengairan')
                    console.log("Data saved successfully for", item.nama, ":", response.data);
                } else {
                    toast.error(`Gagal update sop untuk ${item.nama}.`);
                    console.error("Failed to save data for", item.nama, ":", response.status, response.data);
                }
            } catch (error) {
                toast.error(`Error saat update sop untuk ${item.nama}.`);
                console.error("Error saving data for", item.nama, ":", error);
            }
        }
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
            const response = await axios.get(`/api/pengairan/sop/${parseInt(selectedPenanaman)}`, axiosConfig);
            if (response.status === 200) {
                setSopPengairan(response.data.data)
                console.log(response.data.data);
            } else {
                console.log('Failed to fetch data:', response.status, response.data);
                setSopPengairan(null);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
            <ToastContainer />
            <div className="font-bold text-[#57B492] py-2">Ideal Pengairan</div>
            <form className="bg-white shadow rounded-md p-4">
                <div className="mb-2 flex flex-col gap-y-1">
                    <div>
                        <div>Nama Penanaman</div>
                        <select
                            name='id_penanaman'
                            className="w-full px-4 py-1 rounded-md border border-slate-300"
                            onChange={handleChange}
                            value={selectedPenanaman}
                            disabled={isEditable}
                        >
                            <option value="" disabled>Pilih Penanaman</option>
                            {penanaman && penanaman.map((item: any, index: number) => (
                                <option key={index} value={item.id}>{item.nama_penanaman}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-y-2 pt-2">
                        {selectedPenanaman == '' ? (
                            <div className="">Pilih Penanaman</div>
                        ) : (
                            sopPengairan ? sopPengairan.map((item, index) => (
                                <div key={index} className="flex flex-col gap-y-1">
                                    <div>{item.nama === 'temperature' ? 'Suhu' : item.nama === 'humidity' ? 'Kelembapan Udara' : 'Kelembapan Tanah'}</div>
                                    <div className="flex">
                                        <div className="flex gap-x-2 justify-center">
                                            <input
                                                defaultValue={item.min ?? 0}
                                                onChange={(e) => handleInputChange('min', e.target.value, index)}
                                                disabled={!isEditable}
                                                className={`border w-1/2 rounded-md px-2 ${!isEditable ? 'bg-gray-200' : ''}`}
                                                type="number"
                                                name={`min${index}`}
                                            />
                                            min
                                        </div>
                                        <div className="flex gap-x-2 justify-center">
                                            <input
                                                defaultValue={item.max ?? 0}
                                                onChange={(e) => handleInputChange('max', e.target.value, index)}
                                                disabled={!isEditable}
                                                className={`border w-1/2 rounded-md px-2 ${!isEditable ? 'bg-gray-200' : ''}`}
                                                type="number"
                                                name={`max${index}`}
                                            />
                                            max
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="">
                                    <div className="">Suhu</div>
                                    <div className="flex">
                                        <input className='hidden' type="text" name='temperature' id="" />
                                        <div className="flex gap-x-2 justify-center ">
                                            <input
                                                onChange={(e) => handleInputChange('min', e.target.value, 0)}
                                                defaultValue={0} disabled={!isEditable} className={`border w-1/2 rounded-md px-2 ${!isEditable ? 'bg-gray-200' : ''}`} type="number" name="min0" id="" />
                                            min
                                        </div>
                                        <div className="flex gap-x-2 justify-center">
                                            <input
                                                onChange={(e) => handleInputChange('max', e.target.value, 0)}
                                                defaultValue={0} disabled={!isEditable} className={`border w-1/2 rounded-md px-2 ${!isEditable ? 'bg-gray-200' : ''}`} type="number" name="max0" id="" />
                                            max
                                        </div>
                                    </div>
                                    <div className="">Kelembapan Udara</div>
                                    <div className="flex">
                                        <input className='hidden' type="text" name='humidity' id="" />
                                        <div className="flex gap-x-2 justify-center ">
                                            <input
                                                onChange={(e) => handleInputChange('min', e.target.value, 1)}
                                                defaultValue={0} disabled={!isEditable} className={`border w-1/2 rounded-md px-2 ${!isEditable ? 'bg-gray-200' : ''}`} type="number" name="min1" id="" />
                                            min
                                        </div>
                                        <div className="flex gap-x-2 justify-center">
                                            <input
                                                onChange={(e) => handleInputChange('max', e.target.value, 1)}
                                                defaultValue={0} disabled={!isEditable} className={`border w-1/2 rounded-md px-2 ${!isEditable ? 'bg-gray-200' : ''}`} type="number" name="max1" id="" />
                                            max
                                        </div>
                                    </div>
                                    <div className="">Kelembapan Tanah</div>
                                    <div className="flex">
                                        <input className='hidden' type="text" name='soil_moisture' id="" />
                                        <div className="flex gap-x-2 justify-center ">
                                            <input
                                                onChange={(e) => handleInputChange('min', e.target.value, 2)}
                                                defaultValue={0} disabled={!isEditable} className={`border w-1/2 rounded-md px-2 ${!isEditable ? 'bg-gray-200' : ''}`} name="min2" id="" />
                                            min
                                        </div>
                                        <div className="flex gap-x-2 justify-center">
                                            <input
                                                onChange={(e) => handleInputChange('max', e.target.value, 2)}
                                                defaultValue={0} disabled={!isEditable} className={`border w-1/2 rounded-md px-2 ${!isEditable ? 'bg-gray-200' : ''}`} type="number" name="max2" id="" />
                                            max
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-y-2 items-center justify-center mt-6">
                    <button onClick={handleEditClick} className={`border border-[#57B492] text-[#57B492] px-4 py-1 rounded-md w-full ${isEditable ? 'hidden' : ''}`}>Ubah Data</button>
                    <button onClick={handleSaveClick} className={`bg-[#57B492] text-white px-4 py-1 rounded-md w-full ${isEditable ? '' : 'hidden'}`}>Simpan Data</button>
                </div>
            </form>
        </div>
    );
}
