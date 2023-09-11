import { eq } from "drizzle-orm";

import db from "../db";
import { NewUser, users } from "../db/schema";
import { BadRequestException } from "../utils/errors";

export async function findUsers() {
  const result = await db.select().from(users);

  return result;
}

export async function findUserById(id: number) {
  const [user] = await db.select().from(users).where(eq(users.id, id));

  if (!user) {
    throw new BadRequestException(`User ${id} not found`);
  }

  return user;
}

export async function findUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  return user;
}

export async function createUser(input: NewUser) {
  const user = await findUserByEmail(input.email);

  if (user) {
    throw new BadRequestException("Email already exist");
  }

  const passwordHash = await Bun.password.hash(input.password);

  const [newUser] = await db
    .insert(users)
    .values({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      password: passwordHash,
    })
    .returning()
    .execute();

  return newUser;
}
