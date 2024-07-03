import { Env, Hono } from "hono";
import { cors } from "hono/cors";

import login from "./methods/login"
import validateToken from "./methods/validateToken";
import socialAccounts from "./methods/socialAccounts";
import contacts from "./methods/contacts";
import cronTask from "./methods/cronTask";
import user from "./methods/user";
import admin from "./methods/admin";

type Bindings = {
  JWT_SECRET: string;
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(`*`, cors());

app.get("/", (c) => {
  return c.text("Invalid route 🤷 go away!");
});

app.route('/login', login)
app.route('/validateToken', validateToken)
app.route("/user", user)
app.route("/socialAccounts", socialAccounts)
app.route("/contacts", contacts)
app.route("/admin", admin)

export default {
  scheduled(
    event: ScheduledEvent,
    env: {
      DB?: any;
      SENDGRID_API_KEY: any;
    },
    ctx: ExecutionContext
  ) {
    const delayedProcessing = async () => {
      await cronTask(env);
    };
    ctx.waitUntil(delayedProcessing());
  },
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx);
  },
};
