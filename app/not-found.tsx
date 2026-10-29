import Link from "next/link";
import { LineArt } from "@/components/collage/LineArt";
import { Note } from "@/components/collage/Note";
import { CornerLabels } from "@/components/ui/CornerLabels";

export default function NotFound() {
  return (
    <>
      <CornerLabels left="lost page" right="?? / ??" />
      <section className="sheet-cols mt-16 gap-y-8">
        <h1 className="col-span-4 font-display text-mega md:col-span-8">Torn out.</h1>
        <LineArt name="cloud" className="col-span-4 w-full max-w-sm md:col-span-4" />
        <Note className="col-span-4 md:col-span-6" seed="404">
          this page fell out of the sketchbook —{" "}
          <Link href="/" className="text-accent-ink underline underline-offset-4">
            back to the start
          </Link>
        </Note>
      </section>
    </>
  );
}
