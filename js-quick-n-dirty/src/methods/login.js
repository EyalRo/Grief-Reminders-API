import { Hono } from "hono";
import { sign } from "hono/jwt";
import { cors } from "hono/cors";
import jsSHA from "jssha";
import { NoSQLDatabase } from "artia.db";
const db = new NoSQLDatabase("dev_data.json"); // TODO: dynamic filename depending on envrionment vars instead
const secret = "it-is-very-secret"; // TODO: use environment vars instead
const token_ttl = 60; // In minutes
const login = new Hono();
login.use(`*`, cors());
login.post("/", async (c) => {
    const body = await c.req.json();
    // gather required params
    const email = body.email;
    const password = body.password;
    // generate password hash
    const hash = new jsSHA("SHA-1", "TEXT")
        .update(password)
        .getHash("HEX");
    // search for user
    const foundItem = db.findUnique({
        where: { email: email, hash: hash },
    });
    // generate the token
    const payload = {
        user: foundItem,
        exp: Math.floor(Date.now() / 1000) + 60 * token_ttl,
    };
    const token = await sign(payload, secret);
    return c.json(token);
});
export default login;
