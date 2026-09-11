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
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff6fb5]">Welcome back, {user?.displayName?.split(' ')[0]}</p>
        <h1 className="mt-2 font-display text-5xl text-[#5b2b86]">Your fun faith journey</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard title="Play again" description="Jump into more Bible activities, stories, and games." ctaLabel="Browse activities" to="/activities" />
          {isEducator && <QuickActionCard title="Leader hub" description="Manage story packs, publish content, and view progress." ctaLabel="Open leader hub" to="/teach" />}
          {isAdmin && <QuickActionCard title="Admin" description="Support leaders, manage access, and help the ministry team." ctaLabel="Open admin" to="/admin" />}
        </div>

        {enrollments && enrollments.length > 0 && (
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border-4 border-white/70 bg-white/70 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-[#00a8b5]">Continue your adventure</p>
              {nextUp ? (
                <>
                  <h2 className="mt-2 font-display text-3xl text-[#5b2b86]">{nextUp.courseTitle}</h2>
                  <p className="mt-2 text-sm text-[#5b5872]">Pick up your next activity and keep your badge trail growing.</p>
                  <div className="mt-4">
                    <ProgressPath completed={nextUp.completedLessons} total={nextUp.totalLessons} />
                  </div>
                  <Link
                    to={`/activities/${nextUp.courseSlug}/play`}
                    className="mt-5 inline-block rounded-full bg-[#00c2ff] px-6 py-3 text-sm font-black uppercase tracking-wide text-white"
                  >
                    Continue now
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="mt-2 font-display text-3xl text-[#5b2b86]">You finished your current adventures</h2>
                  <p className="mt-2 text-sm text-[#5b5872]">Amazing work. Pick a new Bible activity to keep learning.</p>
                  <Link to="/activities" className="mt-5 inline-block rounded-full bg-[#ffd84d] px-6 py-3 text-xs font-black uppercase tracking-wide text-[#6b4b00]">
                    Start another activity
                  </Link>
                </>
              )}
            </div>

            <div className="rounded-[2rem] border-4 border-white/70 bg-white/70 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-[#ff6fb5]">Recent fun</p>
              <ul className="mt-3 space-y-3">
                {recentActivity.map((item, index) => (
                  <li key={`${item.title}-${index}`} className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-sm font-semibold text-[#5b2b86]">{item.title}</p>
                    <p className="mt-1 text-xs text-[#5b5872]">{item.meta}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {enrollments && enrollments.length > 0 && (
          <div className="mt-6 flex gap-8">
            <StatChip num={enrollments.length} label="Joined" />
            <StatChip num={activitiesCompleted} label="Completed" />
          </div>
        )}

        {error && <p className="mt-8 text-sm text-[#d0467a]">{error}</p>}

        {enrollments && enrollments.length === 0 && (
          <div className="mt-10 rounded-[2rem] border-4 border-dashed border-white bg-white/50 p-10 text-center">
            <p className="text-[#5b5872]">You haven&apos;t joined an activity yet.</p>
            <Link to="/activities" className="mt-4 inline-block rounded-full bg-[#00c2ff] px-6 py-3 text-sm font-black uppercase tracking-wide text-white">
              Browse activities
            </Link>
          </div>
        )}

        {enrollments && enrollments.length > 0 && (
          <div className="mt-10 space-y-4">
            {enrollments.map((item) => (
              <div key={item.enrollmentId} className="flex items-center justify-between rounded-[2rem] border-4 border-white/70 bg-white/70 p-6">
                <div>
                  <h3 className="font-display text-2xl text-[#5b2b86]">{item.courseTitle}</h3>
                  <div className="mt-2">
                    <ProgressPath completed={item.completedLessons} total={item.totalLessons} />
                  </div>
                </div>

                {item.status === 'COMPLETED' ? (
                  <span className="rounded-full bg-[#fff1a8] px-4 py-1.5 text-xs font-black uppercase tracking-wide text-[#8a4b00]">Completed</span>
                ) : (
                  <Link to={`/activities/${item.courseSlug}/play`} className="rounded-full bg-[#ff6fb5] px-5 py-2.5 text-xs font-black uppercase tracking-wide text-white">
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
      <div className="font-display text-3xl leading-none text-[#ff6fb5]">{num}</div>
      <div className="mt-1 text-[11px] font-black uppercase tracking-wide text-[#5b5872]">{label}</div>
    </div>
  )
}

function QuickActionCard({ title, description, ctaLabel, to }) {
  return (
    <div className="rounded-[2rem] border-4 border-white/70 bg-white/70 p-5">
      <h2 className="font-display text-2xl text-[#5b2b86]">{title}</h2>
      <p className="mt-2 text-sm text-[#5b5872]">{description}</p>
      <Link to={to} className="mt-4 inline-block rounded-full bg-[#ffd84d] px-4 py-2 text-xs font-black uppercase tracking-wide text-[#6b4b00]">
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
