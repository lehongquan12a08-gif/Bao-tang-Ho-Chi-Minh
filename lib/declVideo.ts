// Shared handle to the Tuyên ngôn Độc lập <video> that lives inside the 1945
// chapter. Chapter1945 registers the element; AudioController drives it (play /
// pause / volume) as the "voice" of the Ba Đình scene, exactly where the audio
// recording used to sit.
let el: HTMLVideoElement | null = null;

export function setDeclVideo(v: HTMLVideoElement | null): void {
  el = v;
}

export function getDeclVideo(): HTMLVideoElement | null {
  return el;
}
