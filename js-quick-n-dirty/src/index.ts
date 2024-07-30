import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import login from "./methods/login";
import user from "./methods/user";
import { timeout } from "hono/timeout";
import { logger } from "hono/logger";
import { compress } from "hono/compress";

const app = new Hono();

// Console Logging Middleware
app.use(async (c, next) => {
  const now = new Date();
  const currentDateTime = now.toLocaleString();
  console.log(
    `${currentDateTime} - API request: "${c.req.path}"`
  );
  await next();
});

// Built-in middleware
app.use(cors());
app.use(logger());
app.use(compress());
app.use(timeout(5000));

// Routes
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
