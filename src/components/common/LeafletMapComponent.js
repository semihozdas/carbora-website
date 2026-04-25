import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon for Platforms (Neon Green)
const platformIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom Icons for Locations based on type
const getLocIcon = (type) => {
  const colors = {
    university: 'blue',
    park: 'green',
    metro: 'violet',
    mall: 'red',
    other: 'gold'
  };
  const color = colors[type] || colors.other;
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const MapBounds = ({ locations, platforms }) => {
  const map = useMap();
  React.useEffect(() => {
    const allPoints = [
      ...locations.map(l => [l.lat, l.lng]),
      ...platforms.map(p => [p.location?.lat, p.location?.lng])
    ].filter(p => p[0] && p[1]);

    if (allPoints.length > 0) {
      map.fitBounds(allPoints, { padding: [50, 50] });
    }
  }, [locations, platforms, map]);
  return null;
};

const LeafletMapComponent = ({ locations = [], platforms = [] }) => {
  const center = [39.9208, 32.8541]; // Ankara default center

  return (
    <div className="bg-white p-2 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden" style={{ height: '600px' }}>
      <MapContainer 
        center={center} 
        zoom={11} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', borderRadius: '1.25rem' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBounds locations={locations} platforms={platforms} />

        {/* Locations */}
        {locations.map((loc) => (
          <Marker 
            key={`loc-${loc.id}`} 
            position={[loc.lat, loc.lng]}
            icon={getLocIcon(loc.type)}
          >
            <Popup>
              <div className="p-1 min-w-[150px]">
                <h3 className="text-sm font-bold text-slate-900 m-0">{loc.name}</h3>
                <p className="text-[10px] text-slate-500 my-1">{loc.addressText}</p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">{loc.type}</span>
                  <span className={`text-[10px] font-bold ${loc.active ? 'text-green-600' : 'text-red-500'}`}>
                    {loc.active ? 'AKTİF' : 'PASİF'}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Platforms */}
        {platforms.map((p) => (
          <Marker 
            key={`plat-${p.id}`} 
            position={[p.location?.lat, p.location?.lng]}
            icon={platformIcon}
            zIndexOffset={1000}
          >
            <Popup>
              <div className="p-1 min-w-[150px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-900">Platform: {p.code}</span>
                </div>
                <p className="text-[10px] text-slate-500 my-1">Konum: {p.location?.name}</p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-1">
                  <span className="text-[10px] font-bold text-blue-600">{p.totalWeightGram?.toLocaleString()} g Atık</span>
                  <span className={`text-[10px] font-bold ${p.active ? 'text-green-600' : 'text-red-500'}`}>
                    {p.active ? 'AKTİF' : 'PASİF'}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMapComponent;
