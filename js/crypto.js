/* Wishes are locked in the browser with a secret key that lives only in the
   invitation links (after the # sign). The server never sees the key. */
const _enc = new TextEncoder(), _dec = new TextDecoder();
const _b64 = (bytes) => btoa(String.fromCharCode(...bytes));
const _unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const KEY_RE = /^[A-Za-z0-9_-]{43}$/;

function newKey() {
  return _b64(crypto.getRandomValues(new Uint8Array(32)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function _importKey(k) {
  let s = k.replace(/-/g, "+").replace(/_/g, "/");
  s += "=".repeat((4 - (s.length % 4)) % 4);
  return crypto.subtle.importKey("raw", _unb64(s), "AES-GCM", false, ["encrypt", "decrypt"]);
}
async function encryptWish(text, k) {
  const key = await _importKey(k);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, _enc.encode(text)));
  const out = new Uint8Array(12 + ct.length);
  out.set(iv); out.set(ct, 12);
  return _b64(out);
}
async function decryptWish(data, k) {
  const all = _unb64(data);
  const key = await _importKey(k);
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: all.slice(0, 12) }, key, all.slice(12));
  return _dec.decode(pt);
}

/* A second sealed copy of a wish, made only when someone asks for the New Year email.
   It is locked with the site's public key; only the private key held by the New Year job can open it. */
async function sealForEmail(text, publicJwk) {
  const rsa = await crypto.subtle.importKey("jwk", publicJwk, { name: "RSA-OAEP", hash: "SHA-256" }, false, ["encrypt"]);
  const aes = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, aes, _enc.encode(text)));
  const wrapped = new Uint8Array(await crypto.subtle.encrypt({ name: "RSA-OAEP" }, rsa, await crypto.subtle.exportKey("raw", aes)));
  return JSON.stringify({ k: _b64(wrapped), iv: _b64(iv), c: _b64(ct) });
}
