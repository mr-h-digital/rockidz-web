import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import ThemedPage from '../components/ThemedPage'

const storyPosterUrl = `${import.meta.env.BASE_URL}david-and-goliath-story.webp`
const lessonTalkUrl = `${import.meta.env.BASE_URL}david-and-goliath-lesson-talk.webp`

function formatContentTypeLabel(contentType) {
  return typeof contentType === 'string' && contentType.length > 0 ? contentType.replaceAll('_', ' ') : 'STORY'
}

export default function ActivityDetail() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [error, setError] = useState(null)
  const [enrolling, setEnrolling] = useState(false)
  const [enrollError, setEnrollError] = useState(null)
  const [enrolled, setEnrolled] = useState(false)

  useEffect(() => {
    api
      .get(`/api/courses/${slug}`, { auth: false })
      .then((c) => {
        setCourse(c)
        return api.get(`/api/courses/${c.id}/modules`, { auth: false })
      })
      .then(setModules)
      .catch((err) => setError(err.message))
  }, [slug])

  useEffect(() => {
    if (course && user && searchParams.get('action') === 'enroll' && !enrolled) {
      handleEnroll()
    }
  }, [course, user])

  async function handleEnroll() {
    if (!user) {
      sessionStorage.setItem('rm_redirect_after_auth', `/activities/${slug}?action=enroll`)
      navigate('/sign-in')
      return
    }

    setEnrolling(true)
    setEnrollError(null)
    try {
      await api.post(`/api/enrollments/${slug}`)
      setEnrolled(true)
    } catch (err) {
      if (err.message.toLowerCase().includes('already enrolled')) {
        setEnrolled(true)
      } else {
        setEnrollError(err.message)
      }
    } finally {
      setEnrolling(false)
    }
  }

  if (error) {
    return (
      <ThemedPage variant="detail">
        <p className="mx-auto max-w-3xl px-6 py-20 text-sm text-[#d0467a]">{error}</p>
      </ThemedPage>
    )
  }

  if (!course) {
    return (
      <ThemedPage variant="detail">
        <p className="mx-auto max-w-3xl px-6 py-20 text-sm text-[#5b5872]">Loading…</p>
      </ThemedPage>
    )
  }

  const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0)

  return (
    <ThemedPage variant="detail">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-[2rem] border border-white/18 bg-[linear-gradient(180deg,rgba(23,12,73,0.86)_0%,rgba(10,42,85,0.8)_100%)] p-5 text-white shadow-[0_20px_52px_rgba(4,4,28,0.28)] backdrop-blur-xl sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffd233]">Scripture constellation · Led by {course.createdByName}</p>
          <h1 className="mt-2 text-4xl font-display text-white sm:text-5xl">{course.title}</h1>
          <p className="mt-4 text-white/74">{course.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wide text-white/58">
            <span>{modules.length} story steps</span>
            <span>{totalLessons} activities</span>
            <span>{course.enrolledCount} kids joined</span>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-white/16 bg-white/10 p-5 backdrop-blur-sm">
            <h2 className="font-display text-3xl text-[#ffd233]">What kids will do</h2>
            <p className="mt-2 text-sm text-white/76">
              Read the Bible story, enjoy playful activities, learn a memory verse, and finish with a cheerful reward.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:gap-5 lg:grid-cols-2">
            <img src={storyPosterUrl} alt="David and Goliath illustrated story page" className="w-full rounded-[1.5rem] border-4 border-white/70 object-cover shadow-lg" />
            <img src={lessonTalkUrl} alt="David and Goliath lesson discussion page" className="w-full rounded-[1.5rem] border-4 border-white/70 object-cover shadow-lg" />
          </div>

          <div className="mt-8">
            {enrolled ? (
              <button
                onClick={() => navigate(`/activities/${slug}/play`)}
                className="w-full rounded-full bg-[#00c2ff] px-7 py-4 text-center text-sm font-black uppercase tracking-wide text-white shadow-[0_16px_30px_rgba(0,194,255,0.32)] transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                You&apos;re in — start playing
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full rounded-full bg-[#ff6fb5] px-7 py-4 text-center text-sm font-black uppercase tracking-wide text-white shadow-[0_16px_30px_rgba(255,111,181,0.32)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 sm:w-auto"
              >
                {enrolling ? 'Joining…' : 'Join this activity'}
              </button>
            )}
            {enrollError && <p className="mt-3 text-sm text-[#ff8bc3]">{enrollError}</p>}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-3xl text-white">Adventure path</h2>
          <ol className="mt-6 space-y-5">
            {modules.map((module, index) => (
            <li key={module.id} className="rounded-[1.75rem] border border-white/18 bg-[linear-gradient(180deg,rgba(24,12,76,0.82)_0%,rgba(9,42,84,0.72)_100%)] p-5 text-white shadow-[0_16px_36px_rgba(4,4,28,0.18)]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5fe7ff]">
                  Step {String(index + 1).padStart(2, '0')}
                </p>
              <h3 className="mt-1 font-display text-2xl text-white">{module.title}</h3>
                <ul className="mt-3 space-y-2">
                  {module.lessons.map((lesson) => (
                  <li key={lesson.id} className="flex flex-col gap-2 rounded-xl border border-white/12 bg-white/10 px-4 py-3 text-sm text-white/76 sm:flex-row sm:items-center">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ffd84d] text-[#8a4b00]">⭐</span>
                      <span className="sm:flex-1">{lesson.title}</span>
                    <span className="text-[11px] font-black uppercase tracking-wide text-white/56 sm:ml-auto">
                        {formatContentTypeLabel(lesson.contentType)}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          {modules.length === 0 && <p className="mt-4 text-sm text-white/70">This activity pack is being prepared right now.</p>}
        </div>
      </div>
    </ThemedPage>
  )
}
