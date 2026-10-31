/* =========================================================
   EDIT YOUR DETAILS HERE. Everything else works on its own.
   (Letter text is at the bottom of this file.)
   ========================================================= */
const CONFIG = {
  guestName: "[Their Name]",      // who you are inviting
  senderName: "[Your Name]",      // who the letter is from
  date: "December 16, 2026 (first of nine Masses)",
  time: "4:30 AM, Misa de Gallo",
  church: "[Name of Church], [City]",
  meetingPoint: "In front of the church gate, 4:00 AM",
  reminders: [
    "Wear something warm and modest; dawn mornings can be cool.",
    "Come a little early so we can find seats together.",
    "Bring a small coin for the offering, and a big appetite for bibingka and puto bumbong after Mass."
  ]
};

/* ---------- Playful NO messages (one per click) ---------- */
const NO_MESSAGES = [
  "Are you sure? It's only a few mornings...",
  "Think of the warm bibingka waiting for us.",
  "The parol is looking at you sadly.",
  "I'll even save you a seat.",
  "Pretty please? It's Christmas.",
  "Okay, the NO button is getting shy..."
];
const FINAL_MESSAGE = "Looks like there's only one answer left. Yes?";


/* ---------- The letter (one string per paragraph) ---------- */
const LETTER_PARAGRAPHS = [
  `Dear ${CONFIG.guestName},`,
  "Every Christmas, I think about what really makes the season glow. It isn't the lights or the gifts. It's the people we choose to sit beside, especially in the quiet hours when the world is still asleep.",
  "Simbang Gabi has always felt like that to me: walking out in the cool dawn, the church lit gold, voices rising together. I would love to share that with you. Time spent side by side is the best gift I know how to give.",
  "I am grateful for you, for your laughter, your kindness, and the way you make ordinary days brighter. Faith, to me, is also gratitude for people like you, and I want to say thank you where it feels most honest: together, in prayer, at Christmas.",
  "Whether you come for all nine mornings or only one, I'll be happy you were there. Thank you for letting me ask.",
  "Maligayang Pasko."
];
