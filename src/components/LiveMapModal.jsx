import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import socket from '../utils/socket';

const containerStyle = { width: '100%', height: '100%' };

const LiveMapChatModal = ({ report, onClose }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCi3WjC7uOUTETqWvXtCjgdv0X6O6twIOQ'
  });

  const mapRef = useRef();
  const chatEndRef = useRef();

  const startCoords = report.location.split(',').map(Number);
  const [liveCoords, setLiveCoords] = useState(
    report.liveLocation ? report.liveLocation.split(',').map(Number) : startCoords
  );
  const [routePath, setRoutePath] = useState([
    { lat: startCoords[0], lng: startCoords[1] }
  ]);

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    socket.emit('joinRoom', report._id);

    const handleLocation = (data) => {
      if (data.reportId === report._id) {
        const newCoord = { lat: data.latitude, lng: data.longitude };
        setLiveCoords([data.latitude, data.longitude]);
        setRoutePath((prev) => [...prev, newCoord]);
        if (mapRef.current) mapRef.current.panTo(newCoord);
      }
    };

    const handleMessage = (data) => {
      if (data.reportId === report._id) {
        setMessages((prev) => [...prev, data]);
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    socket.on('updateLocation', handleLocation);
    socket.on('newMessage', handleMessage);

    return () => {
      socket.off('updateLocation', handleLocation);
      socket.off('newMessage', handleMessage);
    };
  }, [report]);

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
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-6xl h-[600px] flex relative overflow-hidden">
        {/* Left: Map */}
        <div className="w-2/3 h-full p-4">
          <h3 className="text-lg font-bold mb-2 text-blue-700">Live Route Tracking</h3>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: liveCoords[0], lng: liveCoords[1] }}
            zoom={16}
            onLoad={(map) => (mapRef.current = map)}
          >
            <Marker position={{ lat: startCoords[0], lng: startCoords[1] }} label="Start" />
            <Marker
              position={{ lat: liveCoords[0], lng: liveCoords[1] }}
              label="Live"
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new window.google.maps.Size(40, 40)
              }}
            />
            <Polyline
              path={routePath}
              options={{
                strokeColor: '#1E90FF',
                strokeOpacity: 0.8,
                strokeWeight: 4
              }}
            />
          </GoogleMap>
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
