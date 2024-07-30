import { Hono } from "hono";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";

import { NoSQLDatabase } from "artia.db";
import { prettyJSON } from "hono/pretty-json";

const secret = "it-is-very-secret"; // TODO: use environment vars instead
type Variables = JwtVariables;

const db = new NoSQLDatabase("dev_data.json");

const user = new Hono<{ Variables: Variables }>();

user.use(prettyJSON());

// Before jwt middleware => does not require jwt
user.post("/", async (c) => {
  const body = await c.req.json();

  // search for eixsting user
  const foundItem = db.findUnique({
    where: { email: body.email },
  });

  if (foundItem === null) {
    db.create({ create: body });
    return c.json(body);
  } else {
    throw new HTTPException(401, {
      message: "user already exists",
    });
  }
});

user.use(`*`, jwt({ secret: secret }));

user.get("/", (c) => {
  const payload = c.get("jwtPayload").user;
  return c.json(payload);
});

user.put("/", async (c) => {
  const payload = c.get("jwtPayload").user;
  const body = await c.req.json();
  const id = payload.id;
  if (id_valid(body.id, id)) {
    db.update({ where: { id: id }, data: body });
    return c.json(body);
  } else {
    throw new HTTPException(401, { message: "user not valid" });
  }
});

user.delete("/", async (c) => {
  const payload = c.get("jwtPayload").user;
  const body = await c.req.json();
  const id = payload.id;
  if (id_valid(body.id, id)) {
    db.deleteUnique({ where: { id: id } });
    return c.text("deleted");
  } else {
    throw new HTTPException(401, { message: "user not valid" });
  }
});

export default user;

const id_valid = (body_id: string, user_id: string) => {
  return body_id === user_id;
};
