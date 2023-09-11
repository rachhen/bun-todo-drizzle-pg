import * as jose from "jose";

import env from "../utils/env";
import { User, users } from "../db/schema";
import { createUser, findUserByEmail } from "./users";
import { SignInInput, SignUpInput } from "../validators/auth";
import { UnauthorizedException } from "../utils/errors";

const secret = new TextEncoder().encode(env.JWT_SECRET_KEY);

function clearPassword(user: User): Omit<User, "password"> {
  return Object.assign(user, { password: undefined });
}

export async function signUp(input: SignUpInput) {
  const newUser = await createUser({
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    password: input.password,
  });

  const accessToken = await new jose.SignJWT({ id: users.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(secret);

  return { user: clearPassword(newUser), accessToken };
}

export async function signIn(input: SignInInput) {
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new UnauthorizedException("Invalid credentials");
  }

  const isMatch = await Bun.password.verify(input.password, user.password);
  if (!isMatch) {
    throw new UnauthorizedException("Invalid credentials");
  }

  const accessToken = await new jose.SignJWT({ id: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(secret);

  return { user: clearPassword(user), accessToken };
}
