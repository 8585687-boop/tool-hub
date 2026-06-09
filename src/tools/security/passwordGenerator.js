const CHARS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
}

export function generatePassword(options) {
  const { length = 16, uppercase = true, lowercase = true, numbers = true, symbols = true } = options

  let pool = ''
  if (uppercase) pool += CHARS.uppercase
  if (lowercase) pool += CHARS.lowercase
  if (numbers) pool += CHARS.numbers
  if (symbols) pool += CHARS.symbols

  if (!pool) {
    return { success: false, error: 'At least one character type must be selected' }
  }

  const array = new Uint32Array(length)
  crypto.getRandomValues(array)

  let password = ''
  for (let i = 0; i < length; i++) {
    password += pool[array[i] % pool.length]
  }

  return { success: true, result: password }
}

export function getPasswordStrength(password) {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 2) return { label: 'Weak', color: '#ef4444' }
  if (score <= 4) return { label: 'Medium', color: '#f59e0b' }
  return { label: 'Strong', color: '#10b981' }
}
