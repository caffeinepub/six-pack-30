import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMyProgress } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Lock } from 'lucide-react';

export default function ProgramPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: progress } = useGetMyProgress();

  const isAuthenticated = !!identity;
  const completedSet = new Set(progress?.completedDays.map((d) => Number(d)) || []);

  const weeks = Array.from({ length: 5 }, (_, weekIndex) => {
    const startDay = weekIndex * 6 + 1;
    const endDay = Math.min(startDay + 5, 30);
    const days = Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i);
    return { weekNumber: weekIndex + 1, days };
  });

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">30-Day Program</h1>
          <p className="text-lg text-muted-foreground">
            Your complete workout schedule. {isAuthenticated ? 'Click any day to view details.' : 'Sign in to track your progress.'}
          </p>
        </div>

        {!isAuthenticated && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Sign In to Track Progress
              </CardTitle>
              <CardDescription>
                Create an account to save your progress and unlock the full experience.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="space-y-8">
          {weeks.map((week) => (
            <Card key={week.weekNumber}>
              <CardHeader>
                <CardTitle>Week {week.weekNumber}</CardTitle>
                <CardDescription>
                  Days {week.days[0]} - {week.days[week.days.length - 1]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {week.days.map((day) => {
                    const isCompleted = isAuthenticated && completedSet.has(day);
                    const isRestDay = day % 7 === 3;

                    return (
                      <button
                        key={day}
                        onClick={() => navigate({ to: '/day/$dayNumber', params: { dayNumber: String(day) } })}
                        className="text-left p-4 rounded-lg border-2 hover:border-primary transition-all hover:shadow-md"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">Day {day}</h3>
                            {isRestDay && (
                              <Badge variant="secondary" className="mt-1">
                                Recovery
                              </Badge>
                            )}
                          </div>
                          {isAuthenticated && (
                            <div>
                              {isCompleted ? (
                                <CheckCircle2 className="w-6 h-6 text-primary" />
                              ) : (
                                <Circle className="w-6 h-6 text-muted-foreground" />
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {isRestDay ? 'Active recovery day' : 'Core workout'}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={() => navigate({ to: '/' })}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
