"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const jwt_1 = require("hono/jwt");
const cors_1 = require("hono/cors");
const http_exception_1 = require("hono/http-exception");
const artia_db_1 = require("artia.db");
const secret = "it-is-very-secret"; // TODO: use environment vars instead
const db = new artia_db_1.NoSQLDatabase("dev_data.json");
const user = new hono_1.Hono();
user.use(`*`, (0, cors_1.cors)());
// Before jwt middleware => does not require jwt
user.post("/", async (c) => {
    const body = await c.req.json();
    // search for eixsting user
    const foundItem = db.findUnique({
        where: { email: body.email },
    });
    if (foundItem === null) {
        db.create({ create: body });
    }
    else {
        throw new http_exception_1.HTTPException(401, {
            message: "user already exists",
        });
    }
});
user.use(`*`, (0, jwt_1.jwt)({ secret: secret }));
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
    }
    else {
        throw new http_exception_1.HTTPException(401, { message: "user not valid" });
    }
});
user.delete("/", async (c) => {
    const payload = c.get("jwtPayload").user;
    const body = await c.req.json();
    const id = payload.id;
    if (id_valid(body.id, id)) {
        db.deleteUnique({ where: { id: id } });
        return c.text("deleted");
    }
    else {
        throw new http_exception_1.HTTPException(401, { message: "user not valid" });
    }
});
exports.default = user;
const id_valid = (body_id, user_id) => {
    return body_id === user_id;
};
