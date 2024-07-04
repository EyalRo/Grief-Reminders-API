import gleam/http.{Get}
import gleam/string_builder

import grief_reminders_api/web
import wisp.{type Request, type Response}

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
  // Later we'll use templates, but for now a string will do.
  use <- wisp.require_method(req, Get)
  // Will call https://db.ops.in.net/inactive-account/_find/
  // Will add header -- Authorization: Basic <Long HASH == >
  // The hash is Base64 Encode of "user:password" - Change to API specific credentials
  let html = string_builder.from_string("<h1>Hello, Joe!</h1>")
  wisp.ok()
  |> wisp.html_body(html)
}
