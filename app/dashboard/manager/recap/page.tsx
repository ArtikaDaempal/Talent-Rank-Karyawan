import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CheckCircle2, AlertCircle, FileText, ArrowRight, Building2, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default async function ManagerRecapPage() {
  const supabase = await createClient()
  const period = 'April 2026'

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: me } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch criteria for displaying scores
  const { data: criteria } = await supabase.from('kriteria').select('*').order('created_at', { ascending: true })
  
  // Fetch departments
  const { data: departments } = await supabase.from('departemen').select('*').order('name', { ascending: true })

  // Fetch employees based on role
  let employeesQuery = supabase
    .from('profiles')
    .select('*, departemen(name)')
    .order('role', { ascending: true }) // manager first, then employee
    .order('full_name', { ascending: true })

  if (me?.role === 'manager') {
    // Manager sees only their department's employees
    employeesQuery = employeesQuery
      .eq('departemen_id', me.departemen_id)
      .eq('role', 'employee')
      .neq('id', me.id)
  } else if (me?.role === 'admin') {
    // Admin sees managers and employees
    employeesQuery = employeesQuery.in('role', ['manager', 'employee'])
  }

  const { data: employees } = await employeesQuery

  // Fetch evaluations already done
  const { data: evaluations } = await supabase
    .from('penilaian')
    .select('*')
    .eq('period', period)

  const evalMap = new Map() // employee_id -> evaluation[]
  evaluations?.forEach(e => {
    if (!evalMap.has(e.employee_id)) evalMap.set(e.employee_id, [])
    evalMap.get(e.employee_id).push(e)
  })

  // Group employees by department
  const groupedEmployees = new Map()
  departments?.forEach(d => groupedEmployees.set(d.id, { ...d, employees: [] }))
  groupedEmployees.set('umum', { id: 'umum', name: 'Umum / Tanpa Bidang', employees: [] })

  let total = 0
  let done = 0

  employees?.forEach(emp => {
    const deptId = emp.departemen_id || 'umum'
    if (groupedEmployees.has(deptId)) {
      groupedEmployees.get(deptId).employees.push(emp)
      total++
      if (evalMap.has(emp.id)) {
        done++
      }
    }
  })

  const pending = total - done
  const displayDepartments = Array.from(groupedEmployees.values()).filter(d => d.employees.length > 0)

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
          <FileText size={14} />
          Rekapitulasi Evaluasi
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter">Status Penilaian</h1>
        <p className="text-slate-400 font-medium">
          Daftar seluruh karyawan yang wajib dinilai beserta detail nilai dari Manajer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col justify-center">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Tanggungan</p>
          <p className="text-4xl font-black text-white">{total} <span className="text-lg text-slate-500">Orang</span></p>
        </div>
        <div className="bg-green-500/5 border border-green-500/10 rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CheckCircle2 size={120} className="text-green-500" />
          </div>
          <p className="text-green-500/80 text-[10px] font-black uppercase tracking-widest mb-2">Selesai Dinilai</p>
          <p className="text-4xl font-black text-green-400 relative z-10">{done} <span className="text-lg text-green-500/50">Orang</span></p>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertCircle size={120} className="text-amber-500" />
          </div>
          <p className="text-amber-500/80 text-[10px] font-black uppercase tracking-widest mb-2">Pending</p>
          <p className="text-4xl font-black text-amber-400 relative z-10">{pending} <span className="text-lg text-amber-500/50">Orang</span></p>
        </div>
      </div>

      <div className="space-y-6">
        {displayDepartments.map((dept, index) => (
          <details 
            key={dept.id} 
            className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-white/20 transition-all [&_summary::-webkit-details-marker]:hidden"
            open={displayDepartments.length === 1 || index === 0}
          >
            <summary className="px-8 py-6 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] outline-none">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800/50 border border-white/5 flex items-center justify-center text-slate-400">
                  <Building2 size={24} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{dept.name}</h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                    {dept.employees.length} Karyawan
                  </p>
                </div>
              </div>
              <ChevronDown size={20} className="text-slate-500 group-open:rotate-180 transition-transform" />
            </summary>
            
            <div className="px-8 pb-8 pt-4 border-t border-white/5 bg-white/[0.01] space-y-6">
              {dept.employees.map((emp: any) => {
                const isDone = evalMap.has(emp.id)
                const empEvals = evalMap.get(emp.id) || []

                return (
                  <div key={emp.id} className="p-6 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/10 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xl">
                          {emp.full_name?.[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="text-white font-bold text-xl">{emp.full_name}</h4>
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${emp.role === 'manager' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                              {emp.role}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1.5 flex items-center gap-2">
                            ID: {emp.employee_id || 'N/A'} <span className="w-1 h-1 rounded-full bg-slate-700"></span> {emp.position || 'Staff'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {isDone ? (
                          <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-2.5 rounded-xl border border-green-400/20">
                            <CheckCircle2 size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">
                              {me?.role === 'admin' ? 'Selesai' : 'Sudah Dikirim ke Admin'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-4 py-2.5 rounded-xl border border-amber-400/20">
                            <AlertCircle size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Belum Dinilai</span>
                          </div>
                        )}

                        {!isDone && me?.role === 'manager' && (
                          <Link 
                            href="/dashboard/manager/scoring"
                            className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 hover:scale-105 transition-all shadow-lg shadow-indigo-600/20"
                          >
                            <ArrowRight size={20} />
                          </Link>
                        )}
                        {!isDone && me?.role === 'admin' && emp.role === 'manager' && (
                          <Link 
                            href="/dashboard/manager/scoring"
                            className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 hover:scale-105 transition-all shadow-lg shadow-indigo-600/20"
                          >
                            <ArrowRight size={20} />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Display Scores if Evaluated */}
                    {isDone && criteria && criteria.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-white/5">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4">Detail Nilai KPI</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {criteria.map(c => {
                            const ev = empEvals.find((e: any) => e.kriteria_id === c.id)
                            return (
                              <div key={c.id} className="bg-black/20 rounded-xl p-4 border border-white/5 flex flex-col justify-between gap-3">
                                <p className="text-[9px] text-slate-400 uppercase tracking-widest leading-relaxed line-clamp-2">{c.name}</p>
                                <p className="text-2xl font-black text-indigo-400">{ev ? ev.score : '-'}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {dept.employees.length === 0 && (
                <div className="p-8 text-center text-slate-500 font-medium">
                  Tidak ada karyawan di bidang ini.
                </div>
              )}
            </div>
          </details>
        ))}

        {displayDepartments.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-16 text-center text-slate-500 font-medium">
            Tidak ada karyawan yang ditemukan.
          </div>
        )}
      </div>
    </div>
  )
}
