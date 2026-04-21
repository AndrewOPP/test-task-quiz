import Link from 'next/link';
import { useRouter } from 'next/router';
import type { PropsWithChildren } from 'react';

const navigationItems = [
  {
    href: '/quizzes',
    label: 'Dashboard',
  },
  {
    href: '/create',
    label: 'Create quiz',
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === '/quizzes') {
    return pathname.startsWith('/quizzes');
  }

  return pathname === href;
}

export function AppShell({ children }: PropsWithChildren) {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-slate-950">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#dfe4d7] blur-3xl" />
        <div className="absolute -right-32 top-24 h-72 w-72 rounded-full bg-[#e2d8cc] blur-3xl" />
        <div className="absolute -bottom-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#d5dee4] blur-3xl" />
      </div>

      <div className="relative">
        <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <Link href="/quizzes" className="inline-flex items-center gap-3 self-start">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-950/10">
                QB
              </span>
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-400">
                  Quiz Builder
                </span>
                <span className="block text-lg font-semibold tracking-tight text-slate-950">
                   Quiz Builder
                </span>
              </span>
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <nav className="flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm shadow-slate-950/5">
                {navigationItems.map((item) => {
                  const active = isActivePath(router.pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        active
                          ? 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200 shadow-sm shadow-emerald-900/5'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
