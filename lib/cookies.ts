export function setCookie(name: string, value: string, days = 30) {
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/`;
}
export function getCookie(name: string) {
  const prefix = `${name}=`;
  const parts = document.cookie.split(";").map(s => s.trim());
  for (const p of parts) if (p.startsWith(prefix)) return decodeURIComponent(p.substring(prefix.length));
  return null;
}
