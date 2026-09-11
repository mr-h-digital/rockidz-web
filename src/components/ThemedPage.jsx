const BACKDROPS = {
  catalog: {
    imageUrl: '',
    gradientClass: 'bg-[linear-gradient(180deg,#fff7d1_0%,#ffd6ea_48%,#dff7ff_100%)]',
  },
  detail: {
    imageUrl: '',
    gradientClass: 'bg-[linear-gradient(180deg,#dff7ff_0%,#ffe1f0_55%,#fff7d1_100%)]',
  },
  player: {
    imageUrl: '',
    gradientClass: 'bg-[linear-gradient(180deg,#fff7d1_0%,#dff7ff_45%,#ffd6ea_100%)]',
  },
  dashboard: {
    imageUrl: '',
    gradientClass: 'bg-[linear-gradient(180deg,#ffe1f0_0%,#fff7d1_55%,#dff7ff_100%)]',
  },
  teach: {
    imageUrl: '',
    gradientClass: 'bg-[linear-gradient(180deg,#dff7ff_0%,#fff7d1_60%,#ffe1f0_100%)]',
  },
  builder: {
    imageUrl: '',
    gradientClass: 'bg-[linear-gradient(180deg,#fff7d1_0%,#dff7ff_50%,#ffe1f0_100%)]',
  },
  admin: {
    imageUrl: '',
    gradientClass: 'bg-[linear-gradient(180deg,#ffe1f0_0%,#dff7ff_45%,#fff7d1_100%)]',
  },
  settings: {
    imageUrl: '',
    gradientClass: 'bg-[linear-gradient(180deg,#fff7d1_0%,#ffe1f0_55%,#dff7ff_100%)]',
  },
}

export default function ThemedPage({ variant = 'catalog', children }) {
  const backdrop = BACKDROPS[variant] || BACKDROPS.catalog

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        {backdrop.imageUrl ? <img src={backdrop.imageUrl} alt="" aria-hidden="true" className="h-full w-full object-cover object-center" /> : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,111,181,0.18),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(0,194,255,0.16),transparent_34%),radial-gradient(circle_at_bottom,rgba(255,216,77,0.22),transparent_28%)]" />
        <div className={`absolute inset-0 ${backdrop.gradientClass}`} />
      </div>

      {children}
    </div>
  )
}
