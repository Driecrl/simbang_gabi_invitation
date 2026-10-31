/* App logic. Content comes from config.js; the parol is drawn by parol.js. */

/* ---------- Helpers ---------- */
const $ = (id) => document.getElementById(id);

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => {
    s.hidden = s.id !== id;
    s.classList.toggle("active", s.id === id);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  const heading = $(id).querySelector("h1, h2");
  if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
}

/* ---------- Fill in the editable content ---------- */
$("invite-greeting").textContent = `Dear ${CONFIG.guestName},`;

const details = [
  ["Date", CONFIG.date],
  ["Time", CONFIG.time],
  ["Church", CONFIG.church],
  ["Meeting point", CONFIG.meetingPoint]
];
details.forEach(([label, value]) => {
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = label;
  dd.textContent = value;
  $("details-list").append(dt, dd);
});
CONFIG.reminders.forEach((text) => {
  const li = document.createElement("li");
  li.textContent = text;
  $("reminders-list").append(li);
});

LETTER_PARAGRAPHS.forEach((text) => {
  const p = document.createElement("p");
  p.textContent = text;
  $("letter-body").append(p);
});
const sign = document.createElement("p");
sign.className = "sign";
sign.textContent = `With all my heart, ${CONFIG.senderName}`;
$("letter-body").append(sign);

/* ---------- YES / NO interaction ---------- */
const MAX_NO_CLICKS = 6;
let noClicks = 0;

$("btn-no").addEventListener("click", () => {
  noClicks++;
  const yes = $("btn-yes"), no = $("btn-no");

  // YES grows (capped so it never overflows small screens)
  document.documentElement.style.setProperty("--s", Math.min(1 + noClicks * 0.22, 2.4));

  if (noClicks >= MAX_NO_CLICKS) {
    no.hidden = true;
    $("invite-message").textContent = FINAL_MESSAGE;
    yes.focus();
    return;
  }
  // NO shrinks and fades
  no.style.transform = `scale(${1 - noClicks * 0.14})`;
  no.style.opacity = String(1 - noClicks * 0.17);
  $("invite-message").textContent = NO_MESSAGES[noClicks - 1];
});

$("btn-yes").addEventListener("click", () => showScreen("screen-details"));
$("btn-letter").addEventListener("click", () => showScreen("screen-letter"));

/* ---------- Wish form with validation ---------- */
$("wish-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const wish = $("wish-input").value.trim();
  const error = $("wish-error");

  if (wish.length < 3) {
    error.textContent = "Please write at least a few words for your wish.";
    $("wish-input").focus();
    return;
  }
  error.textContent = "";
  $("wish-echo").textContent = `"${wish}"`;  // textContent keeps this safe from HTML injection
  showScreen("screen-thanks");
});
