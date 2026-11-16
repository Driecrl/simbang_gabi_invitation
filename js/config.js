/* =========================================================
   SETTINGS. Everything the sender types lives in the database.
   ========================================================= */

/* Paste your Supabase values here (Connect button in the dashboard).
   Use the anon / publishable key. NEVER the service_role key. */
const SUPABASE_URL = "https://huahzsejfnlgiemcvsoz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_DBioNUeCgDqnFBnFBb9NpQ_rye5eF7F";

/* Public key for the optional New Year email. Paste the public key made by tools/make-keys.html here.
   While it is null, the email box on the wish screen stays hidden. */
const EMAIL_PUBLIC_KEY = {"alg":"RSA-OAEP-256","e":"AQAB","ext":true,"key_ops":["encrypt"],"kty":"RSA","n":"3u36CIIfXR1csnHXV7GbjtOnIelEsnFHKLTOvsZKseuMxO3ddUHLFC5MVVrkRWm9oDFWkm8O7wD16nuYuRFlsCLRsu_A__EHLsciFzOuZychId4WC5xyE6-OoGOjXuXEMLt3kjDzkE1XwavCrCWQ2X_Oa5CEkcR6dtljF_d1Rgtctulw1oc30Xo8l6mJqatJcH8tZzfYTdB5KN0v3kusS62zmX8HRCnGlbe6gPtUWBQE_KSsmSxLTjgmG6xSPQDF7z5vpyJlzAU-WIhNvhmQAviKqvRATerEsujBLjEE_ZmZTEvmUgbAZOYuWZwe-zBVZ1W6Hm-Sk0TKIr_1yRAvtQ"};

/* Pre-filled values in the sender form (the sender can change all of them) */
const CONFIG = {
  defaults: {
    date: "",
    time: "",
  }
};

/* One line per message. Also used when an older invitation has no custom ones. */
const DEFAULT_NO_MESSAGES = [
  "",
  "",
  "",
  "",
  "",
  "",
  ""
];
const DEFAULT_FINAL_MESSAGE = "";
const DEFAULT_REMINDERS = [
  "",
  "",
  "",
];

/* ---------- Starting text for the sender's letter (they can edit it) ---------- */
const LETTER_TEMPLATE = [
  "",
  "",
  "",
  "",
  ""
];
