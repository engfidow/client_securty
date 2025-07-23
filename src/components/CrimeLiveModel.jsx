import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import io from 'socket.io-client';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibmFpbWE3NzciLCJhIjoiY21kZzBxdTVzMGdhNzJrcjFuaW8yM2QzdSJ9.oxnbUzrKit3T1bIJ2YSFwglooo'; // Replace with your Mapbox token

const CrimeLiveModel = ({ report, onClose }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const startMarkerRef = useRef(null);
  const liveMarkerRef = useRef(null);
  const socketRef = useRef(null);

  const initialCoords = report.location.split(',').map(Number);
  const [liveCoords, setLiveCoords] = useState(
    report.liveLocation ? report.liveLocation.split(',').map(Number) : initialCoords
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [initialCoords[1], initialCoords[0]],
      zoom: 16,
    });

    // Initial Start Marker
    startMarkerRef.current = new mapboxgl.Marker({ color: 'green' })
      .setLngLat([initialCoords[1], initialCoords[0]])
      .setPopup(new mapboxgl.Popup().setText('Start'))
      .addTo(mapRef.current);

    // Live Marker
    liveMarkerRef.current = new mapboxgl.Marker({ color: 'blue' })
      .setLngLat([liveCoords[1], liveCoords[0]])
      .setPopup(new mapboxgl.Popup().setText('Live'))
      .addTo(mapRef.current);

    return () => {
      mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (report.type === 'personal') {
      socketRef.current = io('https://security991.onrender.com');

      socketRef.current.on('updateLocation', (data) => {
        if (data.reportId === report._id) {
          const newCoords = [data.latitude, data.longitude];
          setLiveCoords(newCoords);

          // Update marker position
          if (liveMarkerRef.current) {
            liveMarkerRef.current.setLngLat([newCoords[1], newCoords[0]]);
          }

          // Smooth pan
          if (mapRef.current) {
            mapRef.current.easeTo({
              center: [newCoords[1], newCoords[0]],
              duration: 1000,
            });
          }
        }
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [report]);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-3xl h-[500px] relative">
        <h3 className="text-lg font-bold text-violet-600 dark:text-violet-300 mb-2">Live Tracking Map</h3>

        <div
          ref={mapContainerRef}
          className="w-full h-full rounded-lg"
          style={{ height: '400px' }}
        ></div>

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

export default CrimeLiveModel;
