import { User } from "../db/schema";

type Bindings = {};

type Variables = {
  user: User;
};

export type HonoEnv = { Bindings: Bindings; Variables: Variables };
