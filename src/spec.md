# Specification

## Summary
**Goal:** Fix unauthenticated navigation/progress loading issues on Day Details and Program pages, ensure workout timer seconds count down and reset correctly, and make exercise demo videos play reliably with a clear fallback on failure.

**Planned changes:**
- Gate progress-related React Query calls (e.g., day progress and “my progress”) behind authentication so signed-out users can browse Day Details and the Program schedule without unauthorized requests.
- Update Day Details UI to render core content (title, description, exercise list) when signed out, while hiding/omitting completion badges that depend on saved progress.
- Fix Workout Runner countdown logic so seconds decrement reliably and reset/stop correctly when switching exercises (Next/Previous or selecting from the list).
- Improve exercise demo video rendering so `videoSrc` loads consistently and shows an English in-UI fallback state when the video is missing or fails, while still prioritizing video over image when both are present.

**User-visible outcome:** Signed-out users can open /day/1 and /program without crashes and still view workouts; signed-in users continue to see progress badges. In /workout/1 the timer counts down correctly per exercise, and exercise demo videos play when available with a clear fallback message if they fail.
