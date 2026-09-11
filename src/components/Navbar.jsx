import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const logoUrl = `${import.meta.env.BASE_URL}rockidz-logo-transparent-bg.webp`

export default function Navbar() {
  const { user, logout, isAdmin, isEducator } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  function handleLogout() {
    logout()
    closeMenu()
    navigate('/')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-rock-border bg-rock-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <a href="https://rockmission.co.za" className="flex items-center gap-3 font-display text-xl leading-none tracking-wide text-[#5b2b86] sm:text-2xl" rel="noopener noreferrer">
          <img src={logoUrl} alt="Rockidz" className="h-12 w-auto drop-shadow-[0_10px_20px_rgba(140,82,255,0.18)]" />
          <span>
            ROCK<span className="text-[#00a8b5]">IDZ</span>{' '}
            <span className="hidden align-middle font-body text-[10px] font-black uppercase tracking-[0.2em] text-[#5b5872] sm:inline">
              Kids Corner
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 font-body text-sm md:flex">
          <Link to="/" className="text-[#5b5872] transition-colors hover:text-[#00a8b5]">
            Home
          </Link>
          <Link to="/activities" className="text-[#5b5872] transition-colors hover:text-[#00a8b5]">
            Activities
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="text-[#5b5872] transition-colors hover:text-[#00a8b5]">
                My fun
              </Link>
              <Link to="/settings" className="text-[#5b5872] transition-colors hover:text-[#00a8b5]">
                Settings
              </Link>
              {isEducator && (
                <Link to="/teach" className="text-[#5b5872] transition-colors hover:text-[#00a8b5]">
                  {isAdmin ? 'Content' : 'Leaders'}
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="text-[#5b5872] transition-colors hover:text-[#00a8b5]">
                  Admin
                </Link>
              )}
              <span className="text-[#d9bfd1]">|</span>
              <span className="text-[#5b2b86]">{user.displayName}</span>
              <button
                onClick={handleLogout}
                className="rounded-full border-2 border-white bg-white/70 px-3 py-1.5 text-xs font-bold text-[#5b2b86] transition-colors hover:border-[#ffd84d] hover:bg-[#fff6c8]"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="text-[#5b5872] transition-colors hover:text-[#00a8b5]">
                Sign in
              </Link>
              <Link
                to="/sign-up"
                className="rounded-full bg-[#8c52ff] px-5 py-2 text-xs font-black uppercase tracking-wide text-white shadow-[0_10px_26px_rgba(140,82,255,0.24)] transition-opacity hover:opacity-90"
              >
                Join now
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-white bg-white/70 text-[#5b2b86] md:hidden"
        >
          <span className="sr-only">Menu</span>
          <span className="flex w-5 flex-col gap-1.5">
            <span
              className={`h-0.5 bg-current transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
            />
            <span className={`h-0.5 bg-current transition-opacity ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span
              className={`h-0.5 bg-current transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
            />
          </span>
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-rock-border bg-rock-bg/95 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 font-body text-sm sm:px-6">
            <Link to="/" onClick={closeMenu} className="text-[#5b5872] transition-colors hover:text-[#00a8b5]">
              Home
            </Link>
            <Link to="/activities" onClick={closeMenu} className="text-[#5b5872] transition-colors hover:text-[#00a8b5]">
              Activities
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="text-[#5b5872] transition-colors hover:text-[#00a8b5]"
                >
                  My fun
                </Link>
                <Link
                  to="/settings"
                  onClick={closeMenu}
                  className="text-[#5b5872] transition-colors hover:text-[#00a8b5]"
                >
                  Settings
                </Link>
                {isEducator && (
                  <Link to="/teach" onClick={closeMenu} className="text-[#5b5872] transition-colors hover:text-[#00a8b5]">
                    {isAdmin ? 'Content' : 'Leaders'}
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" onClick={closeMenu} className="text-[#5b5872] transition-colors hover:text-[#00a8b5]">
                    Admin
                  </Link>
                )}
                <span className="truncate text-xs font-black uppercase tracking-wide text-[#8f7f9d]">{user.displayName}</span>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-full border-2 border-white bg-white/70 px-3 py-2 text-left text-xs font-bold text-[#5b2b86] transition-colors hover:border-[#ffd84d] hover:bg-[#fff6c8]"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/sign-in" onClick={closeMenu} className="text-[#5b5872] transition-colors hover:text-[#00a8b5]">
                  Sign in
                </Link>
                <Link
                  to="/sign-up"
                  onClick={closeMenu}
                  className="rounded-full bg-[#8c52ff] px-5 py-2 text-center text-xs font-black uppercase tracking-wide text-white shadow-[0_10px_26px_rgba(140,82,255,0.24)] transition-opacity hover:opacity-90"
                >
                  Join now
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
