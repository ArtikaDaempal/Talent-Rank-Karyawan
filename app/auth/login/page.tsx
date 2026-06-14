'use client'

import { useState } from 'react'
import { login } from '@/lib/actions/auth'
import Link from 'next/link'
import { LogIn, Mail, Lock, Loader2, ArrowLeft, ShieldCheck, Zap, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#020617] relative overflow-hidden">
      {/* Left Side: Visual Experience (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="/corporate_auth_bg_1777491148149.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617]/80"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/20 via-transparent to-[#020617]"></div>
        </div>

        <div className="relative z-10 max-w-xl space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
              <ShieldCheck size={16} />
              Enterprise Security Verified
            </div>
            <h1 className="text-7xl font-black text-white tracking-tighter leading-[0.85]">
              Platform <br />
              Evaluasi <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Terpercaya.</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed">
              Masuk ke portal TalentRank untuk mengelola performa tim dan melihat hasil analisis SAW secara instan.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="space-y-2">
              <div className="text-3xl font-black text-white">99.9%</div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Uptime System</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-black text-white">SAW</div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logic Algorithm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 relative z-10 bg-[#020617]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -mt-48 -mr-48"></div>
        
        <div className="w-full max-w-md space-y-10">
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
              <h2 className="text-4xl font-black text-white tracking-tight">Selamat Datang.</h2>
              <p className="text-slate-500 font-medium text-lg">Silakan masuk menggunakan akun perusahaan Anda.</p>
            </div>
          </div>

          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Alamat Email Resmi</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="nama@perusahaan.com"
                    className="w-full bg-[#0f172a] border border-white/5 rounded-2xl py-5 pl-14 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Kata Sandi</label>
                <Link href="#" className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400">Lupa Sandi?</Link>
              </div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#0f172a] border border-white/5 rounded-2xl py-5 pl-14 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/5 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in zoom-in-95">
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
                  <LogIn size={18} />
                  Otoritasi Masuk
                </>
              )}
            </button>
          </form>

          <div className="pt-8 text-center border-t border-white/5">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
              Belum terdaftar?{' '}
              <Link href="/auth/register" className="text-white font-black hover:text-indigo-400 transition-colors">
                Buat Akun Perusahaan
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
