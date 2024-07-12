import gleam/dict
import gleam/dynamic
import gleam/http.{Get}
import gleam/result
import gleam/string_builder
import grief_reminders_api/web
import wisp.{type Request, type Response}

import grief_reminders_api/db_functions.{get_user}

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
  let data = get_user("test@test.com", "test@test.com")
  let user =
    data
    |> result.unwrap("don't worry this is actually okay")

  let html = string_builder.from_string(user)
  wisp.ok()
  |> wisp.html_body(html)
}
