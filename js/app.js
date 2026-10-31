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
let noClicks = 0;
let lastAttempt = 0;
const MAX_NO_CLICKS = NO_MESSAGES.length + 1; // last attempt hides NO
const noBtn = $("btn-no");
const yesBtn = $("btn-yes");

// Jump NO to a random spot in the middle area of the screen (never the corners)
function moveNoButton() {
  noBtn.classList.add("dodging");
  const w = noBtn.offsetWidth, h = noBtn.offsetHeight;

  // Allowed area: 15% to 85% across, 20% to 85% down
  const minX = window.innerWidth * 0.15;
  const maxX = Math.max(window.innerWidth * 0.85 - w, minX);
  const minY = window.innerHeight * 0.2;
  const maxY = Math.max(window.innerHeight * 0.85 - h, minY);

  const yes = yesBtn.getBoundingClientRect();
  const pad = 80; // extra space because YES keeps growing
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

// Runs when NO is hovered (mouse) or tapped/clicked
function tryNo() {
  const now = Date.now();
  if (now - lastAttempt < 400) return; // stops one tap counting twice
  lastAttempt = now;
  noClicks++;
  const progress = noClicks / MAX_NO_CLICKS; // 0 to 1

  // YES grows
  document.documentElement.style.setProperty("--s", 1 + 1.4 * progress);

  if (noClicks >= MAX_NO_CLICKS) {
    noBtn.hidden = true;
    $("invite-message").textContent = FINAL_MESSAGE;
    yesBtn.focus();
    return;
  }
  // NO shrinks, fades and runs away
  noBtn.style.transform = `scale(${1 - 0.85 * progress})`;
  noBtn.style.opacity = String(1 - 0.9 * progress);
  $("invite-message").textContent = NO_MESSAGES[noClicks - 1];
  moveNoButton();
}


noBtn.addEventListener("click", tryNo);

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