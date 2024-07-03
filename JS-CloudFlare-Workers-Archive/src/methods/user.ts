// ./src/methods/user.ts
// Provides jwt secured CRUD methods for user objects

import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import jsSHA from "jssha";

type Bindings = {
    JWT_SECRET: string;
    DB: D1Database;
};

const user = new Hono<{ Bindings: Bindings }>();

user.use(`*`, cors());

user.use("*", (c, next) => {
    const jwtMiddleware = jwt({
        secret: c.env.JWT_SECRET,
    });
    return jwtMiddleware(c, next);
});

// CREATE (Sign up)
user.post("/", async (c) => {
    let body = await c.req.json()

    const email = body.email
    const password = body.password;
    const account_phone_number = body.account_phone_number ?? null
    const uid = "user" + crypto.randomUUID();
    const role = "user"

    const shaObj = new jsSHA("SHA-1", "TEXT").update(password);
    const hash = shaObj.getHash("HEX");
})

// READ

// UPDATE

// DELETE
user.delete("/", async (c) => {
    const jwtPayload = c.get("jwtPayload");
    const uid = jwtPayload.uid

    try {
        let { results } = await c.env.DB.prepare(
            "DELETE FROM accounts WHERE uid=? RETURNING *"
        )
            .bind(uid)
            .all();
        return c.json(results);
    } catch (e) {
        return c.json({ err: e }, 500);
    }
})

export default user