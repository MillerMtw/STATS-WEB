
import React, { useState, useMemo } from 'react';
import { CountryStat } from '../types';

interface WorldMapSectionProps {
  onlineCount: number;
  countries: CountryStat[];
}

// Coordinate mapping for 1000x500 Equirectangular projection
const countryCoordinates: Record<string, [number, number]> = {
  // format: [latitude, longitude]
  'united states': [37.0902, -95.7129],
  'canada': [56.1304, -106.3468],
  'mexico': [23.6345, -102.5528],
  'brazil': [-14.2350, -51.9253],
  'argentina': [-38.4161, -63.6167],
  'colombia': [4.5709, -74.2973],
  'peru': [-9.1900, -75.0152],
  'chile': [-35.6751, -71.5430],
  'united kingdom': [55.3781, -3.4360],
  'germany': [51.1657, 10.4515],
  'france': [46.2276, 2.2137],
  'italy': [41.8719, 12.5674],
  'spain': [40.4637, -3.7492],
  'netherlands': [52.1326, 5.2913],
  'russia': [61.5240, 105.3188],
  'china': [35.8617, 104.1954],
  'india': [20.5937, 78.9629],
  'japan': [36.2048, 138.2529],
  'australia': [-25.2744, 133.7751],
  'south korea': [35.9078, 127.7669],
  'singapore': [1.3521, 103.8198],
  'indonesia': [-0.7893, 113.9213],
  'saudi arabia': [23.8859, 45.0792],
  'south africa': [-30.5595, 22.9375],
  'egypt': [26.8206, 30.8025],
  'nigeria': [9.0820, 8.6753],
  'turkey': [38.9637, 35.2433],
};

