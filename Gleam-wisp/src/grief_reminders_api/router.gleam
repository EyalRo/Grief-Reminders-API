import gleam/http.{Get, Post}

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
  let data = get_user("email", "password")

  let datastring =
    result.lazy_unwrap(result.lazy_unwrap(data, fn() { Ok("No Data") }), fn() {
      "No Data"
    })

  let html = string_builder.from_string(datastring)
  wisp.ok()
  |> wisp.html_body(html)
}
