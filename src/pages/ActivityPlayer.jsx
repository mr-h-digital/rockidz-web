import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { api, resolveApiUrl } from '../api/client'
import ProgressPath from '../components/ProgressPath'
import ThemedPage from '../components/ThemedPage'

const storyPosterUrl = `${import.meta.env.BASE_URL}david-and-goliath-story.webp`
const colouringPageUrl = `${import.meta.env.BASE_URL}david-colour-in-page.webp`

function formatContentTypeLabel(contentType) {
  return typeof contentType === 'string' && contentType.length > 0 ? contentType.replaceAll('_', ' ') : 'STORY'
}

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
  const markComplete = useCallback((lessonId) => {
    api
      .put(`/api/lessons/${lessonId}/progress`, { watchTimeSeconds: 0, markComplete: true })
      .then(() => setProgressByLesson((prev) => ({ ...prev, [lessonId]: true })))
      .catch(() => {})
  }, [])

  function submitGuess(e) {
    e.preventDefault()
    if (!activeLesson) return
    if (guess.trim().toLowerCase() === (activeLesson.gameAnswer || '').trim().toLowerCase()) {
      setGuessFeedback(activeLesson.successMessage || 'Amazing job! You got it right.')
      if (activeLesson) {
        markComplete(activeLesson.id)
      }
      return
    }
    setGuessFeedback(activeLesson.retryMessage || 'Nice try! Read the story clue and try again.')
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
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff6fb5]">{course.title}</p>
        <div className="mt-3">
          <ProgressPath completed={completedCount} total={totalLessons} size="sm" />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {activeLesson ? (
              <>
                <div className="rounded-[2rem] border-4 border-white/70 bg-white/70 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.08)] sm:p-6">
                  <h2 className="font-display text-3xl text-[#5b2b86] sm:text-4xl">{activeLesson.title}</h2>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-[#ff6fb5]">
                    {formatContentTypeLabel(activeLesson.contentType)}
                  </p>
                  <LessonContent lesson={activeLesson} />
                </div>

                <div className="rounded-[2rem] border-4 border-white/70 bg-white/70 p-5 sm:p-6">
                  {activeLesson.contentType === 'QUESTIONS' ? (
                    <>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00a8b5]">Discussion time</p>
                      <QuestionList questions={activeLesson.questions} />
                    </>
                  ) : activeLesson.contentType === 'GAME' ? (
                    <GamePanel lesson={activeLesson} guess={guess} setGuess={setGuess} guessFeedback={guessFeedback} onSubmit={submitGuess} />
                  ) : activeLesson.contentType === 'ACTIVITY' ? (
                    <ActivityPanel lesson={activeLesson} />
                  ) : activeLesson.contentType === 'DOWNLOAD' ? (
                    <DownloadPanel lesson={activeLesson} />
                  ) : activeLesson.contentType === 'COLOURING_PAGE' ? (
                    <>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00a8b5]">Colouring page</p>
                      <img
                        src={activeLesson.assetUrl ? resolveApiUrl(activeLesson.assetUrl) : colouringPageUrl}
                        alt={activeLesson.title}
                        className="mt-4 w-full rounded-[1.25rem] border-4 border-[#f3ecff] object-cover"
                      />
                      <div className="mt-4 flex flex-wrap gap-3">
                        {activeLesson.assetUrl && (
                          <a href={resolveApiUrl(activeLesson.assetUrl)} target="_blank" rel="noreferrer" className="w-full rounded-full bg-[#00c2ff] px-5 py-3 text-center text-xs font-black uppercase tracking-wide text-white sm:w-auto">
                            Open to colour
                          </a>
                        )}
                        {activeLesson.downloadUrl && (
                          <a href={resolveApiUrl(activeLesson.downloadUrl)} target="_blank" rel="noreferrer" className="w-full rounded-full bg-[#ffd84d] px-5 py-3 text-center text-xs font-black uppercase tracking-wide text-[#6b4b00] sm:w-auto">
                            Download printable
                          </a>
                        )}
                      </div>
                    </>
                  ) : activeLesson.contentType === 'VIDEO' ? (
                    <>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00a8b5]">Video activity</p>
                      {activeLesson.videoRef ? (
                        <div className="mt-4 aspect-video overflow-hidden rounded-[1.5rem] border-4 border-white/70">
                          <iframe
                            title={activeLesson.title}
                            src={`https://www.youtube.com/embed/${activeLesson.videoRef}`}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-[#5b5872]">No video has been added for this step yet.</p>
                      )}
                    </>
                  ) : (
                    <StoryPanel lesson={activeLesson} />
                  )}

                  <button
                    onClick={() => markComplete(activeLesson.id)}
                    disabled={!!progressByLesson[activeLesson.id]}
                    className="mt-6 w-full rounded-full bg-[#ffd84d] px-5 py-3 text-xs font-black uppercase tracking-wide text-[#6b4b00] disabled:opacity-50 sm:w-auto"
                  >
                    {progressByLesson[activeLesson.id] ? 'Activity complete' : 'Mark this activity complete'}
                  </button>

                  {activeLesson.downloadUrl && (
                    <div className="mt-6 rounded-[1.5rem] bg-white p-4">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6fb5]">Printable resource</p>
                      <a href={resolveApiUrl(activeLesson.downloadUrl)} target="_blank" rel="noreferrer" className="mt-3 inline-flex w-full justify-center rounded-full bg-[#ffd84d] px-5 py-3 text-xs font-black uppercase tracking-wide text-[#6b4b00] sm:w-auto">
                        Open resource
                      </a>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-[#5b5872]">This activity pack doesn&apos;t have any game steps yet.</p>
            )}
          </div>

          <aside className="rounded-[2rem] border-4 border-white/70 bg-white/70 p-5">
            <h3 className="font-display text-2xl text-[#5b2b86] sm:text-3xl">Adventure map</h3>
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
                            <div className="min-w-0 flex-1">
                              <div className="break-words">{lesson.title}</div>
                              <div className={`text-[10px] font-black uppercase tracking-wide ${isActive ? 'text-white/80' : 'text-[#8f7f9d]'}`}>
                                {formatContentTypeLabel(lesson.contentType)}
                              </div>
                            </div>
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

function LessonContent({ lesson }) {
  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <img
        src={lesson.assetUrl ? resolveApiUrl(lesson.assetUrl) : storyPosterUrl}
        alt={lesson.title}
        className="w-full rounded-[1.5rem] border-4 border-white/70 object-cover shadow-lg"
      />
      <div className="rounded-[1.5rem] bg-[linear-gradient(180deg,#76e4ff_0%,#ffd6ea_55%,#fff1a8_100%)] p-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a4b00]">Story clue</p>
        {lesson.content ? (
          <p className="mt-3 whitespace-pre-line text-lg font-semibold text-[#5b2b86]">{lesson.content}</p>
        ) : (
          <p className="mt-3 text-lg font-semibold text-[#5b2b86]">This step is ready for your story, context, or lesson notes.</p>
        )}
        {lesson.instructions && <p className="mt-4 whitespace-pre-line text-sm text-[#5b5872]">{lesson.instructions}</p>}
      </div>
    </div>
  )
}

