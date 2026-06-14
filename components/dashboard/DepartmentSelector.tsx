'use client'

import { updateEmployeeDepartment } from '@/lib/actions/auth'

export default function DepartmentSelector({ 
  employeeId, 
  departments, 
  currentDeptId 
}: { 
  employeeId: string, 
  departments: any[] | null, 
  currentDeptId: string | null 
}) {
  return (
    <select 
      name="dept" 
      onChange={async (e) => {
        const deptId = e.target.value
        await updateEmployeeDepartment(employeeId, deptId)
      }}
      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 appearance-none cursor-pointer hover:bg-white/10 transition-all"
      defaultValue={currentDeptId || 'none'}
    >
      <option value="none">Pilih Bidang...</option>
      {departments?.map(d => (
        <option key={d.id} value={d.id}>{d.name}</option>
      ))}
    </select>
  )
}
