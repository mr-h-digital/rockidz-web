import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const logoUrl = `${import.meta.env.BASE_URL}rockidz-logo-transparent.webp`
const desktopNavLinkClassName =
  'rounded-full px-3 py-2 text-[13px] font-bold tracking-[0.04em] !text-white transition-all duration-200 hover:bg-white/10 hover:!text-[#5fe7ff] hover:shadow-[0_0_18px_rgba(95,231,255,0.22)]'
const mobileNavLinkClassName =
  'rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 !text-white transition-all duration-200 hover:border-[#5fe7ff]/45 hover:bg-white/10 hover:!text-[#5fe7ff]'
const desktopMetaChipClassName =
  'rounded-full border border-white/14 bg-white/[0.07] px-3 py-2 text-[12px] font-bold tracking-[0.04em] text-white shadow-[0_10px_24px_rgba(5,5,28,0.14)]'

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-[linear-gradient(90deg,rgba(18,10,54,0.88),rgba(37,15,86,0.82),rgba(7,74,117,0.82))] shadow-[0_16px_36px_rgba(5,5,28,0.35)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 font-display text-xl leading-none tracking-wide text-white sm:text-2xl">
          <img src={logoUrl} alt="Rockidz Kids Ministry" className="h-14 w-auto drop-shadow-[0_16px_28px_rgba(125,60,255,0.24)] sm:h-16" />
          <span className="hidden flex-col sm:flex">
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/88">Kids Ministry</span>
            <span className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#ffd233]">
              Launch into God&apos;s Word
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 font-body text-sm md:flex">
          <Link to="/" className={desktopNavLinkClassName}>
            Home
          </Link>
          <Link to="/activities" className={desktopNavLinkClassName}>
            Activities
          </Link>
          <a
            href="https://rockmission.co.za"
            target="_blank"
            rel="noopener noreferrer"
            className={desktopNavLinkClassName}
          >
            Rock Mission
          </a>

          {user ? (
            <>
              <Link to="/dashboard" className={desktopNavLinkClassName}>
                My fun
              </Link>
              <Link to="/settings" className={desktopNavLinkClassName}>
                Settings
              </Link>
              {isEducator && (
                <Link to="/teach" className={desktopNavLinkClassName}>
                  {isAdmin ? 'Content' : 'Leaders'}
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className={desktopNavLinkClassName}>
                  Admin
                </Link>
              )}
              <span className="hidden text-white/28 lg:inline">|</span>
              <span className={`${desktopMetaChipClassName} max-w-[180px] truncate`}>{user.displayName}</span>
              <button
                onClick={handleLogout}
                className="rounded-full border-2 border-white/20 bg-white/12 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_10px_20px_rgba(5,5,28,0.18)] transition-all duration-200 hover:border-[#ffd233] hover:bg-white/20"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/sign-in"
                className="rounded-full border border-white/18 bg-white/[0.07] px-4 py-2 text-[13px] font-bold tracking-[0.04em] text-white shadow-[0_10px_24px_rgba(5,5,28,0.16)] transition-all duration-200 hover:border-[#5fe7ff]/45 hover:bg-white/12 hover:text-white"
              >
                Sign in
              </Link>
              <Link
                to="/sign-up"
                className="rounded-full bg-[linear-gradient(120deg,#ff4fa3_0%,#7d3cff_55%,#00b8ff_100%)] px-5 py-2 text-xs font-black uppercase tracking-wide text-white shadow-[0_16px_32px_rgba(125,60,255,0.38)] transition-opacity hover:opacity-90"
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
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-white/15 bg-white/10 text-white shadow-[0_10px_18px_rgba(5,5,28,0.2)] md:hidden"
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
        <nav className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(18,10,54,0.95),rgba(37,15,86,0.94),rgba(7,74,117,0.92))] md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 font-body text-sm sm:px-6">
            <Link to="/" onClick={closeMenu} className={mobileNavLinkClassName}>
              Home
            </Link>
            <Link to="/activities" onClick={closeMenu} className={mobileNavLinkClassName}>
              Activities
            </Link>
            <a
              href="https://rockmission.co.za"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className={mobileNavLinkClassName}
            >
              Rock Mission
            </a>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className={mobileNavLinkClassName}
                >
                  My fun
                </Link>
                <Link
                  to="/settings"
                  onClick={closeMenu}
                  className={mobileNavLinkClassName}
                >
                  Settings
                </Link>
                {isEducator && (
                  <Link to="/teach" onClick={closeMenu} className={mobileNavLinkClassName}>
                    {isAdmin ? 'Content' : 'Leaders'}
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" onClick={closeMenu} className={mobileNavLinkClassName}>
                    Admin
                  </Link>
                )}
                <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 shadow-[0_10px_22px_rgba(5,5,28,0.12)]">
                  <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/82">Signed in as</span>
                  <span className="mt-1 block truncate text-sm font-bold text-white">{user.displayName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-full border-2 border-white/20 bg-white/12 px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.08em] text-white transition-all duration-200 hover:border-[#ffd233] hover:bg-white/20"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/sign-in" onClick={closeMenu} className={mobileNavLinkClassName}>
                  Sign in
                </Link>
                <Link
                  to="/sign-up"
                  onClick={closeMenu}
                  className="rounded-full bg-[linear-gradient(120deg,#ff4fa3_0%,#7d3cff_55%,#00b8ff_100%)] px-5 py-2 text-center text-xs font-black uppercase tracking-wide text-white shadow-[0_16px_32px_rgba(125,60,255,0.38)] transition-opacity hover:opacity-90"
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
