import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/client'
import ProgressPath from '../components/ProgressPath'
import ThemedPage from '../components/ThemedPage'

const GAME_TEMPLATES = [
  {
    title: 'Memory verse puzzle',
    prompt: 'Finish the verse: "The battle is the ___."',
    answer: 'Lord',
  },
  {
    title: 'Brave choice quiz',
    prompt: 'Who trusted God when facing Goliath?',
    answer: 'David',
  },
]

export default function ActivityPlayer() {
  const { slug } = useParams()
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [activeLesson, setActiveLesson] = useState(null)
  const [progressByLesson, setProgressByLesson] = useState({})
  const [guess, setGuess] = useState('')
  const [guessFeedback, setGuessFeedback] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get(`/api/courses/${slug}`, { auth: false })
      .then((c) => {
        setCourse(c)
        return api.get(`/api/courses/${c.id}/modules`, { auth: false })
      })
      .then((mods) => {
        setModules(mods)
        const firstLesson = mods.find((module) => module.lessons.length > 0)?.lessons[0]
        if (firstLesson) setActiveLesson(firstLesson)
      })
      .catch((err) => setError(err.message))
  }, [slug])

  const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0)
  const completedCount = Object.values(progressByLesson).filter(Boolean).length
  const game = GAME_TEMPLATES[(activeLesson?.orderIndex || 0) % GAME_TEMPLATES.length]

  const markComplete = useCallback((lessonId) => {
    api
      .put(`/api/lessons/${lessonId}/progress`, { watchTimeSeconds: 0, markComplete: true })
      .then(() => setProgressByLesson((prev) => ({ ...prev, [lessonId]: true })))
      .catch(() => {})
  }, [])

  function submitGuess(e) {
    e.preventDefault()
    if (guess.trim().toLowerCase() === game.answer.toLowerCase()) {
      setGuessFeedback('Amazing job! You got it right.')
      if (activeLesson) {
        markComplete(activeLesson.id)
      }
      return
    }
    setGuessFeedback('Nice try! Read the story clue and try again.')
  }

  if (error) {
    return (
      <ThemedPage variant="player">
        <p className="mx-auto max-w-3xl px-6 py-20 text-sm text-[#d0467a]">{error}</p>
      </ThemedPage>
    )
  }

  if (!course) {
    return (
      <ThemedPage variant="player">
        <p className="mx-auto max-w-3xl px-6 py-20 text-sm text-[#5b5872]">Loading…</p>
      </ThemedPage>
    )
  }

  return (
    <ThemedPage variant="player">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff6fb5]">{course.title}</p>
        <div className="mt-3">
          <ProgressPath completed={completedCount} total={totalLessons} size="sm" />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {activeLesson ? (
              <>
                <div className="rounded-[2rem] border-4 border-white/70 bg-white/70 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
                  <h2 className="font-display text-4xl text-[#5b2b86]">{activeLesson.title}</h2>
                  <p className="mt-3 text-[#5b5872]">
                    God helps us be brave, kind, and full of faith. Read the story clue below, then play the mini game.
                  </p>

                  <div className="mt-6 rounded-[1.5rem] bg-[linear-gradient(180deg,#76e4ff_0%,#ffd6ea_55%,#fff1a8_100%)] p-6">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a4b00]">Story clue</p>
                    <p className="mt-3 text-lg font-semibold text-[#5b2b86]">
                      David trusted God more than he feared the giant. He knew the Lord would help him.
                    </p>
                  </div>
                </div>

                <div className="rounded-[2rem] border-4 border-white/70 bg-white/70 p-6">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00a8b5]">{game.title}</p>
                  <h3 className="mt-2 font-display text-3xl text-[#5b2b86]">{game.prompt}</h3>

                  <form onSubmit={submitGuess} className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <input
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      className="w-full rounded-full border-4 border-white bg-white px-5 py-3 text-sm text-[#5b2b86] outline-none"
                      placeholder="Type your answer"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-[#00c2ff] px-6 py-3 text-sm font-black uppercase tracking-wide text-white"
                    >
                      Check answer
                    </button>
                  </form>

                  {guessFeedback && <p className="mt-4 text-sm font-semibold text-[#5b5872]">{guessFeedback}</p>}

                  <button
                    onClick={() => markComplete(activeLesson.id)}
                    disabled={!!progressByLesson[activeLesson.id]}
                    className="mt-6 rounded-full bg-[#ffd84d] px-5 py-3 text-xs font-black uppercase tracking-wide text-[#6b4b00] disabled:opacity-50"
                  >
                    {progressByLesson[activeLesson.id] ? 'Activity complete' : 'Mark this activity complete'}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-[#5b5872]">This activity pack doesn&apos;t have any game steps yet.</p>
            )}
          </div>

          <aside className="rounded-[2rem] border-4 border-white/70 bg-white/70 p-5">
            <h3 className="font-display text-3xl text-[#5b2b86]">Adventure map</h3>
            <div className="mt-5 space-y-5">
              {modules.map((module, index) => (
                <div key={module.id}>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ff6fb5]">
                    Step {String(index + 1).padStart(2, '0')} · {module.title}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {module.lessons.map((lesson) => {
                      const isActive = activeLesson?.id === lesson.id
                      const isDone = !!progressByLesson[lesson.id]
                      return (
                        <li key={lesson.id}>
                          <button
                            onClick={() => {
                              setActiveLesson(lesson)
                              setGuess('')
                              setGuessFeedback('')
                            }}
                            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm ${
                              isActive ? 'bg-[#00c2ff] text-white' : 'bg-white text-[#5b5872]'
                            }`}
                          >
                            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${isDone ? 'bg-[#ffd84d] text-[#6b4b00]' : 'bg-[#ffd6ea] text-[#b33e79]'}`}>
                              {isDone ? '✓' : '★'}
                            </span>
                            {lesson.title}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </ThemedPage>
  )
}
