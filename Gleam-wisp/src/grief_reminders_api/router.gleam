import gleam/hackney
import gleam/http.{Get, Post}
import gleam/http/request
import gleam/http/response
import gleam/httpc
import gleam/io
import gleam/result.{try}
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

  io.debug(send_request("_find"))

  let html = string_builder.from_string("<h1>God darnit!</h1>")
  wisp.ok()
  |> wisp.html_body(html)
}

fn get_auth_hash() -> String {
  dot.new()
  |> dot.set_path(".env")
  |> dot.set_debug(False)
  |> dot.load

  env.get_or("AUTH_HASH", "default_hash_value")
}

fn send_request(path: String) {
  // Prepare a HTTP request record
  let assert Ok(req) =
    request.to("https://db.ops.in.net/inactive-account/" <> path)

  // change to username:pass - maybe will work?

  req
  |> request.prepend_header("Authorization", "Basic " <> get_auth_hash())
  |> request.prepend_header("Content-Type", "application/json")
  |> request.set_method(Post)

  // Send the HTTP request to the server
  use resp <- result.try(httpc.send(req))

  Ok(resp.body)
}
