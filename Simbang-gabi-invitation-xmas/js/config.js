/* =========================================================
   SETTINGS. Everything the sender types lives in the database.
   ========================================================= */

/* Paste your Supabase values here (Connect button in the dashboard).
   Use the anon / publishable key. NEVER the service_role key. */
const SUPABASE_URL = "https://huahzsejfnlgiemcvsoz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_DBioNUeCgDqnFBnFBb9NpQ_rye5eF7F";

/* Pre-filled values in the sender form (the sender can change them) */
const CONFIG = {
  defaults: {
    date: "December 16, 2026 (first of nine Masses)",
    time: "4:30 AM, Misa de Gallo"
  },
  /* Shown to every receiver */
  reminders: [
    "No need to dress up too much, but wear something warm and modest; dawn can be cool.",
    "Let's come early so we can find a good seat inside the church.",
    "Travel safe on the way to our meeting point."
  ]
};

/* ---------- Playful NO messages (one per press) ---------- */
const NO_MESSAGES = [
  "Sure ka na ba riyan baby ilang gabi lang toh baby pleaseeeeee",
  "Isipin mo yung bibingka at puto bumbong na naghihintay sa atin pagkatapos ng misa.",
  "Naiisip ko pa naman na nakikinig tayo sa homily ni father oh.",
  "Tapos magkahawak tayo ng kamay sa ama namin, di mo ba naisip yun?",
  "Ayaw mo talga? Malulungkot si Papa Jesus niyan bahala ka",
  "Pretty please? It's Christmas.",
  "Sige na baby oh kahit na ilang gabi na oh samahan mo na'ko pleaseeeeee"
];
const FINAL_MESSAGE = "Pano yan, isa na lang yung choice, wala ka na magagawa. Click that YES button baby pleaseeeeee";

/* ---------- Starting text for the sender's letter (they can edit it) ---------- */
const LETTER_TEMPLATE = [
  "Every Christmas, I think about what really makes the season glow. It isn't the lights or the gifts. It's the people we choose to sit beside, especially in the quiet hours when the world is still asleep.",
  "Simbang Gabi has always felt like that to me: walking out in the cool dawn, the church lit gold, voices rising together. I would love to share that with you. Time spent side by side is the best gift I know how to give.",
  "I am grateful for you, and I want to say thank you where it feels most honest: together, in prayer, at Christmas.",
  "Whether you come for all nine mornings or only one, I'll be happy you were there. Thank you for letting me ask.",
  "Maligayang Pasko."
];
