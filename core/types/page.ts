import { Block } from "./block";
export type Page = {
  slug: string;
  profile: {
    name: string;
    avatar: string;
    bio: string;
  };
  blocks: Block[];
};
