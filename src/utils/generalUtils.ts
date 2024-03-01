export function timestampPT() {
  return new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    timeZoneName: "shortGeneric",
  });
}

export function checkPassword(
  passwordValue: string,
  passwordConfirmValue: string
) {
  let error = "";
  if (passwordValue !== passwordConfirmValue) {
    error = "Passwords do not match. ";
  }

  if (passwordValue.length < 6) {
    error += "Password must be at least 6 characters.";
  }

  console.log(error);
  return error;
}
