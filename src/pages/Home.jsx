import { Link } from 'react-router-dom'
import Marquee from '../components/Marquee'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const firstName = user?.displayName?.trim()?.split(/\s+/)?.[0] || 'friend'

  return (
    <div className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,105,180,0.24),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(80,180,255,0.28),transparent_30%),radial-gradient(circle_at_bottom,rgba(255,205,86,0.2),transparent_28%)]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#fff7d1_0%,#ffd6ea_38%,#dff7ff_100%)]" />
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

            <span className="inline-flex -rotate-3 items-center rounded-full bg-[#ff6fb5] px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-[0_10px_24px_rgba(255,111,181,0.3)]">
              Rockidz Kids Corner
            </span>

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
              <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,#76e4ff_0%,#8df3c4_45%,#fff1a8_100%)]">
                <div className="absolute left-6 top-6 h-16 w-16 rounded-full bg-white/55" />
                <div className="absolute right-10 top-16 h-8 w-8 rounded-full bg-white/55" />
                <div className="absolute bottom-0 left-0 right-0 h-28 bg-[linear-gradient(180deg,#7ad97c_0%,#42b658_100%)]" />
                <div className="relative z-[1] max-w-[18rem] rounded-[1.5rem] bg-white/75 p-5 text-center shadow-xl">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ff6fb5] text-3xl">📖</div>
                  <h2 className="mt-4 font-display text-3xl text-[#5b2b86]">David &amp; Goliath</h2>
                  <p className="mt-2 text-sm text-[#5b5872]">Read the story, match the cards, and earn a brave heart badge.</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-3 -top-4 rotate-6 rounded-2xl bg-[#ff8a00] px-4 py-3 text-white shadow-xl">
              <div className="font-display text-3xl leading-none">3</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em]">New this week</div>
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
      <div className="font-display text-3xl leading-none text-[#ff6fb5]">{num}</div>
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
