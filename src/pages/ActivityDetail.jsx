import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import ThemedPage from '../components/ThemedPage'

const storyPosterUrl = `${import.meta.env.BASE_URL}david-and-goliath-story.webp`
const lessonTalkUrl = `${import.meta.env.BASE_URL}david-and-goliath-lesson-talk.webp`

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
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-[2rem] border-4 border-white/70 bg-white/65 p-7 shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-md">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff6fb5]">Led by {course.createdByName}</p>
          <h1 className="mt-2 font-display text-5xl text-[#5b2b86]">{course.title}</h1>
          <p className="mt-4 text-[#5b5872]">{course.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wide text-[#8f7f9d]">
            <span>{modules.length} story steps</span>
            <span>{totalLessons} activities</span>
            <span>{course.enrolledCount} kids joined</span>
          </div>

          <div className="mt-8 rounded-[1.5rem] bg-[#fff5b8] p-5">
            <h2 className="font-display text-3xl text-[#8a4b00]">What kids will do</h2>
            <p className="mt-2 text-sm text-[#6b5a2c]">
              Read the Bible story, enjoy playful activities, learn a memory verse, and finish with a cheerful reward.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <img src={storyPosterUrl} alt="David and Goliath illustrated story page" className="w-full rounded-[1.5rem] border-4 border-white/70 object-cover shadow-lg" />
            <img src={lessonTalkUrl} alt="David and Goliath lesson discussion page" className="w-full rounded-[1.5rem] border-4 border-white/70 object-cover shadow-lg" />
          </div>

          <div className="mt-8">
            {enrolled ? (
              <button
                onClick={() => navigate(`/activities/${slug}/play`)}
                className="rounded-full bg-[#00c2ff] px-7 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_14px_28px_rgba(0,194,255,0.28)] transition-transform hover:-translate-y-0.5"
              >
                You&apos;re in — start playing
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="rounded-full bg-[#ff6fb5] px-7 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[0_14px_28px_rgba(255,111,181,0.3)] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {enrolling ? 'Joining…' : 'Join this activity'}
              </button>
            )}
            {enrollError && <p className="mt-3 text-sm text-[#d0467a]">{enrollError}</p>}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-3xl text-[#5b2b86]">Adventure path</h2>
          <ol className="mt-6 space-y-5">
            {modules.map((module, index) => (
              <li key={module.id} className="rounded-[1.75rem] border-4 border-white/70 bg-white/65 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00a8b5]">
                  Step {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-1 font-display text-2xl text-[#5b2b86]">{module.title}</h3>
                <ul className="mt-3 space-y-2">
                  {module.lessons.map((lesson) => (
                    <li key={lesson.id} className="flex items-center gap-3 rounded-xl bg-white/70 px-4 py-3 text-sm text-[#5b5872]">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ffd84d] text-[#8a4b00]">⭐</span>
                      {lesson.title}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          {modules.length === 0 && <p className="mt-4 text-sm text-[#5b5872]">This activity pack is being prepared right now.</p>}
        </div>
      </div>
    </ThemedPage>
  )
}
