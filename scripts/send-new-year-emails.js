#!/usr/bin/env node
/* Sends the New Year wish emails. Runs on GitHub Actions (see .github/workflows/new-year-emails.yml).
   It never prints wishes or email addresses, only counts, because the logs of a public repo are public. */
const { webcrypto } = require("node:crypto");
const subtle = webcrypto.subtle;
const fromB64 = (s) => Buffer.from(s, "base64");

/* Opens one sealed copy made by the website (RSA key wraps a one-time AES key) */
async function decryptSealed(sealedJson, privateJwk) {
  const o = JSON.parse(sealedJson);
  const priv = await subtle.importKey("jwk", privateJwk, { name: "RSA-OAEP", hash: "SHA-256" }, false, ["decrypt"]);
  const raw = await subtle.decrypt({ name: "RSA-OAEP" }, priv, fromB64(o.k));
  const aes = await subtle.importKey("raw", raw, "AES-GCM", false, ["decrypt"]);
  const pt = await subtle.decrypt({ name: "AES-GCM", iv: fromB64(o.iv) }, aes, fromB64(o.c));
  return new TextDecoder().decode(pt);
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function buildEmail({ myName, otherName, myWish, otherWish }) {
  const subject = "Happy New Year! Your Simbang Gabi wishes are open";
  const otherText = otherWish
    ? `${otherName}'s wish for you:\n"${otherWish}"`
    : `${otherName}'s wish is not part of this email. If they wrote one, open your invitation link to read it.`;
  const text = [
    `Hi ${myName},`, "",
    "Happy New Year! The wishes you and " + otherName + " made for this Christmas season are open now.", "",
    myWish ? `Your wish:\n"${myWish}"` : "", "",
    otherText, "",
    "Maligayang Bagong Taon!", "",
    "You got this email because you entered your address on the Simbang Gabi site. If that was not you, please ignore it. Your address has now been deleted from our records."
  ].join("\n");
  const html = `<div style="font-family:Georgia,serif;max-width:34rem;margin:auto;background:#f8f1de;color:#2a2a22;padding:24px;border-top:8px solid #c9473b">
<h2 style="color:#1b4535;margin-top:0">Happy New Year, ${esc(myName)}!</h2>
<p>The wishes you and ${esc(otherName)} made for this Christmas season are open now.</p>
${myWish ? `<h3 style="color:#9e2f26">Your wish</h3><blockquote style="margin:0;padding:8px 14px;border-left:4px solid #e3b448;background:#fffdf2">${esc(myWish)}</blockquote>` : ""}
<h3 style="color:#9e2f26">${esc(otherName)}'s wish</h3>
${otherWish ? `<blockquote style="margin:0;padding:8px 14px;border-left:4px solid #e3b448;background:#fffdf2">${esc(otherWish)}</blockquote>` : `<p>This wish is not part of this email. If ${esc(otherName)} wrote one, open your invitation link to read it.</p>`}
<p>Maligayang Bagong Taon!</p>
<p style="font-size:12px;color:#666">You got this email because you entered your address on the Simbang Gabi site. If that was not you, please ignore it. Your address has now been deleted from our records.</p>
</div>`;
  return { subject, text, html };
}

async function run({ env, mailer, fetchImpl = fetch, now = new Date(), sleep = (ms) => new Promise((r) => setTimeout(r, ms)) }) {
  const mode = env.MODE || "send"; // test: sample email to yourself | dry: check only | send: real
  const from = `"Simbang Gabi" <${env.GMAIL_USER}>`;

  if (mode === "test") {
    const mail = buildEmail({ myName: "Test", otherName: "Friend", myWish: "A sample wish for the test.", otherWish: "A sample wish from a friend." });
    await mailer.sendMail({ from, to: env.GMAIL_USER, ...mail });
    console.log("Test email sent to your Gmail address.");
    return 0;
  }

  const headers = { apikey: env.SUPABASE_SERVICE_KEY, "Content-Type": "application/json" };
  if (env.SUPABASE_SERVICE_KEY.startsWith("eyJ")) headers.Authorization = "Bearer " + env.SUPABASE_SERVICE_KEY;
  const base = env.SUPABASE_URL + "/rest/v1";
  const get = async (path) => {
    const r = await fetchImpl(base + path, { headers });
    if (!r.ok) throw new Error("Database read failed (" + r.status + ")");
    return r.json();
  };
  const patch = async (path, body) => {
    const r = await fetchImpl(base + path, { method: "PATCH", headers: { ...headers, Prefer: "return=minimal" }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error("Database update failed (" + r.status + ")");
  };

  const privateJwk = JSON.parse(env.EMAIL_PRIVATE_KEY);
  const rows = await get("/wish_emails?select=invitation_id,author,email,invitations(sender_name,receiver_name,reveal_at)&sent_at=is.null&email=not.is.null");
  const due = rows.filter((r) => r.invitations && new Date(r.invitations.reveal_at) <= now);
  const groups = new Map();
  due.forEach((r) => groups.set(r.invitation_id, [...(groups.get(r.invitation_id) || []), r]));

  let sent = 0, failed = 0, wouldSend = 0;
  for (const [id, group] of groups) {
    const wishes = await get(`/wishes?invitation_id=eq.${id}&select=author,email_sealed`);
    const plain = {};
    for (const w of wishes) {
      if (!w.email_sealed) continue;
      try { plain[w.author] = await decryptSealed(w.email_sealed, privateJwk); } catch (e) { failed++; }
    }
    let allOk = true;
    for (const row of group) {
      const inv = row.invitations;
      const mine = row.author, other = mine === "sender" ? "receiver" : "sender";
      const names = { sender: inv.sender_name, receiver: inv.receiver_name };
      if (!(mine in plain)) { allOk = false; continue; }
      if (mode === "dry") { wouldSend++; continue; }
      try {
        const mail = buildEmail({ myName: names[mine], otherName: names[other], myWish: plain[mine], otherWish: plain[other] || null });
        await mailer.sendMail({ from, to: row.email, ...mail });
        await patch(`/wish_emails?invitation_id=eq.${id}&author=eq.${mine}`, { email: null, sent_at: now.toISOString() });
        sent++;
        await sleep(1500);
      } catch (e) {
        failed++; allOk = false;
        console.error("One email failed (" + (e.code || "error") + ")");
      }
    }
    if (mode === "send" && allOk) await patch(`/wishes?invitation_id=eq.${id}`, { email_sealed: null });
  }
  console.log(`Mode: ${mode}. Invitations due: ${groups.size}. Emails ${mode === "dry" ? "ready to send: " + wouldSend : "sent: " + sent}. Problems: ${failed}.`);
  return failed > 0 ? 1 : 0;
}

module.exports = { decryptSealed, buildEmail, run, esc };

if (require.main === module) {
  const nodemailer = require("nodemailer");
  const mailer = nodemailer.createTransport({ service: "gmail", auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD } });
  run({ env: process.env, mailer })
    .then((code) => process.exit(code))
    .catch((e) => { console.error("Failed:", e.code || e.message); process.exit(1); });
}
