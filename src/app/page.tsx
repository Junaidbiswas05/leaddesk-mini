import { LeadForm } from '@/components/LeadForm'
import { BarChart3, Users, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center relative overflow-hidden">
      {/* Header with Admin Login */}
      <div className="absolute top-0 w-full p-4 sm:p-6 flex justify-end z-50">
        <a 
          href="/admin" 
          className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Users className="w-4 h-4 mr-2 text-slate-500" />
          Admin Dashboard
        </a>
      </div>

      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Copy */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
              <span>Next-Generation Lead Management</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              Turn conversations into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">customers.</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              LeadDesk Mini is the most elegant way to capture, track, and convert your leads. Experience a seamless workflow designed for modern agencies.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Lightning Fast</h3>
                  <p className="text-sm text-slate-500 mt-1">Capture leads instantly with zero friction.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Actionable Data</h3>
                  <p className="text-sm text-slate-500 mt-1">Track status and budget effortlessly.</p>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="relative">
            {/* Glassmorphism card effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/60 to-white/40 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/50 -rotate-2 scale-[1.02] transform transition-transform duration-500 hover:rotate-0" />
            
            <div className="relative bg-white/80 backdrop-blur-lg border border-slate-100 rounded-2xl p-8 shadow-xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Let's build together</h2>
                <p className="text-slate-500">Fill out the form below and our team will get in touch within 24 hours.</p>
              </div>
              
              <LeadForm />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
