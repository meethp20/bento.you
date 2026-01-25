export type Block =
  | { type: "link"; title: string; url: string }
  | { type: "text"; content: string }
  | { type: "image"; src: string }
  | { type: "social"; platform: "instagram" | "twitter"; handle: string }
  | { type: "map"; location: string }
