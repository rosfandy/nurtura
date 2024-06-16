import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import Leaflet from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Link from "next/link";
import CityMap from "./Map";

type Position = [number, number] | null;
interface LahanData {
    nama_lahan?: string;
    deskripsi?: string;
    longitude?: string;
    latitude?: string;
}
export default function Lahan({ penanaman }: any) {
    const [position, setPosition] = useState<Position>(null);
    const [id_lahan, setIdLahan] = useState(null)
    const [longitude, setLong] = useState<number | null>(null);
    const [latitude, setLat] = useState<number | null>(null);
    const [DataLahan, setDataLahan] = useState<LahanData | null>(null);

    const markerIcon = Leaflet.divIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" fill="#E82323"/></svg>`,
        iconSize: [24, 24],
        className: 'shadow-md'
    })
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
                    validateStatus: (status: any) => status < 500 // status typed as any
                };

                const penanamanData = await axios.get(`/api/penanaman/id/${penanaman}`, axiosConfig);
                const id_lahan = penanamanData.data.data[0].id_lahan;
                setIdLahan(id_lahan)
                const lahanData = await axios.get(`/api/lahan/${id_lahan}`, axiosConfig);
                console.log(lahanData.data.data[0])
                setDataLahan(lahanData.data.data[0])
                // setLat(lahanData.data.data[0].latitude)
                // setLong(lahanData.data.data[0].longitude)
            } catch (error) {
                console.log('Error fetching lahan data:', error);
            }
        };

        if (penanaman) {
            fetchData();
        }
    }, [penanaman]);

    useEffect(() => {

    })
    return (
        <div className="">
            <div className="">
                <div className="flex justify-between items-center">
                    <div className="font-bold text-[#57B492] py-2">Lokasi Lahan</div>
                    {
                        DataLahan ? (
                            <Link href={`/main/lahan/detail/${id_lahan}`} className="underline text-[#57B492] py-2">Lihat selengkapnya</Link>
                        ) : (
                            <div className=""></div>
                        )
                    }
                </div>
                <div className="bg-white shadow rounded-md p-4 flex flex-wrap mb-14">
                    <div className=" z-0" style={{ height: "55vh", width: "100%" }}>
                        {
                            DataLahan ? (
                                <CityMap city="" longitude={setLong} latitude={setLat} dataLat={DataLahan.latitude} dataLong={DataLahan.longitude} />
                            ) : (
                                <div className="">Pilih penanaman</div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
