import gleam/json.{type Json, object, string}
import grief_reminders_api/utils.{send_request}

pub fn get_user(email: String, password: String) {
  let params =
    object([
      #(
        "selector",
        object([#("email", string(email)), #("password", string(password))]),
      ),
    ])

  let resp = send_request("_find", params)

  Ok(resp)
}
