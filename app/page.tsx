import Link from 'next/link'
import { 
  Trophy, 
  BarChart3, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  Building2, 
  Briefcase, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  Zap,
  Sparkles,
  Globe,
  Lock,
  Cpu
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden relative font-sans scroll-smooth selection:bg-indigo-500 selection:text-white">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-purple-600/10 rounded-full mix-blend-screen filter blur-[150px] animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
      </div>

      {/* Futuristic Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5">
        <div className="absolute inset-0 bg-[#020617]/60 backdrop-blur-2xl"></div>
        <div className="relative flex items-center justify-between px-8 lg:px-12 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 font-black text-3xl tracking-tighter group cursor-pointer">
            <div className="relative">
              <div className="absolute -inset-2 bg-indigo-500/20 rounded-xl blur group-hover:blur-xl transition-all duration-500"></div>
              <div className="relative w-12 h-12 rounded-2xl bg-white overflow-hidden shadow-2xl shadow-indigo-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-white">Talent<span className="text-indigo-500">Rank</span></span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-1">Enterprise</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            <a href="#visi-misi" className="hover:text-indigo-400 transition-colors py-2 relative group/link">
              Visi & Misi
              <span className="absolute bottom-0 left-0 w-0 h-px bg-indigo-500 group-hover/link:w-full transition-all duration-300"></span>
            </a>
            <a href="#metodologi" className="hover:text-indigo-400 transition-colors py-2 relative group/link">
              Metodologi
              <span className="absolute bottom-0 left-0 w-0 h-px bg-indigo-500 group-hover/link:w-full transition-all duration-300"></span>
            </a>
            <a href="#bantuan" className="hover:text-indigo-400 transition-colors py-2 relative group/link">
              Bantuan
              <span className="absolute bottom-0 left-0 w-0 h-px bg-indigo-500 group-hover/link:w-full transition-all duration-300"></span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="hidden sm:block px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all text-slate-300 border border-transparent hover:border-white/10">
              Portal Log In
            </Link>
            <Link href="/auth/register" className="group relative px-8 py-4 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20">
              <div className="absolute inset-0 bg-white group-hover:bg-indigo-50 transition-colors"></div>
              <div className="relative flex items-center gap-3 text-black font-black text-[10px] uppercase tracking-[0.2em]">
                Get Started
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 max-w-7xl mx-auto px-8 pt-64 pb-32">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="text-left space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] shadow-inner">
              <Zap size={16} className="fill-indigo-400" />
              Revolutionizing Performance Analysis
            </div>
            
            <h1 className="text-7xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-8">
              Elevate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-600">
                Workforce.
              </span>
            </h1>
            
            <p className="max-w-xl text-xl lg:text-2xl text-slate-400 leading-relaxed font-medium">
              Sistem Pendukung Keputusan tercanggih berbasis <span className="text-white font-black">SAW Algorithm</span> untuk evaluasi performa yang objektif, transparan, dan terukur.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 pt-8">
              <Link 
                href="/auth/register" 
                className="group relative px-12 py-6 rounded-[2.5rem] bg-indigo-600 text-white font-black text-xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.5)] transition-all flex items-center justify-center gap-4 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                Daftar Sekarang
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-[#020617] bg-slate-800 flex items-center justify-center text-xs font-black">
                      {String.fromCharCode(64+i)}
                    </div>
                  ))}
                </div>
                <div className="text-left leading-tight">
                  <p className="text-white font-black text-sm tracking-tight">1,000+ Karyawan</p>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Terdaftar di Sistem</p>
                </div>
              </div>
            </div>
          </div>

          {/* Spectacular Visual Element */}
          <div className="relative hidden lg:block animate-in fade-in zoom-in-95 duration-1000 delay-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-[4rem] blur-[100px] animate-pulse"></div>
            <div className="relative bg-[#0f172a]/80 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-12 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-1000 group">
              <div className="absolute -top-6 -left-6 p-6 rounded-3xl bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 rotate-12 group-hover:rotate-0 transition-all duration-500">
                <Trophy size={40} />
              </div>
              <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
                <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500/50"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500/50"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500/50"></div>
                </div>
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] bg-indigo-500/10 px-3 py-1 rounded-lg">Performance Matrix</div>
              </div>
              <div className="space-y-8">
                {[
                  { name: "Andi Saputra", score: "0.9842", rank: 1, color: "text-amber-400" },
                  { name: "Siti Aminah", score: "0.9521", rank: 2, color: "text-slate-400" },
                  { name: "Budi Cahyo", score: "0.9210", rank: 3, color: "text-orange-500" }
                ].map((emp, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-white/5 hover:bg-white/[0.05] transition-all">
                    <div className="flex items-center gap-6">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm bg-white/5 ${emp.color}`}>#{emp.rank}</div>
                      <span className="font-bold text-slate-200">{emp.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${parseFloat(emp.score)*100}%` }}></div>
                      </div>
                      <span className="font-mono text-xs font-black text-white">{emp.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Visi & Misi Section */}
      <section id="visi-misi" className="relative z-10 py-48 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-3 gap-20 items-start">
            <div className="lg:col-span-1 space-y-6">
              <div className="inline-flex items-center gap-3 text-indigo-500 font-black text-[10px] uppercase tracking-[0.4em]">
                <Globe size={18} />
                Corporate Vision
              </div>
              <h2 className="text-5xl lg:text-6xl font-black tracking-tighter leading-none text-white">Landasan & Tujuan Kami.</h2>
              <p className="text-slate-500 font-medium leading-relaxed">Membangun ekosistem korporasi yang sehat melalui objektivitas data dan pengakuan prestasi yang transparan.</p>
            </div>

            <div className="lg:col-span-2 grid md:grid-cols-2 gap-10">
              <div className="group p-12 rounded-[3rem] bg-[#0f172a] border border-white/5 hover:border-indigo-500/20 transition-all duration-700 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors">
                  <ShieldCheck size={120} />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tight">Visi Strategis</h3>
                  <p className="text-slate-400 leading-relaxed font-medium">Menjadi standar utama industri dalam sistem evaluasi kinerja berbasis kecerdasan data (Decision Support System) yang adil dan inklusif.</p>
                </div>
              </div>

              <div className="group p-12 rounded-[3rem] bg-[#0f172a] border border-white/5 hover:border-purple-500/20 transition-all duration-700 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-purple-500/10 group-hover:text-purple-500/20 transition-colors">
                  <Sparkles size={120} />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tight">Misi Operasional</h3>
                  <p className="text-slate-400 leading-relaxed font-medium">Mentransformasi potensi setiap individu menjadi prestasi nyata melalui alur kerja evaluasi yang otomatis, akurat, dan dapat diandalkan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="metodologi" className="relative z-10 py-48 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/3 space-y-8 sticky top-48 self-start">
            <div className="inline-flex items-center gap-3 text-indigo-500 font-black text-[10px] uppercase tracking-[0.4em]">
              <Cpu size={18} />
              SAW Logic
            </div>
            <h2 className="text-5xl lg:text-6xl font-black tracking-tighter leading-none text-white">Bagaimana <br />Kami Menghitung.</h2>
            <p className="text-slate-500 font-medium leading-relaxed">Matematika di balik pengambilan keputusan yang adil.</p>
            
            <div className="p-8 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black">f(x)</div>
                <p className="text-white font-bold tracking-tight">V<sub>i</sub> = ∑ (w<sub>j</sub> * r<sub>ij</sub>)</p>
              </div>
              <p className="text-xs text-indigo-300/70 font-medium italic">Simple Additive Weighting - Penjumlahan Terbobot dari hasil normalisasi.</p>
            </div>
          </div>

          <div className="lg:w-2/3 grid sm:grid-cols-2 gap-10">
            <StepCard number="01" icon={<Target />} title="Definisi Kriteria" desc="Admin menentukan parameter KPI (Benefit/Cost) dan bobot persentase kepentingan masing-masing kriteria." />
            <StepCard number="02" icon={<Users />} title="Evaluasi Manager" desc="Manager di tiap bidang memberikan penilaian numerik berdasarkan performa nyata di lapangan." />
            <StepCard number="03" icon={<BarChart3 />} title="Normalisasi Data" desc="Sistem melakukan normalisasi matriks untuk menyetarakan skala penilaian antar kriteria yang berbeda." />
            <StepCard number="04" icon={<Trophy />} title="Ranking Otomatis" desc="Hasil perhitungan akhir disortir secara instan untuk menghasilkan urutan prestasi yang valid." />
          </div>
        </div>
      </section>

      {/* Help / FAQ */}
      <section id="bantuan" className="relative z-10 py-48 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto px-8 space-y-20">
          <div className="text-center space-y-6">
            <h2 className="text-5xl lg:text-6xl font-black tracking-tighter leading-none text-white">Pusat Informasi</h2>
            <p className="text-slate-500 font-medium">Segala hal yang perlu Anda ketahui tentang sistem TalentRank.</p>
          </div>
          
          <div className="grid gap-6">
            <FaqItem question="Apakah data penilaian saya bersifat rahasia?" answer="Data penilaian individual bersifat terbatas, namun papan peringkat (leaderboard) bersifat publik di internal perusahaan untuk mendorong transparansi dan kompetisi yang sehat." />
            <FaqItem question="Bagaimana jika ada kesalahan input nilai?" answer="Manager dapat melakukan pembaruan (update) nilai selama periode evaluasi belum ditutup oleh Admin HR." />
            <FaqItem question="Apa itu kriteria 'Benefit' dan 'Cost'?" answer="Benefit berarti semakin tinggi nilai semakin baik (misal: Produktivitas). Cost berarti semakin rendah nilai semakin baik (misal: Tingkat Absensi)." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 pt-32 pb-16 border-t border-white/5 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3 font-black text-3xl tracking-tighter text-white opacity-80">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              TalentRank
            </div>
            <p className="text-slate-500 text-sm max-w-xs font-medium leading-relaxed">Memberdayakan sumber daya manusia melalui teknologi keputusan berbasis data yang presisi.</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-20">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Perusahaan</h4>
              <ul className="space-y-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Karir</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Kontak</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Legal</h4>
              <ul className="space-y-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Syarat & Ketentuan</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
          <span>&copy; 2026 PT. TalentRank Global Tech.</span>
          <div className="flex gap-8">
            <span className="flex items-center gap-2"><Globe size={12}/> Jakarta, Indonesia</span>
            <span className="flex items-center gap-2"><Lock size={12}/> SSL Secured</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function StepCard({ number, icon, title, desc }: { number: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="group p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all duration-700">
      <div className="flex items-center justify-between mb-8">
        <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          {icon}
        </div>
        <div className="text-4xl font-black text-white/5 group-hover:text-indigo-500/10 transition-colors">{number}</div>
      </div>
      <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  )
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="group p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all duration-500">
      <h4 className="text-xl font-black flex items-center gap-4 text-indigo-100 mb-4 tracking-tight">
        <HelpCircle size={24} className="text-indigo-500" />
        {question}
      </h4>
      <p className="text-slate-500 font-medium ml-10 leading-relaxed">{answer}</p>
    </div>
  )
}
