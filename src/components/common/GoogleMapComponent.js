import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '16px'
};

const center = {
  lat: 39.9334, // Ankara default
  lng: 32.8597
};

const GoogleMapComponent = ({ locations = [], platforms = [], apiKey }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  const [selectedItem, setSelectedItem] = useState(null); // loc or platform
  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    const allPoints = [...locations, ...platforms.map(p => ({ lat: p.location?.lat, lng: p.location?.lng }))].filter(p => p.lat && p.lng);
    
    if (allPoints.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      allPoints.forEach(p => {
        bounds.extend({ lat: p.lat, lng: p.lng });
      });
      map.fitBounds(bounds);
    }
    setMap(map);
  }, [locations, platforms]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!isLoaded) return <div className="h-[600px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest">Harita Yükleniyor...</div>;

  return (
    <div className="bg-white p-2 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: [
            {
              "featureType": "all",
              "elementType": "geometry.fill",
              "stylers": [{ "weight": "2.00" }]
            },
            {
              "featureType": "all",
              "elementType": "geometry.stroke",
              "stylers": [{ "color": "#9c9c9c" }]
            },
            {
              "featureType": "all",
              "elementType": "labels.text",
              "stylers": [{ "visibility": "on" }]
            },
            {
              "featureType": "landscape",
              "elementType": "all",
              "stylers": [{ "color": "#f2f2f2" }]
            },
            {
              "featureType": "landscape",
              "elementType": "geometry.fill",
              "stylers": [{ "color": "#ffffff" }]
            },
            {
              "featureType": "landscape.man_made",
              "elementType": "geometry.fill",
              "stylers": [{ "color": "#ffffff" }]
            },
            {
              "featureType": "poi",
              "elementType": "all",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "featureType": "road",
              "elementType": "all",
              "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
            },
            {
              "featureType": "road",
              "elementType": "geometry.fill",
              "stylers": [{ "color": "#eeeeee" }]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#7b7b7b" }]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.stroke",
              "stylers": [{ "color": "#ffffff" }]
            },
            {
              "featureType": "road.highway",
              "elementType": "all",
              "stylers": [{ "visibility": "simplified" }]
            },
            {
              "featureType": "road.arterial",
              "elementType": "labels.icon",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "featureType": "transit",
              "elementType": "all",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "featureType": "water",
              "elementType": "all",
              "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }]
            },
            {
              "featureType": "water",
              "elementType": "geometry.fill",
              "stylers": [{ "color": "#c8d7d4" }]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#070707" }]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.stroke",
              "stylers": [{ "color": "#ffffff" }]
            }
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true
        }}
      >
        {/* Locations */}
        {locations.map((loc) => (
          <Marker
            key={`loc-${loc.id}`}
            position={{ lat: loc.lat, lng: loc.lng }}
            onClick={() => setSelectedItem({ ...loc, _type: 'location' })}
            icon={{
              url: loc.type === 'university' ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' :
                   loc.type === 'park' ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' :
                   loc.type === 'metro' ? 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png' :
                   loc.type === 'mall' ? 'https://maps.google.com/mapfiles/ms/icons/pink-dot.png' :
                   'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }}
          />
        ))}

        {/* Platforms */}
        {platforms.map((p) => (
          <Marker
            key={`plat-${p.id}`}
            position={{ lat: p.location?.lat, lng: p.location?.lng }}
            onClick={() => setSelectedItem({ ...p, _type: 'platform' })}
            zIndex={1000}
            icon={{
              path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
              fillColor: "#00FF87",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#060B14",
              scale: 2,
              anchor: new window.google.maps.Point(12, 22)
            }}
          />
        ))}

        {selectedItem && (
          <InfoWindow
            position={{ 
              lat: selectedItem._type === 'location' ? selectedItem.lat : selectedItem.location?.lat, 
              lng: selectedItem._type === 'location' ? selectedItem.lng : selectedItem.location?.lng 
            }}
            onCloseClick={() => setSelectedItem(null)}
          >
            <div className="p-2 min-w-[200px]">
              {selectedItem._type === 'location' ? (
                <>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{selectedItem.name}</h3>
                  <p className="text-[10px] text-slate-500 mb-2">{selectedItem.addressText}</p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">{selectedItem.type}</span>
                    <span className={`text-[10px] font-bold ${selectedItem.active ? 'text-green-600' : 'text-red-500'}`}>
                      {selectedItem.active ? 'AKTİF' : 'PASİF'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Platform: {selectedItem.code}</h3>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2">Konum: {selectedItem.location?.name}</p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-1">
                    <span className="text-[10px] font-bold text-blue-600">{selectedItem.totalWeightGram?.toLocaleString()} g Atık</span>
                    <span className={`text-[10px] font-bold ${selectedItem.active ? 'text-green-600' : 'text-red-500'}`}>
                      {selectedItem.active ? 'AKTİF' : 'PASİF'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;
