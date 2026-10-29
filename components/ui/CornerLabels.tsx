import { Label } from "./Label";

type Props = {
  left: string;
  right: string;
  bottomLeft?: string;
  bottomRight?: string;
};

/** The small corner marks of an editorial spread: "project mood" … "02 / 09". */
export function CornerLabels({ left, right, bottomLeft, bottomRight }: Props) {
  return (
    <>
      <div className="sheet-cols pointer-events-none relative z-10 pt-24 md:pt-28">
        <Label className="col-span-2 md:col-span-6">{left}</Label>
        <Label className="col-span-2 text-right md:col-span-6">
          <span aria-hidden="true">{right}</span>
          <span className="sr-only">page {right.replace(" / ", " of ")}</span>
        </Label>
      </div>
      {(bottomLeft || bottomRight) && (
        <div className="sheet-cols pointer-events-none">
          <Label className="col-span-2 md:col-span-6">{bottomLeft}</Label>
          <Label className="col-span-2 text-right md:col-span-6">{bottomRight}</Label>
        </div>
      )}
    </>
  );
}
