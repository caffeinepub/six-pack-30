import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Program, DailyProgress, Day, DayProgress, UserProfile } from '../backend';

export function useGetProgram() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Program>({
    queryKey: ['program'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProgram();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetMyProgress() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<DailyProgress>({
    queryKey: ['myProgress'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyProgress();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });
}

export function useGetDay(dayNumber: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Day>({
    queryKey: ['day', dayNumber],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDay(BigInt(dayNumber));
    },
    enabled: !!actor && !actorFetching && dayNumber >= 1 && dayNumber <= 30,
  });
}

export function useGetDayProgress(dayNumber: number) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<DayProgress>({
    queryKey: ['dayProgress', dayNumber],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDayProgress(BigInt(dayNumber));
    },
    enabled: !!actor && !actorFetching && !!identity && dayNumber >= 1 && dayNumber <= 30,
    retry: false,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}
