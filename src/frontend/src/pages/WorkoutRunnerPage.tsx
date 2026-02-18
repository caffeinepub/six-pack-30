import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useMarkDayComplete } from '../hooks/useWorkoutActions';
import { getDayWorkout } from '../lib/programContent';
import { useCountdownTimer } from '../hooks/useCountdownTimer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Play, Pause, RotateCcw, ArrowLeft, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import ExerciseMedia from '../components/exercise/ExerciseMedia';

export default function WorkoutRunnerPage() {
  const navigate = useNavigate();
  const { dayNumber } = useParams({ from: '/workout/$dayNumber' });
  const { identity } = useInternetIdentity();
  const markComplete = useMarkDayComplete();

  const dayNum = Number(dayNumber);
  const workout = getDayWorkout(dayNum);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const isAuthenticated = !!identity;

  // Get current exercise before any early returns - must be called unconditionally
  const currentExercise = workout?.exercises[currentExerciseIndex];
  const isTimedExercise = currentExercise ? (currentExercise.type === 'time' || currentExercise.type === 'rest') : false;
  const timer = useCountdownTimer(currentExercise?.duration || 0);

  // Reset timer when exercise changes
  useEffect(() => {
    timer.reset();
  }, [currentExerciseIndex]);

  if (!workout || !currentExercise) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Workout not found</h1>
          <Button onClick={() => navigate({ to: '/program' })}>Back to Program</Button>
        </div>
      </div>
    );
  }

  const progressPercentage = (completedExercises.size / workout.exercises.length) * 100;
  const allExercisesComplete = completedExercises.size === workout.exercises.length;

  const handleToggleExercise = (index: number) => {
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedExercises(newCompleted);
  };

  const handleCompleteWorkout = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save your progress');
      return;
    }

    try {
      await markComplete.mutateAsync(dayNum);
      setShowCompletion(true);
      toast.success('Workout completed! Great job!');
    } catch (error) {
      toast.error('Failed to save progress. Please try again.');
      console.error('Error marking day complete:', error);
    }
  };

  const handleExerciseChange = (newIndex: number) => {
    timer.pause();
    setCurrentExerciseIndex(newIndex);
  };

  if (showCompletion) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <Trophy className="w-24 h-24 mx-auto text-primary" />
          <h1 className="text-4xl font-bold">Workout Complete!</h1>
          <p className="text-xl text-muted-foreground">
            Amazing work on Day {dayNum}. You're one step closer to your goal!
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate({ to: '/' })}>
              Back to Dashboard
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate({ to: '/program' })}>
              View Program
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate({ to: '/day/$dayNumber', params: { dayNumber: String(dayNum) } })} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Exit Workout
          </Button>
          <Badge variant="outline">Day {dayNum}</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{workout.title}</CardTitle>
            <CardDescription>
              {completedExercises.size} of {workout.exercises.length} exercises completed
            </CardDescription>
            <Progress value={progressPercentage} className="h-2 mt-2" />
          </CardHeader>
        </Card>

        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge>Current Exercise</Badge>
              <span className="text-sm text-muted-foreground">
                {currentExerciseIndex + 1} / {workout.exercises.length}
              </span>
            </div>
            <CardTitle className="text-2xl">{currentExercise.name}</CardTitle>
            <CardDescription>{currentExercise.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(currentExercise.imageSrc || currentExercise.videoSrc) && (
              <ExerciseMedia
                imageSrc={currentExercise.imageSrc}
                videoSrc={currentExercise.videoSrc}
                exerciseName={currentExercise.name}
              />
            )}

            <div className="flex flex-wrap gap-2">
              {currentExercise.type === 'reps' && (
                <>
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {currentExercise.sets} sets
                  </Badge>
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {currentExercise.reps} reps
                  </Badge>
                </>
              )}
              {isTimedExercise && (
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {currentExercise.duration}s
                </Badge>
              )}
            </div>

            {isTimedExercise && currentExercise.duration && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="text-6xl font-bold text-primary mb-4">{timer.formatTime()}</div>
                  <Progress value={((currentExercise.duration - timer.seconds) / currentExercise.duration) * 100} className="h-3" />
                </div>
                <div className="flex gap-2 justify-center">
                  {!timer.isRunning ? (
                    <Button size="lg" onClick={timer.start} className="gap-2">
                      <Play className="w-5 h-5" />
                      Start
                    </Button>
                  ) : (
                    <Button size="lg" onClick={timer.pause} variant="outline" className="gap-2">
                      <Pause className="w-5 h-5" />
                      Pause
                    </Button>
                  )}
                  <Button size="lg" onClick={timer.reset} variant="outline" className="gap-2">
                    <RotateCcw className="w-5 h-5" />
                    Reset
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => handleExerciseChange(Math.max(0, currentExerciseIndex - 1))}
                disabled={currentExerciseIndex === 0}
                className="flex-1"
              >
                Previous
              </Button>
              <Button
                onClick={() => {
                  handleToggleExercise(currentExerciseIndex);
                  if (currentExerciseIndex < workout.exercises.length - 1) {
                    handleExerciseChange(currentExerciseIndex + 1);
                  }
                }}
                className="flex-1 gap-2"
              >
                {completedExercises.has(currentExerciseIndex) ? 'Mark Incomplete' : 'Complete'}
                <CheckCircle2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExerciseChange(Math.min(workout.exercises.length - 1, currentExerciseIndex + 1))}
                disabled={currentExerciseIndex === workout.exercises.length - 1}
                className="flex-1"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {workout.exercises.map((exercise, index) => (
                <button
                  key={index}
                  onClick={() => handleExerciseChange(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    index === currentExerciseIndex
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {completedExercises.has(index) ? (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{exercise.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {exercise.type === 'reps' && `${exercise.sets} × ${exercise.reps}`}
                        {exercise.type === 'time' && `${exercise.duration}s`}
                        {exercise.type === 'rest' && `Rest ${exercise.duration}s`}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {allExercisesComplete && (
          <Card className="border-2 border-primary bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Trophy className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-xl font-bold">All exercises completed!</h3>
                <p className="text-muted-foreground">
                  {isAuthenticated
                    ? 'Mark this day as complete to save your progress.'
                    : 'Sign in to save your progress.'}
                </p>
                <Button
                  size="lg"
                  onClick={handleCompleteWorkout}
                  disabled={!isAuthenticated || markComplete.isPending}
                  className="gap-2"
                >
                  {markComplete.isPending ? 'Saving...' : 'Complete Day ' + dayNum}
                  <CheckCircle2 className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
