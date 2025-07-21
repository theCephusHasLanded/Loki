import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../stores/authStore';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <>
      <header className="header">
        <div className="container">
          <nav className="flex flex-between align-center">
            <Link href="/" className="nav-brand">
              🌟 Constellation Markets
            </Link>
            
            <ul className="nav-links">
              <li>
                <Link href="/markets" className="nav-link">
                  Markets
                </Link>
              </li>
              
              {isAuthenticated ? (
                <>
                  <li>
                    <Link href="/portfolio" className="nav-link">
                      Portfolio
                    </Link>
                  </li>
                  <li>
                    <Link href="/create-market" className="nav-link">
                      Create Market
                    </Link>
                  </li>
                  <li className="flex align-center">
                    <span className="text-muted">
                      {user?.username} • ${user?.walletBalance.toFixed(2)}
                    </span>
                  </li>
                  <li>
                    <button 
                      onClick={logout}
                      className="nav-link"
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        font: 'inherit',
                        padding: 0,
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login" className="nav-link">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="nav-link">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main className="container">
        {children}
      </main>

      <footer className="text-center text-muted" style={{ marginTop: '4rem', paddingBottom: '2rem' }}>
        <p>
          © 2024 Constellation Markets. 
          Prediction markets powered by astrological analysis.
        </p>
      </footer>
    </>
  );
}