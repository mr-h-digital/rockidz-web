const BACKDROPS = {
  catalog: {
    imageUrl: `${import.meta.env.BASE_URL}rockidz-activities-page-background-image.webp`,
    gradientClass: 'bg-[linear-gradient(180deg,rgba(255,229,95,0.76)_0%,rgba(255,124,196,0.52)_48%,rgba(113,228,255,0.72)_100%)]',
  },
  detail: {
    imageUrl: '',
    gradientClass: 'bg-[linear-gradient(180deg,#8feeff_0%,#ffc0e2_55%,#ffe772_100%)]',
  },
  player: {
    imageUrl: '',
    gradientClass: 'bg-[linear-gradient(180deg,#ffe772_0%,#90efff_45%,#ffb2d8_100%)]',
  },
  dashboard: {
    imageUrl: '',
    gradientClass: 'bg-[linear-gradient(180deg,#ffc0e2_0%,#ffe772_55%,#90efff_100%)]',
  },
  teach: {
    imageUrl: '',
    gradientClass: 'bg-[linear-gradient(180deg,#90efff_0%,#ffe772_60%,#ffc0e2_100%)]',
  },
  builder: {
    imageUrl: '',
    gradientClass: 'bg-[linear-gradient(180deg,#ffe772_0%,#90efff_50%,#ffc0e2_100%)]',
  },
  admin: {
    imageUrl: '',
    gradientClass: 'bg-[linear-gradient(180deg,#ffc0e2_0%,#90efff_45%,#ffe772_100%)]',
  },
  settings: {
    imageUrl: '',
    gradientClass: 'bg-[linear-gradient(180deg,#ffe772_0%,#ffc0e2_55%,#90efff_100%)]',
  },
}

export default function ThemedPage({ variant = 'catalog', children }) {
  const backdrop = BACKDROPS[variant] || BACKDROPS.catalog

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#1a1242]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {backdrop.imageUrl ? <img src={backdrop.imageUrl} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.3]" /> : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,79,163,0.34),transparent_20%),radial-gradient(circle_at_80%_20%,rgba(0,184,255,0.3),transparent_22%),radial-gradient(circle_at_bottom,rgba(255,210,51,0.26),transparent_20%),radial-gradient(circle_at_62%_38%,rgba(125,60,255,0.28),transparent_22%),radial-gradient(circle_at_28%_74%,rgba(184,239,0,0.16),transparent_18%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_24%,rgba(255,255,255,0.7)_0_2px,transparent_3px),radial-gradient(circle_at_74%_16%,rgba(255,255,255,0.62)_0_2px,transparent_3px),radial-gradient(circle_at_86%_56%,rgba(255,255,255,0.58)_0_1.5px,transparent_3px),radial-gradient(circle_at_32%_82%,rgba(255,255,255,0.52)_0_1.5px,transparent_3px)] opacity-70" />
        <div className={`absolute inset-0 ${backdrop.gradientClass}`} />
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
