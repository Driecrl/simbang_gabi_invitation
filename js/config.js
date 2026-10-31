/* =========================================================
   EDIT YOUR DETAILS HERE. Everything else works on its own.
   (Letter text is at the bottom of this file.)
   ========================================================= */
const CONFIG = {
  guestName: "[Their Name]",      // who you are inviting
  senderName: "Drie",             // who the letter is from
  date: "December 16, 2026 (first of nine Masses)",
  time: "4:30 AM, Misa de Gallo",
  church: "[Name of Church], [City]",
  meetingPoint: "In front of the church gate, 4:00 AM",
  reminders: [
    "Baby di mo na kailangan pumustura ng sobra pero kung gusto mo talaga ikaw bahala, it will be so much special to me presence mo palang sobra-sobra na.",
    "Agahan natin para makahanap tayo ng magandang puwesto sa loob ng simbahan.",
    "Ingat ka sa biyahe papunta sa meeting point natin babyyy."
  ]
};

/* ---------- Playful NO messages (one per click) ---------- */
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

/* ---------- The letter (one string per paragraph) ---------- */
const LETTER_PARAGRAPHS = [
  `Dear ${CONFIG.guestName},`,
  "Every Christmas, I think about what really makes the season glow. It isn't the lights or the gifts. It's the people we choose to sit beside, especially in the quiet hours when the world is still asleep.",
  "Simbang Gabi has always felt like that to me: walking out in the cool dawn, the church lit gold, voices rising together. I would love to share that with you. Time spent side by side is the best gift I know how to give.",
  "I am grateful for you, for your laughter, your kindness, and the way you make ordinary days brighter. Faith, to me, is also gratitude for people like you, and I want to say thank you where it feels most honest: together, in prayer, at Christmas.",
  "Whether you come for all nine mornings or only one, I'll be happy you were there. Thank you for letting me ask.",
  "Maligayang Pasko."
];