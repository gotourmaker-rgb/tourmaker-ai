import React, { useEffect, useRef, useState } from 'react';

const MapView = ({ data }) => {
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const initMap = () => {
      const { naver } = window;
      if (!mapElement.current || !naver) return false;
      if (mapRef.current) return true;

      try {
        let center = new naver.maps.LatLng(37.5665, 126.9780); // Default Seoul
        const markers = [];
        const path = [];

        if (data.route && data.route.start && data.route.start.lat && data.route.start.lng) {
          center = new naver.maps.LatLng(data.route.start.lat, data.route.start.lng);
        }

        // 1. Initialize Map
        const mapOptions = {
          center: center,
          zoom: 10,
          zoomControl: true,
          zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT }
        };
        const map = new naver.maps.Map(mapElement.current, mapOptions);
        mapRef.current = map;

        // 2. Handle Route Data
        if (data.route) {
          const { start, waypoints, destination } = data.route;
          const bounds = new naver.maps.LatLngBounds();

          const addMarker = (loc, color, label) => {
            if (!loc || !loc.lat || !loc.lng) return;
            const position = new naver.maps.LatLng(loc.lat, loc.lng);

            new naver.maps.Marker({
              position,
              map,
              title: loc.name,
              icon: {
                content: `<div style="background:${color};color:white;padding:5px 10px;border-radius:15px;font-size:12px;font-weight:bold;box-shadow:0 2px 5px rgba(0,0,0,0.3);white-space:nowrap;">${label}: ${loc.name}</div>`,
                anchor: new naver.maps.Point(15, 30)
              }
            });
            path.push(position);
            bounds.extend(position);
          };

          addMarker(start, '#2ecc71', '출발'); // Green
          if (waypoints) waypoints.forEach((wp, idx) => addMarker(wp, '#3498db', `경유${idx + 1}`)); // Blue
          addMarker(destination, '#e74c3c', '도착'); // Red

          // Draw Polyline
          if (path.length > 1) {
            new naver.maps.Polyline({
              map: map,
              path: path,
              strokeColor: '#535c68',
              strokeWeight: 4,
              strokeOpacity: 0.8
            });
          }

          // Fit Bounds
          if (path.length > 0) {
            map.fitBounds(bounds, { margin: 50 });
          }

        } else if (data.region) {
          // Fallback legacy support
        }

        console.log("Map Initialized Successfully");
        return true;
      } catch (e) {
        console.error("Map Init Error:", e);
        setIsError(true);
        return true;
      }
    };

    // Retry loop
    if (!initMap()) {
      const intervalId = setInterval(() => {
        if (initMap()) clearInterval(intervalId);
      }, 500);
      return () => clearInterval(intervalId);
    }
  }, [data]);

  return (
    <div className="map-card glass-panel">
      <div className="map-header">
        {data.route ?
          `${data.route.start?.name || 'Start'} ➝ ${data.route.destination?.name || 'End'}` :
          `Recommended Region: ${data.region || 'Korea'}`
        }
      </div>
      <div ref={mapElement} className="map-container" id="naver-map"></div>

      {isError && (
        <div className="error-overlay">
          Map Error: check API key.
        </div>
      )}

      <style>{`
        .map-card {
           width: 100%;
           height: 500px;
           background: #fff;
           position: relative;
           overflow: hidden;
           margin-top: var(--sp-sm);
        }
        .map-header {
           position: absolute;
           top: 10px; left: 10px;
           background: rgba(255,255,255,0.9);
           padding: 6px 10px;
           border-radius: 6px;
           font-size: 0.8rem;
           font-weight: 600;
           z-index: 1000;
           box-shadow: 0 2px 4px rgba(0,0,0,0.1);
           max-width: 90%;
           overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .map-container { width: 100%; height: 100%; }
        .error-overlay {
           position: absolute; bottom: 0; left: 0; right: 0;
           color: red; font-size: 0.8rem; padding: 5px;
           background: rgba(255,0,0,0.1); text-align: center;
        }
      `}</style>
    </div>
  );
};

export default MapView;
