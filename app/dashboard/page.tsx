import { createClient } from '@/lib/supabase/server'
import { calculateSAW } from '@/lib/actions/saw'
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Medal,
  Target,
  Building2,
  Calendar,
  Briefcase,
  ArrowUpRight,
  Filter,
  Sparkles,
  Zap,
  Star
} from 'lucide-react'
import Link from 'next/link'
import DepartmentFilter from '@/components/dashboard/DepartmentFilter'

export default async function DashboardOverview({ 
  searchParams 
}: { 
  searchParams: Promise<{ dept?: string }> 
}) {
  const { dept: deptFilter } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, departemen(name)')
    .eq('id', user?.id)
    .single()

  const period = 'April 2026'

  // Fetch Departments for filter
  const { data: departments } = await supabase.from('departemen').select('*').order('name', { ascending: true })

  // Fetch Stats (Role-Aware)
  let employeeCountQuery = supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'employee')

  if (profile?.role === 'manager') {
    employeeCountQuery = employeeCountQuery.eq('departemen_id', profile.departemen_id)
  }

  const { count: totalEmployees } = await employeeCountQuery
  const { count: totalCriteria } = await supabase.from('kriteria').select('*', { count: 'exact', head: true })
  
  // Evaluated count logic (also role-aware for manager)
  let evaluationsQuery = supabase.from('penilaian').select('employee_id, profiles!inner(departemen_id)').eq('period', period)
  if (profile?.role === 'manager') {
    evaluationsQuery = evaluationsQuery.eq('profiles.departemen_id', profile.departemen_id)
  }
  
  const { data: evaluations } = await evaluationsQuery
  const totalEvaluated = new Set(evaluations?.map(e => e.employee_id)).size

  // Fetch Ranking with Filter
  let rankingQuery = supabase
    .from('hasil_spk')
    .select('*, profiles!inner(full_name, employee_id, position, departemen_id, departemen(name))')
    .eq('period', period)
    .order('rank', { ascending: true })

  if (deptFilter && deptFilter !== 'all') {
    rankingQuery = rankingQuery.eq('profiles.departemen_id', deptFilter)
  }

  const { data: ranking } = await rankingQuery

  const myRank = ranking?.find(r => r.employee_id === user?.id)

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      {/* Premium Welcome Section */}
      <div className="relative group">
        {/* Animated Background Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative overflow-hidden bg-[#0f172a]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 lg:p-14 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[32rem] h-[32rem] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-80 h-80 bg-purple-500/10 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] shadow-inner">
                <Sparkles size={14} className="animate-spin-slow" />
                Performance Dashboard v2.0
              </div>
              
              <div className="space-y-2">
                <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">
                  Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400">{profile?.full_name?.split(' ')[0]}!</span>
                </h1>
                <p className="text-slate-400 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed">
                  Selamat datang kembali di <span className="text-white font-bold">TalentRank Portal</span>. 
                  Pantau performa objektif dan hasil evaluasi tim Anda secara real-time.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-8 pt-4">
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-slate-300">
                  <Calendar size={18} className="text-indigo-400" />
                  <span className="text-xs font-black uppercase tracking-widest">{period}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <Filter size={16} className="text-slate-500" />
                  </div>
                  <DepartmentFilter departments={departments} currentDept={deptFilter || 'all'} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {profile?.role === 'admin' && (
                <form action={calculateSAW}>
                  <button className="group relative flex items-center gap-4 bg-white text-black px-10 py-5 rounded-[2rem] font-black shadow-2xl hover:bg-indigo-50 transition-all active:scale-95 whitespace-nowrap uppercase tracking-widest text-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <Zap size={20} className="fill-black" />
                    Run SAW Analysis
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* User Status Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-700"></div>
            <div className="relative bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mt-16 -mr-16 blur-2xl"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-violet-600 p-1">
                    <div className="w-full h-full rounded-[1.8rem] bg-[#0f172a] flex items-center justify-center text-4xl font-black text-white">
                      {profile?.full_name?.[0]}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-green-500 border-4 border-[#0f172a] flex items-center justify-center shadow-lg shadow-green-500/40">
                    <CheckCircle2 size={18} className="text-white" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-3xl font-black text-white tracking-tight leading-tight">{profile?.full_name}</h4>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <Briefcase size={12} />
                    {profile?.position || 'Pegawai'}
                  </div>
                </div>

                <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                  <div className="text-left space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ID Pegawai</p>
                    <p className="text-sm font-bold text-slate-200">{profile?.employee_id}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Bidang</p>
                    <p className="text-sm font-bold text-indigo-400">{profile?.departemen?.name || 'Umum'}</p>
                  </div>
                </div>

                {profile?.role === 'employee' && myRank && (
                  <div className="w-full mt-4 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 shadow-inner group-hover:scale-[1.02] transition-transform">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Peringkat Anda</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-white">#{myRank.rank}</span>
                          <span className="text-xs font-bold text-slate-500">/{ranking?.length}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Skor SAW</p>
                        <p className="text-2xl font-black text-white">{Number(myRank.saw_score).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Key Stats Cards */}
          <div className="grid grid-cols-1 gap-6">
            <div className="group bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-xl hover:bg-indigo-600/5 hover:border-indigo-500/20 transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Users size={28} />
                </div>
                <div className="h-2 w-12 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-indigo-500"></div>
                </div>
              </div>
              <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Total Karyawan</p>
              <h3 className="text-5xl font-black text-white mt-2 group-hover:scale-110 transition-transform origin-left duration-500">{totalEmployees || 0}</h3>
            </div>

            <div className="group bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-xl hover:bg-green-600/5 hover:border-green-500/20 transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                  <Target size={28} />
                </div>
                <div className="h-2 w-12 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[45%] bg-green-500"></div>
                </div>
              </div>
              <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Karyawan Dinilai</p>
              <h3 className="text-5xl font-black text-white mt-2 group-hover:scale-110 transition-transform origin-left duration-500">{totalEvaluated || 0}</h3>
            </div>
          </div>
        </div>

        {/* Content Column: Leaderboard */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-[#0f172a]/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)]">
            <div className="px-10 py-10 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-8 bg-gradient-to-r from-white/[0.02] to-transparent">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute -inset-2 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative p-4 rounded-[1.5rem] bg-indigo-600 text-white shadow-xl shadow-indigo-500/40">
                    <Trophy size={32} />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter">Leaderboard Performa</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Analisis SAW</span>
                    <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                    <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">{deptFilter === 'all' ? 'Seluruh Unit' : 'Unit Spesifik'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Star size={14} className="text-amber-400" />
                Updated Today
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                    <th className="px-12 py-8 text-center w-32">Rank</th>
                    <th className="px-10 py-8">Karyawan & Unit Kerja</th>
                    <th className="px-12 py-8 text-right">Performa Akhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {ranking?.map((row) => (
                    <tr key={row.id} className={`group hover:bg-white/[0.02] transition-all duration-300 ${row.employee_id === user?.id ? 'bg-indigo-500/5' : ''}`}>
                      <td className="px-12 py-10">
                        <div className={`mx-auto w-14 h-14 rounded-[1.5rem] flex items-center justify-center font-black text-xl shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6
                          ${row.rank === 1 ? 'bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 text-amber-950 shadow-amber-500/40 ring-4 ring-amber-400/20' : 
                            row.rank === 2 ? 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-500 text-slate-950 shadow-slate-400/30 ring-4 ring-slate-400/20' : 
                            row.rank === 3 ? 'bg-gradient-to-br from-orange-600 via-orange-700 to-orange-900 text-white shadow-orange-900/30 ring-4 ring-orange-900/20' : 
                            'bg-white/[0.03] text-slate-500 border border-white/5 group-hover:text-indigo-400 group-hover:border-indigo-500/30'}
                        `}>
                          {row.rank === 1 ? <Medal size={28} /> : row.rank}
                        </div>
                      </td>
                      <td className="px-10 py-10">
                        <div className="flex items-center gap-8">
                          <div className="relative group/avatar">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-0 group-hover/avatar:opacity-20 transition duration-500"></div>
                            <div className="relative w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 font-black text-2xl transition-transform duration-700 group-hover:scale-105 group-hover:bg-white/10">
                              {row.profiles.full_name?.[0]}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-white text-xl font-bold tracking-tight group-hover:text-indigo-400 transition-colors">{row.profiles.full_name}</p>
                            <div className="flex items-center gap-3">
                              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{row.profiles.position || 'Employee'}</span>
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                              <span className="px-3 py-1 rounded-lg bg-indigo-500/5 text-indigo-400/80 text-[10px] font-black uppercase tracking-[0.15em] border border-indigo-500/10">
                                {row.profiles.departemen?.name || 'Umum'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-10 text-right">
                        <div className="inline-flex flex-col items-end gap-1.5 p-4 rounded-[1.5rem] bg-white/[0.02] border border-white/5 group-hover:border-indigo-500/20 group-hover:bg-indigo-500/[0.02] transition-all shadow-inner">
                          <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-indigo-500" />
                            <span className="text-white font-mono text-3xl font-black tracking-tighter">{Number(row.saw_score).toFixed(4)}</span>
                          </div>
                          <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Final Weight Index</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {(!ranking || ranking.length === 0) && (
                    <tr>
                      <td colSpan={3} className="px-10 py-40 text-center">
                        <div className="max-w-xs mx-auto space-y-6">
                          <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-dashed border-white/10 flex items-center justify-center mx-auto">
                            <AlertCircle className="text-slate-800" size={48} />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-white font-black text-2xl uppercase tracking-tighter">No Data Available</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                              Hasil ranking untuk bidang ini belum diproses untuk periode {period}.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
