import { Suspense } from 'react'
import ResetPasswordForm from '@/components/ResetPasswordForm'

export const metadata = {
  title: 'Reset Password | LeadDesk Mini',
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden bg-slate-50 px-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-[100px] pointer-events-none opacity-50" />
      <div className="w-full max-w-md relative z-10 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Create New Password</h1>
          <p className="text-slate-500 mt-2">Please enter your new password below.</p>
        </div>

        <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
