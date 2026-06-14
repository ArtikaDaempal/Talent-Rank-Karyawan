import { createClient } from '@/lib/supabase/server'
import { saveEvaluation } from '@/lib/actions/saw'
import { User, ClipboardList, CheckCircle2, AlertCircle, Search } from 'lucide-react'

export default async function ScoringPage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  const { data: me } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser?.id)
    .single()

  // Fetch criteria
  const { data: criteria } = await supabase.from('kriteria').select('*').order('created_at', { ascending: true })
  
  // Role-based filtering logic
  let employeesQuery = supabase.from('profiles').select('*, departemen(name)').order('full_name', { ascending: true })

  if (me?.role === 'manager') {
    // Managers assess employees in their department (excluding themselves and other managers)
    employeesQuery = employeesQuery
      .eq('departemen_id', me.departemen_id)
      .eq('role', 'employee')
      .neq('id', me.id)
  } else if (me?.role === 'admin') {
    // Admin assesses Managers
    employeesQuery = employeesQuery.eq('role', 'manager')
  } else {
    // Employees cannot assess anyone
    employeesQuery = employeesQuery.eq('id', '00000000-0000-0000-0000-000000000000') // Dummy to return empty
  }

  const { data: employees } = await employeesQuery

  // Fetch existing evaluations for current period
  const period = 'April 2026'
  const { data: evaluations } = await supabase
    .from('penilaian')
    .select('employee_id')
    .eq('period', period)

  const evaluatedEmployeeIds = new Set(evaluations?.map(e => e.employee_id))

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
            <ClipboardList size={14} />
            Modul Evaluasi
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Penilaian Kinerja</h1>
          <p className="text-slate-400 font-medium">Input skor performa karyawan berdasarkan kriteria KPI perusahaan.</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Cari Nama Karyawan..." 
            className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all w-full md:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {employees?.map((emp) => {
          const isDone = evaluatedEmployeeIds.has(emp.id)
          
          return (
            <div 
              key={emp.id} 
              className={`relative overflow-hidden bg-white/5 border border-white/10 rounded-[2.5rem] p-8 transition-all group hover:border-white/20 shadow-xl ${isDone ? 'opacity-80' : ''}`}
            >
              {/* Progress Indicator */}
              <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest border-l border-b transition-all
                ${isDone 
                  ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}
              `}>
                {isDone ? 'Selesai Dinilai' : 'Menunggu Penilaian'}
              </div>

              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 font-black text-2xl group-hover:scale-105 transition-transform duration-500">
                  {emp.full_name?.[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">{emp.full_name}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-slate-500 text-sm font-medium">
                    <span>{emp.position || 'Employee'}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span className="text-indigo-400/80">{emp.departemen?.name || 'Umum'}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span>{emp.employee_id}</span>
                  </div>
                </div>
              </div>

              <form action={saveEvaluation} className="space-y-6">
                <input type="hidden" name="employeeId" value={emp.id} />
                <div className="grid grid-cols-2 gap-6">
                  {criteria?.map((c) => (
                    <div key={c.id} className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-[0.15em]">
                        {c.name}
                      </label>
                      <input
                        name={c.id}
                        type="number"
                        required
                        min="1"
                        max="100"
                        placeholder="Skor 1-100"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono font-bold"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className={`w-full mt-6 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-[0.98]
                    ${isDone 
                      ? 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10' 
                      : 'bg-indigo-600 text-white shadow-indigo-500/20 hover:bg-indigo-500'}
                  `}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 size={18} />
                      Update Penilaian
                    </>
                  ) : (
                    <>
                      <ClipboardList size={18} />
                      Simpan Evaluasi
                    </>
                  )}
                </button>
              </form>
            </div>
          )
        })}

        {(!employees || employees.length === 0) && (
          <div className="col-span-full bg-white/5 border border-dashed border-white/10 rounded-[3rem] p-24 text-center">
            <div className="max-w-xs mx-auto">
              <User className="mx-auto text-slate-800 mb-6" size={80} />
              <h3 className="text-white font-bold text-xl">Data Karyawan Kosong</h3>
              <p className="text-slate-500 mt-2">Belum ada karyawan yang terdaftar di sistem untuk dinilai.</p>
            </div>
          </div>
        )}

        {employees && employees.length > 0 && (!criteria || criteria.length === 0) && (
          <div className="col-span-full bg-red-500/10 border border-red-500/20 rounded-3xl p-8 flex gap-4 items-center">
            <AlertCircle className="text-red-400" size={32} />
            <div>
              <h4 className="text-red-400 font-bold">Kriteria Belum Diatur</h4>
              <p className="text-slate-400 text-sm">Admin harus mengatur Kriteria KPI terlebih dahulu sebelum penilaian dapat dilakukan.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
