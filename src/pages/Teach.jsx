import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, resolveApiUrl } from '../api/client'
import FormField from '../components/FormField'
import ThemedPage from '../components/ThemedPage'
import { formatFileSize, optimizeImageForUpload } from '../lib/imageUpload'

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function buildCoursePayload(form) {
  const thumbnailUrl = form.thumbnailUrl.trim()
  const persistedThumbnailUrl =
    thumbnailUrl && /^\/api\/courses\/\d+\/thumbnail$/i.test(thumbnailUrl) ? '' : thumbnailUrl

  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    description: form.description.trim(),
    thumbnailUrl: persistedThumbnailUrl || null,
  }
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
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0)
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState(null)
  const isSubmitting = creating || (editingCourseId != null && savingCourseId === editingCourseId)

  function loadCourses() {
    return api.get('/api/courses/mine').then((loadedCourses) => {
      setCourses(loadedCourses)
      return loadedCourses
    }).catch((err) => {
      setError(err.message)
      throw err
    })
  }

  useEffect(() => {
    loadCourses()
  }, [])

  function handleTitleChange(title) {
    setForm((current) => ({ ...current, title, slug: slugTouched ? current.slug : slugify(title) }))
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError(null)
    setCreating(true)
    try {
      const createdCourse = await api.post('/api/courses', buildCoursePayload(form))
      if (selectedThumbnailFile) {
        setUploadingThumbnail(true)
        setThumbnailUploadProgress(0)
        await api.upload(`/api/courses/${createdCourse.id}/thumbnail`, selectedThumbnailFile, 'file', {
          onProgress: setThumbnailUploadProgress,
        })
        setUploadingThumbnail(false)
        setThumbnailUploadProgress(100)
      }
      setForm({ title: '', slug: '', description: '', thumbnailUrl: '' })
      setSlugTouched(false)
      setShowCreate(false)
      setSelectedThumbnailFile(null)
      loadCourses()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploadingThumbnail(false)
      setCreating(false)
      setThumbnailUploadProgress(0)
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
      await api.patch(`/api/courses/${editingCourseId}`, buildCoursePayload(form))
      if (selectedThumbnailFile) {
        setUploadingThumbnail(true)
        setThumbnailUploadProgress(0)
        await api.upload(`/api/courses/${editingCourseId}/thumbnail`, selectedThumbnailFile, 'file', {
          onProgress: setThumbnailUploadProgress,
        })
        setUploadingThumbnail(false)
        setThumbnailUploadProgress(100)
      }
      setForm({ title: '', slug: '', description: '', thumbnailUrl: '' })
      setSlugTouched(false)
      setEditingCourseId(null)
      setShowCreate(false)
      setSelectedThumbnailFile(null)
      loadCourses()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploadingThumbnail(false)
      setSavingCourseId(null)
      setThumbnailUploadProgress(0)
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

  async function prepareThumbnailFile(file) {
    if (!file) return null

    const optimizedFile = await optimizeImageForUpload(file)
    setSelectedThumbnailFile(optimizedFile)
    return optimizedFile
  }

  async function handleThumbnailUpload(file) {
    if (!file) return
    if (!editingCourseId) {
      setError('Create the activity draft first, then upload its cover image.')
      return
    }

    setError(null)
    setUploadingThumbnail(true)
    setThumbnailUploadProgress(0)
    try {
      await api.upload(`/api/courses/${editingCourseId}/thumbnail`, file, 'file', {
        onProgress: setThumbnailUploadProgress,
      })
      setSelectedThumbnailFile(null)
      const refreshedCourses = await loadCourses()
      const updatedCourse = refreshedCourses?.find?.((course) => course.id === editingCourseId)
      if (updatedCourse) {
        setForm((current) => ({ ...current, thumbnailUrl: updatedCourse.thumbnailUrl || '' }))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setUploadingThumbnail(false)
      setThumbnailUploadProgress(0)
    }
  }

  return (
    <ThemedPage variant="teach">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5fe7ff]">Leader hub</p>
            <h1 className="mt-2 text-4xl font-display text-white sm:text-5xl">Your activity packs</h1>
          </div>
          <button
            onClick={() => {
              if (showCreate) {
                setShowCreate(false)
                setEditingCourseId(null)
                setForm({ title: '', slug: '', description: '', thumbnailUrl: '' })
                setSlugTouched(false)
                setSelectedThumbnailFile(null)
                return
              }
              setShowCreate(true)
            }}
            className="w-full whitespace-nowrap rounded-full bg-[#ff6fb5] px-5 py-3 text-xs font-black uppercase tracking-wide text-white sm:w-auto"
          >
            {showCreate ? 'Cancel' : '+ New activity'}
          </button>
        </div>

        {error && <p className="mt-6 text-sm text-[#ff8bc3]">{error}</p>}

        {showCreate && (
          <form
            onSubmit={editingCourseId ? handleUpdateCourse : handleCreate}
            className="mt-8 space-y-4 rounded-[2rem] border border-white/18 bg-[linear-gradient(180deg,rgba(23,12,73,0.86)_0%,rgba(10,42,85,0.8)_100%)] p-5 text-white shadow-[0_18px_40px_rgba(4,4,28,0.22)] sm:p-6"
          >
            <p className="text-xs font-black uppercase tracking-wide text-[#5fe7ff]">
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
              <span className="text-sm font-semibold text-white">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                rows={3}
                className="mt-1.5 w-full rounded-2xl border-2 border-white/18 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/72"
              />
            </label>
            <FormField label="Thumbnail URL (optional)" value={form.thumbnailUrl} onChange={(value) => setForm((current) => ({ ...current, thumbnailUrl: value }))} />
            <label className="block">
              <span className="text-sm font-semibold text-white">Activity cover image</span>
              <input
                id="course-thumbnail-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  e.target.value = ''
                  if (!file) return

                  try {
                    setError(null)
                    const optimizedFile = await prepareThumbnailFile(file)
                    if (optimizedFile && editingCourseId) {
                      handleThumbnailUpload(optimizedFile)
                    }
                  } catch (err) {
                    setSelectedThumbnailFile(null)
                    setError(err.message)
                  }
                }}
                disabled={uploadingThumbnail || isSubmitting}
                className="sr-only"
              />
              <label
                htmlFor="course-thumbnail-upload"
                className={`mt-1.5 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-2 border-dashed px-4 py-4 text-sm text-white shadow-[0_10px_24px_rgba(5,5,28,0.12)] transition duration-150 active:scale-[0.99] ${
                  !uploadingThumbnail && !isSubmitting
                    ? 'border-[#7ce8ff]/70 bg-white/10 hover:border-[#00c2ff] hover:bg-white/14'
                    : 'border-white/18 bg-white/10 cursor-not-allowed opacity-75'
                }`}
              >
                <span className="rounded-full bg-[#00c2ff] px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-[0_12px_22px_rgba(0,194,255,0.24)] transition duration-150 active:translate-y-px">
                  Choose file
                </span>
                <span className="flex-1 truncate text-white/84">{selectedThumbnailFile?.name || 'No file chosen'}</span>
              </label>
              <span className="mt-1 block text-xs text-white/78">
                {isSubmitting && selectedThumbnailFile && !uploadingThumbnail
                  ? 'Preparing your draft and cover image upload…'
                  : uploadingThumbnail
                  ? `Uploading and optimizing image… ${thumbnailUploadProgress}%`
                  : editingCourseId
                  ? 'PNG, JPG, WEBP, or GIF. We resize to 1600px max, convert to WebP, and aim to keep uploads around 4 MB or less.'
                    : selectedThumbnailFile
                      ? 'Your selected image will upload automatically when you create the draft.'
                    : 'Optional. Choose a PNG, JPG, WEBP, or GIF image. Large images are optimized before upload.'}
              </span>
              {uploadingThumbnail && (
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/12">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#00c2ff_0%,#8c52ff_60%,#ffd84d_100%)] transition-[width] duration-200"
                    style={{ width: `${thumbnailUploadProgress}%` }}
                  />
                </div>
              )}
            </label>
            {form.thumbnailUrl && (
              <div className="rounded-[1.5rem] border border-white/18 bg-white/10 p-3">
                <p className="text-xs font-black uppercase tracking-wide text-[#5fe7ff]">Current cover image</p>
                <img src={resolveApiUrl(form.thumbnailUrl)} alt="" className="mt-3 h-40 w-full rounded-[1.25rem] object-cover" />
              </div>
            )}
            {!form.thumbnailUrl && selectedThumbnailFile && (
              <div className="rounded-[1.5rem] border border-white/18 bg-white/10 p-3">
                <p className="text-xs font-black uppercase tracking-wide text-[#5fe7ff]">Selected cover image</p>
                <p className="mt-3 text-sm text-white/88">
                  {selectedThumbnailFile.name} ({formatFileSize(selectedThumbnailFile.size)})
                </p>
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-full bg-[linear-gradient(120deg,#00c2ff_0%,#8c52ff_58%,#ff6fb5_100%)] px-6 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_18px_34px_rgba(140,82,255,0.32)] ring-2 ring-white/80 transition-transform hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(140,82,255,0.38)] disabled:cursor-not-allowed disabled:opacity-60 w-full sm:w-auto"
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
            <div
              key={course.id}
              className="flex flex-col gap-4 rounded-[2rem] border border-white/18 bg-[linear-gradient(180deg,rgba(24,12,76,0.82)_0%,rgba(10,42,85,0.76)_100%)] p-5 text-white shadow-[0_18px_40px_rgba(4,4,28,0.2)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display text-xl text-white break-words">{course.title}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${course.status === 'PUBLISHED' ? 'bg-[#dff7ff] text-[#007e8c]' : 'bg-[#fff1a8] text-[#8a4b00]'}`}>
                    {course.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/84">{course.enrolledCount} kids joined</p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <button
                  onClick={() => beginEditCourse(course)}
                  className="rounded-full bg-[#fff1a8] px-4 py-2 text-center text-xs font-black uppercase tracking-wide text-[#8a4b00]"
                >
                  Edit
                </button>
                {course.status === 'DRAFT' && (
                  <button onClick={() => handlePublish(course.id)} className="rounded-full bg-[#ffd84d] px-4 py-2 text-center text-xs font-black uppercase tracking-wide text-[#6b4b00]">
                    Publish
                  </button>
                )}
                <Link to={`/teach/${course.slug}`} className="rounded-full bg-[#00c2ff] px-4 py-2 text-center text-xs font-black uppercase tracking-wide text-white">
                  Manage
                </Link>
              </div>
            </div>
          ))}

          {courses && courses.length === 0 && !showCreate && <p className="text-sm text-white/84">You haven&apos;t created any Rockidz activities yet.</p>}
        </div>
      </div>
    </ThemedPage>
  )
}
