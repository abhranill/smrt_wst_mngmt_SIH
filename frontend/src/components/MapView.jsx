import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const getStatusColor = (status) => {
  switch (status) {
    case 'Reported':
      return '#f59e0b'; // amber
    case 'Assigned':
      return '#3b82f6'; // blue
    case 'In Progress':
      return '#6366f1'; // indigo
    case 'Resolved':
      return '#10b981'; // emerald
    default:
      return '#64748b';
  }
};

const createMarkerIcon = (status) => {
  const color = getStatusColor(status);
  return L.divIcon({
    className: 'gis-pin',
    html: `
      <div style="
        background: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2.5px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: #ffffff;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });
};

export const MapView = ({ complaints = [], onSelectComplaint, selectedComplaintId }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [28.6328, 77.2197],
        zoom: 12,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when complaints change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const validMarkers = [];

    complaints.forEach((c) => {
      if (c.latitude && c.longitude) {
        const marker = L.marker([c.latitude, c.longitude], {
          icon: createMarkerIcon(c.status)
        });

        // Popup Content
        const popupContent = document.createElement('div');
        popupContent.className = 'p-1 text-xs space-y-1.5 font-sans min-w-[200px]';
        popupContent.innerHTML = `
          <div class="flex items-center justify-between border-b pb-1">
            <strong class="text-slate-800 font-mono text-[11px]">${c.id}</strong>
            <span class="px-1.5 py-0.2 rounded text-[10px] font-bold" style="background:${getStatusColor(c.status)}22; color:${getStatusColor(c.status)};">
              ${c.status}
            </span>
          </div>
          ${c.image_url ? `<img src="${c.image_url}" alt="waste" class="w-full h-24 object-cover rounded border border-slate-200" />` : ''}
          <div>
            <div class="font-semibold text-slate-800">${c.category} Waste</div>
            <div class="text-[11px] text-slate-500 line-clamp-2">${c.address}</div>
          </div>
          <button id="btn-${c.id}" class="w-full mt-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-xs transition cursor-pointer text-center">
            Inspect Complaint
          </button>
        `;

        // Bind popup and button click
        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-${c.id}`);
          if (btn && onSelectComplaint) {
            btn.onclick = () => {
              onSelectComplaint(c);
              marker.closePopup();
            };
          }
        });

        marker.addTo(markersGroup);
        validMarkers.push([c.latitude, c.longitude]);
      }
    });

    // Auto-fit bounds if markers exist
    if (validMarkers.length > 0) {
      try {
        const bounds = L.latLngBounds(validMarkers);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      } catch (err) {
        console.warn('Map fitBounds error:', err);
      }
    }
  }, [complaints]);

  // Pan to selected complaint if prop changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedComplaintId) return;
    const selected = complaints.find((c) => c.id === selectedComplaintId);
    if (selected && selected.latitude && selected.longitude) {
      mapInstanceRef.current.setView([selected.latitude, selected.longitude], 15, { animate: true });
    }
  }, [selectedComplaintId, complaints]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />

      {/* Map Legend Floating Box */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md border border-slate-200 text-xs flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
          <span className="text-slate-700 font-medium">Reported</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
          <span className="text-slate-700 font-medium">Assigned</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
          <span className="text-slate-700 font-medium">In Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span className="text-slate-700 font-medium">Resolved</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
