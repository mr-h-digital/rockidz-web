const MAX_IMAGE_DIMENSION = 1600
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024
const OUTPUT_TYPE = 'image/webp'
const OUTPUT_QUALITY = 0.82

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Unable to read the selected image. Please choose a PNG, JPG, WEBP, or GIF file.'))
    }

    image.src = objectUrl
  })
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Unable to optimize the selected image. Please try a different file.'))
        return
      }
      resolve(blob)
    }, OUTPUT_TYPE, quality)
  })
}

function getScaledDimensions(width, height) {
  const longestSide = Math.max(width, height)
  if (longestSide <= MAX_IMAGE_DIMENSION) {
    return { width, height }
  }

  const scale = MAX_IMAGE_DIMENSION / longestSide
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

export async function optimizeImageForUpload(file) {
  if (!(file instanceof File)) {
    throw new Error('Please choose an image to upload.')
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose a PNG, JPG, WEBP, or GIF image.')
  }

  const image = await loadImage(file)
  const { width, height } = getScaledDimensions(image.naturalWidth || image.width, image.naturalHeight || image.height)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Your browser could not prepare the image for upload. Please try a different browser.')
  }

  context.drawImage(image, 0, 0, width, height)

  let quality = OUTPUT_QUALITY
  let blob = await canvasToBlob(canvas, quality)

  while (blob.size > MAX_UPLOAD_BYTES && quality > 0.5) {
    quality = Number((quality - 0.07).toFixed(2))
    blob = await canvasToBlob(canvas, quality)
  }

  if (blob.size > MAX_UPLOAD_BYTES) {
    throw new Error('This image is still too large after optimization. Please choose a smaller image, ideally under 10 MB.')
  }

  const extension = 'webp'
  const filename = file.name.replace(/\.[^.]+$/, '') || 'activity-cover'
  return new File([blob], `${filename}.${extension}`, {
    type: OUTPUT_TYPE,
    lastModified: Date.now(),
  })
}

export function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
