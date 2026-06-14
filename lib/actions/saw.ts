'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const CURRENT_PERIOD = 'April 2026'

function requireString(value: FormDataEntryValue | null, field: string) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${field} is required`)
  }

  return value.trim()
}

export async function addCriteria(formData: FormData) {
  const supabase = await createClient()
  const name = requireString(formData.get('name'), 'Criteria name')
  const type = requireString(formData.get('type'), 'Criteria type')
  const weight = Number(requireString(formData.get('weight'), 'Criteria weight')) / 100

  if (!Number.isFinite(weight) || weight <= 0) {
    throw new Error('Criteria weight must be a positive number')
  }

  if (type !== 'benefit' && type !== 'cost') {
    throw new Error('Criteria type must be benefit or cost')
  }

  const { error } = await supabase.from('kriteria').insert({
    name,
    type,
    weight,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/admin/criteria')
}

export async function deleteCriteria(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('kriteria').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/admin/criteria')
  revalidatePath('/dashboard/manager/scoring')
}

export async function seedDefaultCriteria() {
  const supabase = await createClient()

  const defaultCriteria = [
    { name: 'Kedisiplinan', weight: 0.2, type: 'benefit' },
    { name: 'Kualitas Kerja', weight: 0.25, type: 'benefit' },
    { name: 'Produktivitas', weight: 0.25, type: 'benefit' },
    { name: 'Kerja Sama', weight: 0.15, type: 'benefit' },
    { name: 'Inisiatif', weight: 0.15, type: 'benefit' },
  ]

  const { error } = await supabase.from('kriteria').insert(defaultCriteria)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/admin/criteria')
  revalidatePath('/dashboard/manager/scoring')
}

export async function addDepartment(formData: FormData) {
  const supabase = await createClient()
  const name = requireString(formData.get('name'), 'Department name')

  const { error } = await supabase.from('departemen').insert({ name })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/admin/departments')
}

export async function deleteDepartment(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('departemen').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/admin/departments')
}

export async function saveEvaluation(formData: FormData) {
  const supabase = await createClient()
  const employeeId = requireString(formData.get('employeeId'), 'Employee')

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error(userError?.message || 'Unauthorized')
  }

  const { data: criteria, error: criteriaError } = await supabase
    .from('kriteria')
    .select('id')

  if (criteriaError) {
    throw new Error(criteriaError.message)
  }

  const evaluations =
    criteria?.map((criterion) => {
      const score = Number(requireString(formData.get(criterion.id), 'Score'))

      if (!Number.isFinite(score) || score < 1 || score > 100) {
        throw new Error('Score must be between 1 and 100')
      }

      return {
        employee_id: employeeId,
        kriteria_id: criterion.id,
        score,
        manager_id: user.id,
        period: CURRENT_PERIOD,
      }
    }) ?? []

  if (evaluations.length === 0) {
    throw new Error('No criteria defined')
  }

  const { error } = await supabase.from('penilaian').upsert(evaluations, {
    onConflict: 'employee_id,kriteria_id,period',
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/manager/scoring')
}

export async function calculateSAW(formData: FormData) {
  const supabase = await createClient()

  try {
    // Ambil semua kriteria
    const { data: criteria, error: criteriaError } = await supabase
      .from('kriteria')
      .select('*')

    if (criteriaError) {
      throw new Error(criteriaError.message)
    }

    if (!criteria || criteria.length === 0) {
      throw new Error('No criteria defined')
    }

    const period = CURRENT_PERIOD

    // Ambil semua penilaian
    const { data: evaluations, error: evaluationsError } = await supabase
      .from('penilaian')
      .select('*')
      .eq('period', period)

    if (evaluationsError) {
      throw new Error(evaluationsError.message)
    }

    if (!evaluations || evaluations.length === 0) {
      throw new Error('No evaluations found')
    }

    // Ambil employee unik
    const employeeIds = [
      ...new Set(evaluations.map((e) => e.employee_id))
    ]

    // Statistik normalisasi
    const stats: Record<string, { max: number; min: number }> = {}

    criteria.forEach((c) => {
      const scores = evaluations
        .filter((e) => e.kriteria_id === c.id)
        .map((e) => Number(e.score))

      stats[String(c.id)] =
        scores.length > 0
          ? {
              max: Math.max(...scores),
              min: Math.min(...scores),
            }
          : {
              max: 1,
              min: 1,
            }
    })

    // Hitung SAW
    const results = employeeIds.map((employeeId) => {
      let finalScore = 0

      criteria.forEach((c) => {
        const evaluation = evaluations.find(
          (e) =>
            e.employee_id === employeeId &&
            e.kriteria_id === c.id
        )

        if (!evaluation) return

        const score = Number(evaluation.score)

        let normalized = 0

        if (c.type === 'benefit') {
          normalized =
            score / stats[String(c.id)].max
        } else {
          normalized =
            stats[String(c.id)].min / (score || 1)
        }

        finalScore += normalized * Number(c.weight)
      })

      return {
        employee_id: employeeId,
        saw_score: Number(finalScore.toFixed(4)),
        period,
      }
    })

    // Ranking
    results.sort((a, b) => b.saw_score - a.saw_score)

    const rankedResults = results.map((item, index) => ({
      ...item,
      rank: index + 1,
    }))

    // Simpan ke hasil_spk
    const { error: upsertError } = await supabase
      .from('hasil_spk')
      .upsert(rankedResults, {
        onConflict: 'employee_id,period',
      })

    if (upsertError) {
      throw new Error(upsertError.message)
    }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/admin/calculate')
  } catch (error) {
    console.error('SAW Calculation Error:', error)

    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to calculate SAW'
    )
  }
}
