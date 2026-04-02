import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/store';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    // THIS WILL TELL US THE TRUTH: Check your VS Code terminal
    console.error("DEBUG: Auth Exchange Failed:", error.message);
  }

  // Redirect back to login but with the specific error code
  return NextResponse.redirect(`${origin}/login?error=handshake-failed`);
}