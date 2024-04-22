export function encodeURI(str: string) {
  return encodeURIComponent(str).replace(/'/g, "%27").replace(/"/g, "%22");
}
export function decodeURI(str: string) {
  return decodeURIComponent(str.replace(/\+/g, " "));
}
