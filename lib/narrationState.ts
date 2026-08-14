// Shared narration state. AudioController writes it; AutoScrollButton reads it
// to drive a voice-locked auto-scroll: the scroll position is tied to the
// narration audio clock, so each chapter glides through in exactly the time of
// its voiceover and hands off to the next one seamlessly.
export const narrationState = {
  enabled: false, // sound is on
  speaking: false, // any voice (narration or the Tuyên ngôn recording) is audible
  activeId: null as string | null, // id of the chapter currently being narrated
  progress: 0, // 0..1 position within the current cue, from the audio clock
  playing: false, // the narration audio is actively advancing (not paused/ended)
};
