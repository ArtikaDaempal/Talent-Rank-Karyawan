import { createClient } from '@/lib/supabase/server'
import { Trophy, Star, Target, TrendingUp } from 'lucide-react'

export default async function EmployeeDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const period = 'April 2026'

  // Fetch personal rank
  const { data: myRank } = await supabase
    .from('hasil_spk')
    .select('*, profiles(full_name)')
    .eq('employee_id', user?.id)
    .eq('period', period)
    .single()

  // Fetch personal scores
  const { data: scores } = await supabase
    .from('penilaian')
    .select('*, kriteria(name, weight)')
    .eq('employee_id', user?.id)
    .eq('period', period)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Personal Performance</h1>
            <p className="text-indigo-100 opacity-80">Period: {period}</p>
            
            <div className="mt-12 flex items-baseline gap-4">
              <span className="text-8xl font-black tracking-tighter">
                {myRank ? `#${myRank.rank}` : '--'}
              </span>
              <span className="text-xl font-medium text-indigo-100">Current Rank</span>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10 flex gap-12">
              <div>
                <p className="text-indigo-200 text-sm mb-1 uppercase tracking-wider font-bold">Total Score</p>
                <p className="text-3xl font-black">{myRank ? Number(myRank.saw_score).toFixed(4) : '0.0000'}</p>
              </div>
              <div>
                <p className="text-indigo-200 text-sm mb-1 uppercase tracking-wider font-bold">Status</p>
                <p className="text-3xl font-black">{myRank?.rank <= 3 ? 'Elite' : 'Active'}</p>
              </div>
            </div>
          </div>
          <Star className="absolute right-0 top-0 text-white/10 -mr-16 -mt-16" size={320} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="text-indigo-400" size={20} />
            Score Breakdown
          </h2>
          <div className="space-y-6">
            {scores?.map((s) => (
              <div key={s.id}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300 font-medium">{s.kriteria.name}</span>
                  <span className="text-white font-bold">{s.score}/100</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${s.score}%` }}
                  />
                </div>
              </div>
            ))}
            {(!scores || scores.length === 0) && (
              <p className="text-slate-500 text-center py-4">No scores recorded yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 mb-6">
            <TrendingUp size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Improvement Tip</h2>
          <p className="text-slate-400 leading-relaxed">
            {scores?.some(s => s.score < 70) 
              ? "Focus on improving your scores in lower-rated criteria to boost your overall ranking."
              : "Great job maintaining high scores across all criteria! Consistency is key."
            }
          </p>
        </div>
      </div>
    </div>
  )
}
