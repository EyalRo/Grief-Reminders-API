import { Env, Hono } from "hono";
import { cors } from "hono/cors";
import { jwt, decode, sign, verify } from "hono/jwt";
import jsSHA from "jssha";

type Bindings = {
  JWT_SECRET: string;
  DB: D1Database;
};

const login = new Hono<{ Bindings: Bindings }>();

login.use(`*`, cors());

login.post("/", async (c) => {
  const body = await c.req.json();
  const email = body.email;
  const password = body.password;
  const shaObj = new jsSHA("SHA-1", "TEXT").update(password);
  const hash = shaObj.getHash("HEX");

  try {
    let { results } = await c.env.DB.prepare(
      "SELECT uid, role FROM accounts WHERE account_email = ? AND account_password_hash = ? "
    )
      .bind(email, hash)
      .all();

    const UID = results[0].uid;
    const role = results[0].role;
    const payload = {
      uid: UID,
      role: role,
      exp: Date.now() + 24 * 60 * 60 * 1000,
    };
    const secret = c.env.JWT_SECRET;
    const token = await sign(payload, secret);
    return c.json({ token: token });
  } catch (e) {
    console.log(JSON.stringify(e))
    return c.json({ err: e }, 500);
  }
});

export default login