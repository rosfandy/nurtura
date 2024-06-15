'use client'
import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import ApexCharts from 'apexcharts';
import Graph from './graph';
import Lahan from './lahan';

interface SensorData {
    suhu?: number;
    kelembapan_udara?: number;
    kelembapan_tanah?: number;
    ph_tanah?: number;
    nitrogen?: number;
    fosfor?: number;
    kalium?: number;
}

interface Penanaman {
    id: string; // or number, depending on your data structure
    nama_penanaman: string;
}

interface ChartLabels {
    [key: string]: string;
}

export default function Dashboard() {
    const didFetchData = useRef(false);
    const [sensorData, setSensorData] = useState(null);
    const [latestSensor, setLatestSensor] = useState<SensorData | null>(null);
    const [penanamanData, setPenanamanData] = useState<Penanaman[] | null>(null);
    const [error, setError] = useState('');
    const chartRefs = useRef<{ [key: string]: HTMLElement | null }>({});
    const [selectedPenanaman, setSelectedPenanaman] = useState(null);
    const [selectedSensorType, setSelectedSensorType] = useState(null); // State to track selected sensor type

    const handleSensorTypeChange = (e: any) => {
        setSelectedSensorType(e.target.value); // Update state when the user selects a sensor type
    };

    const handlePenanamanChange = (e: any) => {
        setSelectedPenanaman(e.target.value); // Update state when the user selects a sensor type
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id_user = Cookies.get('id_user');
                const token = Cookies.get('token');

                if (!id_user || !token) {
                    setError('Authentication details are missing');
                    return;
                }

                // Configure axios to handle 200, 400, and 404 as non-errors
                const axiosConfig = {
                    headers: { 'Authorization': `Bearer ${token}` },
                    validateStatus: function (status: any) {
                        // Only reject with an error for server-side errors (status codes 500 and above)
                        return status < 500;
                    }
                };

                const allSensor = await axios.get(`/api/sensor/${id_user}`, axiosConfig);
                if (allSensor.status !== 200) {
                    console.log('Non-200 status:', allSensor.status, allSensor.data);
                    setError(`Received status ${allSensor.status}`);
                    return;  // Handle non-200 statuses without throwing an error
                }

                setSensorData(allSensor.data.data);

                const latestSensor = await axios.get(`/api/sensor/latest/${id_user}`, axiosConfig);
                if (latestSensor.status !== 200) {
                    console.log('Non-200 status:', latestSensor.status, latestSensor.data);
                    setError(`Received status ${latestSensor.status}`);
                    return;  // Handle non-200 statuses without throwing an error
                }

                console.log(latestSensor.data.data)
                setLatestSensor(latestSensor.data.data);

                const penanaman = await axios.get(`/api/penanaman/${id_user}`, axiosConfig);
                if (penanaman.status !== 200) {
                    console.log('Non-200 status:', penanaman.status, penanaman.data);
                    setError(`Received status ${penanaman.status}`);
                    return;  // Handle non-200 statuses without throwing an error
                }

                setPenanamanData(penanaman.data.data);

            } catch (error: any) {
                setError(error.message || 'An error occurred');
            }

        };

        if (!didFetchData.current) {
            fetchData();
            didFetchData.current = true;
        }
    }, []);

    useEffect(() => {
        if (latestSensor) {
            const sensorKeys: (keyof SensorData)[] = ['suhu', 'kelembapan_udara', 'kelembapan_tanah', 'ph_tanah', 'nitrogen', 'fosfor', 'kalium'];
            const labels: ChartLabels = {
                suhu: 'Suhu',
                kelembapan_udara: 'Kelembapan Udara',
                kelembapan_tanah: 'Kelembapan Tanah',
                ph_tanah: 'pH Tanah',
                nitrogen: 'Nitrogen',
                fosfor: 'Fosfor',
                kalium: 'Kalium'
            };

            sensorKeys.forEach((key) => {
                const value = latestSensor[key];
                if (value !== undefined && chartRefs.current[key]) {
                    const options = {
                        series: [value],
                        chart: {
                            height: 120,
                            type: 'radialBar',
                        },
                        plotOptions: {
                            radialBar: {
                                hollow: {
                                    size: '50%',
                                },
                                dataLabels: {
                                    name: {
                                        fontSize: '12px',
                                        color: '#000',
                                        offsetY: 47,
                                    },
                                    value: {
                                        fontSize: '16px',
                                        offsetY: -10,
                                        fontWeight: 'bold',
                                        show: true,
                                        formatter: function (val: number): string {
                                            return val.toString(); // This will display just the numeric value
                                        }
                                    },
                                },

                            },
                        },
                        colors: ['#57B492'], // Specify the color here
                        labels: [labels[key]],
                    };

                    const chart = new ApexCharts(chartRefs.current[key], options);
                    chart.render();
                }
            });
        }
    }, [latestSensor]);

    return (
        <div className="bg-[#F1F5F9] min-h-screen text-black">
            <div className="p-4 flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-2">
                    <div className="font-bold text-[#57B492]">Fitur Unggulan</div>
                    <div className="bg-white shadow rounded-md p-4 flex justify-between text-[12px] font-semibold">
                        <div className="flex justify-center flex-col items-center gap-y-2">
                            <div className="bg-[#57B492] rounded-xl">
                                <div className="h-[8vh] w-auto p-3 ">
                                    <img className='w-full h-full object-contain' src="/deteksi.png" alt="" />
                                </div>
                            </div>
                            <div className="font-bold ">Deteksi</div>
                        </div>
                        <div className="flex justify-center flex-col items-center gap-y-2">
                            <div className="bg-[#57B492] rounded-xl">
                                <div className="h-[8vh] w-auto p-3 ">
                                    <img className='w-full h-full object-contain' src="/pengairan.png" alt="" />
                                </div>
                            </div>
                            <div className="font-bold ">Pengairan</div>
                        </div>
                        <div className="flex justify-center flex-col items-center gap-y-2">
                            <div className="bg-[#57B492] rounded-xl">
                                <div className="h-[8vh] w-auto p-3 ">
                                    <img className='w-full h-full object-contain' src="/pupuk.png" alt="" />
                                </div>
                            </div>
                            <div className="font-bold ">Pemupukan</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-y-2">
                    <div className="font-bold text-[#57B492]">Data Sensor Terkini</div>
                    <div className="bg-white shadow rounded-md p-4 flex flex-wrap">
                        {
                            sensorData && Object.keys(sensorData[0]).length > 0 ? (
                                Object.keys(sensorData[0]).map((key, index) => (
                                    <div key={index} className="max-w-[50%]">
                                        <div ref={el => {
                                            if (el) chartRefs.current[key] = el;
                                        }}></div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-sm font-medium text-gray-500">
                                    Tidak ada data
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="flex flex-col gap-y-2">
                    <div className="font-bold text-[#57B492]">Data Seluruh Sensor</div>
                    <div className="flex gap-x-4 text-xs">
                        <select className="w-[30%] p-1 rounded-md border border-slate-300 shadow-xs text-black" name="" id="" onChange={handleSensorTypeChange}>
                            <option disabled selected >Pilih Data Sensor</option> {/* Tidak dipilih sebagai item yang valid */}
                            <option className='text-black' value="suhu">Suhu</option>
                            <option className='text-black' value="kelembapan_udara">Kelembapan udara</option>
                            <option className='text-black' value="kelembapan_tanah">Kelembapan tanah</option>
                            <option className='text-black' value="ph_tanah">pH tanah</option>
                            <option className='text-black' value="nitrogen">Nitrogen</option>
                            <option className='text-black' value="fosfor">Fosfor</option>
                            <option className='text-black' value="kalium">Kalium</option>
                        </select>
                        <select className="w-[30%] p-1 rounded-md border border-slate-300 shadow-xs text-black" name="" id="" onChange={handlePenanamanChange}>
                            <option disabled selected >Pilih Penanaman</option>
                            {penanamanData && Object.keys(penanamanData).map(index => (
                                <option key={index} className='text-black' value={penanamanData[0].id}>{penanamanData[0].nama_penanaman}</option>
                            ))}
                        </select>
                        <button className="bg-[#57B492] w-[30%] rounded-md text-white">Pilih Tanggal</button>
                    </div>
                    <div className="bg-white shadow rounded-md p-4 flex flex-wrap">
                        {
                            sensorData && Object.keys(sensorData[0]).length > 0 ? (
                                <Graph penanaman={selectedPenanaman} type_sensor={selectedSensorType} sensorData={sensorData} />
                            ) : (
                                <div className="text-center text-sm font-medium text-gray-500">
                                    Tidak ada data
                                </div>
                            )
                        }
                    </div>
                </div>
                {
                    penanamanData && Object.keys(penanamanData[0]).length > 0 ? (
                        <Lahan penanaman={selectedPenanaman} />
                    ) : (
                        <div className="text-center text-sm font-medium text-gray-500">
                            Tidak ada data
                        </div>
                    )
                }
            </div>
        </div>
    );
}
