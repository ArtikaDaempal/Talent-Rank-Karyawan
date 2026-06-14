'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function DepartmentFilter({ 
  departments, 
  currentDept 
}: { 
  departments: any[] | null, 
  currentDept: string 
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value === 'all') {
      params.delete('dept')
    } else {
      params.set('dept', e.target.value)
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <select 
      onChange={handleChange}
      className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer appearance-none hover:text-indigo-400 transition-colors"
      defaultValue={currentDept}
    >
      <option value="all" className="bg-[#020617]">Seluruh Bidang</option>
      {departments?.map(d => (
        <option key={d.id} value={d.id} className="bg-[#020617]">{d.name}</option>
      ))}
    </select>
  )
}
