import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import ProgressPath from '../components/ProgressPath'
import ThemedPage from '../components/ThemedPage'

export default function Dashboard() {
  const { isAdmin, isEducator, user } = useAuth()
  const [enrollments, setEnrollments] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get('/api/enrollments/me')
      .then(setEnrollments)
      .catch((err) => setError(err.message))
  }, [])

  const activitiesCompleted = enrollments?.filter((item) => item.status === 'COMPLETED').length ?? 0
  const activeEnrollments = enrollments?.filter((item) => item.status !== 'COMPLETED') ?? []
  const nextUp = activeEnrollments[0] || null
  const recentActivity = buildRecentActivity(enrollments)

  return (
    <ThemedPage variant="dashboard">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffd233]">Explorer passport · Welcome back, {user?.displayName?.split(' ')[0]}</p>
        <h1 className="mt-2 text-4xl font-display text-white sm:text-5xl">Your Rockidz mission dashboard</h1>
        <p className="mt-4 max-w-2xl text-sm text-white/88 sm:text-base">
          Track your active adventures, celebrate progress, and jump back into the next world waiting for you.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard title="Play again" description="Jump into more Bible activities, stories, and games." ctaLabel="Browse activities" to="/activities" />
          {isEducator && <QuickActionCard title="Leader hub" description="Manage story packs, publish content, and view progress." ctaLabel="Open leader hub" to="/teach" />}
          {isAdmin && <QuickActionCard title="Admin" description="Support leaders, manage access, and help the ministry team." ctaLabel="Open admin" to="/admin" />}
        </div>

        {enrollments && enrollments.length > 0 && (
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-white/18 bg-[linear-gradient(180deg,rgba(23,12,73,0.86)_0%,rgba(10,42,85,0.8)_100%)] p-5 text-white shadow-[0_18px_44px_rgba(4,4,28,0.24)]">
              <p className="text-xs font-black uppercase tracking-wide text-[#5fe7ff]">Continue your adventure</p>
              {nextUp ? (
                <>
                  <h2 className="mt-2 font-display text-3xl text-white">{nextUp.courseTitle}</h2>
                  <p className="mt-2 text-sm text-white/88">Pick up your next activity and keep your badge trail growing.</p>
                  <div className="mt-4">
                    <ProgressPath completed={nextUp.completedLessons} total={nextUp.totalLessons} />
                  </div>
                  <Link
                    to={`/activities/${nextUp.courseSlug}/play`}
                    className="mt-5 inline-block rounded-full bg-[#00c2ff] px-6 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_16px_30px_rgba(0,194,255,0.28)]"
                  >
                    Continue now
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="mt-2 font-display text-3xl text-white">You finished your current adventures</h2>
                  <p className="mt-2 text-sm text-white/88">Amazing work. Pick a new Bible activity to keep learning.</p>
                  <Link to="/activities" className="mt-5 inline-block rounded-full bg-[#ffd84d] px-6 py-3 text-xs font-black uppercase tracking-wide text-[#6b4b00] shadow-[0_16px_30px_rgba(255,216,77,0.22)]">
                    Start another activity
                  </Link>
                </>
              )}
            </div>

            <div className="rounded-[2rem] border border-white/18 bg-[linear-gradient(180deg,rgba(25,12,77,0.84)_0%,rgba(34,15,87,0.78)_100%)] p-5 text-white shadow-[0_18px_44px_rgba(4,4,28,0.22)]">
              <p className="text-xs font-black uppercase tracking-wide text-[#ff8bc3]">Recent fun</p>
              <ul className="mt-3 space-y-3">
                {recentActivity.map((item, index) => (
                  <li key={`${item.title}-${index}`} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-white/82">{item.meta}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {enrollments && enrollments.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-6 sm:gap-8">
            <StatChip num={enrollments.length} label="Joined" />
            <StatChip num={activitiesCompleted} label="Completed" />
          </div>
        )}

        {error && <p className="mt-8 text-sm text-[#ff8bc3]">{error}</p>}

        {enrollments && enrollments.length === 0 && (
          <div className="mt-10 rounded-[2rem] border border-dashed border-white/22 bg-[linear-gradient(180deg,rgba(24,12,76,0.72)_0%,rgba(11,43,88,0.68)_100%)] p-10 text-center text-white shadow-[0_18px_44px_rgba(4,4,28,0.22)]">
            <p className="text-white/88">You haven&apos;t joined an activity yet.</p>
            <Link to="/activities" className="mt-4 inline-block rounded-full bg-[#00c2ff] px-6 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_16px_30px_rgba(0,194,255,0.28)]">
              Browse activities
            </Link>
          </div>
        )}

        {enrollments && enrollments.length > 0 && (
          <div className="mt-10 space-y-4">
            {enrollments.map((item) => (
              <div
                key={item.enrollmentId}
                className="flex flex-col gap-4 rounded-[2rem] border border-white/18 bg-[linear-gradient(180deg,rgba(23,12,73,0.84)_0%,rgba(10,42,85,0.76)_100%)] p-5 text-white shadow-[0_18px_44px_rgba(4,4,28,0.22)] sm:flex-row sm:items-center sm:justify-between sm:p-6"
              >
                <div className="min-w-0">
                  <h3 className="font-display text-2xl text-white">{item.courseTitle}</h3>
                  <div className="mt-2">
                    <ProgressPath completed={item.completedLessons} total={item.totalLessons} />
                  </div>
                </div>

                {item.status === 'COMPLETED' ? (
                  <span className="rounded-full bg-[#fff1a8] px-4 py-1.5 text-xs font-black uppercase tracking-wide text-[#8a4b00] shadow-[0_12px_22px_rgba(255,216,77,0.2)]">Completed</span>
                ) : (
                  <Link to={`/activities/${item.courseSlug}/play`} className="rounded-full bg-[#ff6fb5] px-5 py-2.5 text-center text-xs font-black uppercase tracking-wide text-white shadow-[0_16px_28px_rgba(255,111,181,0.24)]">
                    Continue
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ThemedPage>
  )
}

function StatChip({ num, label }) {
  return (
    <div>
      <div className="font-display text-3xl leading-none text-[#5fe7ff]">{num}</div>
      <div className="mt-1 text-[11px] font-black uppercase tracking-wide text-white/84">{label}</div>
    </div>
  )
}

function QuickActionCard({ title, description, ctaLabel, to }) {
  return (
    <div className="rounded-[2rem] border border-white/18 bg-[linear-gradient(180deg,rgba(25,12,77,0.84)_0%,rgba(14,45,88,0.78)_100%)] p-5 text-white shadow-[0_18px_40px_rgba(4,4,28,0.22)]">
      <h2 className="font-display text-2xl text-white">{title}</h2>
      <p className="mt-2 text-sm text-white/86">{description}</p>
      <Link to={to} className="mt-4 inline-block rounded-full bg-[#ffd84d] px-4 py-2 text-xs font-black uppercase tracking-wide text-[#6b4b00] shadow-[0_14px_24px_rgba(255,216,77,0.18)]">
        {ctaLabel}
      </Link>
    </div>
  )
}

function buildRecentActivity(enrollments) {
  if (!enrollments || enrollments.length === 0) {
    return [{ title: 'No activity yet', meta: 'Join a Rockidz activity to begin your adventure.' }]
  }

  return enrollments.slice(0, 4).map((item) =>
    item.status === 'COMPLETED'
      ? {
          title: `Completed ${item.courseTitle}`,
          meta: `${item.completedLessons}/${item.totalLessons} activity steps finished`,
        }
      : {
          title: `In progress: ${item.courseTitle}`,
          meta: `${item.completedLessons}/${item.totalLessons} activity steps completed`,
        },
  )
}
