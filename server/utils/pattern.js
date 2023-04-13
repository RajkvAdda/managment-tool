exports.EmailPattern = {
  pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  patternMsg: `Invalid email`,
}
exports.MobilePattern = {
  pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  patternMsg: `Invalid mobile number`,
}
exports.PasswordPattern = {
  pattern:
    /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
  patternMsg: `Invalid password pattern ex : User@1991`,
}
