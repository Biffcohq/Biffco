"use client"

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'

export interface MapWrapperProps {
  geoJsonData?: any[]
  onFeatureClick?: (feature: any) => void
  center?: [number, number]
  zoom?: number
}

export default function MapWrapper({ geoJsonData = [], onFeatureClick, center = [-34.6037, -58.3816], zoom = 4 }: MapWrapperProps) {
  
  // Custom styling based on generic attributes
  const styleFeature = (feature: any) => {
    // Example: Use GFW status if available to color the polygon
    const status = feature?.properties?.gfwStatus
    if (status === 'compliant') return { color: '#059669', weight: 2, fillOpacity: 0.2 } // Success
    if (status === 'pending') return { color: '#d97706', weight: 2, fillOpacity: 0.2 } // Warning
    if (status === 'non-compliant') return { color: '#dc2626', weight: 2, fillOpacity: 0.3 } // Error
    
    // Default blue for generic facilities
    return { color: '#3b82f6', weight: 2, fillOpacity: 0.2 }
  }

  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties && feature.properties.name) {
      layer.bindTooltip(feature.properties.name, { permanent: false, direction: 'top' })
    }
    
    layer.on({
      click: () => {
        if (onFeatureClick) onFeatureClick(feature)
      },
      mouseover: (e: any) => {
        const lyr = e.target
        lyr.setStyle({ weight: 4, fillOpacity: 0.4 })
      },
      mouseout: (e: any) => {
        const lyr = e.target
        lyr.setStyle(styleFeature(feature))
      }
    })
  }

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {geoJsonData.map((data, idx) => {
           // Si 'data' es un objeto directo de polígono en lugar de FeatureCollection, wrapearlo
           const geoJsonObj = data.type === 'Feature' ? data : {
             type: 'Feature',
             properties: data.properties || {},
             geometry: data.geometry || data
           }
           
           return (
             <GeoJSON
               key={`geojson-${idx}-${data.id || Math.random()}`}
               data={geoJsonObj as any}
               style={styleFeature}
               onEachFeature={onEachFeature}
             />
           )
        })}
      </MapContainer>
    </div>
  )
}
