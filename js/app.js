/* App logic. Settings: config.js. Database calls: api.js. Lantern: parol.js. */

const $ = (id) => document.getElementById(id);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
let inv = null;    // the invitation loaded from the database
let token = null;  // the private token from the link
const KEY = new URLSearchParams(location.hash.slice(1)).get("k"); // secret key from the link (never sent to the server)

/* ---------- Helpers ---------- */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => {
    s.hidden = s.id !== id;
    s.classList.toggle("active", s.id === id);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  const heading = $(id).querySelector("h1, h2");
  if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
}
function fail(msg) {
  $("error-text").textContent = msg || "Something went wrong. Please try again.";
  showScreen("screen-error");
}
function addPara(box, text, cls) {
  const p = document.createElement("p");
  if (cls) p.className = cls;
  p.textContent = text;
  box.append(p);
}
const pageLink = (t, k) => location.origin + location.pathname + "?t=" + t + "#k=" + k;
const otherName = () => (inv.role === "sender" ? inv.receiver_name : inv.sender_name);
const revealDateText = () => new Date(inv.reveal_at).toLocaleDateString("en-PH",
  { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Manila" });

/* ---------- Start: decide which screen to show ---------- */
async function start() {
  if (!SUPABASE_URL.startsWith("https://")) {
    return fail("The site isn't connected yet. Add your Supabase URL and key in js/config.js.");
  }
  const t = new URLSearchParams(location.search).get("t");
  if (!t) { prefillCreateForm(); return showScreen("screen-create"); }
  if (!UUID_RE.test(t)) return fail("This link doesn't look right. Please ask for a new one.");
  if (!KEY || !/^[A-Za-z0-9_-]{43}$/.test(KEY)) {
    return fail("This link is missing its secret part (the bit after the # sign). Please open the full link you were given.");
  }
  token = t;
  try { inv = await getInvitation(t); } catch (e) { return fail(e.message); }
  if (!inv) return fail("This link isn't valid. Please ask for a new one.");
  fillInvitation();
  if (inv.revealed) return await showReveal();
  if (inv.my_wish_sent) return showSealed();
  if (inv.role === "receiver") return showScreen("screen-invite");
  showScreen("screen-wish"); // sender who hasn't wished yet
}

/* ---------- Sender: create form ---------- */
function prefillCreateForm() {
  $("f-date").value = CONFIG.defaults.date;
  $("f-time").value = CONFIG.defaults.time;
  $("f-message").value = LETTER_TEMPLATE.join("\n\n");
}

$("create-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const v = (id) => $(id).value.trim();
  const f = { sender: v("f-sender"), receiver: v("f-receiver"), date: v("f-date"), time: v("f-time"),
              church: v("f-church"), meeting: v("f-meeting"), message: v("f-message") };
  const err = $("create-error"), btn = $("btn-create");
  if (Object.values(f).some((x) => !x)) { err.textContent = "Please fill in every field."; return; }
  if (f.message.length < 20) { err.textContent = "Your letter is a little short. Add a few more words."; return; }
  err.textContent = ""; btn.disabled = true; btn.textContent = "Creating...";
  try {
    const key = newKey();
    const r = await createInvitation(f);
    openShare(r.receiver_token, r.sender_token, f.receiver, f.sender, key);
  } catch (ex) {
    err.textContent = ex.message;
  } finally {
    btn.disabled = false; btn.textContent = "Create my invitation";
  }
});

/* ---------- Sender: share link, QR, email ---------- */
function openShare(receiverToken, senderToken, receiverName, senderName, key) {
  const link = pageLink(receiverToken, key), mine = pageLink(senderToken, key);
  document.querySelector("#screen-share p").textContent =
    "Send this whole link to them, or let them scan the QR code. The part after the # sign is the secret key that locks your wishes, so never cut it off.";
  $("share-link").value = link;
  $("my-link").value = mine;
  const qr = $("qr");
  qr.replaceChildren();
  if (window.QRCode) new QRCode(qr, { text: link, width: 180, height: 180 });
  try { localStorage.setItem("sg_my_link", mine); } catch (e) {}
  showScreen("screen-share");
}
$("btn-share-next").addEventListener("click", () => { location.href = $("my-link").value; });
$("btn-show-link").addEventListener("click", () =>
  openShare(inv.receiver_token, token, inv.receiver_name, inv.sender_name, KEY));

document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const input = $(btn.dataset.copy);
    try { await navigator.clipboard.writeText(input.value); }
    catch (e) { input.select(); document.execCommand("copy"); }
    const old = btn.textContent;
    btn.textContent = "Copied!";
    setTimeout(() => { btn.textContent = old; }, 1500);
  });
});

