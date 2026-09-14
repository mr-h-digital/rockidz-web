import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import FormField from '../components/FormField'
import ThemedPage from '../components/ThemedPage'

export default function Settings() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const roleLabel = useMemo(() => {
    if (!user?.role) return 'Member'
    return user.role.charAt(0) + user.role.slice(1).toLowerCase()
  }, [user])

  function validate() {
    const displayName = form.displayName.trim()
    const email = form.email.trim()

    if (displayName.length < 2) return 'Display name must be at least 2 characters'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address'

    const hasNewPassword = form.newPassword.length > 0 || form.confirmNewPassword.length > 0
    if (hasNewPassword) {
      if (form.newPassword.length < 8) return 'New password must be at least 8 characters'
      if (!/[A-Z]/.test(form.newPassword)) return 'New password must include an uppercase letter'
      if (!/[a-z]/.test(form.newPassword)) return 'New password must include a lowercase letter'
      if (!/\d/.test(form.newPassword)) return 'New password must include a number'
      if (!/[^A-Za-z0-9]/.test(form.newPassword)) return 'New password must include a symbol'
      if (!form.currentPassword) return 'Current password is required to set a new password'
      if (form.newPassword !== form.confirmNewPassword) return 'New password and confirmation do not match'
    }

    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        displayName: form.displayName.trim(),
        email: form.email.trim().toLowerCase(),
      }

      if (form.newPassword) {
        payload.currentPassword = form.currentPassword
        payload.newPassword = form.newPassword
      }

      await updateProfile(payload)
      setSuccess('Profile updated successfully')
      setForm((f) => ({ ...f, currentPassword: '', newPassword: '', confirmNewPassword: '' }))
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ThemedPage variant="settings">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-[#ffd233]">Explorer passport</p>
        <h1 className="mt-2 text-4xl font-display text-white sm:text-5xl">Your profile</h1>
        <p className="mt-3 text-sm text-white/72">Keep your account details up to date.</p>

        <div className="mt-6 rounded-2xl border border-white/18 bg-[linear-gradient(180deg,rgba(24,12,76,0.82)_0%,rgba(10,42,85,0.74)_100%)] p-5 text-white shadow-[0_18px_40px_rgba(4,4,28,0.2)]">
          <p className="text-xs uppercase tracking-wide text-white/58">Signed in as</p>
          <p className="mt-2 text-sm text-white">{user?.displayName}</p>
          <p className="text-sm text-white/70">{user?.email}</p>
          <p className="mt-2 text-xs uppercase tracking-wide text-[#ffd233]">Role: {roleLabel}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5 rounded-2xl border border-white/18 bg-[linear-gradient(180deg,rgba(24,12,76,0.84)_0%,rgba(9,41,84,0.76)_100%)] p-5 text-white shadow-[0_18px_40px_rgba(4,4,28,0.22)] sm:p-6"
        >
          <FormField
            label="Display name"
            value={form.displayName}
            onChange={(v) => setForm((f) => ({ ...f, displayName: v }))}
            autoComplete="name"
            required
          />

          <FormField
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            autoComplete="email"
            required
          />

          <div className="pt-2">
            <p className="text-xs font-bold uppercase tracking-wide text-[#ffd233]">Change password (optional)</p>
          </div>

          <FormField
            label="Current password"
            type="password"
            value={form.currentPassword}
            onChange={(v) => setForm((f) => ({ ...f, currentPassword: v }))}
            autoComplete="current-password"
            allowReveal
          />

          <FormField
            label="New password"
            type="password"
            value={form.newPassword}
            onChange={(v) => setForm((f) => ({ ...f, newPassword: v }))}
            autoComplete="new-password"
            hint="At least 8 chars, including upper/lowercase, number and symbol"
            allowReveal
          />

          <FormField
            label="Confirm new password"
            type="password"
            value={form.confirmNewPassword}
            onChange={(v) => setForm((f) => ({ ...f, confirmNewPassword: v }))}
            autoComplete="new-password"
            allowReveal
          />

          {error && <p className="text-sm text-[#ff8bc3]">{error}</p>}
          {success && <p className="text-sm text-[#5fe7ff]">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-grad-gold px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-[#0b1220] transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
          >
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </ThemedPage>
  )
}
