"use client";

import { useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Download } from "lucide-react";
import { useReducedMotion } from "motion/react";

import { FileFlight, type Flight } from "@/components/download-flight";
import { Button } from "@/components/ui/button";

export function DownloadDemo({ onArrival }: { onArrival: (id: string) => void }) {
  const [flight, setFlight] = useState<Flight | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const active = useRef(false);
  const reduceMotion = useReducedMotion();

  function launch(event: MouseEvent<HTMLButtonElement>) {
    if (active.current) return;
    const button = event.currentTarget.getBoundingClientRect();
    const gift = document.querySelector<HTMLElement>("[data-download-target]");
    const rect = gift?.getBoundingClientRect();
    const x = rect ? rect.x + rect.width / 2 : -1;
    const y = rect ? rect.y + rect.height / 2 : -1;
    const hit = document.elementFromPoint(x, y);
    const visible = !!gift && !!hit && gift.contains(hit);
    const id = crypto.randomUUID();
    setAnnouncement("");
    if (reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onArrival(id);
      setAnnouncement("Animation preview complete. No file was downloaded.");
      return;
    }
    active.current = true;
    setFlight({
      id,
      name: "Download preview",
      origin: event.detail === 0
        ? { x: button.x + button.width / 2, y: button.y + button.height / 2 }
        : { x: event.clientX, y: event.clientY },
      target: visible ? { x, y } : { x: 28, y: window.innerHeight - 32 },
      showGift: !visible,
    });
  }

  function land(id: string) {
    if (!active.current) return;
    active.current = false;
    setFlight(null);
    onArrival(id);
    setAnnouncement("Animation preview complete. No file was downloaded.");
  }

  return (
    <>
      <div className="flex min-h-64 flex-1 items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <Button type="button" onClick={launch} disabled={!!flight}
            aria-describedby="download-demo-description"
            className="h-9 gap-2 rounded-lg bg-[#65556f] px-4 text-white hover:bg-[#54455d] focus-visible:ring-[#65556f]/40">
            <Download aria-hidden="true" className="size-4" />
            Download
          </Button>
          <p id="download-demo-description" className="text-sm text-[#65556f]">
            Preview the animation. No file is downloaded.
          </p>
        </div>
      </div>
      <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
      {flight && createPortal(
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
          <FileFlight flight={flight} onLand={land} />
        </div>, document.body,
      )}
    </>
  );
}
