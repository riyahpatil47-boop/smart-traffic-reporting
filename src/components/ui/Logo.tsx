import { TrafficCone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Logo({
  size = 'md',
  showText = true,
  light = false,
}: {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  light?: boolean;
}) {
  const box =
    size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';
  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 26 : 22;
  const text =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg';

  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div
        className={`${box} rounded-xl bg-navy-800 text-traffic-400 grid place-items-center transition-transform group-hover:scale-105`}
      >
        <TrafficCone size={iconSize} />
      </div>
      {showText && (
        <div className="leading-tight">
          <div
            className={`${text} font-extrabold tracking-tight ${
              light ? 'text-white' : 'text-navy-900'
            }`}
          >
            STRS
          </div>
          <div
            className={`text-[10px] font-medium uppercase tracking-wider ${
              light ? 'text-navy-200' : 'text-navy-400'
            }`}
          >
            Smart Traffic Reporting
          </div>
        </div>
      )}
    </Link>
  );
}