/* ---------- Fill the screens with the invitation ---------- */
function fillInvitation() {
  $("invite-greeting").textContent = `Dear ${inv.receiver_name},`;

  const list = $("details-list");
  list.replaceChildren();
  [["Date", inv.event_date], ["Time", inv.event_time], ["Church", inv.church],
   ["Meeting point", inv.meeting_point]].forEach(([label, value]) => {
    const dt = document.createElement("dt"), dd = document.createElement("dd");
    dt.textContent = label; dd.textContent = value;
    list.append(dt, dd);
  });

  const rem = $("reminders-list");
  rem.replaceChildren();
  CONFIG.reminders.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    rem.append(li);
  });

  const body = $("letter-body");
  body.replaceChildren();
  addPara(body, `Dear ${inv.receiver_name},`);
  inv.message.split(/\n+/).map((s) => s.trim()).filter(Boolean).forEach((t) => addPara(body, t));
  addPara(body, `With all my heart, ${inv.sender_name}`, "sign");

  $("wish-for").textContent =
    `Your wish is locked with a key that exists only in your link, so not even the site's creator can read it. It opens on ${revealDateText()}, when ${otherName()} will see it and you will see theirs.`;
}

/* ---------- YES / NO interaction ---------- */
let noClicks = 0;
let lastAttempt = 0;
const MAX_NO_CLICKS = NO_MESSAGES.length + 1; // last press hides NO
const noBtn = $("btn-no");
const yesBtn = $("btn-yes");

// Jump NO to a random spot in the middle area of the screen (never the corners)
function moveNoButton() {
  noBtn.classList.add("dodging");
  const w = noBtn.offsetWidth, h = noBtn.offsetHeight;
  const minX = window.innerWidth * 0.15;
  const maxX = Math.max(window.innerWidth * 0.85 - w, minX);
  const minY = window.innerHeight * 0.2;
  const maxY = Math.max(window.innerHeight * 0.85 - h, minY);
  const yes = yesBtn.getBoundingClientRect();
  const pad = 80;
  let x, y;
  for (let i = 0; i < 20; i++) {
    x = minX + Math.random() * (maxX - minX);
    y = minY + Math.random() * (maxY - minY);
    const overlapsYes = x < yes.right + pad && x + w > yes.left - pad &&
                        y < yes.bottom + pad && y + h > yes.top - pad;
    if (!overlapsYes) break;
  }
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
}

// Runs when NO is pressed (clicked or tapped)
function tryNo() {
  const now = Date.now();
  if (now - lastAttempt < 400) return;
  lastAttempt = now;
  noClicks++;
  const progress = noClicks / MAX_NO_CLICKS;
  document.documentElement.style.setProperty("--s", 1 + 1.4 * progress);
  if (noClicks >= MAX_NO_CLICKS) {
    noBtn.hidden = true;
    $("invite-message").textContent = FINAL_MESSAGE;
    yesBtn.focus();
    return;
  }
  noBtn.style.transform = `scale(${1 - 0.85 * progress})`;
  noBtn.style.opacity = String(1 - 0.9 * progress);
  $("invite-message").textContent = NO_MESSAGES[noClicks - 1];
  moveNoButton();
}
noBtn.addEventListener("click", tryNo);

yesBtn.addEventListener("click", () => showScreen("screen-details"));
$("btn-letter").addEventListener("click", () => showScreen("screen-letter"));
$("btn-to-wish").addEventListener("click", () => showScreen("screen-wish"));

/* ---------- Wish ---------- */
$("wish-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const wish = $("wish-input").value.trim();
  const error = $("wish-error"), btn = $("btn-wish");
  if (wish.length < 3) {
    error.textContent = "Please write at least a few words for your wish.";
    $("wish-input").focus();
    return;
  }
  error.textContent = ""; btn.disabled = true; btn.textContent = "Sealing...";
  try {
    await submitWish(token, await encryptWish(wish, KEY));
    inv.my_wish_sent = true;
    showSealed();
  } catch (ex) {
    error.textContent = ex.message;
  } finally {
    btn.disabled = false; btn.textContent = "Seal my wish";
  }
});

function showSealed() {
  const other = otherName();
  $("sealed-status").textContent = inv.other_wish_sent
    ? `${other} has sealed their wish too.`
    : `${other} hasn't written their wish yet.`;
  const days = Math.max(1, Math.ceil((new Date(inv.reveal_at) - Date.now()) / 86400000));
  $("sealed-date").textContent =
    `Both wishes open on ${revealDateText()}, in ${days} day${days > 1 ? "s" : ""}. Open this same link again then.`;
  $("btn-show-link").hidden = inv.role !== "sender";
  showScreen("screen-sealed");
}

async function readWish(cipher, emptyText) {
  if (!cipher) return emptyText;
  try { return `"${await decryptWish(cipher, KEY)}"`; }
  catch (e) { return "This wish could not be opened. Please use the full link you were given."; }
}

async function showReveal() {
  const other = otherName();
  $("reveal-mine").textContent = await readWish(inv.my_wish, "You didn't write a wish this time.");
  $("reveal-other-title").textContent = `${other}'s wish`;
  $("reveal-other").textContent = await readWish(inv.other_wish, `${other} didn't write a wish this time.`);
  showScreen("screen-reveal");
}

start().catch((e) => fail("Something broke: " + e.message));
