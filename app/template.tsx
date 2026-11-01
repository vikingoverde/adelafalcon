import type { ReactNode } from "react";

/** Remounts on every navigation, so the CSS fade replays: a quiet cut between "reels". */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-in">{children}</div>;
}
