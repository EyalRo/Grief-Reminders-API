import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";

type Bindings = {
  JWT_SECRET: string;
  DB: D1Database;
};

const validateToken = new Hono<{ Bindings: Bindings }>();

validateToken.use(`*`, cors());

validateToken.use("*", (c, next) => {
    const jwtMiddleware = jwt({
        secret: c.env.JWT_SECRET,
    });
    return jwtMiddleware(c, next);
});

validateToken.get("/", async (c) => {
    const payload = c.get("jwtPayload");
    return c.json(payload);
  });

  export default validateToken