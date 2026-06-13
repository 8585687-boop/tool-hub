/**
 * Image Compressor - Browser-side image compression using Canvas API
 */

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp'

const MIME_MAP = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

/**
 * Compress a single image file
 * @param {File} file - Input image file
 * @param {object} options - { quality, outputFormat, maxWidth, maxHeight }
 * @returns {Promise<{blob: Blob, width: number, height: number, originalSize: number, compressedSize: number}>}
 */
export function compressImage(file, options = {}) {
  const {
    quality = 0.8,
    outputFormat = 'original', // 'original', 'jpg', 'png', 'webp'
    maxWidth,
    maxHeight,
  } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img

      // Resize if needed
      if (maxWidth && maxWidth > 0 && width > maxWidth) {
        height = Math.round(height * (maxWidth / width))
        width = maxWidth
      }
      if (maxHeight && maxHeight > 0 && height > maxHeight) {
        width = Math.round(width * (maxHeight / height))
        height = maxHeight
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      // Determine output MIME
      let mime
      if (outputFormat === 'original') {
        mime = file.type || 'image/jpeg'
      } else {
        mime = MIME_MAP[outputFormat] || 'image/jpeg'
      }

      // PNG doesn't support quality parameter
      const q = mime === 'image/png' ? undefined : quality

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'))
            return
          }
          resolve({
            blob,
            width,
            height,
            originalSize: file.size,
            compressedSize: blob.size,
          })
        },
        mime,
        q
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

/**
 * Get output filename
 */
export function getOutputFilename(originalName, outputFormat) {
  const baseName = originalName.replace(/\.[^.]+$/, '')
  if (outputFormat === 'original') {
    return originalName
  }
  return `${baseName}.${outputFormat}`
}

/**
 * Format file size
 */
export function formatSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Calculate saved percentage
 */
export function calcSaved(original, compressed) {
  if (original === 0) return 0
  return Math.round(((original - compressed) / original) * 100)
}

export { ACCEPTED_TYPES, ACCEPTED_EXTENSIONS, MIME_MAP }
