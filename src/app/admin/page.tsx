import { AdminLeadsTable } from '@/components/AdminLeadsTable'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Dashboard | LeadDesk Mini',
}

export const dynamic = 'force-dynamic'

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/admin/login')
  }

  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams.q || ''

  // Build where clause based on search query
  const where: Prisma.LeadWhereInput = query
    ? {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { message: { contains: query, mode: 'insensitive' } },
        ],
      }
    : {}

  // Fetch leads
  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })

  // Format dates for client component serialization
  const formattedLeads = leads.map(lead => ({
    ...lead,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  }))

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center relative overflow-hidden bg-slate-50 px-4 sm:px-6 lg:px-8 py-12">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-slate-900">Leads Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage and track your incoming leads.
          </p>
        </div>

        <AdminLeadsTable initialLeads={formattedLeads} />
      </div>
    </div>
  )
}
