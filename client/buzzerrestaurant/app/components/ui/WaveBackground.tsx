'use client';

import React, { ReactNode } from 'react';

interface WaveBackgroundProps {
  children?: ReactNode;
  topColor?: string;
  bottomColor?: string;
  topHeight?: string;
}

export const WaveBackground: React.FC<WaveBackgroundProps> = ({
  children,
  topColor = '#4d0d0d',
  bottomColor = '#FFFFFF',
  topHeight = '60%',
}) => {
  return (
    <div className="relative w-full overflow-hidden flex flex-col" style={{ minHeight: '100vh' }}>
      {/* Top Red Section */}
      <div 
        className="relative w-full flex flex-col"
        style={{ 
          backgroundColor: topColor,
          minHeight: topHeight,
        }}
      >
        {/* Content goes here */}
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
        
        {/* SVG Wave Divider - positioned at bottom of red section */}
        <div className="absolute bottom-0 left-0 w-full" style={{ lineHeight: 0, zIndex: 1 }}>
          <svg
            className="w-full block"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ 
              display: 'block',
              width: '100%',
              height: '120px',
            }}
          >
            <path
              d="M0,120 C200,120 400,40 720,60 C1040,80 1240,100 1440,80 L1440,200 L0,200 Z"
              fill={bottomColor}
            />
          </svg>
        </div>
      </div>

      {/* Bottom White Section */}
      <div 
        className="w-full flex-1 relative"
        style={{ 
          backgroundColor: bottomColor,
          minHeight: '40%',
        }}
      />
    </div>
  );
};

