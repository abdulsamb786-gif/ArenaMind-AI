import GlassCard from '../Common/GlassCard';
import { Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';

const WEATHER_ICONS = {
  clear: Sun,
  cloudy: Cloud,
  rain: CloudRain,
  storm: CloudLightning,
};

export default function WeatherCard({ data = {} }) {
  const Icon = WEATHER_ICONS[data.condition] || Sun;

  return (
    <GlassCard>
      <div className="flex items-center gap-3">
        <Icon size={28} className="text-arena-accent" />
        <div>
          <p className="text-lg font-semibold">{data.temperature}°C</p>
          <p className="text-xs text-arena-muted capitalize">{data.condition}</p>
        </div>
        <div className="ml-auto text-right text-xs text-arena-muted">
          <p>💧 {data.humidity}%</p>
          <p>💨 {data.windSpeed}km/h</p>
          <p>🌧 {data.rainProbability}%</p>
        </div>
      </div>
    </GlassCard>
  );
}
