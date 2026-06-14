import { createClient } from '@/lib/supabase/server'
import { Users, UserPlus, Trash2, Hash, Briefcase, Building2, ShieldCheck, UserCog } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import DepartmentSelector from '@/components/dashboard/DepartmentSelector'
import { updateEmployeeRole } from '@/lib/actions/auth'

export default async function EmployeesPage() {
  const supabase = await createClient()
  
  const { data: employees } = await supabase
    .from('profiles')
    .select('*, departemen(name)')
    .neq('role', 'admin')
    .order('created_at', { ascending: false })

  const { data: departments } = await supabase
    .from('departemen')
    .select('*')
    .order('name', { ascending: true })

  async function deleteUser(id: string) {
    'use server'
    const supabase = await createClient()
    await supabase.from('profiles').delete().eq('id', id)
    revalidatePath('/dashboard/admin/employees')
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
            <UserCog size={14} />
            HR Administration
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Manajemen Karyawan</h1>
          <p className="text-slate-400 font-medium">Kelola hak akses, penempatan bidang, dan data master personil.</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-[2rem] px-8 py-4 flex items-center gap-4 shadow-xl">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Terdaftar</p>
            <p className="text-2xl font-black text-white leading-none">{employees?.length || 0} Personil</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {employees?.map((emp) => (
          <div 
            key={emp.id} 
            className="relative overflow-hidden bg-[#0f172a]/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:bg-[#0f172a]/60 hover:border-white/20 transition-all group shadow-2xl"
          >
            {/* Background Glow on Hover */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-600/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex items-center gap-8 relative z-10">
              <div className="relative">
                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-indigo-500/20 to-violet-700/20 border border-white/10 flex items-center justify-center text-indigo-400 font-black text-2xl group-hover:scale-105 transition-transform duration-500 shadow-inner">
                  {emp.full_name?.[0]}
                </div>
                {emp.role === 'admin' && (
                  <div className="absolute -top-2 -right-2 p-2 rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/40 ring-4 ring-[#0f172a]">
                    <ShieldCheck size={14} />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors">{emp.full_name}</h3>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${
                    emp.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                    emp.role === 'manager' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
                    'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                  }`}>
                    {emp.role}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 text-[11px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-indigo-500/60" />
                    {emp.employee_id}
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-indigo-500/60" />
                    {emp.position || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-indigo-400" />
                    <span className={emp.departemen?.name ? 'text-indigo-400' : 'text-slate-700 italic'}>
                      {emp.departemen?.name || 'Tanpa Bidang'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 relative z-10 self-end lg:self-auto">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Penempatan Unit</p>
                <DepartmentSelector 
                  employeeId={emp.id} 
                  departments={departments} 
                  currentDeptId={emp.departemen_id} 
                />
              </div>

              <div className="flex items-center gap-3 pt-4 lg:pt-0">
                {emp.role !== 'admin' && (
                  <form action={updateEmployeeRole.bind(null, emp.id, emp.role)}>
                    <button className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-lg active:scale-95
                      ${emp.role === 'manager' 
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500 hover:text-white hover:shadow-amber-500/20' 
                        : 'bg-indigo-600 text-white border-transparent hover:bg-indigo-500 hover:shadow-indigo-500/40'}
                    `}>
                      {emp.role === 'manager' ? 'Demote to Emp' : 'Promote to Manager'}
                    </button>
                  </form>
                )}
                
                <form action={deleteUser.bind(null, emp.id)}>
                  <button className="w-12 h-12 flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all border border-transparent hover:border-red-500/20">
                    <Trash2 size={20} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {(!employees || employees.length === 0) && (
          <div className="bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] p-20 text-center">
            <UserPlus className="mx-auto text-slate-700 mb-6" size={64} />
            <h3 className="text-white font-bold text-xl">Belum Ada Karyawan</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">
              Karyawan akan muncul di sini setelah mereka melakukan registrasi melalui portal.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
