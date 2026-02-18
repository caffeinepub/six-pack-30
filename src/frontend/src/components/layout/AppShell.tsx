import { Link, useNavigate } from '@tanstack/react-router';
import { Home, Calendar, Info, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LoginButton from '../auth/LoginButton';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { useState } from 'react';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = !!identity;

  const navItems = [
    { label: 'Dashboard', path: '/', icon: Home },
    { label: 'Program', path: '/program', icon: Calendar },
    { label: 'Info', path: '/info', icon: Info },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center gap-2 ${
            mobile
              ? 'text-lg py-3 px-4 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 rounded-lg transition-all duration-200'
              : 'text-sm font-semibold hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-accent hover:after:w-full after:transition-all after:duration-300'
          }`}
          onClick={() => mobile && setIsOpen(false)}
        >
          <item.icon className="w-5 h-5" />
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-background via-background to-primary/5 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity group"
            >
              <div className="relative">
                <img
                  src="/assets/generated/challenge-badge.dim_256x256.png"
                  alt="Six Pack 30"
                  className="w-8 h-8 group-hover:scale-110 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <span className="hidden sm:inline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Six Pack 30
              </span>
            </button>
            <nav className="hidden md:flex items-center gap-6">
              <NavLinks />
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && userProfile && (
              <span className="hidden sm:inline text-sm font-medium text-muted-foreground px-3 py-1.5 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full border border-primary/10">
                Hi, {userProfile.name}
              </span>
            )}
            <LoginButton />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gradient-to-b from-background to-primary/5">
                <nav className="flex flex-col gap-2 mt-8">
                  <NavLinks mobile />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-gradient-to-r from-background via-background to-primary/5 py-6 md:py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Six Pack 30. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'sixpack30'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
