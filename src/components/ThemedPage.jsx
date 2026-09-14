const BACKDROPS = {
  catalog: {
    imageUrl: `${import.meta.env.BASE_URL}rockidz-activities-adventure-galaxy-background.webp`,
    overlayClass:
      'bg-[linear-gradient(180deg,rgba(11,7,44,0.7)_0%,rgba(18,11,74,0.66)_44%,rgba(6,57,106,0.58)_100%)]',
    accentClass:
      'bg-[radial-gradient(circle_at_18%_16%,rgba(255,79,163,0.16),transparent_18%),radial-gradient(circle_at_78%_20%,rgba(95,231,255,0.18),transparent_20%),radial-gradient(circle_at_22%_76%,rgba(184,239,0,0.14),transparent_16%),radial-gradient(circle_at_88%_68%,rgba(255,210,51,0.14),transparent_16%)]',
    gradientClass: 'bg-[linear-gradient(180deg,rgba(31,15,83,0.42)_0%,rgba(29,18,92,0.24)_36%,rgba(4,74,117,0.28)_100%)]',
  },
  detail: {
    imageUrl: `${import.meta.env.BASE_URL}rockidz-bible-lessons-constellations-background.webp`,
    overlayClass:
      'bg-[linear-gradient(180deg,rgba(15,10,51,0.8)_0%,rgba(25,14,73,0.76)_40%,rgba(8,48,92,0.72)_100%)]',
    accentClass:
      'bg-[radial-gradient(circle_at_18%_18%,rgba(255,210,51,0.14),transparent_18%),radial-gradient(circle_at_84%_22%,rgba(95,231,255,0.14),transparent_18%),radial-gradient(circle_at_50%_68%,rgba(255,79,163,0.1),transparent_22%)]',
    gradientClass: 'bg-[linear-gradient(180deg,rgba(28,15,83,0.32)_0%,rgba(42,18,95,0.18)_38%,rgba(10,74,122,0.2)_100%)]',
  },
  player: {
    imageUrl: `${import.meta.env.BASE_URL}rockidz-quiz-cosmic-challenge-background.webp`,
    overlayClass:
      'bg-[linear-gradient(180deg,rgba(8,11,47,0.86)_0%,rgba(17,15,70,0.8)_38%,rgba(6,49,96,0.76)_100%)]',
    accentClass:
      'bg-[radial-gradient(circle_at_16%_14%,rgba(0,184,255,0.16),transparent_18%),radial-gradient(circle_at_82%_22%,rgba(255,79,163,0.14),transparent_18%),radial-gradient(circle_at_24%_78%,rgba(255,210,51,0.12),transparent_16%)]',
    gradientClass: 'bg-[linear-gradient(180deg,rgba(13,19,64,0.4)_0%,rgba(29,18,80,0.16)_42%,rgba(6,79,115,0.18)_100%)]',
  },
  dashboard: {
    imageUrl: `${import.meta.env.BASE_URL}rockidz-rewards-galactic-station-background.webp`,
    overlayClass:
      'bg-[linear-gradient(180deg,rgba(12,10,51,0.82)_0%,rgba(21,13,74,0.76)_42%,rgba(7,55,101,0.68)_100%)]',
    accentClass:
      'bg-[radial-gradient(circle_at_18%_16%,rgba(255,79,163,0.16),transparent_18%),radial-gradient(circle_at_78%_18%,rgba(255,210,51,0.14),transparent_18%),radial-gradient(circle_at_50%_74%,rgba(95,231,255,0.12),transparent_20%)]',
    gradientClass: 'bg-[linear-gradient(180deg,rgba(31,17,88,0.34)_0%,rgba(33,19,90,0.18)_42%,rgba(4,82,120,0.18)_100%)]',
  },
  teach: {
    imageUrl: `${import.meta.env.BASE_URL}rockidz-bible-lessons-constellations-background.webp`,
    overlayClass:
      'bg-[linear-gradient(180deg,rgba(8,14,55,0.82)_0%,rgba(15,18,74,0.78)_42%,rgba(8,59,94,0.68)_100%)]',
    accentClass:
      'bg-[radial-gradient(circle_at_16%_16%,rgba(95,231,255,0.14),transparent_18%),radial-gradient(circle_at_82%_20%,rgba(255,210,51,0.12),transparent_18%),radial-gradient(circle_at_52%_76%,rgba(255,79,163,0.12),transparent_18%)]',
    gradientClass: 'bg-[linear-gradient(180deg,rgba(13,21,66,0.34)_0%,rgba(18,31,77,0.18)_42%,rgba(7,85,116,0.18)_100%)]',
  },
  builder: {
    imageUrl: `${import.meta.env.BASE_URL}rockidz-bible-lessons-constellations-background.webp`,
    overlayClass:
      'bg-[linear-gradient(180deg,rgba(11,14,56,0.84)_0%,rgba(20,13,71,0.8)_42%,rgba(7,56,99,0.72)_100%)]',
    accentClass:
      'bg-[radial-gradient(circle_at_14%_20%,rgba(255,210,51,0.14),transparent_18%),radial-gradient(circle_at_84%_18%,rgba(95,231,255,0.16),transparent_18%),radial-gradient(circle_at_50%_78%,rgba(255,79,163,0.12),transparent_18%)]',
    gradientClass: 'bg-[linear-gradient(180deg,rgba(16,21,66,0.34)_0%,rgba(32,14,86,0.18)_42%,rgba(5,82,116,0.18)_100%)]',
  },
  admin: {
    imageUrl: `${import.meta.env.BASE_URL}rockidz-signin-mission-control-background.webp`,
    overlayClass:
      'bg-[linear-gradient(180deg,rgba(14,9,49,0.88)_0%,rgba(22,14,72,0.82)_38%,rgba(6,47,85,0.76)_100%)]',
    accentClass:
      'bg-[radial-gradient(circle_at_18%_18%,rgba(255,79,163,0.12),transparent_18%),radial-gradient(circle_at_82%_18%,rgba(95,231,255,0.14),transparent_18%),radial-gradient(circle_at_50%_74%,rgba(255,210,51,0.1),transparent_20%)]',
    gradientClass: 'bg-[linear-gradient(180deg,rgba(17,13,58,0.4)_0%,rgba(27,15,75,0.18)_42%,rgba(7,61,95,0.18)_100%)]',
  },
  settings: {
    imageUrl: `${import.meta.env.BASE_URL}rockidz-signin-mission-control-background.webp`,
    overlayClass:
      'bg-[linear-gradient(180deg,rgba(12,10,51,0.84)_0%,rgba(20,14,72,0.8)_40%,rgba(8,55,98,0.72)_100%)]',
    accentClass:
      'bg-[radial-gradient(circle_at_18%_18%,rgba(255,210,51,0.12),transparent_18%),radial-gradient(circle_at_80%_20%,rgba(255,79,163,0.12),transparent_18%),radial-gradient(circle_at_48%_78%,rgba(95,231,255,0.12),transparent_20%)]',
    gradientClass: 'bg-[linear-gradient(180deg,rgba(14,15,59,0.38)_0%,rgba(29,16,82,0.18)_42%,rgba(8,74,110,0.18)_100%)]',
  },
}

export default function ThemedPage({ variant = 'catalog', children }) {
  const backdrop = BACKDROPS[variant] || BACKDROPS.catalog

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#1a1242]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {backdrop.imageUrl ? <img src={backdrop.imageUrl} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.3]" /> : null}
        <div className={`absolute inset-0 ${backdrop.overlayClass}`} />
        <div className={`absolute inset-0 ${backdrop.accentClass}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_24%,rgba(255,255,255,0.7)_0_2px,transparent_3px),radial-gradient(circle_at_74%_16%,rgba(255,255,255,0.62)_0_2px,transparent_3px),radial-gradient(circle_at_86%_56%,rgba(255,255,255,0.58)_0_1.5px,transparent_3px),radial-gradient(circle_at_32%_82%,rgba(255,255,255,0.52)_0_1.5px,transparent_3px)] opacity-70" />
        <div className={`absolute inset-0 ${backdrop.gradientClass}`} />
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
