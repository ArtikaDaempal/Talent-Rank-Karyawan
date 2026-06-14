'use client'

import { useState } from 'react'
import { updateProfile } from '@/lib/actions/auth'
import { 
  User, 
  Mail, 
  Hash, 
  Briefcase, 
  Building2, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react'

export default function ProfileForm({ 
  profile, 
  departments 
}: { 
  profile: any, 
  departments: any[] | null 
}) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)
    const result = await updateProfile(formData)
    setLoading(false)

    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Profil Pengguna</h1>
          <p className="text-slate-500 font-medium mt-1">Kelola informasi pribadi dan posisi Anda di perusahaan.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Avatar & Info */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-center space-y-6 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-600 to-violet-700 opacity-20"></div>
            <div className="relative z-10 pt-8">
              <div className="w-24 h-24 rounded-3xl bg-indigo-500/10 border border-white/10 mx-auto flex items-center justify-center text-4xl font-black text-indigo-400 shadow-xl">
                {profile.full_name?.[0]}
              </div>
              <div className="mt-6">
                <h2 className="text-xl font-black text-white">{profile.full_name}</h2>
                <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mt-1">{profile.role}</p>
              </div>
              <div className="mt-8 pt-8 border-t border-white/5 text-left space-y-4">
                <div className="flex items-center gap-3 text-slate-400">
                  <Mail size={16} className="text-slate-600" />
                  <span className="text-xs font-medium">{profile.email || 'Email tidak tersedia'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <Hash size={16} className="text-slate-600" />
                  <span className="text-xs font-medium">{profile.employee_id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl">
            <form action={handleSubmit} className="space-y-6">
              {message && (
                <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                  message.type === 'success' 
                    ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span className="text-sm font-bold">{message.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      name="fullName"
                      type="text"
                      defaultValue={profile.full_name}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">NIK / ID Pegawai</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      name="employeeId"
                      type="text"
                      defaultValue={profile.employee_id}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Jabatan / Posisi</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      name="position"
                      type="text"
                      defaultValue={profile.position || ''}
                      placeholder="Contoh: Senior Operator"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Bidang / Unit</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <select
                      name="departemenId"
                      defaultValue={profile.departemen_id || 'none'}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-sm"
                    >
                      <option value="none" className="bg-[#0f172a]">Tanpa Bidang / Lainnya</option>
                      {departments?.map(d => (
                        <option key={d.id} value={d.id} className="bg-[#0f172a]">{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                  disabled={loading}
                  type="submit"
                  className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Save size={20} />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
