export function timestampPT() {
  return new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    timeZoneName: "shortGeneric"
  });
}
