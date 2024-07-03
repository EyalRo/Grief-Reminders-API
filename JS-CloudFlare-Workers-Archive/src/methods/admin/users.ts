import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import jsSHA from "jssha";

type Bindings = {
    JWT_SECRET: string;
    DB: D1Database;
};

const users = new Hono<{ Bindings: Bindings }>();

users.use(`*`, cors());

users.use("*", (c, next) => {
    const jwtMiddleware = jwt({
        secret: c.env.JWT_SECRET,
    });
    return jwtMiddleware(c, next);
});

// CREATE (Sign up)
users.post("/", async (c) => {
    let body = await c.req.json()
    const jwtPayload = c.get("jwtPayload");
    const isAdmin = jwtPayload.role === "admin"

    const account_email = body.email
    const password = body.password;
    const account_phone_number = body.account_phone_number ?? null
    const uid = "user" + crypto.randomUUID();
    const role = "user"

    const shaObj = new jsSHA("SHA-1", "TEXT").update(password);
    const account_password_hash = shaObj.getHash("HEX");

    if (isAdmin) {
        try {
            let { results } = await c.env.DB.prepare(
                "INSERT INTO accounts ( account_email, account_password_hash, account_phone_number, uid, role, allow_email, allow_phone) VALUES (?,?,?,?,?,1,1) RETURNING *"
            )
                .bind(account_email, account_password_hash, account_phone_number, uid, role)
                .all();
            return c.json(results);
        } catch (e) {
            return c.json({ err: e }, 500);
        }
    } else {
        return c.json({ err: "not authorized ⛔" }, 403);
    }
})

// READ (List all users)
users.get("/users", async (c) => {
    const jwtPayload = c.get("jwtPayload");
    const isAdmin = jwtPayload.role === "admin"

    if (isAdmin) {
        try {
            let { results } = await c.env.DB.prepare(
                "SELECT * FROM accounts"
            ).all();
            return c.json(results);
        } catch (e) {
            return c.json({ err: e }, 500);
        }
    } else {
        return c.json({ err: "not authorized ⛔" }, 403);
    }
})

// UPDATE

// DELETE

export default users

/*
admin.post("/createUser", async (c) => {
    let body = await c.req.json()
    const jwtPayload = c.get("jwtPayload");
    const isAdmin = jwtPayload.role === "admin"

    const account_email = body.email
    const password = body.password;
    const account_phone_number = body.account_phone_number ?? null
    const uid = "user" + crypto.randomUUID();
    const role = "user"

    const shaObj = new jsSHA("SHA-1", "TEXT").update(password);
    const account_password_hash = shaObj.getHash("HEX");

    if (isAdmin) {
        try {
            let { results } = await c.env.DB.prepare(
                "INSERT INTO accounts ( account_email, account_password_hash, account_phone_number, uid, role) VALUES (?,?,?,?,?) RETURNING *"
            )
                .bind(account_email, account_password_hash, account_phone_number, uid, role)
                .all();
            return c.json(results);
        } catch (e) {
            return c.json({ err: e }, 500);
        }
    } else {
        return c.json({ err: "not authorized ⛔" }, 403);
    }
})
*/

