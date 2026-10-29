/**
 * Paper background: a faint square grid whose vertical lines match the `.sheet-cols` columns
 * (12 from md, 4 on mobile) and whose rows use the same pitch, plus a fixed grain tile.
 * The grid is absolutely positioned so it scrolls with the page like real paper.
 */
export function Backdrop() {
  return (
    <>
      <div aria-hidden="true" className="paper-grid pointer-events-none absolute inset-0 -z-10">
        <div className="sheet-cols h-full">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={`h-full border-l border-grid ${i === 3 ? "border-r md:border-r-0" : ""} ${i === 11 ? "border-r" : ""} ${i >= 4 ? "hidden md:block" : ""}`}
            />
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-[70]" />
    </>
  );
}
