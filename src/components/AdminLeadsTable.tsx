'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Loader2, LogOut, UserPlus } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { CreateAdminModal } from './CreateAdminModal'

type Lead = {
  id: string
  name: string
  email: string
  budgetRange: string
  message: string
  status: string
  createdAt: string
}

export function AdminLeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [isSearching, setIsSearching] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)

  // Debounced search could be added here, but for simplicity we'll trigger on submit or let the user type and press enter.
  // Actually, let's just do a simple timeout for debounce.
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    setIsSearching(true)
    
    // Simplistic debounce
    setTimeout(() => {
      if (newQuery) {
        router.push(`/admin?q=${encodeURIComponent(newQuery)}`)
      } else {
        router.push('/admin')
      }
      setIsSearching(false)
    }, 500)
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to update status', error)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="relative">
      {showCreateAdmin && <CreateAdminModal onClose={() => setShowCreateAdmin(false)} />}

      {/* Glassmorphism shadow backplate */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/60 to-white/40 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/50 -rotate-1 scale-[1.01] transform transition-transform duration-500 hover:rotate-0 hidden md:block" />
      
      <div className="relative bg-white/80 backdrop-blur-lg border border-slate-100 rounded-2xl shadow-xl overflow-hidden">
      {/* Header Actions */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isSearching ? (
              <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />
            ) : (
              <Search className="h-4 w-4 text-slate-400" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search leads by name, email, or message..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
          />
        </div>
        
        <button
          onClick={() => setShowCreateAdmin(true)}
          className="inline-flex items-center px-4 py-2 border border-blue-200 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Admin
        </button>
        <button
          onClick={() => signOut({ callbackUrl: `${window.location.origin}/admin/login` })}
          className="inline-flex items-center px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Lead Details
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Budget
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Message
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {initialLeads.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No leads found matching your criteria.
                </td>
              </tr>
            ) : (
              initialLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">{lead.name}</span>
                      <span className="text-sm text-slate-500">{lead.email}</span>
                      <span className="text-xs text-slate-400 mt-1">
                        {new Date(lead.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {lead.budgetRange}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-md">
                    <p className="truncate" title={lead.message}>
                      {lead.message}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        disabled={updatingId === lead.id}
                        className={`block w-full pl-3 pr-8 py-1.5 text-xs font-medium rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer disabled:opacity-50 ${
                          lead.status === 'NEW' ? 'bg-amber-100 text-amber-800' :
                          lead.status === 'CONTACTED' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        <option value="NEW" className="bg-white text-slate-900">New</option>
                        <option value="CONTACTED" className="bg-white text-slate-900">Contacted</option>
                        <option value="CLOSED" className="bg-white text-slate-900">Closed</option>
                      </select>
                      {updatingId === lead.id && (
                        <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
