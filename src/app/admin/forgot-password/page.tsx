'use client'

import { useState } from 'react'
import { Mail, ArrowLeft, ExternalLink } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [resetLink, setResetLink] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setMessage(data.message)
      if (data.resetLink) setResetLink(data.resetLink)
      setSent(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden bg-slate-50 px-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-[100px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] pointer-events-none opacity-30" />

      <div className="w-full max-w-md relative z-10 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-8 shadow-2xl">

        {sent ? (
          /* Success State */
          <div className="text-center py-4">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Check Your Email!</h1>
            <p className="text-slate-500 text-sm leading-relaxed mb-2">{message}</p>

            {resetLink ? (
              /* Dev mode: show a clickable button */
              <div className="mt-4 mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-left">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">⚙️ Dev Mode — SMTP not configured</p>
                <p className="text-xs text-amber-600 mb-3">Click below to open the reset page directly:</p>
                <a
                  href={resetLink}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Reset Password Page
                </a>
                <p className="text-xs text-amber-500 mt-2 text-center">Link expires in 15 minutes</p>
              </div>
            ) : (
              <p className="text-slate-400 text-xs mb-8">
                Don&apos;t see it? Check your <strong>Spam / Junk</strong> folder.
              </p>
            )}
            <a
              href="/admin/login"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </a>
          </div>
        ) : (
          /* Form State */
          <>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Forgot Password</h1>
                <p className="text-sm text-slate-500">We&apos;ll email you a reset link</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
                  ⚠️ {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Admin Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-slate-50 placeholder-slate-400 transition-colors text-sm"
                  placeholder="rikibiswas2005@gmail.com"
                />
                <p className="text-xs text-slate-400 mt-1.5">
                  Enter the email address registered to your admin account
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Email...
                  </>
                ) : '📧 Send Reset Link'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <a
                href="/admin/login"
                className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