function StoryPanel({ lesson }) {
  return (
    <>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00a8b5]">Story time</p>
      <p className="mt-3 whitespace-pre-line text-sm text-[#5b5872]">
        {lesson.instructions || lesson.content || 'Add story details or guidance to this step.'}
      </p>
    </>
  )
}

function QuestionList({ questions }) {
  const items = (questions || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

  if (items.length === 0) {
    return <p className="mt-4 text-sm text-[#5b5872]">No questions have been added for this step yet.</p>
  }

  return (
    <ul className="mt-4 space-y-3">
      {items.map((question) => (
        <li key={question} className="rounded-2xl bg-white px-4 py-3 text-sm text-[#5b5872]">
          {question}
        </li>
      ))}
    </ul>
  )
}

function GamePanel({ lesson, guess, setGuess, guessFeedback, onSubmit }) {
  const options = (lesson.gameOptions || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

  return (
    <>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00a8b5]">
        {lesson.gameType === 'FILL_IN_THE_BLANK' ? 'Fill in the blank' : 'Quiz game'}
      </p>
      <h3 className="mt-2 font-display text-3xl text-[#5b2b86]">{lesson.gamePrompt || 'Add a game prompt to this step.'}</h3>

      {lesson.gameType === 'QUIZ' && options.length > 0 && (
        <div className="mt-5 grid gap-3">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setGuess(option)}
              className={`rounded-2xl border-4 px-4 py-3 text-left text-sm font-semibold ${
                guess === option ? 'border-[#00c2ff] bg-[#dff7ff] text-[#007e8c]' : 'border-white bg-white text-[#5b5872]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className="w-full rounded-full border-4 border-white bg-white px-5 py-3 text-sm text-[#5b2b86] outline-none"
          placeholder={lesson.gameType === 'FILL_IN_THE_BLANK' ? 'Type the missing word' : 'Type or pick your answer'}
        />
        <button
          type="submit"
          className="rounded-full bg-[#00c2ff] px-6 py-3 text-sm font-black uppercase tracking-wide text-white"
        >
          Check answer
        </button>
      </form>

      {guessFeedback && <p className="mt-4 text-sm font-semibold text-[#5b5872]">{guessFeedback}</p>}
    </>
  )
}

function ActivityPanel({ lesson }) {
  return (
    <>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00a8b5]">Hands-on activity</p>
      <h3 className="mt-2 font-display text-3xl text-[#5b2b86]">{lesson.instructions || 'Try this activity together'}</h3>
      {lesson.content && <p className="mt-4 whitespace-pre-line text-sm text-[#5b5872]">{lesson.content}</p>}
      {lesson.assetUrl && (
        <img
          src={resolveApiUrl(lesson.assetUrl)}
          alt={lesson.title}
          className="mt-4 w-full rounded-[1.25rem] border-4 border-[#f3ecff] object-cover"
        />
      )}
    </>
  )
}

function DownloadPanel({ lesson }) {
  return (
    <>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00a8b5]">Printable download</p>
      <h3 className="mt-2 font-display text-3xl text-[#5b2b86]">{lesson.instructions || 'Open the printable resource'}</h3>
      {lesson.content && <p className="mt-4 whitespace-pre-line text-sm text-[#5b5872]">{lesson.content}</p>}
      {lesson.downloadUrl ? (
        <a href={resolveApiUrl(lesson.downloadUrl)} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-[#ffd84d] px-5 py-3 text-xs font-black uppercase tracking-wide text-[#6b4b00]">
          Download resource
        </a>
      ) : (
        <p className="mt-4 text-sm text-[#5b5872]">No download has been added for this step yet.</p>
      )}
    </>
  )
}
