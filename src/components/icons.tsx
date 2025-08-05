import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      {...props}
    >
      <defs>
        <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style={{stopColor: "rgb(255,255,255)", stopOpacity: 0.2}} />
          <stop offset="100%" style={{stopColor: "rgb(0,0,0)", stopOpacity: 0.2}} />
        </radialGradient>
      </defs>
      <path d="M128 0 l27.3 87.3 h91.3 l-73.8 53.9 l27.3 87.3 l-73.8 -53.9 l-73.8 53.9 l27.3 -87.3 l-73.8 -53.9 h91.3 Z" fill="#d4d4d4"/>
      <circle cx="128" cy="128" r="110" fill="#e0e0e0" />
      <circle cx="128" cy="128" r="108" fill="#d4d4d4" />
      <circle cx="128" cy="128" r="98" fill="#facc15" />
      <path d="M128 32 a96 96 0 0 1 0 192 a96 96 0 0 1 0 -192" fill="#022c5b" />
      <path d="M128 128 l-60 -20 l10 30 l-20 0 l35 40 l-20 0 l55 30 l-55 -30 l20 0 l-35 -40 l20 0 Z" fill="#4b8fde" />
      <path d="M200 150 l-20 -40 l10 -10 l20 0 Z" fill="#ffffff" />
      <path d="M205 152 l-20 -40 l10 -10 l20 0" stroke="#000000" strokeWidth="1" fill="none" />
      <path d="M210 145 l-10 15" stroke="#000000" strokeWidth="1" />
      <path d="M200 150 l-10 10" stroke="#000000" strokeWidth="1" />

      <g transform="translate(100, 100) scale(0.3)">
        <path d="M 128,40 A 88,88 0 1 0 128,216 A 88,88 0 1 0 128,40" fill="#005a9e" />
        <path d="M 128,50 A 78,78 0 1 0 128,206 A 78,78 0 1 0 128,50" fill="#63b3ed" />
        <path d="M 128,128 m -60,0 l 120,0 l -20,-15 l -80,0 z" fill="#ffffff" />
        <path d="M 128,128 m -60,0 l 120,0 l -20,-15 l -80,0 z" stroke="#000000" strokeWidth="2" />
        <path d="M 128,128 m -60,10 l 120,0 l -20,15 l -80,0 z" fill="#ffffff" />
        <path d="M 128,128 m -60,10 l 120,0 l -20,15 l -80,0 z" stroke="#000000" strokeWidth="2" />
        <rect x="112" y="90" width="32" height="40" rx="3" fill="#f7fafc" stroke="#000000" strokeWidth="2" />
        <path d="M 118,100 l 20,0 M 118,108 l 20,0 M 118,116 l 20,0" stroke="#718096" strokeWidth="2" />
        <rect x="120" y="80" width="16" height="10" rx="2" fill="#d69e2e" stroke="#000000" strokeWidth="1.5" />
        <path d="M 128,85 l 0,-10 l -15,0 l 15,10 l 15,-10 l -15,0" fill="#f7fafc" stroke="#000000" strokeWidth="2" />
      </g>
      
      <circle cx="128" cy="128" r="110" fill="url(#grad1)" />

      <text x="128" y="55" fontFamily="Arial, sans-serif" fontSize="16" fill="white" textAnchor="middle" fontWeight="bold">
        REPÚBLICA DOMINICANA
      </text>
      <text x="128" y="210" fontFamily="Arial, sans-serif" fontSize="11" fill="white" textAnchor="middle" fontWeight="bold">
        "MAY. GRAL. PIL. LUIS D. CASTRO C., FAD"
      </text>
      
      <path id="circlePath" d="M 60,150 A 80,80 0 1 1 196,150" fill="none" />
      <text fontFamily="Arial, sans-serif" fontSize="14" fill="white" fontWeight="bold">
        <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
          ESCUELA DE SEGURIDAD DE LA AVIACIÓN CIVIL
        </textPath>
      </text>
      <text x="128" y="80" fontFamily="Arial, sans-serif" fontSize="14" fill="#022c5b" textAnchor="middle" fontWeight="bold">
        CESAC
      </text>
    </svg>
  ),
};
