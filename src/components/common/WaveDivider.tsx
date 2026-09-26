import React from 'react';

interface WaveDividerProps {
  className?: string;
  fillColor?: string;
  flip?: boolean;
}

export const WaveDivider: React.FC<WaveDividerProps> = ({
  className = '',
  fillColor = 'fill-[#f8fafc] dark:fill-[#0b1528]',
  flip = false,
}) => {
  return (
    <div
      className={`w-full overflow-hidden leading-none pointer-events-none ${
        flip ? 'rotate-180' : ''
      } ${className}`}
      aria-hidden="true"
    >
      <svg
        className={`relative block w-full h-[36px] md:h-[54px] lg:h-[72px] ${fillColor}`}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z"></path>
      </svg>
    </div>
  );
};
