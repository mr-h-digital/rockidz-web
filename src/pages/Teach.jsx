import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import FormField from '../components/FormField'
import ThemedPage from '../components/ThemedPage'

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function Teach() {
  const [courses, setCourses] = useState(null)
  const [error, setError] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ title: '', slug: '', description: '', thumbnailUrl: '' })
  const [editingCourseId, setEditingCourseId] = useState(null)
  const [slugTouched, setSlugTouched] = useState(false)
  const [creating, setCreating] = useState(false)
  const [savingCourseId, setSavingCourseId] = useState(null)

  function loadCourses() {
    api.get('/api/courses/mine').then(setCourses).catch((err) => setError(err.message))
  }

  useEffect(loadCourses, [])

  function handleTitleChange(title) {
    setForm((current) => ({ ...current, title, slug: slugTouched ? current.slug : slugify(title) }))
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError(null)
    setCreating(true)
    try {
      await api.post('/api/courses', form)
      setForm({ title: '', slug: '', description: '', thumbnailUrl: '' })
      setSlugTouched(false)
      setShowCreate(false)
      loadCourses()
    } catch (err) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  async function handlePublish(courseId) {
    try {
      await api.patch(`/api/courses/${courseId}/publish`)
      loadCourses()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleUpdateCourse(e) {
    e.preventDefault()
    if (!editingCourseId) return
    setError(null)
    setSavingCourseId(editingCourseId)
    try {
      await api.patch(`/api/courses/${editingCourseId}`, form)
      setForm({ title: '', slug: '', description: '', thumbnailUrl: '' })
      setSlugTouched(false)
      setEditingCourseId(null)
      setShowCreate(false)
      loadCourses()
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingCourseId(null)
    }
  }

  function beginEditCourse(course) {
    setEditingCourseId(course.id)
    setForm({
      title: course.title || '',
      slug: course.slug || '',
      description: course.description || '',
      thumbnailUrl: course.thumbnailUrl || '',
    })
    setSlugTouched(true)
    setShowCreate(true)
  }

  return (
    <ThemedPage variant="teach">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#00a8b5]">Leader hub</p>
            <h1 className="mt-2 font-display text-5xl text-[#5b2b86]">Your activity packs</h1>
          </div>
          <button
            onClick={() => {
              if (showCreate) {
                setShowCreate(false)
                setEditingCourseId(null)
                setForm({ title: '', slug: '', description: '', thumbnailUrl: '' })
                setSlugTouched(false)
                return
              }
              setShowCreate(true)
            }}
            className="whitespace-nowrap rounded-full bg-[#ff6fb5] px-5 py-3 text-xs font-black uppercase tracking-wide text-white"
          >
            {showCreate ? 'Cancel' : '+ New activity'}
          </button>
        </div>

        {error && <p className="mt-6 text-sm text-[#d0467a]">{error}</p>}

        {showCreate && (
          <form onSubmit={editingCourseId ? handleUpdateCourse : handleCreate} className="mt-8 space-y-4 rounded-[2rem] border-4 border-white/70 bg-white/70 p-6">
            <p className="text-xs font-black uppercase tracking-wide text-[#00a8b5]">
              {editingCourseId ? 'Edit activity' : 'Create activity'}
            </p>
            <FormField label="Activity title" value={form.title} onChange={handleTitleChange} required />
            <FormField
              label="Slug"
              value={form.slug}
              onChange={(value) => {
                setSlugTouched(true)
                setForm((current) => ({ ...current, slug: slugify(value) }))
              }}
              hint="Used in the activity URL"
              required
            />
            <label className="block">
              <span className="text-sm font-semibold text-[#5b2b86]">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                rows={3}
                className="mt-1.5 w-full rounded-2xl border-4 border-white bg-white px-4 py-3 text-sm text-[#5b2b86] outline-none"
              />
            </label>
            <FormField label="Thumbnail URL (optional)" value={form.thumbnailUrl} onChange={(value) => setForm((current) => ({ ...current, thumbnailUrl: value }))} />
            <button
              type="submit"
              disabled={creating || savingCourseId === editingCourseId}
              className="rounded-full bg-[#00c2ff] px-6 py-3 text-sm font-black uppercase tracking-wide text-white disabled:opacity-60"
            >
              {editingCourseId
                ? savingCourseId === editingCourseId
                  ? 'Saving…'
                  : 'Save activity'
                : creating
                  ? 'Creating…'
                  : 'Create activity draft'}
            </button>
          </form>
        )}

        <div className="mt-8 space-y-3">
          {courses?.map((course) => (
            <div key={course.id} className="flex items-center justify-between rounded-[2rem] border-4 border-white/70 bg-white/70 p-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display text-xl text-[#5b2b86]">{course.title}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${course.status === 'PUBLISHED' ? 'bg-[#dff7ff] text-[#007e8c]' : 'bg-[#fff1a8] text-[#8a4b00]'}`}>
                    {course.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#5b5872]">{course.enrolledCount} kids joined</p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => beginEditCourse(course)}
                  className="rounded-full bg-[#fff1a8] px-4 py-2 text-xs font-black uppercase tracking-wide text-[#8a4b00]"
                >
                  Edit
                </button>
                {course.status === 'DRAFT' && (
                  <button onClick={() => handlePublish(course.id)} className="rounded-full bg-[#ffd84d] px-4 py-2 text-xs font-black uppercase tracking-wide text-[#6b4b00]">
                    Publish
                  </button>
                )}
                <Link to={`/teach/${course.slug}`} className="rounded-full bg-[#00c2ff] px-4 py-2 text-xs font-black uppercase tracking-wide text-white">
                  Manage
                </Link>
              </div>
            </div>
          ))}

          {courses && courses.length === 0 && !showCreate && <p className="text-sm text-[#5b5872]">You haven&apos;t created any Rockidz activities yet.</p>}
        </div>
      </div>
    </ThemedPage>
  )
}
