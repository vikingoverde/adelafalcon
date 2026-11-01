import Link from "next/link";
import { Credits } from "@/components/ui/Credits";

export default function NotFound() {
  return (
    <div className="sheet min-h-[70vh] pt-28 md:pt-36">
      <h1 className="sr-only">Page not found</h1>
      <Credits axis="52%" mobileAxis="0%" rows={[{ values: ["This scene was cut", "Error 404"] }]} />
      <Credits
        className="mt-16"
        axis="52%"
        rows={[
          {
            label: "Return to",
            values: (
              <Link href="/" className="underline underline-offset-4">
                Index
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}
