export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// Email validation
export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }
  return null
}

// Username validation
export const validateUsername = (username: string): string | null => {
  if (!username.trim()) {
    return 'Username is required'
  }
  if (username.length < 3) {
    return 'Username must be at least 3 characters long'
  }
  if (username.length > 20) {
    return 'Username must be no more than 20 characters'
  }
  const usernameRegex = /^[a-zA-Z0-9_-]+$/
  if (!usernameRegex.test(username)) {
    return 'Username can only contain letters, numbers, underscores, and dashes'
  }
  return null
}

// Password validation
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required'
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long'
  }
  if (password.length > 128) {
    return 'Password must be no more than 128 characters'
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter'
  }
  
  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number'
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain at least one special character (!@#$%^&*...)'
  }
  
  return null
}

// Password strength indicator
export const getPasswordStrength = (password: string): 'weak' | 'fair' | 'good' | 'strong' => {
  if (!password) return 'weak'
  
  let strength = 0
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++
  
  if (strength <= 2) return 'weak'
  if (strength <= 3) return 'fair'
  if (strength <= 4) return 'good'
  return 'strong'
}

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password'
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match'
  }
  return null
}

// Login form validation
export const validateLoginForm = (email: string, password: string): ValidationResult => {
  const errors: ValidationError[] = []
  
  const emailError = validateEmail(email)
  if (emailError) {
    errors.push({ field: 'email', message: emailError })
  }
  
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' })
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Signup form validation
export const validateSignupForm = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  agreeToTerms: boolean
): ValidationResult => {
  const errors: ValidationError[] = []
  
  const usernameError = validateUsername(username)
  if (usernameError) {
    errors.push({ field: 'username', message: usernameError })
  }
  
  const emailError = validateEmail(email)
  if (emailError) {
    errors.push({ field: 'email', message: emailError })
  }
  
  const passwordError = validatePassword(password)
  if (passwordError) {
    errors.push({ field: 'password', message: passwordError })
  }
  
  const confirmPasswordError = validateConfirmPassword(password, confirmPassword)
  if (confirmPasswordError) {
    errors.push({ field: 'confirmPassword', message: confirmPasswordError })
  }
  
  if (!agreeToTerms) {
    errors.push({ field: 'terms', message: 'You must agree to the terms and conditions' })
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}
