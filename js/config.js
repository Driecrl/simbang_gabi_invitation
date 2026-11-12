/* =========================================================
   SETTINGS. Everything the sender types lives in the database.
   ========================================================= */

/* Paste your Supabase values here (Connect button in the dashboard).
   Use the anon / publishable key. NEVER the service_role key. */
const SUPABASE_URL = "https://huahzsejfnlgiemcvsoz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_DBioNUeCgDqnFBnFBb9NpQ_rye5eF7F";

/* Pre-filled values in the sender form (the sender can change all of them) */
const CONFIG = {
  defaults: {
    date: "December 16, 2026 (first of nine Masses)",
    time: "4:30 AM, Misa de Gallo"
  }
};

/* One line per message. Also used when an older invitation has no custom ones. */
const DEFAULT_NO_MESSAGES = [
  "Are you sure? It's only a few mornings...",
  "Think of the warm bibingka waiting for us after Mass.",
  "The parol is looking at you sadly.",
  "I'll even save you a seat.",
  "Pretty please? It's Christmas.",
  "Even the stars are hoping you'll say yes.",
  "Okay, the NO button is getting shy..."
];
const DEFAULT_FINAL_MESSAGE = "Looks like there's only one answer left. Yes?";
const DEFAULT_REMINDERS = [
  "No need to dress up too much, but wear something warm and modest; dawn can be cool.",
  "Let's come early so we can find a good seat inside the church.",
  "Travel safe on the way to our meeting point."
];

/* ---------- Starting text for the sender's letter (they can edit it) ---------- */
const LETTER_TEMPLATE = [
  "Every Christmas, I think about what really makes the season glow. It isn't the lights or the gifts. It's the people we choose to sit beside, especially in the quiet hours when the world is still asleep.",
  "Simbang Gabi has always felt like that to me: walking out in the cool dawn, the church lit gold, voices rising together. I would love to share that with you. Time spent side by side is the best gift I know how to give.",
  "I am grateful for you, and I want to say thank you where it feels most honest: together, in prayer, at Christmas.",
  "Whether you come for all nine mornings or only one, I'll be happy you were there. Thank you for letting me ask.",
  "Maligayang Pasko."
];
