import { useEffect, useRef, useState } from 'react';
import { CreatorsSection } from './components/CreatorsSection';
import {
  BackgroundSettings,
  DEFAULT_BACKGROUND_SETTINGS,
  EditBackgroundModal,
  GRADIENT_PRESETS,
} from './components/EditBackgroundModal';
import { EditWorldModal, WorldEditPayload } from './components/EditWorldModal';
import { FilterOption, GameDirectory, SortOption } from './components/GameDirectory';
import { GameDetailModal } from './components/GameDetailModal';
import { DEFAULT_HERO_COPY, HeroCopy, HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ServerGuideSection } from './components/ServerGuideSection';
import { SubmitCondoModal } from './components/SubmitCondoModal';
import {
  CondoCategory,
  CondoGame,
  CondoServer,
  ImageAdjustment,
  INITIAL_CONDO_GAMES,
} from './data/condoGames';

const LIKED_STORAGE_KEY = 'condoindex_liked_ids_v1';
const CUSTOM_GAMES_STORAGE_KEY = 'condoindex_custom_games_v1';
const WORLD_OVERRIDES_STORAGE_KEY = 'condoindex_world_overrides_v1';
const LEGACY_IMAGE_OVERRIDES_KEY = 'condoindex_image_overrides_v1';
const HERO_COPY_STORAGE_KEY = 'condoindex_hero_copy_v1';
const BACKGROUND_STORAGE_KEY = 'condoindex_background_v1';

interface WorldOverride {
  title?: string;
  creator?: string;
  category?: CondoCategory;
  description?: string;
  imageUrl?: string;
  imageAdjustment?: ImageAdjustment;
  servers?: CondoServer[];
}

