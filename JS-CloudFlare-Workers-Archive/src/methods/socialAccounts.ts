// ./src/methods/socialAccounts.ts
// Provides jwt secured CRUD methods for social account objects

import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";

type Bindings = {
    JWT_SECRET: string;
    DB: D1Database;
};

const socialAccounts = new Hono<{ Bindings: Bindings }>();

socialAccounts.use(`*`, cors());

socialAccounts.use("*", (c, next) => {
    const jwtMiddleware = jwt({
        secret: c.env.JWT_SECRET,
    });
    return jwtMiddleware(c, next);
});

// CREATE
socialAccounts.post("/", async (c) => {
    let body = await c.req.json()

    const jwtPayload = c.get("jwtPayload");
    const userid = jwtPayload.uid

    const account_name = body.account_name;
    const social_network = body.social_network;
    const last_update = body.last_update;
    const managing_user_account = userid;
    const uid = "account" + crypto.randomUUID();

    try {
        let { results } = await c.env.DB.prepare(
            "INSERT INTO social_network_accounts ( account_name, social_network, managing_user_account,last_update, uid ) VALUES (?, ?, ?, ?, ?) RETURNING *"
        )
            .bind(
                account_name,
                social_network,
                managing_user_account,
                last_update ? last_update : null,
                uid
            )
            .all();
        return c.json(results);
    } catch (e) {
        return c.json({ err: e }, 500);
    }
});

// READ
socialAccounts.get("/", async (c) => {
    const jwtPayload = c.get("jwtPayload");
    const uid = jwtPayload.uid

    try {
        let { results } = await c.env.DB.prepare(
            "SELECT uid, account_name, last_update, social_network FROM social_network_accounts WHERE managing_user_account = ?"
        )
            .bind(uid)
            .all();
        return c.json(results);
    } catch (e) {
        return c.json({ err: e }, 500);
    }
});

// UPDATE

// DELETE
socialAccounts.delete("/", async (c) => {
    const body = await c.req.json();
    const jwtPayload = c.get("jwtPayload");
    const userid = jwtPayload.uid
    const uid = body.uid

    try {
        let { results } = await c.env.DB.prepare(
            "DELETE FROM social_network_accounts WHERE uid = ? AND managing_user_account = ?"
        )
            .bind(uid, userid)
            .all();
        return c.json(results);
    } catch (e) {
        return c.json({ err: e }, 500);
    }
});

export default socialAccounts