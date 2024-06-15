import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

// Dynamically import ApexCharts with SSR disabled for Next.js compatibility
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SensorData {
    suhu?: number;
    kelembapan_udara?: number;
    kelembapan_tanah?: number;
    ph_tanah?: number;
    nitrogen?: number;
    fosfor?: number;
    kalium?: number;
}

interface SensorDisplay {
    type: keyof SensorData;
    value: number;
}

const RadialBarChart = ({ data }: { data: SensorData }) => {
    const validKeys: (keyof SensorData)[] = ['suhu', 'kelembapan_udara', 'kelembapan_tanah', 'ph_tanah', 'nitrogen', 'fosfor', 'kalium'];

    const sensorData: SensorDisplay[] = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined && validKeys.includes(key as keyof SensorData)) {
            acc.push({ type: key as keyof SensorData, value });
        }
        return acc;
    }, [] as SensorDisplay[]);

    return (
        <div className="flex w-full flex-wrap">
            {sensorData.map((sensor, index) => {
                const options: ApexOptions = {
                    chart: {
                        height: 120,
                        type: 'radialBar',
                    },
                    plotOptions: {
                        radialBar: {
                            hollow: {
                                size: '40%',
                            },
                            dataLabels: {
                                name: {
                                    fontSize: '12px',
                                    color: '#000',
                                    offsetY: 67,
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
                    colors: ['#57B492'],
                    labels: [sensor.type], // Set label dynamically for each sensor
                };

                return (
                    <div key={index} className="w-1/2 p-2">
                        <ApexChart
                            type="radialBar"
                            series={[sensor.value]}
                            options={options}
                            height={350}
                            width={"100%"}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default RadialBarChart;
