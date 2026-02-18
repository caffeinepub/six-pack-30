export interface Exercise {
  name: string;
  type: 'reps' | 'time' | 'rest';
  sets?: number;
  reps?: number;
  duration?: number; // in seconds
  description: string;
  imageSrc?: string;
  videoSrc?: string;
}

export interface DayWorkout {
  dayNumber: number;
  title: string;
  description: string;
  exercises: Exercise[];
  estimatedTime: number; // in minutes
}

// Helper function to get exercise media
function getExerciseMedia(exerciseName: string): { imageSrc?: string; videoSrc?: string } {
  const mediaMap: Record<string, { imageSrc?: string; videoSrc?: string }> = {
    'Plank': { 
      imageSrc: '/assets/generated/exercise-plank.dim_800x450.png',
      videoSrc: '/assets/generated/exercise-plank-demo.mp4'
    },
    'Crunches': { 
      imageSrc: '/assets/generated/exercise-crunches.dim_800x450.png',
      videoSrc: '/assets/generated/exercise-crunches-demo.mp4'
    },
    'Bicycle Crunches': { 
      imageSrc: '/assets/generated/exercise-bicycle-crunches.dim_800x450.png',
      videoSrc: '/assets/generated/exercise-bicycle-crunches-demo.mp4'
    },
    'Mountain Climbers': { 
      imageSrc: '/assets/generated/exercise-mountain-climbers.dim_800x450.png',
      videoSrc: '/assets/generated/exercise-mountain-climbers-demo.mp4'
    },
    'Leg Raises': { 
      imageSrc: '/assets/generated/exercise-leg-raises.dim_800x450.png',
      videoSrc: '/assets/generated/exercise-leg-raises-demo.mp4'
    },
    'Rest': { 
      imageSrc: '/assets/generated/exercise-rest.dim_800x450.png',
      videoSrc: '/assets/generated/exercise-rest-demo.mp4'
    },
  };
  
  return mediaMap[exerciseName] || {};
}

export const programContent: DayWorkout[] = [
  {
    dayNumber: 1,
    title: 'Foundation Day',
    description: 'Start your journey with basic core exercises to build a foundation.',
    estimatedTime: 15,
    exercises: [
      { name: 'Plank', type: 'time', duration: 30, description: 'Hold a straight plank position, engaging your core.', ...getExerciseMedia('Plank') },
      { name: 'Rest', type: 'rest', duration: 30, description: 'Take a short break.', ...getExerciseMedia('Rest') },
      { name: 'Crunches', type: 'reps', sets: 2, reps: 15, description: 'Lie on your back and lift your shoulders off the ground.', ...getExerciseMedia('Crunches') },
      { name: 'Rest', type: 'rest', duration: 30, description: 'Take a short break.', ...getExerciseMedia('Rest') },
      { name: 'Leg Raises', type: 'reps', sets: 2, reps: 10, description: 'Lie flat and raise your legs to 90 degrees.', ...getExerciseMedia('Leg Raises') },
    ],
  },
  {
    dayNumber: 2,
    title: 'Building Strength',
    description: 'Increase intensity with more challenging variations.',
    estimatedTime: 18,
    exercises: [
      { name: 'Plank', type: 'time', duration: 40, description: 'Hold a straight plank position, engaging your core.', ...getExerciseMedia('Plank') },
      { name: 'Rest', type: 'rest', duration: 30, description: 'Take a short break.', ...getExerciseMedia('Rest') },
      { name: 'Bicycle Crunches', type: 'reps', sets: 2, reps: 20, description: 'Alternate bringing opposite elbow to knee.', ...getExerciseMedia('Bicycle Crunches') },
      { name: 'Rest', type: 'rest', duration: 30, description: 'Take a short break.', ...getExerciseMedia('Rest') },
      { name: 'Mountain Climbers', type: 'reps', sets: 2, reps: 15, description: 'Alternate bringing knees to chest in plank position.', ...getExerciseMedia('Mountain Climbers') },
    ],
  },
  {
    dayNumber: 3,
    title: 'Rest & Recovery',
    description: 'Light stretching and recovery to let your muscles rebuild.',
    estimatedTime: 10,
    exercises: [
      { name: 'Cat-Cow Stretch', type: 'time', duration: 60, description: 'Gentle spinal mobility exercise.' },
      { name: 'Rest', type: 'rest', duration: 30, description: 'Take a short break.', ...getExerciseMedia('Rest') },
      { name: 'Child\'s Pose', type: 'time', duration: 60, description: 'Relaxing stretch for your back and core.' },
    ],
  },
];

// Generate remaining days (4-30) with progressive difficulty
for (let day = 4; day <= 30; day++) {
  const isRestDay = day % 7 === 3;
  
  if (isRestDay) {
    programContent.push({
      dayNumber: day,
      title: 'Active Recovery',
      description: 'Light activity to promote recovery and maintain momentum.',
      estimatedTime: 10,
      exercises: [
        { name: 'Light Stretching', type: 'time', duration: 120, description: 'Full body stretching routine.' },
        { name: 'Rest', type: 'rest', duration: 30, description: 'Take a short break.', ...getExerciseMedia('Rest') },
        { name: 'Core Breathing', type: 'time', duration: 60, description: 'Deep breathing with core engagement.' },
      ],
    });
  } else {
    const week = Math.floor((day - 1) / 7) + 1;
    const plankTime = Math.min(30 + (week * 10), 90);
    const repsMultiplier = 1 + (week * 0.2);
    
    programContent.push({
      dayNumber: day,
      title: `Day ${day} - Week ${week}`,
      description: `Progressive training for week ${week}. Push yourself!`,
      estimatedTime: 15 + week * 2,
      exercises: [
        { name: 'Plank', type: 'time', duration: plankTime, description: 'Hold a straight plank position, engaging your core.', ...getExerciseMedia('Plank') },
        { name: 'Rest', type: 'rest', duration: 30, description: 'Take a short break.', ...getExerciseMedia('Rest') },
        { name: 'Crunches', type: 'reps', sets: 3, reps: Math.floor(15 * repsMultiplier), description: 'Controlled abdominal crunches.', ...getExerciseMedia('Crunches') },
        { name: 'Rest', type: 'rest', duration: 30, description: 'Take a short break.', ...getExerciseMedia('Rest') },
        { name: 'Bicycle Crunches', type: 'reps', sets: 3, reps: Math.floor(20 * repsMultiplier), description: 'Alternate bringing opposite elbow to knee.', ...getExerciseMedia('Bicycle Crunches') },
        { name: 'Rest', type: 'rest', duration: 30, description: 'Take a short break.', ...getExerciseMedia('Rest') },
        { name: 'Leg Raises', type: 'reps', sets: 3, reps: Math.floor(12 * repsMultiplier), description: 'Controlled leg raises.', ...getExerciseMedia('Leg Raises') },
        { name: 'Rest', type: 'rest', duration: 30, description: 'Take a short break.', ...getExerciseMedia('Rest') },
        { name: 'Mountain Climbers', type: 'reps', sets: 3, reps: Math.floor(20 * repsMultiplier), description: 'High-intensity mountain climbers.', ...getExerciseMedia('Mountain Climbers') },
      ],
    });
  }
}

export function getDayWorkout(dayNumber: number): DayWorkout | undefined {
  return programContent.find((day) => day.dayNumber === dayNumber);
}
