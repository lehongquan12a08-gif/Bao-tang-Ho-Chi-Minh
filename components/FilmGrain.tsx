/**
 * Fixed, non-interactive film treatment: subtle animated grain + vignette.
 * Kept deliberately low-opacity so the experience stays trang trọng.
 */
export default function FilmGrain() {
  return (
    <>
      <div className="film-grain" aria-hidden="true" />
      <div className="film-vignette" aria-hidden="true" />
    </>
  );
}
