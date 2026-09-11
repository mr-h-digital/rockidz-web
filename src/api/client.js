const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? 'https://rockidz-api.rockmission.co.za' : 'http://localhost:8080')

function getToken() {
  return localStorage.getItem('rockidz_token')
}

function clearStoredAuth() {
  localStorage.removeItem('rockidz_token')
  localStorage.removeItem('rockidz_user')
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  let hadToken = false

  if (auth) {
    const token = getToken()
    if (!token) {
      clearStoredAuth()
      window.dispatchEvent(new Event('rockidz-auth-invalid'))
      throw new Error('Your session has expired. Please sign in again.')
    }

    hadToken = true
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const fieldErrors = data?.fieldErrors
      ? Object.values(data.fieldErrors)
          .filter(Boolean)
          .join(' | ')
      : ''

    if (auth && hadToken && res.status === 401) {
      clearStoredAuth()
      window.dispatchEvent(new Event('rockidz-auth-invalid'))
      throw new Error('Your session has expired. Please sign in again.')
    }

    const message = fieldErrors || data?.message || `Request failed (${res.status})`
    throw new Error(message)
  }

  return data
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
  upload: async (path, file, fieldName = 'file') => {
    const token = getToken()
    if (!token) {
      clearStoredAuth()
      window.dispatchEvent(new Event('rockidz-auth-invalid'))
      throw new Error('Your session has expired. Please sign in again.')
    }

    const formData = new FormData()
    formData.append(fieldName, file)

    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (res.status === 204) return null

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      if (res.status === 401) {
        clearStoredAuth()
        window.dispatchEvent(new Event('rockidz-auth-invalid'))
        throw new Error('Your session has expired. Please sign in again.')
      }

      const fieldErrors = data?.fieldErrors
        ? Object.values(data.fieldErrors)
            .filter(Boolean)
            .join(' | ')
        : ''

      const message = fieldErrors || data?.message || `Request failed (${res.status})`
      throw new Error(message)
    }

    return data
  },
}
