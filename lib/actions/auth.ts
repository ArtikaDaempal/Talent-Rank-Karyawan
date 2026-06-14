'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth
    .signInWithPassword({ email, password })
    .catch((error: Error) => ({ error }))

  if (error) {
    if (error.message.includes('invalid header value')) {
      return { error: 'Sesi login lama tidak valid. Muat ulang halaman lalu coba masuk lagi.' }
    }

    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const employeeId = formData.get('employeeId') as string
  const role = formData.get('role') as string // 'manager' or 'employee'
  const departemenId = formData.get('departemenId') as string

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        employee_id: employeeId,
        role: role,
        departemen_id: departemenId === 'none' ? null : departemenId,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.session) {
    redirect('/dashboard')
  }

  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const fullName = formData.get('fullName') as string
  const employeeId = formData.get('employeeId') as string
  const position = formData.get('position') as string
  const departemenId = formData.get('departemenId') as string

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      employee_id: employeeId,
      position: position,
      departemen_id: departemenId === 'none' ? null : departemenId
    })
    .eq('id', user.id)

  if (error) return { error: error.message }
  return { success: true }
}

export async function updateEmployeeDepartment(employeeId: string, departemenId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ departemen_id: departemenId === 'none' ? null : departemenId })
    .eq('id', employeeId)

  if (error) return { error: error.message }
  
  const { revalidatePath } = await import('next/cache')
  revalidatePath('/dashboard/admin/employees')
  return { success: true }
}

export async function updateEmployeeRole(employeeId: string, currentRole: string) {
  const supabase = await createClient()
  const nextRole = currentRole === 'manager' ? 'employee' : 'manager'
  
  const { error } = await supabase
    .from('profiles')
    .update({ role: nextRole })
    .eq('id', employeeId)

  if (error) {
    throw new Error(error.message)
  }

  const { revalidatePath } = await import('next/cache')
  revalidatePath('/dashboard/admin/employees')
}
