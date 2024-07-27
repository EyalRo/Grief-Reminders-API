"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const cors_1 = require("hono/cors");
const login_1 = __importDefault(require("./methods/login"));
const user_1 = __importDefault(require("./methods/user"));
const app = new hono_1.Hono();
app.use(`*`, (0, cors_1.cors)());
app.route("/login", login_1.default);
app.route("/user", user_1.default);
app.get("/", (c) => {
    return c.text("Hello!");
});
const port = 3000;
console.log(`Server is running on port ${port}`);
(0, node_server_1.serve)({
    fetch: app.fetch,
    port,
});
