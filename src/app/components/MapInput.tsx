import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

const markerIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" fill="#E82323"/></svg>`,
    iconSize: [24, 24],
    className: 'shadow-md'
});

interface CityMapProps {
    city: string;
    longitude: (long: number | null) => void;
    latitude: (lat: number | null) => void;
}

// Komponen helper untuk update map view
const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
};

const CityMap: React.FC<CityMapProps> = ({ city, longitude, latitude }) => {
    const [position, setPosition] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (city) {
            const fetchCityCoordinates = async () => {
                try {
                    const response = await axios.get(`https://nominatim.openstreetmap.org/search?city=${city}&format=json&limit=1`);
                    if (response.data.length > 0) {
                        const { lat, lon } = response.data[0];
                        const newPos: [number, number] = [parseFloat(lat), parseFloat(lon)];
                        setPosition(newPos);
                        longitude(parseFloat(lon));
                        latitude(parseFloat(lat));
                    }
                } catch (error) {
                    console.error('Error fetching city coordinates:', error);
                }
            };
            fetchCityCoordinates()
        }

    }, [city]);

    const handleDragEnd = (event: L.DragEndEvent) => {
        const marker = event.target;
        const newPosition = marker.getLatLng();
        setPosition([newPosition.lat, newPosition.lng]);
        longitude(newPosition.lng);
        latitude(newPosition.lat);
    };

    return (
        <div style={{ height: '350px', width: '100%', zIndex: '10', position: 'relative' }}>
            <MapContainer center={position || [0, 0]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {position && <ChangeView center={position} zoom={13} />}
                {position && (
                    <Marker
                        position={position}
                        icon={markerIcon}
                        draggable={true}
                        eventHandlers={{
                            dragend: handleDragEnd,
                        }}
                    >
                        {/* <Popup>{city}</Popup> */}
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default CityMap;
