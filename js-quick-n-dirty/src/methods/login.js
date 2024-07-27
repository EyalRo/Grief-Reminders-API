"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const jwt_1 = require("hono/jwt");
const cors_1 = require("hono/cors");
const jssha_1 = __importDefault(require("jssha"));
const artia_db_1 = require("artia.db");
const db = new artia_db_1.NoSQLDatabase("dev_data.json"); // TODO: dynamic filename depending on envrionment vars instead
const secret = "it-is-very-secret"; // TODO: use environment vars instead
const token_ttl = 60; // In minutes
const login = new hono_1.Hono();
login.use(`*`, (0, cors_1.cors)());
login.post("/", async (c) => {
    const body = await c.req.json();
    // gather required params
    const email = body.email;
    const password = body.password;
    // generate password hash
    const hash = new jssha_1.default("SHA-1", "TEXT")
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
    const token = await (0, jwt_1.sign)(payload, secret);
    return c.json(token);
});
exports.default = login;
