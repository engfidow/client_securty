import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import io from 'socket.io-client';
import 'mapbox-gl/dist/mapbox-gl.css';
import socket from '../socket'; // ✅ Use shared socket instance



const MAPBOX_TOKEN = 'pk.eyJ1IjoibmFpbWE3NzciLCJhIjoiY21kZzBxdTVzMGdhNzJrcjFuaW8yM2QzdSJ9.oxnbUzrKit3T1bIJ2YSFwg';
mapboxgl.accessToken = MAPBOX_TOKEN;



const getStorageKey = (reportId) => `report_chat_${reportId}`;

const LiveMapChatModal = ({ report, onClose }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const chatEndRef = useRef(null);

  const startCoords = report.location.split(',').map(Number);
  const [liveCoords, setLiveCoords] = useState(
    report.liveLocation ? report.liveLocation.split(',').map(Number) : startCoords
  );
  const [routePath, setRoutePath] = useState([
    [startCoords[1], startCoords[0]]
  ]);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    // Load stored chat messages
    const stored = localStorage.getItem(getStorageKey(report._id));
    if (stored) setMessages(JSON.parse(stored));

    // Initialize Mapbox map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [liveCoords[1], liveCoords[0]],
      zoom: 15
    });

    const map = mapRef.current;

    // Start marker
    new mapboxgl.Marker({ color: 'green' })
      .setLngLat([startCoords[1], startCoords[0]])
      .setPopup(new mapboxgl.Popup().setText('Start'))
      .addTo(map);

    // Live marker
    const liveMarker = new mapboxgl.Marker({ color: 'blue' })
      .setLngLat([liveCoords[1], liveCoords[0]])
      .addTo(map);

    // Draw line
    const drawRoute = (coords) => {
      if (map.getSource('route')) {
        map.getSource('route').setData({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coords
          }
        });
      } else {
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        });

        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          paint: {
            'line-color': '#1E90FF',
            'line-width': 4
          }
        });
      }
    };

    map.on('load', () => {
      drawRoute(routePath);
    });

    // Socket
    socket.emit('joinRoom', report._id);

    const handleLocation = (data) => {
      if (data.reportId === report._id) {
        const newCoord = [data.longitude, data.latitude];
        setLiveCoords([data.latitude, data.longitude]);
        setRoutePath((prev) => {
          const updated = [...prev, newCoord];
          drawRoute(updated);
          return updated;
        });
        liveMarker.setLngLat(newCoord);
        map.flyTo({ center: newCoord, zoom: 15 });
      }
    };

    const handleMessage = (data) => {
      if (data.reportId === report._id) {
        setMessages((prev) => {
          const updated = [...prev, data];
          localStorage.setItem(getStorageKey(report._id), JSON.stringify(updated));
          return updated;
        });
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    socket.on('updateLocation', handleLocation);
    socket.on('newMessage', handleMessage);

    return () => {
      socket.off('updateLocation', handleLocation);
      socket.off('newMessage', handleMessage);
      map.remove();
    };
  }, []);

  const handleSend = () => {
  if (!newMsg.trim()) return;
  const message = {
    reportId: report._id,
    sender: 'Officer',
    text: newMsg.trim(),
    timestamp: new Date().toISOString()
  };
  socket.emit('sendMessage', message);
  setNewMsg('');
};


  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-6xl h-[600px] flex relative overflow-hidden">
        {/* Left: Map */}
        <div className="w-2/3 h-full p-4">
          <h3 className="text-lg font-bold mb-2 text-blue-700">Live Route Tracking</h3>
          <div ref={mapContainerRef} className="w-full h-full rounded shadow" />
        </div>

        {/* Right: Chat */}
        <div className="w-1/3 h-full flex flex-col border-l border-gray-300 dark:border-gray-700">
          <div className="sticky top-0 bg-blue-600 text-white text-lg font-semibold px-4 py-2 z-10 flex justify-between items-center">
            <span>Live Chat</span>
            <button
              onClick={onClose}
              className="text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700"
            >
              ✖
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-gray-800">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg max-w-[70%] ${
                  msg.sender === 'Officer'
                    ? 'bg-blue-500 text-white self-end ml-auto'
                    : 'bg-gray-300 text-black self-start mr-auto'
                }`}
              >
                <div className="text-sm">{msg.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-3 flex items-center border-t border-gray-300 dark:border-gray-700">
            <input
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 p-2 rounded border dark:bg-gray-700 dark:text-white"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMapChatModal;
