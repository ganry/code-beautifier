import wp01 from './wallpapers/wallpaper01.jpg'
import wp02 from './wallpapers/wallpaper02.jpg'
import wp03 from './wallpapers/wallpaper03.jpg'
import wp04 from './wallpapers/wallpaper04.jpg'
import wp05 from './wallpapers/wallpaper05.jpg'
import wp06 from './wallpapers/wallpaper06.jpg'
import wp07 from './wallpapers/wallpaper07.jpg'

export const BACKGROUND_PRESETS = [
  // Classic gradients
  { name: 'Rosé', value: 'linear-gradient(135deg, #f471b5 0%, #c0457a 100%)' },
  { name: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: 'Forest', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { name: 'Midnight', value: 'linear-gradient(135deg, #0c0c1d 0%, #1a1a3e 100%)' },
  { name: 'Flame', value: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)' },
  { name: 'Aurora', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { name: 'Peach', value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { name: 'Royal', value: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)' },
  // Modern 3-color gradients
  { name: 'Neon Pulse', value: 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)' },
  { name: 'Cyber', value: 'linear-gradient(135deg, #0ff 0%, #7b2ff7 50%, #ff2d95 100%)' },
  { name: 'Vapor', value: 'linear-gradient(135deg, #ff71ce 0%, #01cdfe 50%, #05ffa1 100%)' },
  { name: 'Nebula', value: 'linear-gradient(135deg, #1a0533 0%, #4a0e8f 50%, #e040fb 100%)' },
  { name: 'Infrared', value: 'linear-gradient(135deg, #ff4e50 0%, #fc913a 50%, #f9d423 100%)' },
  { name: 'Arctic', value: 'linear-gradient(135deg, #0b132b 0%, #1c2541 40%, #5bc0be 100%)' },
  { name: 'Hologram', value: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #eab308 100%)' },
  { name: 'Mesh Dark', value: 'radial-gradient(at 0% 0%, #1e3a5f 0%, transparent 50%), radial-gradient(at 100% 0%, #4a1942 0%, transparent 50%), radial-gradient(at 100% 100%, #0d3b66 0%, transparent 50%), #0a0a0a' },
  { name: 'Mesh Light', value: 'radial-gradient(at 0% 0%, #c2e9fb 0%, transparent 50%), radial-gradient(at 100% 0%, #fbc2eb 0%, transparent 50%), radial-gradient(at 50% 100%, #a1c4fd 0%, transparent 50%), #f5f7fa' },
  // Grays
  { name: 'White', value: '#ffffff' },
  { name: 'Light Gray', value: '#e5e5e5' },
  { name: 'Gray', value: '#9ca3af' },
  { name: 'Slate', value: '#64748b' },
  { name: 'Dark Gray', value: '#374151' },
  { name: 'Charcoal', value: '#1f2937' },
  { name: 'Carbon', value: '#171717' },
  { name: 'Black', value: '#000000' },
  { name: 'Transparent', value: 'transparent' },
]

export const WALLPAPER_PRESETS = [
  { name: 'Wallpaper 1', url: wp01 },
  { name: 'Wallpaper 2', url: wp02 },
  { name: 'Wallpaper 3', url: wp03 },
  { name: 'Wallpaper 4', url: wp04 },
  { name: 'Wallpaper 5', url: wp05 },
  { name: 'Wallpaper 6', url: wp06 },
  { name: 'Wallpaper 7', url: wp07 },
]

export const DEFAULT_CODE = `function fibonacci(n) {
  if (n <= 1) return n;

  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }

  return b;
}

// Calculate the first 10 Fibonacci numbers
const results = Array.from({ length: 10 }, (_, i) => fibonacci(i));
console.log(results); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`
