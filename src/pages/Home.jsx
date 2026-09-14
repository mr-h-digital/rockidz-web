import { Link } from 'react-router-dom'
import Marquee from '../components/Marquee'
import { useAuth } from '../context/AuthContext'

const programCoverUrl = `${import.meta.env.BASE_URL}david-and-goliath-program-cover-image.webp`
const heroBackgroundUrl = `${import.meta.env.BASE_URL}rockidz-web-background-image.webp`

export default function Home() {
  const { user } = useAuth()
  const firstName = user?.displayName?.trim()?.split(/\s+/)?.[0] || 'friend'

  return (
    <div className="relative isolate min-h-[calc(100vh-89px)] overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(255,247,209,0.78)_28%,rgba(255,214,234,0.62)_62%,rgba(223,247,255,0.78)_100%)]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <img
          src={heroBackgroundUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.34]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(255,247,209,0.78)_28%,rgba(255,214,234,0.62)_62%,rgba(223,247,255,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,105,180,0.12),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(80,180,255,0.16),transparent_30%),radial-gradient(circle_at_bottom,rgba(255,205,86,0.14),transparent_28%)]" />
      </div>

      <Marquee items={['Bible fun for little hearts', 'Games, songs and story time', 'New Sunday activities every week']} />

      <section className="mx-auto max-w-6xl px-6 pt-16 pb-14">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="rounded-[2rem] border-4 border-white/60 bg-white/55 p-6 shadow-[0_24px_80px_rgba(255,105,180,0.18)] backdrop-blur-md sm:p-8">
            {user && (
              <p className="mb-4 inline-flex items-center rounded-full bg-[#fff1a8] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#8a4b00]">
                Welcome back, {firstName}
              </p>
            )}

            <span className="inline-flex -rotate-3 items-center rounded-full bg-[#8c52ff] px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-[0_10px_24px_rgba(140,82,255,0.26)]">
              Rockidz Kids Corner
            </span>

            <p className="mt-4 text-sm font-black uppercase tracking-[0.24em] text-[#ff8a00] sm:text-base">
              Where fun grows faith
            </p>

            <h1 className="mt-6 font-display text-[54px] leading-[0.9] text-[#5b2b86] sm:text-[80px] lg:text-[96px]">
              Discover God's Word
              <span className="block text-[#00a8b5]">through play.</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg text-[#5b5872]">
              Colourful Bible stories, memory verse fun, printable worksheets, and joyful activities made just for kids.
            </p>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link
                to="/activities"
                className="rounded-full bg-[#00c2ff] px-7 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_14px_28px_rgba(0,194,255,0.25)] transition-transform hover:-translate-y-0.5"
              >
                Start exploring
              </Link>
              <Link
                to="/sign-up"
                className="rounded-full bg-[#ffd84d] px-7 py-4 text-sm font-black uppercase tracking-wide text-[#6b4b00] shadow-[0_14px_28px_rgba(255,216,77,0.28)] transition-transform hover:-translate-y-0.5"
              >
                Join Rockidz
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-7">
              <Stat num="12+" label="Fun activities" />
              <Stat num="4-12" label="Ages welcomed" />
              <Stat num="100%" label="Bible based" />
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border-4 border-white/70 bg-white/60 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-5">
              <img
                src={programCoverUrl}
                alt="David and Goliath Rockidz Sunday school program cover"
                className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
              />
            </div>

            <div className="absolute -right-3 -top-4 rotate-6 rounded-2xl bg-[#ff8a00] px-4 py-3 text-white shadow-xl">
              <div className="font-display text-3xl leading-none">1</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em]">Featured story</div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-[2rem] border-4 border-white/60 bg-white/55 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-md sm:p-8">
            <h2 className="font-display text-4xl text-[#5b2b86] sm:text-5xl">How the fun works</h2>
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
      <div className="font-display text-3xl leading-none text-[#8c52ff]">{num}</div>
      <div className="mt-1 text-[11px] font-black uppercase tracking-wide text-[#5b5872]">{label}</div>
    </div>
  )
}

function StepCard({ n, title, desc }) {
  return (
    <div className="rounded-[1.5rem] bg-white/75 p-6 shadow-[0_14px_30px_rgba(91,43,134,0.08)]">
      <p className="font-display text-4xl leading-none text-[#00a8b5]">{n}</p>
      <h3 className="mt-2.5 font-display text-2xl text-[#5b2b86]">{title}</h3>
      <p className="mt-2 text-sm text-[#5b5872]">{desc}</p>
    </div>
  )
}
