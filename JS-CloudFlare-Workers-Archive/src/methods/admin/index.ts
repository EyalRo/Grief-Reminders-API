// ./src/methods/admin.ts
// Provides secured methods for admin operations

import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import users from "./users";

type Bindings = {
    JWT_SECRET: string;
    DB: D1Database;
};

const admin = new Hono<{ Bindings: Bindings }>();

admin.use(`*`, cors());

admin.use("*", (c, next) => {
    const jwtMiddleware = jwt({
        secret: c.env.JWT_SECRET,
    });
    return jwtMiddleware(c, next);
});

admin.route("/users", users)

export default admin