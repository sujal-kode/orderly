import React, { useState } from 'react'
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext.js'
import { ApiError } from '../services/api.js'
import { FieldError, fieldInputClass } from '../components/FieldError.js'

interface SignupPageProps {
  navigate: (path: string) => void
}

export const SignupPage: React.FC<SignupPageProps> = ({ navigate }) => {
  const { signup } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    if (password !== passwordConfirmation) {
      setFieldErrors({ passwordConfirmation: 'Passwords do not match.' })
      return
    }

    if (password.length < 8) {
      setFieldErrors({ password: 'Password must be at least 8 characters long.' })
      return
    }

    setIsLoading(true)

    try {
      const user = await signup({
        fullName: fullName.trim() || undefined,
        email: email.trim(),
        password,
        passwordConfirmation,
      })
      navigate(user.role === 'admin' ? '/admin' : '/app')
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Registration failed. Please check your inputs.'
      if (err instanceof ApiError && err.fieldErrors.length > 0) {
        const errors: Record<string, string> = {}
        for (const fe of err.fieldErrors) errors[fe.field] = fe.message
        setFieldErrors(errors)
      } else {
        setError(errorMsg)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-[#f8f9ff] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[440px] bg-white rounded-lg shadow-sm p-8 sm:p-10">
        {/* Branding Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-10 h-10 mb-4 rounded-lg bg-[#00288e] flex items-center justify-center text-white shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m-10 0a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-[#0b1c30]">Create your Orderly account</h1>
          <p className="text-sm text-[#565e74] mt-1">Start ordering from stores near you</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="text-sm font-medium text-[#0b1c30]">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={fieldInputClass(!!fieldErrors.fullName)}
            />
            <FieldError message={fieldErrors.fullName} />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-[#0b1c30]">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldInputClass(!!fieldErrors.email)}
            />
            <FieldError message={fieldErrors.email} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-[#0b1c30]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-3 pr-9 ${fieldInputClass(!!fieldErrors.password)}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#757684] hover:text-[#0b1c30] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError message={fieldErrors.password} />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="passwordConfirmation" className="text-sm font-medium text-[#0b1c30]">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="passwordConfirmation"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className={`w-full pl-3 pr-9 ${fieldInputClass(!!fieldErrors.passwordConfirmation)}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#757684] hover:text-[#0b1c30] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError message={fieldErrors.passwordConfirmation} />
            </div>
          </div>
          <span className="-mt-2 text-xs text-[#757684]">Must be at least 8 characters</span>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 mt-1 bg-[#00288e] hover:opacity-95 active:opacity-90 disabled:opacity-50 text-white text-sm font-medium rounded flex items-center justify-center gap-2 shadow-sm transition-opacity cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#c4c5d5]/50 text-center">
          <p className="text-sm text-[#565e74]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[#00288e] font-medium hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
