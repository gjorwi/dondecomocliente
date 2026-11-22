"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const CORO_CENTER = { lat: 11.4061, lng: -69.6751 };

function pinIcon(L) {
  return L.divIcon({
    className: "",
    html: '<span class="block h-6 w-6 rounded-full border-4 border-white bg-accent shadow-lg"></span>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export function LocationPicker({ value, onChange }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const leafletRef = useRef(null);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    valueRef.current = value;
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    let active = true;

    import("leaflet").then((module) => {
      if (!active || !containerRef.current) return;
      const L = module.default ?? module;
      leafletRef.current = L;

      const start = valueRef.current || CORO_CENTER;
      const map = L.map(containerRef.current).setView(
        [start.lat, start.lng],
        valueRef.current ? 17 : 14,
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);
      mapRef.current = map;

      const placeMarker = (lat, lng, notify) => {
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          const marker = L.marker([lat, lng], {
            draggable: true,
            icon: pinIcon(L),
          }).addTo(map);
          marker.on("dragend", () => {
            const point = marker.getLatLng();
            onChangeRef.current?.({ lat: point.lat, lng: point.lng });
          });
          markerRef.current = marker;
        }
        if (notify) onChangeRef.current?.({ lat, lng });
      };

      map.on("click", (event) => {
        placeMarker(event.latlng.lat, event.latlng.lng, true);
      });

      if (valueRef.current) {
        placeMarker(start.lat, start.lng, false);
      }
    });

    return () => {
      active = false;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map || !value) return;

    const marker = markerRef.current;
    const current = marker?.getLatLng();
    if (
      current &&
      Math.abs(current.lat - value.lat) < 1e-7 &&
      Math.abs(current.lng - value.lng) < 1e-7
    ) {
      return;
    }

    if (marker) {
      marker.setLatLng([value.lat, value.lng]);
    } else {
      const created = L.marker([value.lat, value.lng], {
        draggable: true,
        icon: pinIcon(L),
      }).addTo(map);
      created.on("dragend", () => {
        const point = created.getLatLng();
        onChangeRef.current?.({ lat: point.lat, lng: point.lng });
      });
      markerRef.current = created;
    }
    map.setView([value.lat, value.lng], Math.max(map.getZoom(), 16));
  }, [value]);

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="Mapa para marcar la ubicación del negocio"
      className="h-[280px] w-full overflow-hidden rounded-[20px] border border-line bg-soft"
    />
  );
}
