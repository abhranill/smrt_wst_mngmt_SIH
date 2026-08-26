import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Crosshair, Map } from 'lucide-react';

// Custom Map Marker SVG Icon
const createMarkerIcon = (color = '#059669') => {
  return L.divIcon({
    className: 'custom-pin',
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: #ffffff;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export const MapPicker = ({ latitude, longitude, onLocationChange }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [locating, setLocating] = useState(false);

  const defaultLat = latitude || 28.6328;
  const defaultLng = longitude || 77.2197;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 14,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Create initial draggable marker
      const marker = L.marker([defaultLat, defaultLng], {
        draggable: true,
        icon: createMarkerIcon('#059669')
      }).addTo(map);

      marker.bindPopup('<b>Garbage Location</b><br>Drag pin or click map to move').openPopup();

      marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        onLocationChange(parseFloat(lat.toFixed(5)), parseFloat(lng.toFixed(5)));
      });

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        onLocationChange(parseFloat(lat.toFixed(5)), parseFloat(lng.toFixed(5)));
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker position if coordinates change externally
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && latitude && longitude) {
      const currentPos = markerRef.current.getLatLng();
      if (currentPos.lat !== latitude || currentPos.lng !== longitude) {
        markerRef.current.setLatLng([latitude, longitude]);
        mapInstanceRef.current.panTo([latitude, longitude]);
      }
    }
  }, [latitude, longitude]);

  // GPS geolocation handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        const { latitude: lat, longitude: lng } = position.coords;
        const roundedLat = parseFloat(lat.toFixed(5));
        const roundedLng = parseFloat(lng.toFixed(5));
        onLocationChange(roundedLat, roundedLng);
        if (mapInstanceRef.current && markerRef.current) {
          markerRef.current.setLatLng([roundedLat, roundedLng]);
          mapInstanceRef.current.setView([roundedLat, roundedLng], 16);
        }
      },
      (err) => {
        setLocating(false);
        console.warn('Geolocation error:', err);
        alert('Could not retrieve GPS location. Please drop pin on map or select a quick preset.');
      },
      { timeout: 8000 }
    );
  };

  // Quick Preset Handlers
  const applyPreset = (lat, lng, name) => {
    onLocationChange(lat, lng);
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapInstanceRef.current.setView([lat, lng], 15);
    }
  };

  return (
    <div className="space-y-3">
      {/* Controls toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 text-slate-600 font-medium">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>Click anywhere on the map or drag the pin to set spot</span>
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={locating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-medium border border-emerald-200 transition-colors shadow-xs cursor-pointer"
        >
          <Crosshair className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
          <span>{locating ? 'Detecting...' : 'Use My GPS Location'}</span>
        </button>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Coordinates readout & quick presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-mono">
          <span className="font-semibold text-slate-500 font-sans">Coordinates:</span>
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
            {latitude?.toFixed(5) || '28.63280'}, {longitude?.toFixed(5) || '77.21970'}
          </span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
          <span className="text-slate-400 mr-1">Demo Spots:</span>
          <button
            type="button"
            onClick={() => applyPreset(28.6328, 77.2197, 'Connaught Place')}
            className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 transition-colors"
          >
            CP (Delhi)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(28.6517, 77.1906, 'Karol Bagh')}
            className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 transition-colors"
          >
            Karol Bagh
          </button>
          <button
            type="button"
            onClick={() => applyPreset(19.0596, 72.8295, 'Bandra')}
            className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 transition-colors"
          >
            Mumbai
          </button>
          <button
            type="button"
            onClick={() => applyPreset(12.9784, 77.6408, 'Indiranagar')}
            className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 transition-colors"
          >
            Bengaluru
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPicker;
