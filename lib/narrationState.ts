// Shared flag: is a voice (narration or the Tuyên ngôn recording) currently
// speaking? AudioController writes it; AutoScrollButton reads it to pace the
// auto-scroll so it follows the narration (slow while a voice speaks, faster
// through the silent gaps).
export const narrationState = { speaking: false, enabled: false };
