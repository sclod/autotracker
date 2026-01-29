export function isChatCodeRequired() {
  return process.env.CHAT_REQUIRE_CODE !== "false";
}
