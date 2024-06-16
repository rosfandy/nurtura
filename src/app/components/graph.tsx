import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import dynamic from 'next/dynamic';
import { format, addHours } from 'date-fns'; // Import addHours

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SensorDataPoint {
    value: number;
    timestamp_pengukuran: string;
}

interface SensorData {
    [key: string]: SensorDataPoint[];
}

export default function Graph(param: any) {
    const { penanaman, type_sensor } = param;

    const [filterSensor, setFilterSensor] = useState<SensorDataPoint[]>([]);
    const [options, setOptions] = useState<any>({});
    const [series, setSeries] = useState<any[]>([]);

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
                    validateStatus: (status: any) => status < 500 // Accept all status below 500
                };

                const res = await axios.get(`/api/sensor/filter/${penanaman}/sensor`, axiosConfig);
                if (Array.isArray(res.data.data)) {
                    setFilterSensor(res.data.data);
                } else {
                    console.error('Expected an array but received:', res.data.data);
                    setFilterSensor([]); // Set an empty array if data is not as expected
                }
            } catch (error) {
                console.log('Error fetching sensor data:', error);
            }
        };

        if (penanaman) {
            fetchData();
        }
    }, [penanaman]);

    useEffect(() => {
        if (filterSensor && Array.isArray(filterSensor) && filterSensor.length > 0 && type_sensor != null) {

            const seriesData = filterSensor.map(sensor => ({
                x: format(addHours(new Date(sensor.timestamp_pengukuran), 7), 'dd MMM yyyy HH:mm:ss'), // Adjust to GMT+7
                y: sensor[type_sensor as keyof SensorDataPoint]  // Ensure type_sensor is valid
            }));

            setOptions({
                chart: {
                    type: 'line',
                    height: 350,
                    zoom: {
                        enabled: true,
                        type: 'x'
                    }
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        format: 'dd MMM yy HH:mm' // Set format for x-axis labels
                    }
                },
                tooltip: {
                    x: {
                        format: 'dd MMM yyyy HH:mm:ss' // Set format for tooltip
                    }
                }
            });

            setSeries([{
                name: type_sensor,
                data: seriesData
            }]);
        }
    }, [filterSensor, type_sensor]);

    return (
        <div>
            <h2>Current Sensor Type: {type_sensor}</h2>
            {filterSensor.length > 0 ? (
                <ApexCharts options={options} series={series} type="line" height={350} width={"100%"} />
            ) : (
                <p>Pilih penanaman</p>
            )}
        </div>
    );
}
