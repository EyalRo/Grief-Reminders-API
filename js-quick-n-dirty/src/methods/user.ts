import { Hono } from "hono";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";

import { cors } from "hono/cors";

const secret = "it-is-very-secret"; // TODO: use environment vars instead
type Variables = JwtVariables;

const user = new Hono<{ Variables: Variables }>();

user.use(`*`, cors());
user.use("*", jwt({ secret: secret }));

user.get("/", (c) => {
  const payload = c.get("jwtPayload").user;
  return c.json(payload);
});

user.post("/", (c) => {
  return c.text("Crate new user - TODO");
});

user.put("/", (c) => {
  return c.text("Update user - TODO");
});

user.delete("/", (c) => {
  return c.text("Delete user - TODO");
});

export default user;
