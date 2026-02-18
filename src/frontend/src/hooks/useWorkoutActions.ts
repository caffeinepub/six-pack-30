import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';

export function useMarkDayComplete() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dayNumber: number) => {
      if (!actor) throw new Error('Actor not available');
      await actor.markDayComplete(BigInt(dayNumber));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProgress'] });
      queryClient.invalidateQueries({ queryKey: ['dayProgress'] });
    },
  });
}

export function useResetProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.resetMyProgress();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProgress'] });
      queryClient.invalidateQueries({ queryKey: ['dayProgress'] });
    },
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
