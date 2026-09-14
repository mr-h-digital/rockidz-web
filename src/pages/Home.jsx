import { Link } from 'react-router-dom'
import Marquee from '../components/Marquee'
import { useAuth } from '../context/AuthContext'

const programCoverUrl = `${import.meta.env.BASE_URL}david-and-goliath-program-cover-image.webp`
const heroBackgroundUrl = `${import.meta.env.BASE_URL}rockidz-home-launch-pad-background.webp`
const heroLogoUrl = `${import.meta.env.BASE_URL}rockidz-logo-transparent.webp`

export default function Home() {
  const { user } = useAuth()
  const firstName = user?.displayName?.trim()?.split(/\s+/)?.[0] || 'friend'

  return (
    <div className="relative isolate min-h-[calc(100vh-89px)] overflow-hidden bg-[#1b1141]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <img
          src={heroBackgroundUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.92]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,44,0.58)_0%,rgba(28,10,76,0.5)_38%,rgba(4,52,95,0.38)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,79,163,0.12),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(0,184,255,0.14),transparent_30%),radial-gradient(circle_at_bottom,rgba(255,210,51,0.12),transparent_28%)]" />
      </div>

      <Marquee items={['Bible fun for little hearts', 'Games, songs and story time', 'New Sunday activities every week']} />

      <section className="mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="rounded-[2rem] border-4 border-white/20 bg-[linear-gradient(180deg,rgba(34,13,88,0.8)_0%,rgba(24,10,68,0.8)_100%)] p-5 text-white shadow-[0_28px_84px_rgba(9,9,34,0.38)] backdrop-blur-xl sm:p-8">
            <div className="inline-flex max-w-[260px] -rotate-2 rounded-[1.5rem] border-4 border-white/24 bg-[linear-gradient(180deg,rgba(37,18,93,0.52)_0%,rgba(15,48,98,0.42)_100%)] px-4 py-3 shadow-[0_20px_34px_rgba(0,0,0,0.28)] backdrop-blur-md">
              <img src={heroLogoUrl} alt="Rockidz Kids Ministry" className="h-auto w-full" />
            </div>

            {user && (
              <p className="mt-5 inline-flex items-center rounded-full bg-[#ffd233] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#7a4200] shadow-[0_12px_22px_rgba(255,210,51,0.28)]">
                Welcome back, {firstName}
              </p>
            )}

            <p className="mt-4 text-sm font-black uppercase tracking-[0.24em] text-[#ffd233] sm:text-base">
              Launch into God&apos;s Word
            </p>

            <h1 className="mt-6 font-display text-[42px] leading-[0.92] text-white sm:text-[80px] lg:text-[96px]">
              Discover God's Word
              <span className="block bg-[linear-gradient(90deg,#5fe7ff_0%,#5fe7ff_32%,#ff68b0_68%,#ffd233_100%)] bg-clip-text text-transparent">through play.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base text-white/82 sm:text-lg">
              Colourful Bible stories, memory verse fun, printable worksheets, and joyful activities made just for kids.
            </p>

            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
              <Link
                to="/activities"
                className="rounded-full bg-[#00b8ff] px-7 py-4 text-center text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_34px_rgba(0,184,255,0.38)] transition-transform hover:-translate-y-0.5"
              >
                Start exploring
              </Link>
              <Link
                to="/sign-up"
                className="rounded-full bg-[#ff4fa3] px-7 py-4 text-center text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_34px_rgba(255,79,163,0.36)] transition-transform hover:-translate-y-0.5"
              >
                Join Rockidz
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-5 sm:flex sm:flex-wrap sm:gap-7">
              <Stat num="12+" label="Fun activities" />
              <Stat num="4-12" label="Ages welcomed" />
              <Stat num="100%" label="Bible based" />
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border-4 border-white/24 bg-[linear-gradient(180deg,rgba(21,11,64,0.86)_0%,rgba(9,44,88,0.82)_100%)] p-4 shadow-[0_22px_66px_rgba(6,18,52,0.34)] backdrop-blur-xl sm:p-5">
              <img
                src={programCoverUrl}
                alt="David and Goliath Rockidz Sunday school program cover"
                className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
              />
            </div>

            <div className="absolute -right-2 top-3 rotate-6 rounded-2xl bg-[#ff7a30] px-3 py-2.5 text-white shadow-xl sm:-right-3 sm:-top-4 sm:px-4 sm:py-3">
              <div className="font-display text-3xl leading-none">1</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em]">Featured story</div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-[2rem] border-4 border-white/18 bg-[linear-gradient(180deg,rgba(17,11,56,0.82)_0%,rgba(12,45,92,0.72)_100%)] p-5 shadow-[0_20px_60px_rgba(9,9,34,0.32)] backdrop-blur-xl sm:p-8">
            <h2 className="font-display text-4xl text-white sm:text-5xl">How the fun works</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              <StepCard n="01" title="Pick a story" desc="Choose a Bible adventure and open its colourful lesson page." />
              <StepCard n="02" title="Play and learn" desc="Enjoy quizzes, matching games, memory verses, and story videos." />
              <StepCard n="03" title="Win badges" desc="Complete activities and collect cheerful rewards along the way." />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Stat({ num, label }) {
  return (
    <div>
      <div className="font-display text-3xl leading-none text-[#5fe7ff]">{num}</div>
      <div className="mt-1 text-[11px] font-black uppercase tracking-wide text-white/88">{label}</div>
    </div>
  )
}

function StepCard({ n, title, desc }) {
  return (
    <div className="rounded-[1.5rem] border border-white/22 bg-[linear-gradient(180deg,rgba(68,93,150,0.46)_0%,rgba(31,56,116,0.38)_100%)] p-6 shadow-[0_18px_34px_rgba(4,4,26,0.3)] backdrop-blur-md">
      <p className="font-display text-4xl leading-none text-[#5fe7ff]">{n}</p>
      <h3 className="mt-2.5 font-display text-2xl text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/92">{desc}</p>
    </div>
  )
}
