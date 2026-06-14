import { createClient } from '@/lib/supabase/server'
import { calculateSAW } from '@/lib/actions/saw'
import { 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  ClipboardList, 
  Trophy,
  ArrowRight,
  Info,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default async function CalculatePage() {
  const supabase = await createClient()
  const period = 'April 2026'

  // Fetch status info
  const { count: totalEmployees } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .neq('role', 'admin')

  const { data: evaluations } = await supabase
    .from('penilaian')
    .select('employee_id')
    .eq('period', period)

  const evaluatedIds = new Set(evaluations?.map(e => e.employee_id))
  const evaluatedCount = evaluatedIds.size
  const pendingCount = (totalEmployees || 0) - evaluatedCount
  const progress = totalEmployees ? (evaluatedCount / totalEmployees) * 100 : 0

  // Fetch current rankings
  const { data: currentRanking } = await supabase
    .from('hasil_spk')
    .select('*, profiles(full_name)')
    .eq('period', period)
    .order('rank', { ascending: true })

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
          <Zap size={14} fill="currentColor" />
          Engine Pemrosesan SAW
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter leading-none">Kalkulasi Peringkat</h1>
        <p className="text-slate-500 font-medium text-lg">Proses data evaluasi menjadi urutan peringkat performa karyawan secara objektif.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Status and Control */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-all duration-700"></div>
            
            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Progress Evaluasi</p>
                  <p className="text-2xl font-black text-white">{Math.round(progress)}%</p>
                </div>
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-green-400 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 size={12} />
                    Selesai
                  </div>
                  <p className="text-3xl font-black text-white">{evaluatedCount}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 text-[10px] font-black uppercase tracking-widest">
                    <AlertCircle size={12} />
                    Pending
                  </div>
                  <p className="text-3xl font-black text-white">{pendingCount}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <form action={calculateSAW}>
                  <button className="w-full relative group/btn flex items-center justify-center gap-4 bg-white text-black px-8 py-5 rounded-2xl font-black shadow-2xl hover:bg-indigo-50 transition-all active:scale-95 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                    <Sparkles size={20} className="text-indigo-600" />
                    Jalankan Analisis SAW
                  </button>
                </form>
                <p className="text-[9px] text-center text-slate-500 mt-4 font-black uppercase tracking-widest leading-relaxed">
                  *Kalkulasi akan memperbarui seluruh peringkat <br /> karyawan di periode {period}.
                </p>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2rem] p-8 space-y-4">
            <h4 className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
              <Info size={14} />
              Informasi Metodologi
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Sistem akan melakukan normalisasi matriks penilaian dan mengalikannya dengan bobot kriteria (KPI) yang telah diatur sebelumnya. Hasil akhirnya adalah skor 0-1 yang menentukan peringkat.
            </p>
          </div>
        </div>

        {/* Right: Preview Ranking */}
        <div className="lg:col-span-7">
          <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-white font-black text-sm uppercase tracking-widest">Preview Peringkat Saat Ini</h3>
              <Link href="/dashboard" className="text-[10px] font-black text-indigo-500 hover:text-indigo-400 uppercase tracking-widest flex items-center gap-1 group">
                Detail Dashboard
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="divide-y divide-white/5">
              {currentRanking?.slice(0, 5).map((r) => (
                <div key={r.id} className="px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-indigo-400 border border-white/5">
                      #{r.rank}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{r.profiles.full_name}</p>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">Skor: {Number(r.saw_score).toFixed(4)}</p>
                    </div>
                  </div>
                  {r.rank <= 3 && (
                    <Trophy size={20} className={r.rank === 1 ? 'text-amber-400' : r.rank === 2 ? 'text-slate-400' : 'text-orange-600'} />
                  )}
                </div>
              ))}

              {(!currentRanking || currentRanking.length === 0) && (
                <div className="px-8 py-20 text-center space-y-4">
                  <ClipboardList className="mx-auto text-slate-800" size={48} />
                  <p className="text-slate-500 text-sm font-medium">Belum ada data peringkat yang diproses.</p>
                </div>
              )}
            </div>
            
            {currentRanking && currentRanking.length > 5 && (
              <div className="px-8 py-4 bg-white/[0.01] text-center border-t border-white/5">
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
                  + {currentRanking.length - 5} Karyawan Lainnya
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