const WorldMapSection: React.FC<WorldMapSectionProps> = ({ onlineCount, countries }) => {
  const [hoveredCountry, setHoveredCountry] = useState<CountryStat | null>(null);

  // Projection logic for 1000x500 SVG
  const getCoordinates = (countryName: string) => {
    const coords = countryCoordinates[countryName.toLowerCase()];
    if (!coords) return null;
    const [lat, lon] = coords;
    // Simple Equirectangular projection adjustments
    const x = (lon + 180) * (1000 / 360);
    const y = (90 - lat) * (500 / 180);
    return { x, y };
  };

  return (
    <div className="relative border border-zinc-800 rounded-xl p-0 h-[500px] overflow-hidden group bg-[#020202]">
      
      {/* 1. Background Pattern (Diagonal Scanlines) */}
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{
            backgroundImage: `repeating-linear-gradient(
                45deg,
                #111 0px,
                #111 1px,
                transparent 1px,
                transparent 6px
            )`
        }}
      ></div>

      {/* Header Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none border-2 border-transparent border-t-zinc-900/50 border-b-zinc-900/50">
          <div className="absolute top-4 left-6 flex items-center gap-3">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping absolute opacity-75"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full relative"></div>
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-300">Live Geographic Map</span>
                <span className="block text-[8px] font-mono text-zinc-500">{onlineCount} ACTIVE NODES</span>
              </div>
          </div>
      </div>

      {/* Main Map SVG */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-[1000px] aspect-[2/1]">
            
            <svg viewBox="0 0 1000 500" className="w-full h-full">
              <defs>
                {/* 2. The Dot Pattern Mask */}
                <pattern id="dotPattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="white" />
                </pattern>
                
                {/* 3. The Map Shape (Mask Source) */}
                <mask id="worldMask">
                    <rect width="100%" height="100%" fill="black" />
                    <g fill="white">
                        {/* Simplified High-Res Paths for Continents */}
                        {/* North America */}
                        <path d="M150 80 L 250 60 L 400 50 L 300 150 L 250 200 L 150 180 L 100 100 Z" />
                        <path d="M90,70 L 300,40 L 350,160 L 250,220 L 160,180 Z" stroke="white" strokeWidth="20" strokeLinejoin="round" />
                        {/* South America */}
                        <path d="M280,240 L 380,230 L 420,300 L 340,450 L 280,350 Z" stroke="white" strokeWidth="15" strokeLinejoin="round"/>
                        {/* Europe */}
                        <path d="M430,120 L 550,50 L 600,60 L 580,140 L 480,150 Z" stroke="white" strokeWidth="10" strokeLinejoin="round"/>
                        {/* Africa */}
                        <path d="M450,180 L 600,180 L 650,280 L 550,400 L 450,300 Z" stroke="white" strokeWidth="15" strokeLinejoin="round"/>
                        {/* Asia */}
                        <path d="M600,60 L 900,60 L 950,200 L 800,280 L 700,250 L 620,150 Z" stroke="white" strokeWidth="20" strokeLinejoin="round"/>
                        {/* Australia */}
                        <path d="M750,350 L 900,340 L 920,440 L 750,420 Z" stroke="white" strokeWidth="15" strokeLinejoin="round"/>
                        
                        {/* Detailed fill adjustment with standard SVG paths */}
                         <path d="M 170 60 L 280 40 L 450 30 L 420 120 L 300 150 L 250 250 L 200 200 Z" />
                         <path d="M 280 250 L 400 230 L 450 300 L 350 480 L 280 320 Z" />
                         <path d="M 450 150 L 550 50 L 650 60 L 600 150 L 500 160 Z" />
                         <path d="M 440 200 L 600 180 L 680 250 L 580 420 L 480 350 Z" />
                         <path d="M 620 60 L 900 60 L 980 180 L 850 300 L 750 250 L 650 150 Z" />
                         <path d="M 780 340 L 920 330 L 940 450 L 780 430 Z" />
                    </g>
                </mask>
              </defs>

              {/* 4. Render the Dotted Map */}
              {/* This rectangle is filled with grey, but only visible where the 'worldMask' allows (dots) */}
              <rect width="100%" height="100%" fill="#3f3f46" mask="url(#worldMask)" opacity="0.4" />
              
              {/* Optional: Add a very subtle outline to define boundaries better */}
              <g stroke="#52525b" strokeWidth="0.5" fill="none" opacity="0.3">
                 <path d="M 170 60 L 280 40 L 450 30 L 420 120 L 300 150 L 250 250 L 200 200 Z" />
                 <path d="M 280 250 L 400 230 L 450 300 L 350 480 L 280 320 Z" />
                 <path d="M 450 150 L 550 50 L 650 60 L 600 150 L 500 160 Z" />
                 <path d="M 440 200 L 600 180 L 680 250 L 580 420 L 480 350 Z" />
                 <path d="M 620 60 L 900 60 L 980 180 L 850 300 L 750 250 L 650 150 Z" />
                 <path d="M 780 340 L 920 330 L 940 450 L 780 430 Z" />
              </g>

              {/* 5. Render Pattern Fill using the mask to create the 'Dot Matrix' look */}
              <rect width="100%" height="100%" fill="url(#dotPattern)" mask="url(#worldMask)" opacity="0.3" />

              {/* 6. Active Nodes */}
              {countries.map((country, i) => {
                const pos = getCoordinates(country.name);
                if (!pos) return null;
                
                const isHovered = hoveredCountry?.name === country.name;
                const size = Math.min(Math.max(country.count * 1.5, 3), 8);

                return (
                  <g key={i} 
                     transform={`translate(${pos.x}, ${pos.y})`}
                     onMouseEnter={() => setHoveredCountry(country)}
                     onMouseLeave={() => setHoveredCountry(null)}
                     className="cursor-pointer"
                     style={{ zIndex: 50 }}
                  >
                     {/* Radar Ping */}
                     <circle r={size * 4} fill="none" stroke="#10b981" strokeWidth="0.5" opacity="0">
                        <animate attributeName="r" from={size} to={size * 4} dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.6" to="0" dur="3s" repeatCount="indefinite" />
                     </circle>

                     {/* Core Glow */}
                     <circle r={size + 2} fill="#10b981" opacity="0.3" filter="blur(2px)" />
                     
                     {/* Solid Core */}
                     <circle r={size} fill={isHovered ? "#fff" : "#10b981"} className="transition-colors duration-300" />
                     
                     {/* Tech Label Line */}
                     {isHovered && (
                        <>
                           <line x1="0" y1="0" x2="15" y2="-15" stroke="#10b981" strokeWidth="1" />
                           <line x1="15" y1="-15" x2="35" y2="-15" stroke="#10b981" strokeWidth="1" />
                        </>
                     )}
                  </g>
                );
              })}
            </svg>

            {/* Floating Tooltip */}
            {hoveredCountry && (
              <div 
                className="absolute z-50 pointer-events-none"
                style={{ 
                   left: getCoordinates(hoveredCountry.name)?.x, 
                   top: getCoordinates(hoveredCountry.name)?.y,
                   transform: 'translate(40px, -45px)'
                }}
              >
                 <div className="bg-black/90 border border-zinc-800 p-2 rounded shadow-2xl backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">{hoveredCountry.name}</p>
                    <p className="text-lg font-mono font-bold text-white leading-none">{hoveredCountry.count} <span className="text-[9px] text-zinc-600">USERS</span></p>
                 </div>
              </div>
            )}
        </div>
      </div>
      
      {/* Vignette Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,#000_100%)]"></div>
    </div>
  );
};

export default WorldMapSection;