export default function App() {
  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>(() => {
    try {
      const raw = localStorage.getItem(BACKGROUND_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.mode === 'string') {
          return { ...DEFAULT_BACKGROUND_SETTINGS, ...parsed };
        }
      }
    } catch {
      // Ignore storage read errors
    }
    return DEFAULT_BACKGROUND_SETTINGS;
  });

  const [heroCopy, setHeroCopy] = useState<HeroCopy>(() => {
    try {
      const raw = localStorage.getItem(HERO_COPY_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.headline === 'string' && typeof parsed.subtitle === 'string') {
          return parsed;
        }
      }
    } catch {
      // Ignore storage read errors
    }
    return DEFAULT_HERO_COPY;
  });

  const [games, setGames] = useState<CondoGame[]>(() => {
    let baseList = INITIAL_CONDO_GAMES;
    try {
      const rawCustom = localStorage.getItem(CUSTOM_GAMES_STORAGE_KEY);
      if (rawCustom) {
        const custom: CondoGame[] = JSON.parse(rawCustom);
        if (Array.isArray(custom) && custom.length > 0) {
          baseList = [...custom, ...INITIAL_CONDO_GAMES];
        }
      }
    } catch {
      // Ignore storage read errors
    }

    try {
      const rawWorldOverrides = localStorage.getItem(WORLD_OVERRIDES_STORAGE_KEY);
      const rawLegacyOverrides = localStorage.getItem(LEGACY_IMAGE_OVERRIDES_KEY);
      const overrides: Record<string, WorldOverride> = rawWorldOverrides
        ? JSON.parse(rawWorldOverrides)
        : rawLegacyOverrides
        ? JSON.parse(rawLegacyOverrides)
        : {};

      if (overrides && typeof overrides === 'object') {
        return baseList.map((g) => {
          const ov = overrides[g.id];
          if (!ov) return g;
          return {
            ...g,
            title: ov.title ?? g.title,
            creator: ov.creator ?? g.creator,
            category: ov.category ?? g.category,
            description: ov.description ?? g.description,
            imageUrl: 'imageUrl' in ov ? ov.imageUrl : g.imageUrl,
            imageAdjustment: ov.imageAdjustment ?? g.imageAdjustment,
            servers: Array.isArray(ov.servers) && ov.servers.length > 0 ? ov.servers : g.servers,
          };
        });
      }
    } catch {
      // Ignore storage read errors
    }

    return baseList;
  });

  const [likedIds, setLikedIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(LIKED_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return new Set(parsed);
      }
    } catch {
      // Ignore storage read errors
    }
    return new Set();
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [sortBy, setSortBy] = useState<SortOption>('playing');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [editingWorldId, setEditingWorldId] = useState<string | null>(null);
  const [isBackgroundEditorOpen, setIsBackgroundEditorOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [joinedConnection, setJoinedConnection] = useState<{
    gameId: string;
    serverId: string;
  } | null>(null);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Persist liked IDs
  useEffect(() => {
    try {
      localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(Array.from(likedIds)));
    } catch {
      // Ignore storage write errors
    }
  }, [likedIds]);

  const handleSaveHeroCopy = (copy: HeroCopy) => {
    setHeroCopy(copy);
    try {
      localStorage.setItem(HERO_COPY_STORAGE_KEY, JSON.stringify(copy));
    } catch {
      // Ignore storage write errors
    }
  };

  const handleSaveBackground = (next: BackgroundSettings) => {
    setBackgroundSettings(next);
    try {
      localStorage.setItem(BACKGROUND_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota/write errors
    }
  };

  const handleToggleLike = (gameId: string) => {
    const alreadyLiked = likedIds.has(gameId);
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (alreadyLiked) {
        next.delete(gameId);
      } else {
        next.add(gameId);
      }
      return next;
    });

    setGames((prev) =>
      prev.map((g) =>
        g.id === gameId
          ? { ...g, likes: Math.max(0, g.likes + (alreadyLiked ? -1 : 1)) }
          : g
      )
    );
  };

  const handleSaveWorld = (gameId: string, payload: WorldEditPayload) => {
    setGames((prev) =>
      prev.map((g) =>
        g.id === gameId
          ? {
              ...g,
              title: payload.title,
              creator: payload.creator,
              category: payload.category,
              description: payload.description,
              imageUrl: payload.imageUrl,
              imageAdjustment: payload.imageAdjustment,
              servers: payload.servers,
            }
          : g
      )
    );

    try {
      const raw = localStorage.getItem(WORLD_OVERRIDES_STORAGE_KEY);
      const existing: Record<string, WorldOverride> = raw ? JSON.parse(raw) : {};
      existing[gameId] = payload;
      localStorage.setItem(WORLD_OVERRIDES_STORAGE_KEY, JSON.stringify(existing));
    } catch {
      // Ignore storage quota/write errors
    }
  };

  const handleDownloadPublishConfig = () => {
    const fileContent = `export const ALLOW_PUBLIC_EDITING = false;

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
  return /^https?:\\/\\/\\S+$/i.test(url.trim());
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

export const INITIAL_CONDO_GAMES: CondoGame[] = ${JSON.stringify(games, null, 2)};

export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) {
    const val = num / 1_000_000;
    return \`\${val >= 100 ? val.toFixed(0) : val.toFixed(1).replace(/\\.0$/, '')}M\`;
  }
  if (num >= 1_000) {
    const val = num / 1_000;
    return \`\${val >= 100 ? val.toFixed(0) : val.toFixed(1).replace(/\\.0$/, '')}K\`;
  }
  return num.toLocaleString();
}
`;

    const blob = new Blob([fileContent], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'condoGames.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBrowseClick = () => {
    const dirEl = document.getElementById('directory');
    if (dirEl) {
      dirEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      searchInputRef.current?.focus({ preventScroll: true });
    }, 350);
  };

  const handleFilterByCreator = (creatorName: string) => {
    setActiveFilter('All');
    setSearchQuery(creatorName);
    const dirEl = document.getElementById('directory');
    if (dirEl) {
      dirEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleJoinServer = (gameId: string, serverId: string) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id !== gameId) return g;
        const wasInThisGame = joinedConnection?.gameId === gameId;
        return {
          ...g,
          visits: g.visits + 1,
          playingNow: wasInThisGame ? g.playingNow : g.playingNow + 1,
          servers: g.servers.map((srv) => {
            if (srv.id === serverId) {
              return { ...srv, players: Math.min(srv.maxPlayers, srv.players + 1) };
            }
            if (joinedConnection?.serverId === srv.id) {
              return { ...srv, players: Math.max(0, srv.players - 1) };
            }
            return srv;
          }),
        };
      })
    );
    setJoinedConnection({ gameId, serverId });
  };

  const handleLeaveServer = () => {
    if (!joinedConnection) return;
    const { gameId, serverId } = joinedConnection;
    setGames((prev) =>
      prev.map((g) => {
        if (g.id !== gameId) return g;
        return {
          ...g,
          playingNow: Math.max(0, g.playingNow - 1),
          servers: g.servers.map((srv) =>
            srv.id === serverId ? { ...srv, players: Math.max(0, srv.players - 1) } : srv
          ),
        };
      })
    );
    setJoinedConnection(null);
  };

  const handleSubmitCondo = (newGame: CondoGame) => {
    setGames((prev) => [newGame, ...prev]);
    try {
      const raw = localStorage.getItem(CUSTOM_GAMES_STORAGE_KEY);
      const existing: CondoGame[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(CUSTOM_GAMES_STORAGE_KEY, JSON.stringify([newGame, ...existing]));
    } catch {
      // Ignore storage write errors
    }
    setActiveFilter('All');
    setSearchQuery('');
    setSortBy('newest');
    const dirEl = document.getElementById('directory');
    if (dirEl) {
      dirEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const selectedGame = games.find((g) => g.id === selectedGameId) ?? null;
  const editingWorldGame = games.find((g) => g.id === editingWorldId) ?? null;

  const applyPageBg = backgroundSettings.scope === 'page';

  return (
    <div className="relative min-h-screen bg-[#050608] text-slate-100">
      {/* Full-page Custom Background */}
      {applyPageBg && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          {backgroundSettings.mode === 'solid' && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: backgroundSettings.solidColor }}
            />
          )}
          {backgroundSettings.mode === 'gradient' && (
            <div
              className="absolute inset-0"
              style={{ background: GRADIENT_PRESETS[backgroundSettings.gradientPreset].css }}
            />
          )}
          {backgroundSettings.mode === 'image' && backgroundSettings.imageUrl && (
            <>
              <img
                src={backgroundSettings.imageUrl}
                alt=""
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  filter:
                    backgroundSettings.blurPx > 0
                      ? `blur(${backgroundSettings.blurPx}px)`
                      : undefined,
                  transform: backgroundSettings.blurPx > 0 ? 'scale(1.06)' : undefined,
                }}
              />
              <div
                className="absolute inset-0 bg-[#050608]"
                style={{ opacity: backgroundSettings.overlayOpacity / 100 }}
              />
            </>
          )}
        </div>
      )}

      <div className="relative z-10">
        <Navbar
          onOpenSubmit={() => setIsSubmitOpen(true)}
          onBrowseClick={handleBrowseClick}
        />

        <main>
          <HeroSection
            games={games}
            likedIds={likedIds}
            heroCopy={heroCopy}
            backgroundSettings={backgroundSettings}
            onSaveHeroCopy={handleSaveHeroCopy}
            onOpenBackgroundEditor={() => setIsBackgroundEditorOpen(true)}
            onBrowseClick={handleBrowseClick}
            onSelectGame={(game) => setSelectedGameId(game.id)}
            onToggleLike={handleToggleLike}
            onEditWorld={(game) => setEditingWorldId(game.id)}
          />

          <GameDirectory
            games={games}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            likedIds={likedIds}
            onToggleLike={handleToggleLike}
            onSelectGame={(game) => setSelectedGameId(game.id)}
            onEditWorld={(game) => setEditingWorldId(game.id)}
            searchInputRef={searchInputRef}
          />

          <CreatorsSection
            games={games}
            onFilterByCreator={handleFilterByCreator}
            onOpenSubmit={() => setIsSubmitOpen(true)}
          />

          <ServerGuideSection
            onBrowseClick={handleBrowseClick}
            onOpenSubmit={() => setIsSubmitOpen(true)}
          />
        </main>
      </div>

      <GameDetailModal
        game={selectedGame}
        isLiked={selectedGame ? likedIds.has(selectedGame.id) : false}
        joinedServerId={
          selectedGame && joinedConnection?.gameId === selectedGame.id
            ? joinedConnection.serverId
            : null
        }
        onClose={() => setSelectedGameId(null)}
        onToggleLike={handleToggleLike}
        onEditWorld={(game) => setEditingWorldId(game.id)}
        onJoinServer={handleJoinServer}
        onLeaveServer={handleLeaveServer}
      />

      <EditWorldModal
        game={editingWorldGame}
        onClose={() => setEditingWorldId(null)}
        onSaveWorld={handleSaveWorld}
        onDownloadPublishConfig={handleDownloadPublishConfig}
      />

      <EditBackgroundModal
        isOpen={isBackgroundEditorOpen}
        settings={backgroundSettings}
        onClose={() => setIsBackgroundEditorOpen(false)}
        onSave={handleSaveBackground}
      />

      <SubmitCondoModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmitCondo={handleSubmitCondo}
      />
    </div>
  );
}
