import { useEffect, useRef, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import ApexCharts from 'apexcharts';

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
    const chartRef = useRef(null);
    const chart = useRef<ApexCharts | null>(null);

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
                setFilterSensor(res.data.data);
            } catch (error) {
                console.log('Error fetching sensor data:', error);
            }
        };

        if (penanaman) {
            fetchData();
        }
    }, [penanaman]);

    useEffect(() => {
        if (filterSensor && filterSensor.length > 0 && type_sensor != null) {
            const seriesData = filterSensor.map(sensor => ({
                x: new Date(sensor.timestamp_pengukuran).getTime(),
                y: sensor[type_sensor as keyof SensorDataPoint]  // Assert that type_sensor is a valid key of SensorDataPoint
            }));

            const options = {
                chart: {
                    type: 'line',
                    height: 350,
                    zoom: {
                        enabled: true,
                        type: 'x'
                    }
                },
                series: [{
                    name: type_sensor,
                    data: seriesData
                }],
                xaxis: {
                    type: 'datetime'
                },
                tooltip: {
                    x: {
                        format: 'dd MMM yyyy HH:mm'
                    }
                }
            };

            // Initialize chart if not already created, or update it
            if (chart.current) {
                chart.current.updateOptions(options);
            } else {
                chart.current = new ApexCharts(chartRef.current, options);
                chart.current.render();
            }
        }

        // Cleanup function to destroy chart
        return () => {
            if (chart.current) {
                chart.current.destroy();
                chart.current = null;
            }
        };
    }, [filterSensor, type_sensor]);

    return (
        <div>
            <h2>Current Sensor Type: {type_sensor}</h2>
            {filterSensor.length > 0 ? (
                <div ref={chartRef}></div>
            ) : (
                <p> Pilih penanaman</p>
            )}
        </div>
    );
}
