import gleam/hackney
import gleam/http.{Get, Post}
import gleam/http/request
import gleam/http/response
import gleam/httpc
import gleam/io
import gleam/json.{array, int, null, object, string}
import gleam/result.{try}
import gleam/string_builder

import grief_reminders_api/web
import wisp.{type Request, type Response}

import dot_env as dot
import dot_env/env

import grief_reminders_api/utils/send_request.{send_request}

// The HTTP request handler
pub fn handle_request(req: Request) -> Response {
  // Apply the middleware stack for this request/response.
  use _req <- web.middleware(req)

  io.debug(send_request("_find"))

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

  let html = string_builder.from_string("<h1>God darnit!</h1>")
  wisp.ok()
  |> wisp.html_body(html)
}
