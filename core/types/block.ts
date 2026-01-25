export type BlockType =
  | "social"
  | "map"
  | "image"
  | "text"
  | "link"
  | "heading";

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
    | "generic";
  text?: string;
  location?: string;
}

export interface Block {
  id: string;
  type: BlockType;
  x?: number;
  y?: number;
  w: number;
  h: number;
  data: BlockData;
}
