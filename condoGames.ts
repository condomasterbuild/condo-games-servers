export const ALLOW_PUBLIC_EDITING = true;

export type CondoCategory = 'Penthouse' | 'Rooftop' | 'Arcade' | 'Chill & Scenic';

export type VisualSceneKey =
  | 'skyline-atrium'
  | 'rainy-loft'
  | 'zen-pavilion'
  | 'orbital-suite';

export interface CondoServer {
  id: string;
  name: string;
  region: string;
  pingMs: number;
  players: number;
  maxPlayers: number;
  joinUrl?: string;
}

export function isSafeHttpUrl(url?: string): url is string {
  if (!url) return false;
  return /^https?:\/\/\S+$/i.test(url.trim());
}

export interface ImageAdjustment {
  brightness: number;
  contrast: number;
  saturate: number;
  objectPosition: 'top' | 'center' | 'bottom';
}

export const DEFAULT_IMAGE_ADJUSTMENT: ImageAdjustment = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  objectPosition: 'center',
};

export interface CondoGame {
  id: string;
  title: string;
  creator: string;
  creatorHandle: string;
  category: CondoCategory;
  description: string;
  imageUrl?: string;
  imageAdjustment?: ImageAdjustment;
  sceneKey: VisualSceneKey;
  visits: number;
  playingNow: number;
  likes: number;
  maxPlayers: number;
  updatedAt: string;
  features: string[];
  servers: CondoServer[];
  featured?: boolean;
}

