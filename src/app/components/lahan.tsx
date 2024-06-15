import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import Leaflet from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type Position = [number, number] | null;

export default function Lahan({ penanaman }: any) {
    const [position, setPosition] = useState<Position>(null);
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
                const lahanData = await axios.get(`/api/lahan/${id_lahan}`, axiosConfig);
                setPosition([lahanData.data.data[0].latitude, lahanData.data.data[0].longitude]); // Use actual data
            } catch (error) {
                console.log('Error fetching lahan data:', error);
            }
        };

        if (penanaman) {
            fetchData();
        }
    }, [penanaman]);

    return (
        <div className="">
            <div className="">
                <div className="font-bold text-[#57B492]">Lokasi Lahan</div>
                <div className="bg-white shadow rounded-md p-4 flex flex-wrap">
                    <div className=" z-0" style={{ height: "40vh", width: "100%" }}>
                        {
                            position ? (
                                <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={position} icon={markerIcon}>
                                        <Popup>
                                            A pretty CSS3 popup. <br /> Easily customizable.
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <div className="">Pilih penanaman</div>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="">
                <div className="font-bold text-[#57B492]">Informasi Lahan</div>
                <div className="bg-white shadow rounded-md p-4 flex flex-wrap">
                    Lahan
                </div>
            </div>
        </div>
    );
}
