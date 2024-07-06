import dot_env as dot
import dot_env/env
import gleam/hackney
import gleam/http.{Get, Post}
import gleam/http/request
import gleam/io
import gleam/json.{type Json, array, int, null, object, string}
import gleam/result.{try}

pub fn send_request(path: String, params: Json) {
  dot.new()
  |> dot.set_path(".env")
  |> dot.set_debug(False)
  |> dot.load

  let scheme = env.get_or("SCHEME", "https://")
  let host = env.get_or("HOST", "my.host.com")
  let db = env.get_or("DB", "businessy-stuff")
  let auth_hash = env.get_or("AUTH_HASH", "default_hash_value")

  let db_query = json.to_string(params)

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
