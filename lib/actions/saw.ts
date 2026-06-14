'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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

    const period = 'April 2026'

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