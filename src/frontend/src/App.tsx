import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import AppShell from './components/layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import ProgramPage from './pages/ProgramPage';
import DayDetailsPage from './pages/DayDetailsPage';
import WorkoutRunnerPage from './pages/WorkoutRunnerPage';
import OnboardingPage from './pages/OnboardingPage';
import ProfileSetupModal from './components/auth/ProfileSetupModal';

const rootRoute = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
      <ProfileSetupModal />
    </AppShell>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const programRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/program',
  component: ProgramPage,
});

const dayDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/day/$dayNumber',
  component: DayDetailsPage,
});

const workoutRunnerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workout/$dayNumber',
  component: WorkoutRunnerPage,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/info',
  component: OnboardingPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  programRoute,
  dayDetailsRoute,
  workoutRunnerRoute,
  onboardingRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
