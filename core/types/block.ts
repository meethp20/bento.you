export type BlockType =
  | "social"
  | "map"
  | "image"
  | "text"
  | "link"
  | "heading"
  | "youtube"
  | "cal"
  | "quote";

export interface BlockData {
  title?: string;
  url?: string;
  imageUrl?: string;
  videoUrl?: string;
  iconUrl?: string; // For generic links with favicons
  platform?:
    | "twitter"
    | "instagram"
    | "github"
    | "linkedin"
    | "youtube"
    | "spotify"
    | "cal"
    | "generic";
  text?: string;
  location?: string;
}

export interface Block {
  id: string;
  type: BlockType;
  // Base coordinates (acting as default/current)
  x: number;
  y: number;
  w: number;
  h: number;

  // Separate states for responsive layouts
  layouts?: {
    desktop: { x: number; y: number; w: number; h: number };
    mobile: { x: number; y: number; w: number; h: number };
  };

  data: BlockData;
}
