import { createClient } from '@/lib/supabase/server'
import { addDepartment, deleteDepartment } from '@/lib/actions/saw'
import { Building2, Plus, Trash2, Info, Users } from 'lucide-react'
import Link from 'next/link'
export default async function DepartmentsPage() {
  const supabase = await createClient()
  const { data: departments } = await supabase
    .from('departemen')
    .select('*, profiles(id)')
    .order('name', { ascending: true })

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Pengelompokan Bidang / Unit</h1>
          <p className="text-slate-400 mt-1">Kelola departemen atau divisi untuk klasifikasi karyawan.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Add Form */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 h-fit sticky top-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Plus size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Tambah Bidang</h2>
          </div>

          <form action={addDepartment} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Nama Bidang / Unit</label>
              <input
                name="name"
                type="text"
                required
                placeholder="Contoh: IT Support, Keuangan"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95 uppercase tracking-widest text-sm"
            >
              Simpan Bidang
            </button>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2 space-y-4">
          {departments?.map((dept) => (
            <div 
              key={dept.id} 
              className="relative bg-white/5 border border-white/10 rounded-[2rem] p-6 flex items-center justify-between group hover:border-white/20 transition-all hover:bg-white/[0.03]"
            >
              <Link 
                href={`/dashboard/admin/departments/${dept.id}`}
                className="absolute inset-0 z-0 rounded-[2rem]"
                aria-label={`Lihat detail ${dept.name}`}
              />

              <div className="flex items-center gap-6 relative z-10 pointer-events-none">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500">
                  <Building2 size={28} className="group-hover:text-indigo-400 transition-colors" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg group-hover:text-indigo-400 transition-colors">{dept.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-slate-500" />
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                        {dept.profiles?.length || 0} Karyawan
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 relative z-10">
                <span className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all pointer-events-none">
                  Lihat Detail
                </span>
                <form action={async () => {
                  'use server'
                  await deleteDepartment(dept.id)
                }}>
                  <button className="p-3 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-400/10 rounded-xl relative z-20 cursor-pointer">
                    <Trash2 size={20} />
                  </button>
                </form>
              </div>
            </div>
          ))}

          {(!departments || departments.length === 0) && (
            <div className="bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] p-20 text-center">
              <Info className="mx-auto text-slate-700 mb-6" size={64} />
              <h3 className="text-white font-bold text-xl">Belum Ada Bidang</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">
                Kelompokkan karyawan Anda ke dalam unit atau bidang kerja tertentu.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
