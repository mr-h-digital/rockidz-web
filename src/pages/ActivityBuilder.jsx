import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/client'
import FormField from '../components/FormField'
import ThemedPage from '../components/ThemedPage'

export default function ActivityBuilder() {
  const { slug } = useParams()
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [roster, setRoster] = useState(null)
  const [pageError, setPageError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [actionSuccess, setActionSuccess] = useState(null)
  const [newModuleTitle, setNewModuleTitle] = useState('')
  const [addingModule, setAddingModule] = useState(false)

  useEffect(() => {
    if (!actionSuccess) return
    const timer = setTimeout(() => setActionSuccess(null), 3000)
    return () => clearTimeout(timer)
  }, [actionSuccess])

  function loadCourse() {
    api
      .get(`/api/courses/${slug}`, { auth: false })
      .then((loadedCourse) => {
        setPageError(null)
        setCourse(loadedCourse)
        return api.get(`/api/courses/${loadedCourse.id}/modules`)
      })
      .then(setModules)
      .catch((err) => setPageError(err.message))
  }

  useEffect(loadCourse, [slug])

  useEffect(() => {
    if (course) {
      api.get(`/api/courses/${course.id}/roster`).then(setRoster).catch(() => {})
    }
  }, [course])

  async function handleAddModule(e) {
    e.preventDefault()
    const title = newModuleTitle.trim()
    if (!title) {
      setActionSuccess(null)
      setActionError('Please enter a story step title.')
      return
    }

    setActionError(null)
    setActionSuccess(null)
    setAddingModule(true)
    try {
      await api.post(`/api/courses/${course.id}/modules`, { title })
      setNewModuleTitle('')
      setActionSuccess('Story step added successfully.')
      loadCourse()
    } catch (err) {
      setActionSuccess(null)
      setActionError(err.message)
    } finally {
      setAddingModule(false)
    }
  }

  async function handleDeleteModule(moduleId) {
    try {
      setActionError(null)
      setActionSuccess(null)
      await api.del(`/api/courses/${course.id}/modules/${moduleId}`)
      setActionSuccess('Story step removed successfully.')
      loadCourse()
    } catch (err) {
      setActionSuccess(null)
      setActionError(err.message)
    }
  }

  async function handlePublish() {
    try {
      setActionError(null)
      setActionSuccess(null)
      const updated = await api.patch(`/api/courses/${course.id}/publish`)
      setCourse(updated)
      setActionSuccess('Activity pack published successfully.')
    } catch (err) {
      setActionSuccess(null)
      setActionError(err.message)
    }
  }

  if (pageError) {
    return (
      <ThemedPage variant="builder">
        <p className="mx-auto max-w-3xl px-6 py-20 text-sm text-[#d0467a]">{pageError}</p>
      </ThemedPage>
    )
  }

  if (!course) {
    return (
      <ThemedPage variant="builder">
        <p className="mx-auto max-w-3xl px-6 py-20 text-sm text-[#5b5872]">Loading…</p>
      </ThemedPage>
    )
  }

  return (
    <ThemedPage variant="builder">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link to="/teach" className="text-xs font-black uppercase tracking-wide text-[#5b5872] hover:text-[#00a8b5]">
          ← Your activity packs
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl text-[#5b2b86]">{course.title}</h1>
            <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${course.status === 'PUBLISHED' ? 'bg-[#dff7ff] text-[#007e8c]' : 'bg-[#fff1a8] text-[#8a4b00]'}`}>
              {course.status}
            </span>
          </div>
          {course.status === 'DRAFT' && (
            <button onClick={handlePublish} className="rounded-full bg-[#ff6fb5] px-6 py-3 text-sm font-black uppercase tracking-wide text-white">
              Publish activity
            </button>
          )}
        </div>

        <div className="mt-10 space-y-5">
          {modules.map((module, index) => (
            <ModuleEditor key={module.id} module={module} index={index} onChanged={loadCourse} onDelete={() => handleDeleteModule(module.id)} />
          ))}
        </div>

        <form onSubmit={handleAddModule} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            placeholder="New story step title"
            className="flex-1 rounded-full border-4 border-white bg-white px-4 py-3 text-sm text-[#5b2b86] outline-none"
          />
          <button type="submit" disabled={addingModule} className="w-full rounded-full bg-[#00c2ff] px-5 py-3 text-xs font-black uppercase tracking-wide text-white disabled:opacity-50 sm:w-auto">
            {addingModule ? 'Adding…' : 'Add story step'}
          </button>
        </form>
        {actionSuccess && <p className="mt-3 text-sm text-[#007e8c]">{actionSuccess}</p>}
        {actionError && <p className="mt-3 text-sm text-[#d0467a]">{actionError}</p>}

        <div className="mt-14 border-t border-white/70 pt-8">
          <h2 className="font-display text-3xl text-[#5b2b86]">Kids joined</h2>
          {!roster && <p className="mt-4 text-sm text-[#5b5872]">Loading…</p>}
          {roster && roster.length === 0 && <p className="mt-4 text-sm text-[#5b5872]">No children have joined this activity yet.</p>}
          {roster && roster.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-[560px] w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/70 text-xs font-black uppercase tracking-wide text-[#5b5872]">
                    <th className="py-2 font-black">Child</th>
                    <th className="py-2 font-black">Status</th>
                    <th className="py-2 font-black">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((entry) => (
                    <tr key={entry.userId} className="border-b border-white/60">
                      <td className="py-3">
                        <div className="text-[#5b2b86]">{entry.displayName}</div>
                        <div className="text-xs text-[#5b5872]">{entry.email}</div>
                      </td>
                      <td className="py-3 text-[#5b5872]">{entry.enrollmentStatus}</td>
                      <td className="py-3 text-xs font-bold text-[#00a8b5]">
                        {entry.completedLessons}/{entry.totalLessons}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ThemedPage>
  )
}

function ModuleEditor({ module, index, onChanged, onDelete }) {
  const [showAddLesson, setShowAddLesson] = useState(false)
  const [lessonForm, setLessonForm] = useState({ title: '', videoRef: '', durationSeconds: '' })
  const [editingModule, setEditingModule] = useState(false)
  const [moduleTitle, setModuleTitle] = useState(module.title)
  const [editingLessonId, setEditingLessonId] = useState(null)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState(null)

  async function handleUpdateModule(e) {
    e.preventDefault()
    try {
      setError(null)
      await api.patch(`/api/courses/${module.courseId}/modules/${module.id}`, { title: moduleTitle })
      setEditingModule(false)
      onChanged()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleAddLesson(e) {
    e.preventDefault()
    setAdding(true)
    setError(null)
    try {
      await api.post(`/api/modules/${module.id}/lessons`, {
        title: lessonForm.title,
        videoProvider: 'YOUTUBE',
        videoRef: lessonForm.videoRef,
        durationSeconds: lessonForm.durationSeconds ? Number(lessonForm.durationSeconds) : null,
      })
      setLessonForm({ title: '', videoRef: '', durationSeconds: '' })
      setShowAddLesson(false)
      onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setAdding(false)
    }
  }

  async function handleDeleteLesson(lessonId) {
    try {
      await api.del(`/api/modules/${module.id}/lessons/${lessonId}`)
      onChanged()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleUpdateLesson(e, lessonId) {
    e.preventDefault()
    try {
      setError(null)
      await api.patch(`/api/modules/${module.id}/lessons/${lessonId}`, {
        title: lessonForm.title,
        videoProvider: 'YOUTUBE',
        videoRef: lessonForm.videoRef,
        durationSeconds: lessonForm.durationSeconds ? Number(lessonForm.durationSeconds) : null,
      })
      setEditingLessonId(null)
      setLessonForm({ title: '', videoRef: '', durationSeconds: '' })
      onChanged()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="rounded-[2rem] border-4 border-white/70 bg-white/70 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#00a8b5]">Step {String(index + 1).padStart(2, '0')}</p>
          {editingModule ? (
            <form onSubmit={handleUpdateModule} className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                className="flex-1 rounded-full border-4 border-white bg-white px-4 py-2 text-sm text-[#5b2b86] outline-none"
              />
              <button type="submit" className="rounded-full bg-[#00c2ff] px-4 py-2 text-xs font-black uppercase tracking-wide text-white">
                Save
              </button>
            </form>
          ) : (
            <h3 className="mt-1 font-display text-2xl text-[#5b2b86]">{module.title}</h3>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingModule((value) => !value)
              setModuleTitle(module.title)
            }}
            className="text-xs font-black uppercase tracking-wide text-[#8a4b00] hover:underline"
          >
            {editingModule ? 'Cancel' : 'Edit'}
          </button>
          <button onClick={onDelete} className="text-xs font-black uppercase tracking-wide text-[#d0467a] hover:underline">
            Delete
          </button>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {module.lessons.map((lesson) => (
          <li key={lesson.id} className="flex flex-col gap-2 rounded-2xl bg-white px-3.5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            {editingLessonId === lesson.id ? (
              <form onSubmit={(e) => handleUpdateLesson(e, lesson.id)} className="flex w-full flex-col gap-2">
                <input
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm((current) => ({ ...current, title: e.target.value }))}
                  className="rounded-full border-4 border-[#f3ecff] bg-white px-4 py-2 text-sm text-[#5b2b86] outline-none"
                />
                <input
                  value={lessonForm.videoRef}
                  onChange={(e) => setLessonForm((current) => ({ ...current, videoRef: e.target.value }))}
                  placeholder="YouTube video ID"
                  className="rounded-full border-4 border-[#f3ecff] bg-white px-4 py-2 text-sm text-[#5b2b86] outline-none"
                />
                <input
                  type="number"
                  value={lessonForm.durationSeconds}
                  onChange={(e) => setLessonForm((current) => ({ ...current, durationSeconds: e.target.value }))}
                  placeholder="Duration in seconds"
                  className="rounded-full border-4 border-[#f3ecff] bg-white px-4 py-2 text-sm text-[#5b2b86] outline-none"
                />
                <div className="flex items-center gap-3">
                  <button type="submit" className="text-xs font-black uppercase tracking-wide text-[#00a8b5] hover:underline">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLessonId(null)
                      setLessonForm({ title: '', videoRef: '', durationSeconds: '' })
                    }}
                    className="text-xs font-black uppercase tracking-wide text-[#8a4b00] hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <span className="text-[#5b5872]">{lesson.title}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditingLessonId(lesson.id)
                      setLessonForm({
                        title: lesson.title || '',
                        videoRef: lesson.videoRef || '',
                        durationSeconds: lesson.durationSeconds?.toString() || '',
                      })
                    }}
                    className="text-xs font-black uppercase tracking-wide text-[#8a4b00] hover:underline"
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteLesson(lesson.id)} className="text-xs font-black uppercase tracking-wide text-[#d0467a] hover:underline">
                    Remove
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
        {module.lessons.length === 0 && <p className="text-sm text-[#5b5872]">No activity steps yet.</p>}
      </ul>

      {showAddLesson ? (
        <form onSubmit={handleAddLesson} className="mt-4 space-y-3 rounded-[1.5rem] bg-white p-4">
          <FormField label="Activity title" value={lessonForm.title} onChange={(value) => setLessonForm((current) => ({ ...current, title: value }))} required />
          <FormField
            label="YouTube video ID"
            value={lessonForm.videoRef}
            onChange={(value) => setLessonForm((current) => ({ ...current, videoRef: value }))}
            hint="Optional for now, but supported for story videos"
            required
          />
          <FormField label="Duration (seconds, optional)" type="number" value={lessonForm.durationSeconds} onChange={(value) => setLessonForm((current) => ({ ...current, durationSeconds: value }))} />
          {error && <p className="text-sm text-[#d0467a]">{error}</p>}
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <button type="submit" disabled={adding} className="rounded-full bg-[#00c2ff] px-5 py-2 text-xs font-black uppercase tracking-wide text-white disabled:opacity-60">
              {adding ? 'Adding…' : 'Add activity'}
            </button>
            <button type="button" onClick={() => setShowAddLesson(false)} className="rounded-full bg-[#fff1a8] px-5 py-2 text-xs font-black uppercase tracking-wide text-[#8a4b00]">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowAddLesson(true)} className="mt-4 text-xs font-black uppercase tracking-wide text-[#00a8b5] hover:underline">
          + Add activity
        </button>
      )}
    </div>
  )
}
