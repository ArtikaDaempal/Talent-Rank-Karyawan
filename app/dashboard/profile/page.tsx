import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/dashboard/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch profile with email from auth.users (requires join or separate fetch)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: departments } = await supabase
    .from('departemen')
    .select('*')
    .order('name', { ascending: true })

  // Merge email for display
  const profileWithEmail = {
    ...profile,
    email: user.email
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ProfileForm profile={profileWithEmail} departments={departments} />
    </div>
  )
}
