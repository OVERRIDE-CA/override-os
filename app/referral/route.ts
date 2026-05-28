import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Generate a unique referral code
function generateReferralCode(name: string, id: string): string {
  const prefix = name.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X')
  const suffix = id.slice(-4).toUpperCase()
  return `${prefix}-${suffix}`
}

// GET — fetch referral stats for a user
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

  const { data: user } = await supabase
    .from('users')
    .select('referral_code, name, id')
    .eq('id', userId)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Generate code if doesn't exist
  if (!user.referral_code) {
    const code = generateReferralCode(user.name || 'OVR', user.id)
    await supabase.from('users').update({ referral_code: code }).eq('id', user.id)
    user.referral_code = code
  }

  // Count referrals
  const { count } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('referred_by', user.referral_code)

  return NextResponse.json({
    referralCode: user.referral_code,
    referralUrl: `https://www.overridecannabis.com/mission?ref=${user.referral_code}`,
    referralCount: count || 0,
    paradiseUnlocked: (count || 0) >= 1,
  })
}

// POST — process a referral when new user signs up
export async function POST(req: NextRequest) {
  const { newUserId, referralCode } = await req.json()
  if (!newUserId || !referralCode) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Find the referrer
  const { data: referrer } = await supabase
    .from('users')
    .select('id, name, level, paradise_access')
    .eq('referral_code', referralCode)
    .single()

  if (!referrer) return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })

  // Tag the new user with referral
  await supabase
    .from('users')
    .update({ referred_by: referralCode })
    .eq('id', newUserId)

  // Count total referrals for the referrer
  const { count } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('referred_by', referralCode)

  // Unlock Paradise access after first successful referral
  if ((count || 0) >= 1 && !referrer.paradise_access) {
    await supabase
      .from('users')
      .update({ paradise_access: true })
      .eq('id', referrer.id)
  }

  return NextResponse.json({
    success: true,
    referrerName: referrer.name,
    referralCount: count || 0,
    paradiseUnlocked: (count || 0) >= 1,
  })
}
