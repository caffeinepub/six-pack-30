import { useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ImageIcon, AlertCircle } from 'lucide-react';

interface ExerciseMediaProps {
  imageSrc?: string;
  videoSrc?: string;
  exerciseName: string;
  className?: string;
}

export default function ExerciseMedia({ imageSrc, videoSrc, exerciseName, className = '' }: ExerciseMediaProps) {
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);

  // If video is present and hasn't errored, prioritize it
  if (videoSrc && !videoError) {
    return (
      <div className={className}>
        <AspectRatio ratio={16 / 9}>
          <video
            src={videoSrc}
            controls
            className="w-full h-full object-cover rounded-lg bg-muted"
            preload="metadata"
            onError={() => {
              console.error(`Video failed to load: ${videoSrc}`);
              setVideoError(true);
            }}
          >
            Your browser does not support the video tag.
          </video>
        </AspectRatio>
      </div>
    );
  }

  // If video errored but image is available, fall back to image
  if (imageSrc && !imageError) {
    return (
      <div className={className}>
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageSrc}
            alt={`${exerciseName} demonstration`}
            className="w-full h-full object-cover rounded-lg"
            onError={() => {
              console.error(`Image failed to load: ${imageSrc}`);
              setImageError(true);
            }}
          />
        </AspectRatio>
      </div>
    );
  }

  // If video errored and no image, or both errored, show error state
  if ((videoError && !imageSrc) || (videoError && imageError)) {
    return (
      <div className={className}>
        <AspectRatio ratio={16 / 9}>
          <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center border border-destructive/20">
            <div className="text-center text-muted-foreground px-4">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-destructive/70" />
              <p className="text-sm font-medium">Media failed to load</p>
              <p className="text-xs mt-1">Please check your connection and try again</p>
            </div>
          </div>
        </AspectRatio>
      </div>
    );
  }

  // Fallback placeholder when no media is available
  return (
    <div className={className}>
      <AspectRatio ratio={16 / 9}>
        <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No media available</p>
          </div>
        </div>
      </AspectRatio>
    </div>
  );
}
