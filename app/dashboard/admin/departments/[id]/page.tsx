import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Users, Building2, Briefcase, Hash, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function DepartmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  // Fetch department details
  const { data: department } = await supabase
    .from('departemen')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (!department) {
    notFound()
  }

  // Fetch employees in this department
  const { data: employees } = await supabase
    .from('profiles')
    .select('*')
    .eq('departemen_id', resolvedParams.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/admin/departments" 
          className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-slate-400 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Building2 className="text-indigo-500" />
            {department.name}
          </h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            <Users size={16} />
            Total {employees?.length || 0} Karyawan
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {employees && employees.length > 0 ? (
          employees.map((emp) => (
            <div 
              key={emp.id} 
              className="bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:bg-white/[0.03] hover:border-white/20 transition-all flex items-center gap-6 group"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-700/20 border border-white/10 flex items-center justify-center text-indigo-400 font-black text-xl shadow-inner group-hover:scale-105 transition-transform">
                  {emp.full_name?.[0]}
                </div>
                {emp.role === 'manager' && (
                  <div className="absolute -top-2 -right-2 p-1.5 rounded-lg bg-amber-500 text-white shadow-lg shadow-amber-500/40 ring-2 ring-[#0f172a]">
                    <ShieldCheck size={12} />
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{emp.full_name}</h3>
                <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${
                  emp.role === 'manager' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                  'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                }`}>
                  {emp.role}
                </span>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">
                  <div className="flex items-center gap-1.5">
                    <Hash size={12} className="text-indigo-500/60" />
                    {emp.employee_id}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase size={12} className="text-indigo-500/60" />
                    {emp.position || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] p-16 text-center">
            <Users className="mx-auto text-slate-700 mb-4" size={48} />
            <h3 className="text-white font-bold text-lg">Belum Ada Karyawan</h3>
            <p className="text-slate-500 text-sm mt-1">
              Belum ada personil yang ditempatkan pada bidang ini.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
