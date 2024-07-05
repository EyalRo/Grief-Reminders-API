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

fn send_request(path: String) {
  dot.new()
  |> dot.set_path(".env")
  |> dot.set_debug(False)
  |> dot.load

  let scheme = env.get_or("SCHEME", "https://")
  let host = env.get_or("HOST", "my.host.com")
  let db = env.get_or("DB", "businessy-stuff")
  let auth_hash = env.get_or("AUTH_HASH", "default_hash_value")

  let db_query = json.to_string(object([#("selector", object([]))]))

  // Prepare a HTTP request record
  let assert Ok(req) = request.to(scheme <> host <> db <> path)
  use resp <- try(
    req
    |> request.prepend_header("Authorization", "Basic " <> auth_hash)
    |> request.prepend_header("Content-Type", "application/json")
    |> request.set_method(Post)
    |> request.set_body(db_query)
    |> io.debug
    |> hackney.send,
  )

  Ok(resp.body)
}
