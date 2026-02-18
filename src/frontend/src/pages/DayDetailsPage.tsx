import { useNavigate, useParams } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetDayProgress } from '../hooks/useQueries';
import { getDayWorkout } from '../lib/programContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Play, CheckCircle2, Clock, Repeat } from 'lucide-react';
import ExerciseMedia from '../components/exercise/ExerciseMedia';

export default function DayDetailsPage() {
  const navigate = useNavigate();
  const { dayNumber } = useParams({ from: '/day/$dayNumber' });
  const { identity } = useInternetIdentity();
  const { data: dayProgress } = useGetDayProgress(Number(dayNumber));

  const isAuthenticated = !!identity;
  const dayNum = Number(dayNumber);
  const workout = getDayWorkout(dayNum);

  if (!workout) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Day not found</h1>
          <Button onClick={() => navigate({ to: '/program' })}>Back to Program</Button>
        </div>
      </div>
    );
  }

  const isCompleted = isAuthenticated && dayProgress?.completed;

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/program' })} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Program
        </Button>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Day {workout.dayNumber}</Badge>
                  {isCompleted && (
                    <Badge className="gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-3xl">{workout.title}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {workout.description}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {workout.estimatedTime} min
              </div>
              <div className="flex items-center gap-1">
                <Repeat className="w-4 h-4" />
                {workout.exercises.length} exercises
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workout Plan</CardTitle>
            <CardDescription>Follow these exercises in order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {workout.exercises.map((exercise, index) => (
              <div key={index}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{exercise.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {exercise.type === 'reps' && (
                          <>
                            <Badge variant="secondary">{exercise.sets} sets</Badge>
                            <Badge variant="secondary">{exercise.reps} reps</Badge>
                          </>
                        )}
                        {exercise.type === 'time' && (
                          <Badge variant="secondary">{exercise.duration}s</Badge>
                        )}
                        {exercise.type === 'rest' && (
                          <Badge variant="outline">Rest {exercise.duration}s</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {(exercise.imageSrc || exercise.videoSrc) && (
                    <ExerciseMedia
                      imageSrc={exercise.imageSrc}
                      videoSrc={exercise.videoSrc}
                      exerciseName={exercise.name}
                      className="ml-12"
                    />
                  )}
                </div>
                {index < workout.exercises.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            size="lg"
            className="flex-1 gap-2"
            onClick={() => navigate({ to: '/workout/$dayNumber', params: { dayNumber: String(dayNum) } })}
          >
            <Play className="w-5 h-5" />
            {isCompleted ? 'Do Again' : 'Start Workout'}
          </Button>
        </div>
      </div>
    </div>
  );
}
