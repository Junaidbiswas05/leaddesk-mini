import { LoginForm } from '@/components/LoginForm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Admin Login | LeadDesk Mini',
}

export default async function LoginPage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/admin')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden bg-slate-50 px-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-[100px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] pointer-events-none opacity-50" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">LeadDesk Admin</h1>
            <p className="text-slate-500 mt-2">Sign in to manage your leads</p>
          </div>
          
          <LoginForm />
          <div className="text-center mt-4">
            <a href="/admin/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
