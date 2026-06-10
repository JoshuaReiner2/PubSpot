import Link from 'next/link'
import { useUser, UserButton, SignInButton } from '@clerk/nextjs'
import styles from './Nav.module.css'

export default function Nav() {
  const { isSignedIn } = useUser()

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        Pub<span>Spot</span>
      </Link>
      <div className={styles.links}>
        <Link href="/#how">How it works</Link>
        {isSignedIn ? (
          <>
            <Link href="/generate">Generate proposal</Link>
            <Link href="/query">Query agents</Link>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <>
            <SignInButton mode="modal">
              <button className={styles.signInBtn}>Sign in</button>
            </SignInButton>
            <Link href="/sign-up">Get started</Link>
          </>
        )}
      </div>
    </nav>
  )
}