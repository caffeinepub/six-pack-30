import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { useSaveUserProfile } from '../../hooks/useWorkoutActions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveUserProfile();
  const [name, setName] = useState('');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    if (!showProfileSetup) {
      setName('');
    }
  }, [showProfileSetup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      try {
        await saveProfile.mutateAsync({ name: name.trim() });
      } catch (error) {
        console.error('Failed to save profile:', error);
      }
    }
  };

  return (
    <Dialog open={showProfileSetup} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Welcome to Six Pack 30!</DialogTitle>
            <DialogDescription>
              Let's get started. What should we call you?
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Label htmlFor="name" className="text-sm font-medium">
              Your Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="mt-2"
              autoFocus
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!name.trim() || saveProfile.isPending}>
              {saveProfile.isPending ? 'Saving...' : 'Get Started'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
