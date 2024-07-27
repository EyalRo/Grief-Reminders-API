import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import { cors } from "hono/cors";

import login from "./methods/login";

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>();

app.use(`*`, cors());
///
app.use(
  "/testjwt",
  jwt({
    secret: "it-is-very-secret",
  })
);
///

app.route("/login", login);

app.get("/", (c) => {
  return c.text("Hello!");
});

app.get("/testjwt", (c) => {
  const payload = c.get("jwtPayload");
  return c.json(payload);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
