'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { leadSchema, LeadFormData } from '@/lib/validations'
import { Loader2, CheckCircle2 } from 'lucide-react'

export function LeadForm() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  })

  const onSubmit = async (data: LeadFormData) => {
    setServerError('')
    setIsSuccess(false)
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Something went wrong')
      }
      
      setIsSuccess(true)
      reset()
    } catch (error: any) {
      setServerError(error.message)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50/50 border border-green-200 rounded-xl p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-2xl font-semibold text-green-900 mb-2">Message Sent!</h3>
        <p className="text-green-700 mb-6">
          Thank you for reaching out. We'll get back to you shortly.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
        >
          Submit another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={`w-full px-4 py-3 rounded-lg border text-slate-900 ${
            errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
          } focus:border-transparent focus:ring-2 transition-shadow bg-white/50 backdrop-blur-sm`}
          placeholder="Jane Doe"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={`w-full px-4 py-3 rounded-lg border text-slate-900 ${
            errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
          } focus:border-transparent focus:ring-2 transition-shadow bg-white/50 backdrop-blur-sm`}
          placeholder="jane@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="budgetRange" className="block text-sm font-medium text-gray-700 mb-1">
          Project Budget
        </label>
        <select
          id="budgetRange"
          {...register('budgetRange')}
          className={`w-full px-4 py-3 rounded-lg border text-slate-900 ${
            errors.budgetRange ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
          } focus:border-transparent focus:ring-2 transition-shadow bg-white/50 backdrop-blur-sm`}
        >
          <option value="">Select a range...</option>
          <option value="<$1k">Under $1k</option>
          <option value="$1k-$5k">$1k - $5k</option>
          <option value="$5k-$20k">$5k - $20k</option>
          <option value="$20k+">$20k+</option>
        </select>
        {errors.budgetRange && (
          <p className="mt-1 text-sm text-red-500">{errors.budgetRange.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          How can we help you?
        </label>
        <textarea
          id="message"
          rows={4}
          {...register('message')}
          className={`w-full px-4 py-3 rounded-lg border text-slate-900 ${
            errors.message ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
          } focus:border-transparent focus:ring-2 transition-shadow resize-none bg-white/50 backdrop-blur-sm`}
          placeholder="Tell us about your project..."
        />
        {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
            Sending...
          </>
        ) : (
          'Get Started'
        )}
      </button>
    </form>
  )
}
