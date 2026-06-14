'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function calculateSAW() {
  const supabase = await createClient()

  // 1. Fetch all criteria
  const { data: criteria } = await supabase.from('kriteria').select('*')
  if (!criteria || criteria.length === 0) return { error: 'No criteria defined' }

  // 2. Fetch all evaluations for the current period
  const period = 'April 2026'
  const { data: evaluations } = await supabase
    .from('penilaian')
    .select('*')
    .eq('period', period)

  if (!evaluations || evaluations.length === 0) return { error: 'No evaluations found' }

  // 3. Get all unique employees evaluated
  const employeeIds = Array.from(new Set(evaluations.map(e => e.employee_id)))

  // 4. Normalize scores
  const stats: Record<string, { max: number; min: number }> = {}
  criteria.forEach(c => {
    const scores = evaluations.filter(e => e.kriteria_id === c.id).map(e => Number(e.score))
    if (scores.length > 0) {
      stats[c.id] = {
        max: Math.max(...scores),
        min: Math.min(...scores)
      }
    } else {
      stats[c.id] = { max: 1, min: 1 }
    }
  })

  // 5. Calculate final score for each employee
  const results = employeeIds.map(empId => {
    let finalScore = 0
    criteria.forEach(c => {
      const evaluation = evaluations.find(e => e.employee_id === empId && e.kriteria_id === c.id)
      if (evaluation) {
        const score = Number(evaluation.score)
        let normalized = 0
        if (c.type === 'benefit') {
          normalized = score / stats[c.id].max
        } else {
          normalized = stats[c.id].min / (score || 1)
        }
        finalScore += normalized * Number(c.weight)
      }
    })
    return { employee_id: empId, saw_score: Number(finalScore.toFixed(4)), period }
  })

  // 6. Sort and Rank
  results.sort((a, b) => b.saw_score - a.saw_score)
  const rankedResults = results.map((r, index) => ({ ...r, rank: index + 1 }))

  // 7. Save to hasil_spk
  const { error: upsertError } = await supabase
    .from('hasil_spk')
    .upsert(rankedResults, { onConflict: 'employee_id, period' })

  if (upsertError) {
    console.error('SAW Upsert Error:', upsertError)
    return { error: upsertError.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function addCriteria(formData: FormData) {
  const name = formData.get('name') as string
  const weight = parseFloat(formData.get('weight') as string) / 100 // Convert to decimal
  const type = formData.get('type') as string

  const supabase = await createClient()
  const { error } = await supabase.from('kriteria').insert({ name, weight, type })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/admin/criteria')
}

export async function submitScores(employeeId: string, scores: Record<string, number>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const period = 'April 2026'

  const evaluations = Object.entries(scores).map(([kriteriaId, score]) => ({
    employee_id: employeeId,
    kriteria_id: kriteriaId,
    score,
    manager_id: user?.id,
    period
  }))

  const { error } = await supabase.from('penilaian').upsert(evaluations, {
    onConflict: 'employee_id, kriteria_id, period'
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/manager/scoring')
  revalidatePath('/dashboard/manager/recap')
}

export async function saveEvaluation(formData: FormData) {
  const employeeId = formData.get('employeeId') as string
  const supabase = await createClient()
  
  // Fetch criteria to know which IDs to look for
  const { data: criteria } = await supabase.from('kriteria').select('id')
  if (!criteria) return { error: 'Criteria not found' }

  const scores: Record<string, number> = {}
  criteria.forEach(c => {
    const val = formData.get(c.id)
    if (val !== null) {
      scores[c.id] = parseFloat(val as string) || 0
    }
  })

  return await submitScores(employeeId, scores)
}

export async function deleteCriteria(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('kriteria').delete().eq('id', id)
  
  if (error) return { error: error.message }
  revalidatePath('/dashboard/admin/criteria')
}

export async function seedDefaultCriteria() {
  const supabase = await createClient()
  const defaultCriteria = [
    { name: 'Kualitas Pekerjaan', weight: 0.30, type: 'benefit' },
    { name: 'Kecepatan Penyelesaian', weight: 0.20, type: 'benefit' },
    { name: 'Kerjasama Tim', weight: 0.20, type: 'benefit' },
    { name: 'Kedisiplinan', weight: 0.15, type: 'benefit' },
    { name: 'Tingkat Kesalahan', weight: 0.15, type: 'cost' }
  ]
  const { error } = await supabase.from('kriteria').insert(defaultCriteria)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/admin/criteria')
}

export async function addDepartment(formData: FormData) {
  const name = formData.get('name') as string
  const supabase = await createClient()
  const { error } = await supabase.from('departemen').insert({ name })
  if (error) return { error: error.message }
  revalidatePath('/dashboard/admin/departments')
}

export async function deleteDepartment(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('departemen').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/admin/departments')
}
