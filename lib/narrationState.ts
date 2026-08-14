// Shared narration state. AudioController writes it; AutoScrollButton reads it
// to drive a voice-locked auto-scroll: the scroll position is tied to the
// narration audio clock, so each chapter glides through in exactly the time of
// its voiceover and hands off seamlessly to the next one.
//
// `scroll0`/`scroll1` are the fraction band (0..1) of the current section that
// this voice scrubs. Normally [0,1] (the whole section). For 1945 the section
// holds several acts, so the narration scrubs only the first band and the
// Tuyên ngôn recording scrubs the middle band — they play in sequence, never
// overlapping.
export const narrationState = {
  enabled: false, // sound is on
  speaking: false, // any voice (narration or the Tuyên ngôn recording) is audible
  activeId: null as string | null, // id of the chapter currently being narrated
  progress: 0, // 0..1 position within the current voice, from the audio clock
  playing: false, // the driving voice is actively advancing (not paused/ended)
  scroll0: 0, // start of the section fraction band this voice scrubs
  scroll1: 1, // end of the section fraction band this voice scrubs
  volume: 0.8, // master volume (0..1), so UI sounds can follow the slider
};
