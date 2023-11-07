import { User } from "@supabase/auth-helpers-nextjs";
import { Database } from "./supabase";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Haiku = Database["public"]["Tables"]["haikus"]["Row"];
export type Hashtag = Database["public"]["Tables"]["hashtags"]["Row"];

export interface UserWithProfile extends User {
  profile: Profile;
}

export interface HaikuWithDetails extends Haiku {
  hashtags: Hashtag[];
  profile: Profile;
}

export interface HaikuWithHashtags extends Haiku {
  hashtags: Hashtag[];
}

export type GenericResponseType = {
  status: null | boolean,
  message: null | string
}

export interface HaikuWithDetailsList {
  list1: HaikuWithDetails[];
  list2: HaikuWithDetails[];
  list3: HaikuWithDetails[];
}