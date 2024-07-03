// ./src/methods/contacts.ts
// Provides jwt secured CRUD methods for contact objects

import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";

import { validateEmail, validatePhone } from "../utils/utils";

type Bindings = {
    JWT_SECRET: string;
    DB: D1Database;
};

const contacts = new Hono<{ Bindings: Bindings }>();

contacts.use(`*`, cors());

contacts.use("*", (c, next) => {
    const jwtMiddleware = jwt({
        secret: c.env.JWT_SECRET,
    });
    return jwtMiddleware(c, next);
});

// CREATE
contacts.post("/", async (c) => {
    const body = await c.req.json();
    const jwtPayload = c.get("jwtPayload");
    const userid = jwtPayload.uid

    const contact_first_name = (body.contact_first_name != "") ? body.contact_first_name : null;
    const contact_last_name = (body.contact_last_name != "") ? body.contact_last_name : null;
    const contact_email = validateEmail(body.contact_email) ? body.contact_email : null;
    const contact_phone = validatePhone(body.contact_phone) ? body.contact_phone : null;
    const uid = "contact" + crypto.randomUUID();
    const managed_by_account = userid

    try {
        let { results } = await c.env.DB.prepare(
            "INSERT INTO contacts ( contact_first_name, contact_last_name, contact_email, contact_phone, allow_email, allow_phone, managed_by_account, uid) VALUES (?, ?, ?, ?, FALSE, FALSE, ?, ?) RETURNING *"
        )
            .bind(
                contact_first_name,
                contact_last_name,
                contact_email,
                contact_phone,
                managed_by_account,
                uid
            )
            .all();
        return c.json(results);
    } catch (e) {
        return c.json({ err: e }, 500);
    }
});

// READ
contacts.get("/", async (c) => {
    const jwtPayload = c.get("jwtPayload");
    const uid = jwtPayload.uid
    try {
        let { results } = await c.env.DB.prepare(
            "SELECT * FROM contacts WHERE managed_by_account = ?"
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
contacts.delete("/", async (c) => {
    const body = await c.req.json();
    const jwtPayload = c.get("jwtPayload");
    const userid = jwtPayload.uid

    const uid = body.uid

    try {
        let { results } = await c.env.DB.prepare(
            "DELETE FROM contacts WHERE uid = ? AND managing_user_account = ?"
        )
            .bind(uid, userid)
            .all();
        return c.json(results);
    } catch (e) {
        return c.json({ err: e }, 500);
    }
});

export default contacts