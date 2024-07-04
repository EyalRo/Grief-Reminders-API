import gleam/http.{Get}
import gleam/io
import gleam/string_builder

import grief_reminders_api/web
import wisp.{type Request, type Response}

import dot_env as dot
import dot_env/env

// The HTTP request handler
pub fn handle_request(req: Request) -> Response {
  // Apply the middleware stack for this request/response.
  use _req <- web.middleware(req)
  case wisp.path_segments(req) {
    [] -> home_page(req)
    ["get_token"] -> get_token(req)
    _ -> wisp.not_found()
  }
}

fn home_page(req: Request) -> Response {
  // Later we'll use templates, but for now a string will do.
  use <- wisp.require_method(req, Get)

  let html = string_builder.from_string("<h1>Hello, Joe!</h1>")
  wisp.ok()
  |> wisp.html_body(html)
}

fn get_token(req: Request) -> Response {
  use <- wisp.require_method(req, Get)
  let auth_hash = get_auth_hash()

  // Will call https://db.ops.in.net/inactive-account/_find/
  // Will add header -- Authorization: Basic <AUTH_HASH>
  // The hash is Base64 Encode of "user:password" - Change to API specific credentials
  let html = string_builder.from_string("<h1>Hello, Joe!</h1>")
  wisp.ok()
  |> wisp.html_body(html)
}

fn get_auth_hash() -> String {
  dot.new()
  |> dot.set_path(".env")
  |> dot.set_debug(False)
  |> dot.load

  let _auth_hash = env.get_or("AUTH_HASH", "default_hash_value")
}
