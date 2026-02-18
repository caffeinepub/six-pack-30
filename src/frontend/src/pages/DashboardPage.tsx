import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMyProgress, useGetCallerUserProfile } from '../hooks/useQueries';
import { getNextIncompleteDay, calculateStreak, getCompletionPercentage } from '../lib/progressMath';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Trophy, Flame, Target, Lock } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: progress, isLoading } = useGetMyProgress();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden mb-8">
            <img
              src="/assets/generated/sixpack-hero.dim_1600x600.png"
              alt="Six Pack Challenge"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h1 className="text-4xl font-bold mb-2">30-Day Six Pack Challenge</h1>
                <p className="text-lg opacity-90">Transform your core in just one month</p>
              </div>
            </div>
          </div>

          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Lock className="w-12 h-12 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">Sign In to Start Your Journey</CardTitle>
              <CardDescription className="text-base">
                Track your progress, complete daily workouts, and achieve your fitness goals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">30 Days</h3>
                  <p className="text-sm text-muted-foreground">Structured program</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Flame className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Daily Workouts</h3>
                  <p className="text-sm text-muted-foreground">15-25 minutes</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Track Progress</h3>
                  <p className="text-sm text-muted-foreground">See your results</p>
                </div>
              </div>
              <div className="pt-4 text-center">
                <Button size="lg" onClick={() => navigate({ to: '/info' })}>
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading || !progress) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-64 bg-muted animate-pulse rounded-2xl" />
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  const completedCount = progress.completedDays.length;
  const nextDay = getNextIncompleteDay(progress.completedDays);
  const streak = calculateStreak(progress.completedDays);
  const completionPercentage = getCompletionPercentage(progress.completedDays);
  const allComplete = completedCount === 30;

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="/assets/generated/sixpack-hero.dim_1600x600.png"
            alt="Six Pack Challenge"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-8 text-white w-full">
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {userProfile?.name || 'Champion'}!
              </h1>
              <p className="text-lg opacity-90">
                {allComplete
                  ? '🎉 Congratulations! You completed the challenge!'
                  : `Day ${nextDay || 1} awaits you`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Progress</CardDescription>
              <CardTitle className="text-3xl">{completedCount}/30</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={completionPercentage} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">{completionPercentage}% complete</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Current Streak</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Flame className="w-8 h-8 text-primary" />
                {streak}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {streak > 0 ? 'Keep it going!' : 'Start your streak today'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Remaining</CardDescription>
              <CardTitle className="text-3xl">{30 - completedCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {allComplete ? 'Challenge complete!' : 'Days to go'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">
              {allComplete ? 'Challenge Complete!' : 'Ready for Your Next Workout?'}
            </CardTitle>
            <CardDescription>
              {allComplete
                ? 'You\'ve completed all 30 days. Amazing work!'
                : `Continue with Day ${nextDay}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {allComplete ? (
              <div className="text-center py-8">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
                <p className="text-lg mb-6">
                  You've shown incredible dedication and strength. Keep up the great work!
                </p>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate({ to: '/program' })}
                >
                  View All Days
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg">Day {nextDay}</h3>
                    <p className="text-sm text-muted-foreground">Your next challenge</p>
                  </div>
                  <Badge variant="secondary">New</Badge>
                </div>
                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={() => navigate({ to: '/day/$dayNumber', params: { dayNumber: String(nextDay) } })}
                >
                  Start Day {nextDay}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="outline" onClick={() => navigate({ to: '/program' })}>
            View Full Program
          </Button>
        </div>
      </div>
    </div>
  );
}
