export function validateEmail(email: string) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return (true)
  }
  return (false)
}

export function validatePhone(phone: string) {
  if (/^(\+\d{1,2}\s?)?\(?\d{2,3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(phone)) {
    return true
  } else {
    return false
  }
}