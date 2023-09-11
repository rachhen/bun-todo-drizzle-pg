import { Context, Next } from "hono";
import * as jose from "jose";

import env from "../utils/env";
import { HonoEnv } from "../types";
import { findUserById } from "../services/users";
import { HttpException } from "../utils/errors";

const secret = new TextEncoder().encode(env.JWT_SECRET_KEY);

export const requiredAuth = () => async (c: Context<HonoEnv>, next: Next) => {
  const credentials = c.req.headers.get("Authorization");
  let token: string;
  const headers = new Headers();
  if (credentials) {
    const parts = credentials.split(/\s+/);
    if (parts.length !== 2) {
      headers.set(
        "WWW-Authenticate",
        `Bearer realm="${c.req.url}",error="invalid_request",error_description="invalid credentials structure"`
      );
    } else {
      token = parts[1];
    }

    if (!token) {
      headers.set(
        "WWW-Authenticate",
        `Bearer realm="${c.req.url}",error="invalid_request",error_description="no authorization included in request"`
      );
    }
    let payload: jose.JWTPayload;

    try {
      const data = await jose.jwtVerify(token, secret);
      payload = data.payload;
    } catch (error) {
      headers.set(
        "WWW-Authenticate",
        `Bearer realm="${c.req.url}",error="invalid_token",error_description="token verification failure"`
      );
      const res = Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401, headers }
      );

      throw new HttpException("", res);
    }

    const user = await findUserById(payload.id as number);

    if (!user) {
      headers.set(
        "WWW-Authenticate",
        `Bearer realm="${c.req.url}",error="invalid_token",error_description="token verification failure"`
      );
    }

    if (headers.has("WWW-Authenticate")) {
      const res = Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401, headers }
      );

      throw new HttpException("", res);
    }

    c.set("user", user);
  } else {
    headers.set(
      "WWW-Authenticate",
      `Bearer realm="${c.req.url}",error="invalid_token",error_description="token verification failure"`
    );

    const res = Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401, headers }
    );

    throw new HttpException("", res);
  }

  await next();
};
