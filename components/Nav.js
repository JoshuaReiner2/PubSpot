import Link from 'next/link'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        Pub<span>Spot</span>
      </Link>
      <div className={styles.links}>
        <Link href="/generate">Generate proposal</Link>
        <Link href="/#pricing">Pricing</Link>
      </div>
    </nav>
  )
}
