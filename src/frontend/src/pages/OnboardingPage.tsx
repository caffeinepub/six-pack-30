import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Target, Flame, Trophy, Calendar, AlertTriangle, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <img
            src="/assets/generated/challenge-badge.dim_256x256.png"
            alt="Challenge Badge"
            className="w-24 h-24 mx-auto"
          />
          <h1 className="text-4xl font-bold">Welcome to Six Pack 30</h1>
          <p className="text-xl text-muted-foreground">
            Your 30-day journey to a stronger, more defined core
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">What is Six Pack 30?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Six Pack 30 is a comprehensive 30-day workout program designed to strengthen and define your core muscles.
              Each day includes a structured workout with exercises targeting your abs, obliques, and lower back.
            </p>
            <div className="grid md:grid-cols-2 gap-4 pt-4">
              <div className="flex gap-3">
                <Target className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Structured Program</h3>
                  <p className="text-sm text-muted-foreground">
                    30 days of progressive workouts designed to build strength gradually
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Flame className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Daily Workouts</h3>
                  <p className="text-sm text-muted-foreground">
                    15-25 minute sessions that fit into your busy schedule
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Trophy className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Track Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor your completion and maintain your streak
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Calendar className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Recovery Days</h3>
                  <p className="text-sm text-muted-foreground">
                    Built-in rest days to help your muscles recover and grow
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">How to Use This App</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <Badge className="shrink-0">1</Badge>
                <div>
                  <h3 className="font-semibold mb-1">Sign In</h3>
                  <p className="text-sm text-muted-foreground">
                    Create an account to save your progress and track your journey
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="shrink-0">2</Badge>
                <div>
                  <h3 className="font-semibold mb-1">View Your Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    See your progress, current streak, and next workout
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="shrink-0">3</Badge>
                <div>
                  <h3 className="font-semibold mb-1">Start Your Workout</h3>
                  <p className="text-sm text-muted-foreground">
                    Follow the guided exercises with built-in timers and instructions
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="shrink-0">4</Badge>
                <div>
                  <h3 className="font-semibold mb-1">Complete & Track</h3>
                  <p className="text-sm text-muted-foreground">
                    Mark exercises as complete and save your daily progress
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertDescription className="ml-2">
            <strong className="font-semibold">Important Safety Disclaimer:</strong> This program is for informational
            purposes only. Before starting any new exercise program, please consult with a healthcare professional or
            certified fitness trainer, especially if you have any pre-existing health conditions, injuries, or concerns.
            Listen to your body and stop immediately if you experience pain or discomfort. The creators of this app are
            not responsible for any injuries that may occur.
          </AlertDescription>
        </Alert>

        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Ready to Start?</h3>
              <p className="text-muted-foreground">
                Sign in to begin your 30-day transformation journey today!
              </p>
              <Button size="lg" onClick={() => navigate({ to: '/' })} className="gap-2">
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
