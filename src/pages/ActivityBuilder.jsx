import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, resolveApiUrl } from '../api/client'
import FormField from '../components/FormField'
import ThemedPage from '../components/ThemedPage'
import { formatFileSize, optimizeImageForUpload } from '../lib/imageUpload'

const EMPTY_LESSON_FORM = {
  title: '',
  contentType: 'STORY',
  content: '',
  instructions: '',
  questions: '',
  assetUrl: '',
  downloadUrl: '',
  gameType: 'QUIZ',
  gamePrompt: '',
  gameOptions: '',
  gameAnswer: '',
  successMessage: '',
  retryMessage: '',
  videoRef: '',
  durationSeconds: '',
}

function formatContentTypeLabel(contentType) {
  return typeof contentType === 'string' && contentType.length > 0 ? contentType.replaceAll('_', ' ') : 'STORY'
}

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
    return api
      .get(`/api/courses/${slug}`, { auth: false })
      .then((loadedCourse) => {
        setPageError(null)
        setCourse(loadedCourse)
        return api.get(`/api/courses/${loadedCourse.id}/modules`)
      })
      .then(setModules)
      .catch((err) => setPageError(err.message))
  }

  useEffect(() => {
    loadCourse()
  }, [slug])

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
      await loadCourse()
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
      await loadCourse()
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
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link to="/teach" className="text-xs font-black uppercase tracking-wide text-[#5b5872] hover:text-[#00a8b5]">
          ← Your activity packs
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="font-display text-4xl text-[#5b2b86] break-words sm:text-5xl">{course.title}</h1>
            <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${course.status === 'PUBLISHED' ? 'bg-[#dff7ff] text-[#007e8c]' : 'bg-[#fff1a8] text-[#8a4b00]'}`}>
              {course.status}
            </span>
          </div>
          {course.status === 'DRAFT' && (
            <button onClick={handlePublish} className="w-full rounded-full bg-[#ff6fb5] px-6 py-3 text-sm font-black uppercase tracking-wide text-white sm:w-auto">
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
  const [lessonForm, setLessonForm] = useState(EMPTY_LESSON_FORM)
  const [editingModule, setEditingModule] = useState(false)
  const [moduleTitle, setModuleTitle] = useState(module.title)
  const [editingLessonId, setEditingLessonId] = useState(null)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState(null)
  const [uploadingAsset, setUploadingAsset] = useState(false)
  const [assetUploadProgress, setAssetUploadProgress] = useState(0)
  const [selectedAssetFile, setSelectedAssetFile] = useState(null)

  function buildLessonPayload(form) {
    const payload = {
      title: form.title.trim(),
      contentType: form.contentType,
      content: form.content,
      instructions: form.instructions,
      questions: form.questions,
      assetUrl: form.assetUrl,
      downloadUrl: form.downloadUrl,
      gameType: form.gameType,
      gamePrompt: form.gamePrompt,
      gameOptions: form.gameOptions,
      gameAnswer: form.gameAnswer,
      successMessage: form.successMessage,
      retryMessage: form.retryMessage,
      videoRef: form.videoRef,
      durationSeconds: form.durationSeconds ? Number(form.durationSeconds) : null,
    }

    if (form.contentType !== 'GAME') {
      payload.gameType = null
      payload.gamePrompt = null
      payload.gameOptions = null
      payload.gameAnswer = null
      payload.successMessage = null
      payload.retryMessage = null
    }

    if (form.contentType !== 'VIDEO') {
      payload.videoRef = null
      payload.durationSeconds = null
    }

    if (form.contentType !== 'QUESTIONS') {
      payload.questions = null
    }

    if (form.contentType !== 'COLOURING_PAGE') {
      payload.assetUrl = form.contentType === 'DOWNLOAD' ? null : form.assetUrl
    }

    if (form.contentType !== 'DOWNLOAD' && form.contentType !== 'COLOURING_PAGE') {
      payload.downloadUrl = null
    }

    return payload
  }

  function validateLessonForm(form) {
    if (!form.title.trim()) return 'Please enter an activity title.'
    if (form.contentType === 'VIDEO' && !form.videoRef.trim()) return 'Please enter a YouTube video ID for a video step.'
    if (form.contentType === 'DOWNLOAD' && !form.downloadUrl.trim()) return 'Please enter a download URL for a download step.'
    if (form.contentType === 'COLOURING_PAGE' && !form.assetUrl.trim() && !selectedAssetFile && !form.downloadUrl.trim()) {
      return 'Please add an image URL, a printable download URL, or both for a colouring page.'
    }
    if (form.contentType === 'GAME') {
      if (!form.gamePrompt.trim()) return 'Please enter a game prompt.'
      if (!form.gameAnswer.trim()) return 'Please enter the correct answer.'
      if (form.gameType === 'QUIZ') {
        const options = form.gameOptions
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean)
        if (options.length < 2) return 'Please add at least two quiz options.'
      }
    }
    return null
  }

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
    const validationError = validateLessonForm(lessonForm)
    if (validationError) {
      setError(validationError)
      return
    }
    setAdding(true)
    setError(null)
    try {
      const createdLesson = await api.post(`/api/modules/${module.id}/lessons`, buildLessonPayload(lessonForm))
      if (selectedAssetFile && lessonForm.contentType === 'COLOURING_PAGE') {
        await handleLessonAssetUpload(selectedAssetFile, createdLesson.id)
      }
      setLessonForm(EMPTY_LESSON_FORM)
      setShowAddLesson(false)
      setSelectedAssetFile(null)
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
    const validationError = validateLessonForm(lessonForm)
    if (validationError) {
      setError(validationError)
      return
    }
    try {
      setError(null)
      await api.patch(`/api/modules/${module.id}/lessons/${lessonId}`, buildLessonPayload(lessonForm))
      if (selectedAssetFile && lessonForm.contentType === 'COLOURING_PAGE') {
        await handleLessonAssetUpload(selectedAssetFile, lessonId)
      }
      setEditingLessonId(null)
      setLessonForm(EMPTY_LESSON_FORM)
      setSelectedAssetFile(null)
      onChanged()
    } catch (err) {
      setError(err.message)
    }
  }

  async function prepareAssetFile(file) {
    if (!file) return null

    const optimizedFile = await optimizeImageForUpload(file)
    setSelectedAssetFile(optimizedFile)
    return optimizedFile
  }

  async function handleLessonAssetUpload(file, lessonId) {
    if (!file || !lessonId) return

    setError(null)
    setUploadingAsset(true)
    setAssetUploadProgress(0)
    try {
      const uploaded = await api.upload(`/api/modules/${module.id}/lessons/${lessonId}/asset`, file, 'file', {
        onProgress: setAssetUploadProgress,
      })
      setSelectedAssetFile(null)
      setLessonForm((current) => ({
        ...current,
        assetUrl: uploaded?.url || current.assetUrl,
        downloadUrl: current.downloadUrl || uploaded?.url || '',
      }))
      await onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploadingAsset(false)
      setAssetUploadProgress(0)
    }
  }

  return (
    <div className="rounded-[2rem] border-4 border-white/70 bg-white/70 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
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
            <h3 className="mt-1 break-words font-display text-2xl text-[#5b2b86]">{module.title}</h3>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
                <select
                  value={lessonForm.contentType}
                  onChange={(e) => setLessonForm((current) => ({ ...EMPTY_LESSON_FORM, ...current, contentType: e.target.value, title: current.title }))}
                  className="rounded-full border-4 border-[#f3ecff] bg-white px-4 py-2 text-sm text-[#5b2b86] outline-none"
                >
                  <option value="STORY">Story</option>
                  <option value="QUESTIONS">Questions</option>
                  <option value="ACTIVITY">Activity</option>
                  <option value="GAME">Game</option>
                  <option value="VIDEO">Video</option>
                  <option value="COLOURING_PAGE">Colouring page</option>
                  <option value="DOWNLOAD">Download</option>
                </select>
                <textarea
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm((current) => ({ ...current, content: e.target.value }))}
                  rows={3}
                  placeholder="Story, context, game intro, or main content"
                  className="rounded-3xl border-4 border-[#f3ecff] bg-white px-4 py-3 text-sm text-[#5b2b86] outline-none"
                />
                <textarea
                  value={lessonForm.instructions}
                  onChange={(e) => setLessonForm((current) => ({ ...current, instructions: e.target.value }))}
                  rows={3}
                  placeholder="Instructions for the child, teacher, or parent"
                  className="rounded-3xl border-4 border-[#f3ecff] bg-white px-4 py-3 text-sm text-[#5b2b86] outline-none"
                />
                <textarea
                  value={lessonForm.questions}
                  onChange={(e) => setLessonForm((current) => ({ ...current, questions: e.target.value }))}
                  rows={3}
                  placeholder="Questions, one per line"
                  className="rounded-3xl border-4 border-[#f3ecff] bg-white px-4 py-3 text-sm text-[#5b2b86] outline-none"
                />
                <input
                  value={lessonForm.assetUrl}
                  onChange={(e) => setLessonForm((current) => ({ ...current, assetUrl: e.target.value }))}
                  placeholder="Activity or colouring image URL"
                  className="rounded-full border-4 border-[#f3ecff] bg-white px-4 py-2 text-sm text-[#5b2b86] outline-none"
                />
                {lessonForm.contentType === 'COLOURING_PAGE' && (
                  <label className="block">
                    <span className="text-sm font-semibold text-[#5b2b86]">Upload colouring image</span>
                    <input
                      id={`lesson-asset-upload-${lesson.id}`}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        e.target.value = ''
                        if (!file) return

                        try {
                          setError(null)
                          const optimizedFile = await prepareAssetFile(file)
                          if (optimizedFile && editingLessonId === lesson.id) {
                            handleLessonAssetUpload(optimizedFile, lesson.id)
                          }
                        } catch (err) {
                          setSelectedAssetFile(null)
                          setError(err.message)
                        }
                      }}
                      disabled={uploadingAsset}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`lesson-asset-upload-${lesson.id}`}
                      className={`mt-1.5 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-4 border-dashed px-4 py-4 text-sm text-[#5b2b86] shadow-[0_10px_24px_rgba(140,82,255,0.08)] transition duration-150 active:scale-[0.99] ${
                        !uploadingAsset
                          ? 'border-[#7ce8ff] bg-white/90 hover:border-[#00c2ff] hover:bg-[#f5fdff]'
                          : 'border-white bg-white/80 cursor-not-allowed opacity-75'
                      }`}
                    >
                      <span className="rounded-full bg-[#00c2ff] px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-[0_12px_22px_rgba(0,194,255,0.24)] transition duration-150 active:translate-y-px">
                        Choose file
                      </span>
                      <span className="flex-1 truncate text-[#7b6d8a]">{selectedAssetFile?.name || 'No file chosen'}</span>
                    </label>
                    <span className="mt-1 block text-xs text-[#7b6d8a]">
                      {uploadingAsset
                        ? `Uploading and optimizing image… ${assetUploadProgress}%`
                        : 'PNG, JPG, WEBP, or GIF. This uploads the colouring page image and saves its lesson asset URL for you.'}
                    </span>
                    {uploadingAsset && (
                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/80">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#00c2ff_0%,#8c52ff_60%,#ffd84d_100%)] transition-[width] duration-200"
                          style={{ width: `${assetUploadProgress}%` }}
                        />
                      </div>
                    )}
                    {lessonForm.assetUrl && (
                      <img src={resolveApiUrl(lessonForm.assetUrl)} alt="" className="mt-3 h-40 w-full rounded-[1.25rem] object-cover" />
                    )}
                    {!lessonForm.assetUrl && selectedAssetFile && (
                      <p className="mt-3 text-sm text-[#5b5872]">
                        {selectedAssetFile.name} ({formatFileSize(selectedAssetFile.size)})
                      </p>
                    )}
                  </label>
                )}
                <input
                  value={lessonForm.downloadUrl}
                  onChange={(e) => setLessonForm((current) => ({ ...current, downloadUrl: e.target.value }))}
                  placeholder="Printable or download URL"
                  className="rounded-full border-4 border-[#f3ecff] bg-white px-4 py-2 text-sm text-[#5b2b86] outline-none"
                />
                {lessonForm.contentType === 'GAME' && (
                  <>
                    <select
                      value={lessonForm.gameType}
                      onChange={(e) => setLessonForm((current) => ({ ...current, gameType: e.target.value }))}
                      className="rounded-full border-4 border-[#f3ecff] bg-white px-4 py-2 text-sm text-[#5b2b86] outline-none"
                    >
                      <option value="QUIZ">Quiz</option>
                      <option value="FILL_IN_THE_BLANK">Fill in the blank</option>
                    </select>
                    <textarea
                      value={lessonForm.gamePrompt}
                      onChange={(e) => setLessonForm((current) => ({ ...current, gamePrompt: e.target.value }))}
                      rows={2}
                      placeholder="Game prompt"
                      className="rounded-3xl border-4 border-[#f3ecff] bg-white px-4 py-3 text-sm text-[#5b2b86] outline-none"
                    />
                    <textarea
                      value={lessonForm.gameOptions}
                      onChange={(e) => setLessonForm((current) => ({ ...current, gameOptions: e.target.value }))}
                      rows={3}
                      placeholder="Options, one per line"
                      className="rounded-3xl border-4 border-[#f3ecff] bg-white px-4 py-3 text-sm text-[#5b2b86] outline-none"
                    />
                    <input
                      value={lessonForm.gameAnswer}
                      onChange={(e) => setLessonForm((current) => ({ ...current, gameAnswer: e.target.value }))}
                      placeholder="Correct answer"
                      className="rounded-full border-4 border-[#f3ecff] bg-white px-4 py-2 text-sm text-[#5b2b86] outline-none"
                    />
                    <textarea
                      value={lessonForm.successMessage}
                      onChange={(e) => setLessonForm((current) => ({ ...current, successMessage: e.target.value }))}
                      rows={2}
                      placeholder="Success message"
                      className="rounded-3xl border-4 border-[#f3ecff] bg-white px-4 py-3 text-sm text-[#5b2b86] outline-none"
                    />
                    <textarea
                      value={lessonForm.retryMessage}
                      onChange={(e) => setLessonForm((current) => ({ ...current, retryMessage: e.target.value }))}
                      rows={2}
                      placeholder="Try again message"
                      className="rounded-3xl border-4 border-[#f3ecff] bg-white px-4 py-3 text-sm text-[#5b2b86] outline-none"
                    />
                  </>
                )}
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
                      setLessonForm(EMPTY_LESSON_FORM)
                      setSelectedAssetFile(null)
                    }}
                    className="text-xs font-black uppercase tracking-wide text-[#8a4b00] hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="min-w-0">
                  <div className="break-words text-[#5b5872]">{lesson.title}</div>
                  <div className="text-[11px] font-black uppercase tracking-wide text-[#8f7f9d]">
                    {formatContentTypeLabel(lesson.contentType)}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setEditingLessonId(lesson.id)
                      setLessonForm({
                        ...EMPTY_LESSON_FORM,
                        title: lesson.title || '',
                        contentType: lesson.contentType || 'STORY',
                        content: lesson.content || '',
                        instructions: lesson.instructions || '',
                        questions: lesson.questions || '',
                        assetUrl: lesson.assetUrl || '',
                        downloadUrl: lesson.downloadUrl || '',
                        gameType: lesson.gameType || 'QUIZ',
                        gamePrompt: lesson.gamePrompt || '',
                        gameOptions: lesson.gameOptions || '',
                        gameAnswer: lesson.gameAnswer || '',
                        successMessage: lesson.successMessage || '',
                        retryMessage: lesson.retryMessage || '',
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
          <label className="block">
            <span className="text-sm font-semibold text-[#5b2b86]">Activity type</span>
            <select
              value={lessonForm.contentType}
              onChange={(e) => setLessonForm((current) => ({ ...EMPTY_LESSON_FORM, ...current, contentType: e.target.value, title: current.title }))}
              className="mt-1.5 w-full rounded-2xl border-4 border-white bg-white px-4 py-3 text-sm text-[#5b2b86] outline-none"
            >
              <option value="STORY">Story</option>
              <option value="QUESTIONS">Questions</option>
              <option value="ACTIVITY">Activity</option>
              <option value="GAME">Game</option>
              <option value="VIDEO">Video</option>
              <option value="COLOURING_PAGE">Colouring page</option>
              <option value="DOWNLOAD">Download</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-[#5b2b86]">Story or content</span>
            <textarea
              value={lessonForm.content}
              onChange={(e) => setLessonForm((current) => ({ ...current, content: e.target.value }))}
              rows={4}
              className="mt-1.5 w-full rounded-2xl border-4 border-white bg-white px-4 py-3 text-sm text-[#5b2b86] outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-[#5b2b86]">Instructions</span>
            <textarea
              value={lessonForm.instructions}
              onChange={(e) => setLessonForm((current) => ({ ...current, instructions: e.target.value }))}
              rows={3}
              className="mt-1.5 w-full rounded-2xl border-4 border-white bg-white px-4 py-3 text-sm text-[#5b2b86] outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-[#5b2b86]">Questions</span>
            <textarea
              value={lessonForm.questions}
              onChange={(e) => setLessonForm((current) => ({ ...current, questions: e.target.value }))}
              rows={3}
              placeholder="One question per line"
              className="mt-1.5 w-full rounded-2xl border-4 border-white bg-white px-4 py-3 text-sm text-[#5b2b86] outline-none"
            />
          </label>
          <FormField label="Asset image URL" value={lessonForm.assetUrl} onChange={(value) => setLessonForm((current) => ({ ...current, assetUrl: value }))} hint="Use for colouring pages or illustrated activities" />
          {lessonForm.contentType === 'COLOURING_PAGE' && (
            <label className="block">
              <span className="text-sm font-semibold text-[#5b2b86]">Upload colouring image</span>
              <input
                id={`new-lesson-asset-upload-${module.id}`}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  e.target.value = ''
                  if (!file) return

                  try {
                    setError(null)
                    await prepareAssetFile(file)
                  } catch (err) {
                    setSelectedAssetFile(null)
                    setError(err.message)
                  }
                }}
                disabled={adding || uploadingAsset}
                className="sr-only"
              />
              <label
                htmlFor={`new-lesson-asset-upload-${module.id}`}
                className={`mt-1.5 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-4 border-dashed px-4 py-4 text-sm text-[#5b2b86] shadow-[0_10px_24px_rgba(140,82,255,0.08)] transition duration-150 active:scale-[0.99] ${
                  !adding && !uploadingAsset
                    ? 'border-[#7ce8ff] bg-white/90 hover:border-[#00c2ff] hover:bg-[#f5fdff]'
                    : 'border-white bg-white/80 cursor-not-allowed opacity-75'
                }`}
              >
                <span className="rounded-full bg-[#00c2ff] px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-[0_12px_22px_rgba(0,194,255,0.24)] transition duration-150 active:translate-y-px">
                  Choose file
                </span>
                <span className="flex-1 truncate text-[#7b6d8a]">{selectedAssetFile?.name || 'No file chosen'}</span>
              </label>
              <span className="mt-1 block text-xs text-[#7b6d8a]">
                {selectedAssetFile
                  ? 'Your selected colouring page image will be uploaded after you add this lesson.'
                  : 'Optional. Choose a colouring page image to prefill the lesson asset URL after the lesson is created.'}
              </span>
              {!lessonForm.assetUrl && selectedAssetFile && (
                <p className="mt-3 text-sm text-[#5b5872]">
                  {selectedAssetFile.name} ({formatFileSize(selectedAssetFile.size)})
                </p>
              )}
              {lessonForm.assetUrl && (
                <img src={resolveApiUrl(lessonForm.assetUrl)} alt="" className="mt-3 h-40 w-full rounded-[1.25rem] object-cover" />
              )}
            </label>
          )}
          <FormField label="Download URL" value={lessonForm.downloadUrl} onChange={(value) => setLessonForm((current) => ({ ...current, downloadUrl: value }))} hint="Optional printable or worksheet link" />
          {lessonForm.contentType === 'GAME' && (
            <>
              <label className="block">
                <span className="text-sm font-semibold text-[#5b2b86]">Game type</span>
                <select
                  value={lessonForm.gameType}
                  onChange={(e) => setLessonForm((current) => ({ ...current, gameType: e.target.value }))}
                  className="mt-1.5 w-full rounded-2xl border-4 border-white bg-white px-4 py-3 text-sm text-[#5b2b86] outline-none"
                >
                  <option value="QUIZ">Quiz</option>
                  <option value="FILL_IN_THE_BLANK">Fill in the blank</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-[#5b2b86]">Game prompt</span>
                <textarea
                  value={lessonForm.gamePrompt}
                  onChange={(e) => setLessonForm((current) => ({ ...current, gamePrompt: e.target.value }))}
                  rows={2}
                  className="mt-1.5 w-full rounded-2xl border-4 border-white bg-white px-4 py-3 text-sm text-[#5b2b86] outline-none"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-[#5b2b86]">Game options</span>
                <textarea
                  value={lessonForm.gameOptions}
                  onChange={(e) => setLessonForm((current) => ({ ...current, gameOptions: e.target.value }))}
                  rows={3}
                  placeholder="One option per line"
                  className="mt-1.5 w-full rounded-2xl border-4 border-white bg-white px-4 py-3 text-sm text-[#5b2b86] outline-none"
                />
              </label>
              <FormField label="Correct answer" value={lessonForm.gameAnswer} onChange={(value) => setLessonForm((current) => ({ ...current, gameAnswer: value }))} />
              <label className="block">
                <span className="text-sm font-semibold text-[#5b2b86]">Success message</span>
                <textarea
                  value={lessonForm.successMessage}
                  onChange={(e) => setLessonForm((current) => ({ ...current, successMessage: e.target.value }))}
                  rows={2}
                  className="mt-1.5 w-full rounded-2xl border-4 border-white bg-white px-4 py-3 text-sm text-[#5b2b86] outline-none"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-[#5b2b86]">Try again message</span>
                <textarea
                  value={lessonForm.retryMessage}
                  onChange={(e) => setLessonForm((current) => ({ ...current, retryMessage: e.target.value }))}
                  rows={2}
                  className="mt-1.5 w-full rounded-2xl border-4 border-white bg-white px-4 py-3 text-sm text-[#5b2b86] outline-none"
                />
              </label>
            </>
          )}
          <FormField
            label="YouTube video ID"
            value={lessonForm.videoRef}
            onChange={(value) => setLessonForm((current) => ({ ...current, videoRef: value }))}
            hint="Only needed for video steps"
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
