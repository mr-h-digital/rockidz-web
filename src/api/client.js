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

function shouldInvalidateAuthFromResponse(status, data) {
  if (status !== 401) return false
  const message = typeof data?.message === 'string' ? data.message.toLowerCase() : ''
  return message.includes('session has expired') || message.includes('sign in again') || message.includes('authentication required')
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

    if (auth && hadToken && shouldInvalidateAuthFromResponse(res.status, data)) {
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
  upload: (path, file, fieldName = 'file', { onProgress } = {}) =>
    new Promise((resolve, reject) => {
    const token = getToken()
    if (!token) {
      clearStoredAuth()
      window.dispatchEvent(new Event('rockidz-auth-invalid'))
      reject(new Error('Your session has expired. Please sign in again.'))
      return
    }

    const formData = new FormData()
    formData.append(fieldName, file)

      const xhr = new XMLHttpRequest()
      xhr.open('POST', `${API_BASE_URL}${path}`)
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable || !onProgress) return
        onProgress(Math.round((event.loaded / event.total) * 100))
      }

      xhr.onerror = () => reject(new Error('Upload failed. Please try again.'))

      xhr.onload = () => {
        const data = xhr.responseText ? JSON.parse(xhr.responseText) : null

        if (xhr.status === 204) {
          resolve(null)
          return
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data)
          return
        }

        if (shouldInvalidateAuthFromResponse(xhr.status, data)) {
          clearStoredAuth()
          window.dispatchEvent(new Event('rockidz-auth-invalid'))
          reject(new Error('Your session has expired. Please sign in again.'))
          return
        }

        const fieldErrors = data?.fieldErrors
          ? Object.values(data.fieldErrors)
              .filter(Boolean)
              .join(' | ')
          : ''

        const message = fieldErrors || data?.message || `Request failed (${xhr.status})`
        reject(new Error(message))
      }

      xhr.send(formData)
    }),
}
