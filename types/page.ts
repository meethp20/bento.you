import { Block } from "@/core/types/block";

export type Page = {
  slug: string;
  profile: {
    name: string;
    avatar: string;
    bio: string;
  };
  blocks: Block[];
};
