import gleam/dict
import gleam/dynamic
import gleam/io
import gleam/json.{object, string}
import gleam/list
import gleam/option
import gleam/result

import grief_reminders_api/utils.{send_request}

pub fn get_user(email: String, password: String) {
  let params =
    object([
      #(
        "selector",
        object([#("email", string(email)), #("password", string(password))]),
      ),
    ])
  let data = send_request("_find", params)
  let response = result.unwrap(data, "{error: send_request}")

  use json <- json.decode(response)
  let all_docs =
    json
    |> dynamic.dict(dynamic.string, dynamic.dynamic)
    |> result.unwrap(dict.new())
    |> dict.get("docs")
    |> io.debug

  Ok("all_docs")
}
