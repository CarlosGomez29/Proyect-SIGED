import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      {...props}
    >
      <defs>
        <path
          id="circlePath"
          d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
        />
        <path
          id="bottomCirclePath"
          d="M 100, 100 m -72, 0 a 72,72 0 1,0 144,0 a 72,72 0 1,0 -144,0"
        />
      </defs>
      
      {/* Outer circle */}
      <circle cx="100" cy="100" r="98" fill="white" stroke="#333" strokeWidth="2" />
      
      {/* Top Text */}
      <text fill="#333" fontSize="11" fontWeight="bold" letterSpacing="0.5">
        <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
          DIRECCIÓN GENERAL DE LAS ESCUELAS VOCACIONALES DE LAS FF.AA. Y LA P.N.
        </textPath>
      </text>

      {/* Bottom Text */}
      <text fill="#333" fontSize="9" fontWeight="bold" letterSpacing="0.2">
         <textPath href="#bottomCirclePath" startOffset="75%" textAnchor="middle" >
           AQUÍ SE ENSEÑA HACIENDO Y SE APRENDE TRABAJANDO
        </textPath>
      </text>

      {/* Central Shield */}
      <g transform="translate(100, 105) scale(0.7)">
        {/* Shield shape */}
        <path d="M 0, -50 C 10, -50 30, -40 50, -20 L 50, 20 C 50, 40 25, 55 0, 65 C -25, 55 -50, 40 -50, 20 L -50, -20 C -30, -40 -10, -50 0, -50 Z" fill="white" stroke="#333" strokeWidth="3"/>
        {/* Blue quarters */}
        <path d="M -50,-20 L 0,-20 L 0,65 C -25, 55 -50, 40 -50, 20 Z" fill="#007bff"/>
        <path d="M 0,-50 C 10, -50 30, -40 50, -20 L 50,20 L 0,20 Z" fill="#007bff"/>
        {/* Red quarters */}
        <path d="M 0,-20 L 50,-20 L 50,20 L 0,20 Z M -50,-20 L 0,-20 L 0,-50 C -30, -40 -10, -50 -50,-20 Z" fill="#dc3545"/>
        <path d="M -50,-20 L 0,-20 L 0,65 C -25, 55 -50, 40 -50, 20 Z" fill="#dc3545" transform="scale(-1, 1)"/>
        <path d="M 0,-50 C 10, -50 30, -40 50, -20 L 50,20 L 0,20 Z" fill="#dc3545" transform="scale(1, -1)"/>


        {/* Laurel branch (left) */}
        <g transform="translate(-65, 10) scale(0.8)">
            <path d="M0,0 C 20,-20 30,-50 20,-70" fill="none" stroke="#28a745" strokeWidth="4"/>
            <circle cx="5" cy="-10" r="5" fill="#28a745" />
            <circle cx="12" cy="-25" r="6" fill="#28a745" />
            <circle cx="18" cy="-40" r="5" fill="#28a745" />
            <circle cx="15" cy="-55" r="4" fill="#28a745" />
        </g>
        
        {/* Palm branch (right) */}
        <g transform="translate(65, 10) scale(-0.8, 0.8)">
            <path d="M0,0 C 20,-20 30,-50 20,-70" fill="none" stroke="#28a745" strokeWidth="4"/>
            <path d="M5,-10 L 25, -30" fill="none" stroke="#28a745" strokeWidth="2.5"/>
            <path d="M12,-25 L 32, -45" fill="none" stroke="#28a745" strokeWidth="2.5"/>
            <path d="M18,-40 L 38, -60" fill="none" stroke="#28a745" strokeWidth="2.5"/>
             <path d="M15,-55 L 30, -70" fill="none" stroke="#28a745" strokeWidth="2.5"/>
        </g>
        
        {/* Ribbon */}
        <g transform="translate(0, 68)">
            <path d="M -30,0 Q -15,5 0,0 Q 15,5 30,0 L 35,10 L 0,5 L -35,10 Z" fill="#dc3545" stroke="darkred" strokeWidth="0.5"/>
            <path d="M-30,0 L-40,-5 M30,0 L40,-5" fill="none" stroke="#dc3545" strokeWidth="4"/>
        </g>

        {/* Gear */}
        <g fill="#343a40" stroke="white" strokeWidth="1">
            <path d="M0,-22 a22,22 0 1,1 0,0.1 Z" />
            <circle cx="0" cy="0" r="10" fill="white" stroke="#343a40" strokeWidth="2"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
                <path key={a} transform={`rotate(${a})`} d="M-5,-25 h10 l3,-3 h-16 l3,3 z" />
            ))}
        </g>

         {/* Text inside shield */}
        <text y="-28" fontSize="6" fill="white" textAnchor="middle" fontWeight="bold">ESCUELAS VOCACIONALES</text>
        <text y="30" fontSize="5" fill="white" textAnchor="middle" fontWeight="bold">
            <tspan x="0" dy="0">DE LAS FUERZAS ARMADAS</tspan>
            <tspan x="0" dy="6">Y LA POLICÍA NACIONAL</tspan>
        </text>

      </g>
      
      {/* Book and Rays */}
      <g transform="translate(100, 50)">
        {/* Rays */}
        <g fill="#FFD700">
            <path d="M -20,-5 l -10,-15 h20 l10,15 z" transform="rotate(-30)" />
            <path d="M -10,-5 l -5,-15 h10 l5,15 z" />
            <path d="M 10,-5 l -10,-15 h20 l10,15 z" transform="rotate(30)" />
        </g>
        {/* Book */}
        <path d="M -25,0 Q -10,-5 0,0 Q 10,-5 25,0 L 25,15 L -25,15 Z" fill="white" stroke="#333" strokeWidth="1"/>
        <path d="M 0,0 V 15 M -20,5 h40 M -20,9 h40" fill="none" stroke="#333" strokeWidth="0.5"/>
      </g>
    </svg>
  ),
};
