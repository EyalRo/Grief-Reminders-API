import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import login from "./methods/login";
import user from "./methods/user";
import { time } from "console";

const app = new Hono();
app.use(async (c, next) => {
  const now = new Date();
  const currentDateTime = now.toLocaleString();
  console.log(
    `${currentDateTime} - API request: "${c.req.path}"`
  );
  await next();
});
app.use(`*`, cors());

app.route("/login", login);
app.route("/user", user);

app.get("/", (c) => {
  return c.text("Hello!");
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
