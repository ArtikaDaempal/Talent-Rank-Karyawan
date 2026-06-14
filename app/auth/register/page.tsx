'use client'

import { useState, useEffect } from 'react'
import { signUp } from '@/lib/actions/auth'
import Link from 'next/link'
import { 
  UserPlus, 
  Mail, 
  Lock, 
  Loader2, 
  User, 
  Hash, 
  Briefcase, 
  Building2, 
  ArrowLeft,
  Sparkles,
  CheckCircle2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [departments, setDepartments] = useState<any[]>([])

  useEffect(() => {
    async function fetchDepts() {
      const supabase = createClient()
      const { data } = await supabase.from('departemen').select('*').order('name', { ascending: true })
      if (data) setDepartments(data)
    }
    fetchDepts()
  }, [])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await signUp(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-8">
        <div className="absolute inset-0 z-0">
          <img src="/corporate_auth_bg_1777491148149.png" alt="BG" className="w-full h-full object-cover opacity-20 blur-xl" />
        </div>
        <div className="max-w-md w-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 text-center space-y-8 relative z-10 shadow-2xl">
          <div className="w-24 h-24 rounded-[2rem] bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto text-green-400">
            <CheckCircle2 size={48} className="animate-bounce" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white tracking-tight">Registrasi Berhasil!</h2>
            <p className="text-slate-400 font-medium leading-relaxed">Akun portal TalentRank Anda telah aktif. Silakan masuk untuk mulai menggunakan sistem.</p>
          </div>
          <Link 
            href="/auth/login" 
            className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-indigo-500/40 transition-all uppercase tracking-widest text-xs"
          >
            Lanjut ke Login Portal
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-[#020617] relative overflow-hidden">
      {/* Right Side: Visual Experience */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-20 order-2">
        <div className="absolute inset-0 z-0">
          <img 
            src="/corporate_auth_bg_1777491148149.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#020617] via-transparent to-[#020617]/80"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/20 via-transparent to-[#020617]"></div>
        </div>

        <div className="relative z-10 max-w-xl space-y-12">
          <div className="space-y-6 text-right flex flex-col items-end">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
              <Sparkles size={16} />
              Join the Talent Network
            </div>
            <h1 className="text-7xl font-black text-white tracking-tighter leading-[0.85]">
              Mulai <br />
              Karir <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Digital Anda.</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-md">
              Daftarkan diri Anda di platform TalentRank untuk mendapatkan evaluasi objektif dan peluang pengembangan yang terukur.
            </p>
          </div>
        </div>
      </div>

      {/* Left Side: Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 relative z-10 bg-[#020617] order-1 overflow-y-auto">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -mt-48 -ml-48"></div>
        
        <div className="w-full max-w-md space-y-10 py-10">
          <div className="flex flex-col gap-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Kembali ke Beranda
            </Link>

            <div className="space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden shadow-2xl shadow-indigo-500/30">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Buat Akun.</h2>
              <p className="text-slate-500 font-medium text-lg">Lengkapi data untuk bergabung ke portal TalentRank.</p>
            </div>
          </div>

          <form action={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" size={18} />
                  <input name="fullName" type="text" required placeholder="John Doe" className="w-full bg-[#0f172a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all" />
                </div>
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">NIK / ID</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" size={18} />
                  <input name="employeeId" type="text" required placeholder="12345" className="w-full bg-[#0f172a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Role Utama</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" size={18} />
                  <select name="role" required className="w-full bg-[#0f172a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all appearance-none">
                    <option value="employee" className="bg-[#0f172a]">Karyawan</option>
                    <option value="manager" className="bg-[#0f172a]">Manager</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Unit / Bidang</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" size={18} />
                  <select name="departemenId" required className="w-full bg-[#0f172a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all appearance-none">
                    <option value="none" className="bg-[#0f172a]">Pilih Unit...</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id} className="bg-[#0f172a]">{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Alamat Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" size={18} />
                <input name="email" type="email" required placeholder="nama@perusahaan.com" className="w-full bg-[#0f172a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all" />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" size={18} />
                <input name="password" type="password" required placeholder="••••••••" className="w-full bg-[#0f172a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-indigo-500/50 transition-all" />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/5 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                {error}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="group relative w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-2xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <UserPlus size={18} />
                  Konfirmasi Daftar
                </>
              )}
            </button>
          </form>

          <div className="pt-8 text-center border-t border-white/5">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
              Sudah punya akun?{' '}
              <Link href="/auth/login" className="text-white font-black hover:text-indigo-400 transition-colors">
                Masuk Disini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
