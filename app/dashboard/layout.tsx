import { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  UserCircle,
  Building2,
  Bell,
  Search,
  Command,
  ChevronRight,
  Sparkles,
  Zap,
  ClipboardList
} from 'lucide-react'
import { logout } from '@/lib/actions/auth'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, departemen(name)')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-[#020617] flex font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Sidebar - Desktop */}
      <aside className="w-80 border-r border-white/5 bg-[#020617] hidden xl:flex flex-col sticky top-0 h-screen z-50">
        {/* Logo Section */}
        <div className="p-10">
          <Link href="/dashboard" className="group flex items-center gap-4 text-white font-black text-3xl tracking-tighter">
            <div className="relative">
              <div className="absolute -inset-2 bg-indigo-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
              <div className="relative w-12 h-12 rounded-2xl bg-white overflow-hidden shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                <img src="/logo.png" alt="TalentRank Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span>Talent<span className="text-indigo-400">Rank</span></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1">Corporate</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 space-y-2 py-4 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6">Main Command</p>
          
          <NavLink href="/dashboard" icon={<LayoutDashboard size={20} />} label="Ringkasan" />
          <NavLink href="/dashboard/profile" icon={<UserCircle size={20} />} label="Profil Saya" />
          
          {profile.role === 'admin' && (
            <>
              <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mt-12 mb-6">Administration</p>
              <NavLink href="/dashboard/admin/employees" icon={<Users size={20} />} label="Data Karyawan" />
              <NavLink href="/dashboard/admin/criteria" icon={<Settings size={20} />} label="Kriteria KPI" />
              <NavLink href="/dashboard/admin/departments" icon={<Building2 size={20} />} label="Bidang / Unit" />
              <NavLink href="/dashboard/admin/calculate" icon={<Zap size={20} />} label="Kalkulasi SAW" />
            </>
          )}

          {(profile.role === 'manager' || profile.role === 'admin') && (
            <>
              <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mt-12 mb-6">Evaluasi Kinerja</p>
              <NavLink href="/dashboard/manager/scoring" icon={<BarChart3 size={20} />} label="Input Penilaian" />
              <NavLink href="/dashboard/manager/recap" icon={<ClipboardList size={20} />} label="Status Penilaian" />
            </>
          )}

          {profile.role === 'employee' && (
            <>
              <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mt-12 mb-6">Laporan Anda</p>
              <NavLink href="/dashboard/employee" icon={<BarChart3 size={20} />} label="Hasil Performa" />
            </>
          )}
        </nav>

        {/* User Profile / Logout */}
        <div className="p-8 border-t border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-4 mb-8 group cursor-pointer">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xl group-hover:border-indigo-500/40 transition-colors">
                {profile.full_name?.[0]}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#020617]"></div>
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-bold truncate group-hover:text-indigo-400 transition-colors">{profile.full_name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">{profile.role}</p>
                <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                <p className="text-indigo-400/70 text-[9px] font-black uppercase tracking-widest truncate max-w-[100px]">{profile.departemen?.name || 'Umum'}</p>
              </div>
            </div>
          </div>
          <form action={logout}>
            <button className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-all font-black text-xs uppercase tracking-[0.2em] border border-red-500/10">
              <LogOut size={16} />
              Logout System
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-[#020617]/80 backdrop-blur-3xl sticky top-0 z-[40]">
          <div className="flex items-center gap-6">
            <div className="xl:hidden w-12 h-12 rounded-2xl bg-white overflow-hidden shadow-lg shadow-indigo-500/20">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-500 group focus-within:border-indigo-500/30 transition-all w-96">
              <Search size={18} className="group-focus-within:text-indigo-400 transition-colors" />
              <input type="text" placeholder="Search commands, data..." className="bg-transparent border-none outline-none text-xs font-bold text-white placeholder:text-slate-700 w-full" />
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest">
                <Command size={10} />
                K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles size={14} className="animate-pulse" />
              Live Server
            </div>
            
            <button className="relative w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-400 hover:bg-white/5 hover:text-white transition-all">
              <Bell size={20} />
              <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-[#020617]"></div>
            </button>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 p-8 lg:p-12 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}

function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center justify-between px-5 py-4 rounded-2xl text-slate-400 hover:bg-indigo-600/5 hover:text-white transition-all font-bold text-sm group relative overflow-hidden"
    >
      <div className="flex items-center gap-4 relative z-10">
        <span className="group-hover:text-indigo-400 transition-colors">{icon}</span>
        <span className="tracking-tight">{label}</span>
      </div>
      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all relative z-10 text-indigo-500" />
      
      {/* Active Indicator Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
    </Link>
  )
}
