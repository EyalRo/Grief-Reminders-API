import gleam/dynamic
import gleam/io
import gleam/json.{object, string}
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

  let response_decoder = dynamic.field("docs", dynamic.list(doc_decoder))
  let res = json.decode(response, response_decoder)

  let _ = io.debug(res)
  //  case res {
  //  Ok(dict_of_docs) -> todo
  //Error(_) -> todo
  // }
}

// 1.
pub type Doc {
  Doc(email: String, password_hash: String)
}

// 2.
pub fn doc_decoder(dynamic: dynamic.Dynamic) {
  dynamic.decode2(
    Doc,
    dynamic.field("email", dynamic.string),
    dynamic.field("password_hash", dynamic.string),
  )(dynamic)
}
