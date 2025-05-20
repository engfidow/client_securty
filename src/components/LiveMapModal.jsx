import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const LiveMapModal = ({ reportLocation, onClose }) => {
  const [myLocation, setMyLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.watchPosition(
      (position) => {
        setMyLocation([position.coords.latitude, position.coords.longitude]);
      },
      (err) => console.error('Geolocation error:', err),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );
  }, []);

  const reportLatLng = reportLocation?.split(',').map(Number);

  const userIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [25, 25],
  });

  const reportIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684912.png',
    iconSize: [25, 25],
  });

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-3xl h-[500px] relative">
        <h3 className="text-lg font-bold text-violet-600 dark:text-violet-300 mb-2">Live Tracking Map</h3>

        <MapContainer
          center={reportLatLng}
          zoom={14}
          scrollWheelZoom={true}
          className="w-full h-full rounded-md"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {reportLatLng && (
            <Marker position={reportLatLng} icon={reportIcon}>
              <Popup>Report Location</Popup>
            </Marker>
          )}

          {myLocation && (
            <Marker position={myLocation} icon={userIcon}>
              <Popup>Your Live Location</Popup>
            </Marker>
          )}

          {myLocation && reportLatLng && (
            <Polyline positions={[myLocation, reportLatLng]} color="red" />
          )}
        </MapContainer>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          ✖ Close
        </button>
      </div>
    </div>
  );
};

export default LiveMapModal;
