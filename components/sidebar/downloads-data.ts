import {
  FileArchive,
  FileText,
  Film,
  Image as ImageIcon,
  Music,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { IconNudgePreset } from "./nudge-icon"

export interface DownloadEntry {
  id: string
  name: string
  meta: string
  /** Short label for the narrow rail, where the full filename never fits. */
  shortMeta: string
  icon: LucideIcon
  nudge: IconNudgePreset
  progress?: number
}

export const downloads: DownloadEntry[] = [
  {
    id: "arc-press-kit",
    name: "arc-press-kit.zip",
    meta: "18.4 MB of 42.1 MB",
    shortMeta: "44%",
    icon: FileArchive,
    nudge: "archive",
    progress: 0.44,
  },
  {
    id: "spaces-walkthrough",
    name: "spaces-walkthrough.mp4",
    meta: "112 MB · 4 minutes ago",
    shortMeta: "112 MB",
    icon: Film,
    nudge: "film",
  },
  {
    id: "sidebar-spec",
    name: "sidebar-spec.pdf",
    meta: "2.1 MB · Yesterday",
    shortMeta: "2.1 MB",
    icon: FileText,
    nudge: "file",
  },
  {
    id: "boost-wallpaper",
    name: "boost-wallpaper.png",
    meta: "6.8 MB · Yesterday",
    shortMeta: "6.8 MB",
    icon: ImageIcon,
    nudge: "image",
  },
  {
    id: "focus-loop",
    name: "focus-loop.mp3",
    meta: "9.2 MB · Jul 21",
    shortMeta: "9.2 MB",
    icon: Music,
    nudge: "music",
  },
]
