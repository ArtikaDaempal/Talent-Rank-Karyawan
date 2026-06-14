import { createClient } from '@/lib/supabase/server'
import { addCriteria, seedDefaultCriteria, deleteCriteria } from '@/lib/actions/saw'
import { Settings, Plus, Trash2, Info, Target, PieChart, Sparkles } from 'lucide-react'

export default async function CriteriaPage() {
  const supabase = await createClient()
  const { data: criteria } = await supabase.from('kriteria').select('*').order('created_at', { ascending: true })

  const totalWeight = criteria?.reduce((acc, curr) => acc + Number(curr.weight), 0) || 0

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Kriteria Penilaian (KPI)</h1>
          <p className="text-slate-400 mt-1">Kelola parameter penilaian kinerja dan bobot persentasenya.</p>
        </div>
        <div className={`px-5 py-2.5 rounded-2xl text-sm font-bold border transition-all ${totalWeight === 1 ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'}`}>
          <div className="flex items-center gap-2">
            <PieChart size={16} />
            Total Bobot: {(totalWeight * 100).toFixed(0)}%
            {totalWeight !== 1 && ' (Harus 100%)'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Add Form */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 h-fit sticky top-24 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <Plus size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Tambah Kriteria</h2>
          </div>

          <form action={addCriteria} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Nama Kriteria</label>
              <input
                name="name"
                type="text"
                required
                placeholder="Contoh: Kedisiplinan"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Bobot (%)</label>
              <input
                name="weight"
                type="number"
                required
                min="1"
                max="100"
                placeholder="Contoh: 25"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Tipe Parameter</label>
              <select
                name="type"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner cursor-pointer"
              >
                <option value="benefit" className="bg-[#0f172a]">Benefit (Semakin Tinggi Semakin Baik)</option>
                <option value="cost" className="bg-[#0f172a]">Cost (Semakin Rendah Semakin Baik)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95 uppercase tracking-widest text-sm"
            >
              Simpan Kriteria
            </button>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2 space-y-4">
          {criteria?.map((c) => (
            <div 
              key={c.id} 
              className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex items-center justify-between group hover:border-white/20 transition-all hover:bg-white/[0.03]"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500">
                  <Target size={28} className="group-hover:text-indigo-400 transition-colors" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg group-hover:text-indigo-400 transition-colors">{c.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Bobot: {(Number(c.weight) * 100).toFixed(0)}%</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-[0.1em] border ${c.type === 'benefit' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                      {c.type}
                    </span>
                  </div>
                </div>
              </div>
              
              <form action={async () => {
                'use server'
                await deleteCriteria(c.id)
              }}>
                <button className="p-3 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-400/10 rounded-xl">
                  <Trash2 size={20} />
                </button>
              </form>
            </div>
          ))}

          {(!criteria || criteria.length === 0) && (
            <div className="bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] p-20 text-center">
              <Info className="mx-auto text-slate-700 mb-6" size={64} />
              <h3 className="text-white font-bold text-xl">Belum Ada Kriteria</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2 mb-8">
                Tambahkan kriteria KPI pertama Anda untuk memulai proses evaluasi kinerja.
              </p>
              
              <form action={seedDefaultCriteria}>
                <button type="submit" className="mx-auto flex items-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 py-3 px-6 rounded-xl font-bold transition-all text-sm uppercase tracking-widest">
                  <Sparkles size={16} />
                  Generate Default KPI
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