export const INITIAL_CONDO_GAMES: CondoGame[] = [
  {
    id: 'midnight-penthouse',
    title: 'Midnight Rain Penthouse',
    creator: 'Studio Kestrel',
    creatorHandle: '@studiokestrel',
    category: 'Penthouse',
    description:
      'High-altitude glass penthouse overlooking a storm-lit city skyline with ambient fireplace seating, vinyl deck, and spatial voice lounges.',
    imageUrl: '/src/assets/images/condo_midnight_penthouse_1795253355377.jpg',
    sceneKey: 'skyline-atrium',
    visits: 6420000,
    playingNow: 2180,
    likes: 264000,
    maxPlayers: 28,
    updatedAt: '2026-11-19',
    features: ['Spatial Voice', 'Dynamic Rain Glass', 'Custom Jukebox', 'Private Balconies'],
    featured: true,
    servers: [
      { id: 'mp-1', name: 'Skyline Prime 01', region: 'US East', pingMs: 24, players: 25, maxPlayers: 28 },
      { id: 'mp-2', name: 'Storm Lounge 04', region: 'EU West', pingMs: 41, players: 19, maxPlayers: 28 },
      { id: 'mp-3', name: 'Late Night Chill', region: 'Asia Pacific', pingMs: 68, players: 14, maxPlayers: 28 },
    ],
  },
  {
    id: 'terrace-lounge-88',
    title: 'Terrace Lounge 88',
    creator: 'Vespera Works',
    creatorHandle: '@vesperaworks',
    category: 'Rooftop',
    description:
      'Sunken firepit rooftop deck paired with an infinity plunge pool, late-night espresso bar, and panoramic downtown views.',
    imageUrl: '/src/assets/images/condo_rooftop_terrace_1795253355788.jpg',
    sceneKey: 'orbital-suite',
    visits: 4850000,
    playingNow: 1740,
    likes: 212000,
    maxPlayers: 32,
    updatedAt: '2026-11-20',
    features: ['Sunken Firepit', 'Rooftop Pool', 'Synced Music Queue', 'Photo Mode'],
    featured: true,
    servers: [
      { id: 'tl-1', name: 'Ember Deck A', region: 'US West', pingMs: 28, players: 29, maxPlayers: 32 },
      { id: 'tl-2', name: 'Poolside Mix', region: 'US East', pingMs: 31, players: 22, maxPlayers: 32 },
      { id: 'tl-3', name: 'Horizon EU', region: 'EU Central', pingMs: 46, players: 17, maxPlayers: 32 },
    ],
  },
  {
    id: 'brickhouse-arcade-loft',
    title: 'Brickhouse Arcade Loft',
    creator: 'Morrow & Co',
    creatorHandle: '@morrowindie',
    category: 'Arcade',
    description:
      'Converted industrial brick loft stocked with playable retro cabinets, pool tables, and a warm vinyl listening corner.',
    imageUrl: '/src/assets/images/condo_retro_arcade_loft_1795253355418.jpg',
    sceneKey: 'rainy-loft',
    visits: 3910000,
    playingNow: 1390,
    likes: 168000,
    maxPlayers: 24,
    updatedAt: '2026-11-18',
    features: ['6 Mini-Games', 'Scoreboards', 'Vinyl Player', 'Co-op Cabinets'],
    featured: true,
    servers: [
      { id: 'ba-1', name: 'Cabinet Alley', region: 'US East', pingMs: 22, players: 21, maxPlayers: 24 },
      { id: 'ba-2', name: 'Loft Session 2', region: 'EU West', pingMs: 39, players: 16, maxPlayers: 24 },
      { id: 'ba-3', name: 'Highscore Room', region: 'US West', pingMs: 34, players: 11, maxPlayers: 24 },
    ],
  },
  {
    id: 'cliffside-glass-villa',
    title: 'Cliffside Glass Villa',
    creator: 'Nori Architecture',
    creatorHandle: '@noribuilds',
    category: 'Chill & Scenic',
    description:
      'Cantilevered coastal timber and glass villa suspended above moonlit ocean swells with acoustic wave audio and stargazing deck.',
    imageUrl: '/src/assets/images/condo_coastal_glass_villa_1795253355704.jpg',
    sceneKey: 'zen-pavilion',
    visits: 3480000,
    playingNow: 1150,
    likes: 142000,
    maxPlayers: 20,
    updatedAt: '2026-11-17',
    features: ['Ocean Acoustics', 'Infinity Deck', 'Fireplace Lounge', 'Day/Night Cycle'],
    servers: [
      { id: 'cg-1', name: 'Moonlit Tide', region: 'US West', pingMs: 26, players: 18, maxPlayers: 20 },
      { id: 'cg-2', name: 'Pacific Overlook', region: 'Asia Pacific', pingMs: 54, players: 14, maxPlayers: 20 },
      { id: 'cg-3', name: 'Quiet Cliff 03', region: 'EU West', pingMs: 44, players: 9, maxPlayers: 20 },
    ],
  },
  {
    id: 'skyline-atrium-suite',
    title: 'Skyline Atrium Suite',
    creator: 'Alder Studio',
    creatorHandle: '@alderstudio',
    category: 'Penthouse',
    description:
      'Double-height brutalist concrete and glass duplex featuring an indoor botanical courtyard and cantilevered mezzanine.',
    sceneKey: 'skyline-atrium',
    visits: 2740000,
    playingNow: 890,
    likes: 105000,
    maxPlayers: 24,
    updatedAt: '2026-11-15',
    features: ['Indoor Courtyard', 'Mezzanine Bar', 'Custom Lighting', 'Roleplay Props'],
    servers: [
      { id: 'sa-1', name: 'Atrium Main', region: 'US East', pingMs: 27, players: 19, maxPlayers: 24 },
      { id: 'sa-2', name: 'Upper Mezzanine', region: 'EU Central', pingMs: 49, players: 13, maxPlayers: 24 },
    ],
  },
  {
    id: 'rainy-neon-loft',
    title: 'Subway Overlook Loft',
    creator: 'Kairo Pixel',
    creatorHandle: '@kairopixel',
    category: 'Arcade',
    description:
      'Cozy elevated studio beside distant commuter tracks with playable tabletop games, synth corner, and customizable desk setups.',
    sceneKey: 'rainy-loft',
    visits: 2310000,
    playingNow: 720,
    likes: 88000,
    maxPlayers: 16,
    updatedAt: '2026-11-14',
    features: ['Tabletop Board', 'Synth Jam', 'Ambient Train Audio', 'Cozy Seating'],
    servers: [
      { id: 'rn-1', name: 'Platform 9 Loft', region: 'Asia Pacific', pingMs: 48, players: 14, maxPlayers: 16 },
      { id: 'rn-2', name: 'Night Express', region: 'US West', pingMs: 32, players: 10, maxPlayers: 16 },
    ],
  },
  {
    id: 'koto-zen-pavilion',
    title: 'Koto Courtyard Condo',
    creator: 'Sora Craft',
    creatorHandle: '@soracraft',
    category: 'Chill & Scenic',
    description:
      'Minimalist dark-cedar townhouse built around a calm reflection pond, tatami tea room, and soft lantern paths.',
    sceneKey: 'zen-pavilion',
    visits: 1920000,
    playingNow: 580,
    likes: 69000,
    maxPlayers: 18,
    updatedAt: '2026-11-12',
    features: ['Koi Pond', 'Tea Room', 'Lo-Fi Radio', 'Lantern Garden'],
    servers: [
      { id: 'kz-1', name: 'Cedar Pond 01', region: 'Asia Pacific', pingMs: 42, players: 15, maxPlayers: 18 },
      { id: 'kz-2', name: 'Kyoto Dusk', region: 'US West', pingMs: 36, players: 11, maxPlayers: 18 },
    ],
  },
  {
    id: 'orbital-sky-suite',
    title: 'Stratos Sky Deck',
    creator: 'Helix Indie',
    creatorHandle: '@helixindie',
    category: 'Rooftop',
    description:
      'High-elevation observatory condo above the cloud layer with low-gravity lounge corners and star-map projection ceiling.',
    sceneKey: 'orbital-suite',
    visits: 1570000,
    playingNow: 450,
    likes: 52000,
    maxPlayers: 22,
    updatedAt: '2026-11-10',
    features: ['Cloud Layer View', 'Star Projection', 'Voice Zones', 'Zero-G Balcony'],
    servers: [
      { id: 'os-1', name: 'Observatory A', region: 'US East', pingMs: 29, players: 16, maxPlayers: 22 },
      { id: 'os-2', name: 'Cloud Nine EU', region: 'EU West', pingMs: 43, players: 9, maxPlayers: 22 },
    ],
  },
];

export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) {
    const val = num / 1_000_000;
    return `${val >= 100 ? val.toFixed(0) : val.toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (num >= 1_000) {
    const val = num / 1_000;
    return `${val >= 100 ? val.toFixed(0) : val.toFixed(1).replace(/\.0$/, '')}K`;
  }
  return num.toLocaleString();
}
