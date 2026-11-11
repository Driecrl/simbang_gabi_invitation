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
    date: "",
    time: ""
  },
  /* Shown to every receiver */
  reminders: [
    
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
  
];
