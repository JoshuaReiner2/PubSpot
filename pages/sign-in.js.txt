import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f3ee'
    }}>
      <SignIn afterSignInUrl="/generate" redirectUrl="/generate" />
    </div>
  )
}