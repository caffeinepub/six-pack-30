import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DayProgress {
    completed: boolean;
    dayNumber: bigint;
}
export interface Day {
    description: string;
    dayNumber: bigint;
    activity: string;
}
export interface DailyProgress {
    completedDays: Array<bigint>;
}
export interface UserProfile {
    name: string;
}
export interface Program {
    title: string;
    days: Array<Day>;
    description: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDay(dayNumber: bigint): Promise<Day>;
    getDayProgress(dayNumber: bigint): Promise<DayProgress>;
    getDaysRange(startDay: bigint, endDay: bigint): Promise<Array<Day>>;
    getMyProgress(): Promise<DailyProgress>;
    getProgram(): Promise<Program>;
    getProgramStats(): Promise<{
        totalDays: bigint;
        completedCount: bigint;
        remainingCount: bigint;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markDayComplete(dayNumber: bigint): Promise<void>;
    resetMyProgress(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
