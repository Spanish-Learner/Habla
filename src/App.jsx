import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic, MicOff, Volume2, Send, Star, ChevronLeft, ChevronRight,
  RotateCcw, Sparkles, Languages, BookOpen, MessageCircle,
  Type as TypeIcon, Loader2, Check
} from "lucide-react";

/* ---------------------------------------------------------------- */
/*  TOKENS                                                           */
/* ---------------------------------------------------------------- */

const C = {
  ink: "#14213D",
  inkMuted: "#5B6785",
  paper: "#FBF6E9",
  surface: "#FFFFFF",
  sun: "#FFB627",
  sunDark: "#E89A00",
  azul: "#2274A5",
  azulDark: "#175A82",
  pomegranate: "#E63946",
  pomegranateSoft: "#FBE2E4",
  verde: "#3A9D23",
  verdeSoft: "#E4F3DF",
  border: "#E3DCC8",
};

const FONT_DISPLAY = "'Fraunces', serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

/* ---------------------------------------------------------------- */
/*  CONTENT DATA                                                     */
/* ---------------------------------------------------------------- */

const SCENARIOS = [
  {
    id: "free",
    icon: "\uD83D\uDCAC",
    label: "Free chat",
    context: "a relaxed, open-ended conversation about everyday topics",
    opener: {
      es: "\u00A1Hola! \u00BFQu\u00E9 tal? \u00BFDe qu\u00E9 quieres hablar hoy?",
      pron: "OH-lah / keh tahl / deh keh KYEH-rehs ah-BLAR oy",
      en: "Hi! How's it going? What do you want to talk about today?",
    },
  },
  {
    id: "cafe",
    icon: "\u2615",
    label: "At a caf\u00E9",
    context:
      "ordering food and drinks at a Spanish café — the tutor plays the waiter or barista",
    opener: {
      es: "\u00A1Bienvenido! \u00BFQu\u00E9 le gustar\u00EDa pedir?",
      pron: "byehn-veh-NEE-doh / keh leh goos-tah-REE-ah peh-DEER",
      en: "Welcome! What would you like to order?",
    },
  },
  {
    id: "meet",
    icon: "\uD83E\uDD1D",
    label: "Meeting someone",
    context:
      "meeting a new person for the first time and making small talk introductions",
    opener: {
      es: "\u00A1Hola! Mucho gusto, \u00BFc\u00F3mo te llamas?",
      pron: "OH-lah / MOO-choh GOOS-toh / KOH-moh teh YAH-mahs",
      en: "Hi! Nice to meet you, what's your name?",
    },
  },
  {
    id: "airport",
    icon: "\u2708\uFE0F",
    label: "At the airport",
    context:
      "checking in for a flight and going through security — the tutor plays airport staff",
    opener: {
      es: "Buenos d\u00EDas, \u00BFsu pasaporte, por favor?",
      pron: "BWEH-nohs DEE-ahs / soo pah-sah-POR-teh por fah-VOR",
      en: "Good morning, your passport, please?",
    },
  },
];

const PRESET_DECKS = {
  greetings: {
    title: "Greetings",
    icon: "\uD83D\uDC4B",
    cards: [
      { es: "Hola", en: "Hello", pron: "OH-lah" },
      { es: "Buenos d\u00EDas", en: "Good morning", pron: "BWEH-nohs DEE-ahs" },
      { es: "Buenas tardes", en: "Good afternoon", pron: "BWEH-nahs TAR-dehs" },
      { es: "Buenas noches", en: "Good night", pron: "BWEH-nahs NOH-chehs" },
      { es: "\u00BFC\u00F3mo est\u00E1s?", en: "How are you?", pron: "KOH-moh ehs-TAHS" },
      { es: "Muy bien", en: "Very well", pron: "MOO-ee byehn" },
      { es: "Gracias", en: "Thank you", pron: "GRAH-syahs" },
      { es: "Por favor", en: "Please", pron: "por fah-VOR" },
      { es: "De nada", en: "You're welcome", pron: "deh NAH-dah" },
      { es: "Adi\u00F3s", en: "Goodbye", pron: "ah-DYOHS" },
    ],
  },
  food: {
    title: "Food",
    icon: "\uD83C\uDF7D\uFE0F",
    cards: [
      { es: "la manzana", en: "the apple", pron: "lah mahn-SAH-nah" },
      { es: "el pan", en: "the bread", pron: "el pahn" },
      { es: "el agua", en: "the water", pron: "el AH-gwah" },
      { es: "la carne", en: "the meat", pron: "lah KAR-neh" },
      { es: "el pollo", en: "the chicken", pron: "el POH-yoh" },
      { es: "el arroz", en: "the rice", pron: "el ah-ROHS" },
      { es: "la ensalada", en: "the salad", pron: "lah en-sah-LAH-dah" },
      { es: "el caf\u00E9", en: "the coffee", pron: "el kah-FEH" },
      { es: "la leche", en: "the milk", pron: "lah LEH-cheh" },
      { es: "el queso", en: "the cheese", pron: "el KEH-soh" },
    ],
  },
  travel: {
    title: "Travel",
    icon: "\u2708\uFE0F",
    cards: [
      { es: "el aeropuerto", en: "the airport", pron: "el ah-eh-roh-PWEHR-toh" },
      { es: "la maleta", en: "the suitcase", pron: "lah mah-LEH-tah" },
      { es: "el pasaporte", en: "the passport", pron: "el pah-sah-POR-teh" },
      { es: "el hotel", en: "the hotel", pron: "el oh-TEL" },
      { es: "el boleto", en: "the ticket", pron: "el boh-LEH-toh" },
      { es: "la estaci\u00F3n", en: "the station", pron: "lah es-tah-SYOHN" },
      { es: "el tren", en: "the train", pron: "el trehn" },
      { es: "la playa", en: "the beach", pron: "lah PLAH-yah" },
      { es: "el mapa", en: "the map", pron: "el MAH-pah" },
      { es: "la reserva", en: "the reservation", pron: "lah reh-SEHR-vah" },
    ],
  },
  numbers: {
    title: "Numbers",
    icon: "\uD83D\uDD22",
    cards: [
      { es: "uno", en: "one", pron: "OO-noh" },
      { es: "dos", en: "two", pron: "dohs" },
      { es: "tres", en: "three", pron: "trehs" },
      { es: "cuatro", en: "four", pron: "KWAH-troh" },
      { es: "cinco", en: "five", pron: "SEEN-koh" },
      { es: "seis", en: "six", pron: "seys" },
      { es: "siete", en: "seven", pron: "SYEH-teh" },
      { es: "ocho", en: "eight", pron: "OH-choh" },
      { es: "nueve", en: "nine", pron: "NWEH-veh" },
      { es: "diez", en: "ten", pron: "dyehs" },
    ],
  },
};

const ALPHABET = [
  { letter: "A", name: "a", es: "Amigo", en: "friend" },
  { letter: "B", name: "be", es: "Barco", en: "boat" },
  { letter: "C", name: "ce", es: "Casa", en: "house" },
  { letter: "D", name: "de", es: "Dinero", en: "money" },
  { letter: "E", name: "e", es: "Elefante", en: "elephant" },
  { letter: "F", name: "efe", es: "Familia", en: "family" },
  { letter: "G", name: "ge", es: "Gato", en: "cat" },
  { letter: "H", name: "hache", es: "Hola", en: "hello" },
  { letter: "I", name: "i", es: "Isla", en: "island" },
  { letter: "J", name: "jota", es: "Jard\u00EDn", en: "garden" },
  { letter: "K", name: "ka", es: "Kilo", en: "kilo" },
  { letter: "L", name: "ele", es: "Libro", en: "book" },
  { letter: "M", name: "eme", es: "Mesa", en: "table" },
  { letter: "N", name: "ene", es: "Noche", en: "night" },
  { letter: "\u00D1", name: "e\u00F1e", es: "Ni\u00F1o", en: "child" },
  { letter: "O", name: "o", es: "Oso", en: "bear" },
  { letter: "P", name: "pe", es: "Perro", en: "dog" },
  { letter: "Q", name: "cu", es: "Queso", en: "cheese" },
  { letter: "R", name: "erre", es: "Rat\u00F3n", en: "mouse" },
  { letter: "S", name: "ese", es: "Sol", en: "sun" },
  { letter: "T", name: "te", es: "Taza", en: "cup" },
  { letter: "U", name: "u", es: "Uva", en: "grape" },
  { letter: "V", name: "ve", es: "Vaca", en: "cow" },
  { letter: "W", name: "doble ve", es: "Wifi", en: "wifi" },
  { letter: "X", name: "equis", es: "Examen", en: "exam" },
  { letter: "Y", name: "ye", es: "Yo", en: "I" },
  { letter: "Z", name: "zeta", es: "Zapato", en: "shoe" },
];

/* ---------------------------------------------------------------- */
/*  HELPERS                                                           */
/* ---------------------------------------------------------------- */

function parseJSONSafe(text) {
  if (!text) return null;
  let cleaned = text.trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const match = cleaned.match(/[\{\[][\s\S]*[\}\]]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e2) {
        return null;
      }
    }
    return null;
  }
}

// Point this at YOUR backend proxy (see server/proxy-example.js). Never call
// api.anthropic.com directly from a shipped app — your API key would be
// visible to anyone who decompiles the APK.
const CLAUDE_ENDPOINT = "https://YOUR-BACKEND-URL.example.com/api/claude";

async function callClaude(messages, system, maxTokens = 800) {
  const response = await fetch(CLAUDE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });
  const data = await response.json();
  const text = (data.content || [])
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("");
  return text;
}

// In claude.ai, window.storage is provided by the platform. In a standalone
// build (like this APK), it doesn't exist — this polyfill gives the same
// async get/set interface backed by the device's localStorage instead.
const storage = {
  async get(key) {
    const v = window.localStorage.getItem(key);
    if (v === null) throw new Error("not found");
    return { key, value: v };
  },
  async set(key, value) {
    window.localStorage.setItem(key, value);
    return { key, value };
  },
};

function todayStr() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

// Chrome can silently drop speech if the utterance object is garbage-collected
// before it finishes, and voices sometimes aren't loaded on the very first call.
// Keeping a module-level reference and retrying the voice lookup fixes both.
let _activeUtterance = null;

function speakSpanish(text, voicesRef) {
  if (!window.speechSynthesis || !text) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voices =
    (voicesRef && voicesRef.current && voicesRef.current.length && voicesRef.current) ||
    window.speechSynthesis.getVoices();
  const esVoice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("es"));
  if (esVoice) {
    u.voice = esVoice;
    u.lang = esVoice.lang; // match lang to the found voice — a mismatch here silently fails on some devices
  } else {
    u.lang = "es-ES";
  }
  u.rate = 0.88;
  _activeUtterance = u; // prevent garbage collection mid-utterance
  u.onend = () => {
    if (_activeUtterance === u) _activeUtterance = null;
  };
  u.onerror = () => {
    if (_activeUtterance === u) _activeUtterance = null;
  };
  if (window.speechSynthesis.paused) window.speechSynthesis.resume();
  window.speechSynthesis.speak(u);

  // Self-heal: some browsers silently drop the utterance if the queue was in a
  // bad state. If nothing is speaking shortly after, retry once.
  setTimeout(() => {
    if (_activeUtterance === u && !window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
      window.speechSynthesis.speak(u);
    }
  }, 250);

  return true;
}

// Chrome has a long-standing bug where speechSynthesis silently stops firing
// after the engine sits idle for a while. Nudging it periodically works around it.
if (typeof window !== "undefined" && window.speechSynthesis) {
  setInterval(() => {
    try {
      window.speechSynthesis.resume();
    } catch (e) {}
  }, 4000);
}

/* ---------------------------------------------------------------- */
/*  ROOT APP                                                          */
/* ---------------------------------------------------------------- */

export default function App() {
  const [tab, setTab] = useState("chat");
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState({ streak: 0, lastActiveDate: null, learnedWords: [] });
  const [customDecks, setCustomDecks] = useState({});
  const voicesRef = useRef([]);

  const [voiceCount, setVoiceCount] = useState(0);

  // load voices — poll for a bit too, since onvoiceschanged doesn't fire in every browser
  useEffect(() => {
    function loadVoices() {
      const all = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
      voicesRef.current = all;
      setVoiceCount(all.filter((v) => v.lang && v.lang.toLowerCase().startsWith("es")).length);
    }
    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    let attempts = 0;
    const poll = setInterval(() => {
      loadVoices();
      attempts += 1;
      if ((voicesRef.current && voicesRef.current.length) || attempts > 10) clearInterval(poll);
    }, 300);
    return () => clearInterval(poll);
  }, []);

  // load persisted state (streak itself is only updated by recordActivity(),
  // triggered by real practice — not just opening the app)
  useEffect(() => {
    (async () => {
      let prog = { streak: 0, lastActiveDate: null, learnedWords: [] };
      try {
        const res = await storage.get("progress", false);
        if (res && res.value) prog = JSON.parse(res.value);
      } catch (e) {
        /* first run, keep defaults */
      }
      setProgress(prog);

      let decks = {};
      try {
        const res2 = await storage.get("customDecks", false);
        if (res2 && res2.value) decks = JSON.parse(res2.value);
      } catch (e) {}
      setCustomDecks(decks);
      setLoaded(true);
    })();
  }, []);

  const speak = useCallback((text) => {
    speakSpanish(text, voicesRef);
  }, []);

  // Called from real practice actions (sending a chat message, learning a
  // flashcard, translating, generating a deck, tapping the alphabet) — NOT
  // just from opening the app. Only advances the streak once per calendar
  // day, and only if that day had actual activity.
  const recordActivity = useCallback(() => {
    setProgress((prev) => {
      const today = todayStr();
      if (prev.lastActiveDate === today) return prev; // already counted today
      let diffDays = null;
      if (prev.lastActiveDate) {
        const last = new Date(prev.lastActiveDate);
        const now = new Date(today);
        diffDays = Math.round((now - last) / 86400000);
      }
      const streak = diffDays === 1 ? (prev.streak || 0) + 1 : 1;
      const next = { ...prev, streak, lastActiveDate: today };
      storage.set("progress", JSON.stringify(next), false).catch(() => {});
      return next;
    });
  }, []);

  const toggleLearned = useCallback((id) => {
    setProgress((prev) => {
      const has = prev.learnedWords.includes(id);
      const learnedWords = has ? prev.learnedWords.filter((w) => w !== id) : [...prev.learnedWords, id];
      const next = { ...prev, learnedWords };
      storage.set("progress", JSON.stringify(next), false).catch(() => {});
      return next;
    });
  }, []);

  const addCustomDeck = useCallback((topic, cards) => {
    setCustomDecks((prev) => {
      const next = { ...prev, [topic]: { title: topic, icon: "\u2728", cards, custom: true } };
      storage.set("customDecks", JSON.stringify(next), false).catch(() => {});
      return next;
    });
  }, []);

  const TABS = [
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "alphabet", label: "Alphabet", icon: TypeIcon },
    { id: "vocab", label: "Vocab", icon: BookOpen },
    { id: "translate", label: "Translate", icon: Languages },
  ];

  if (!loaded) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.ink, fontFamily: FONT_BODY }}>
        <Loader2 size={28} color={C.sun} className="spin" />
        <style>{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(circle at 30% 0%, #1d2c52 0%, ${C.ink} 60%)`, display: "flex", justifyContent: "center", padding: "24px 12px", fontFamily: FONT_BODY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500..700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        button { font-family: ${FONT_BODY}; cursor: pointer; }
        button:focus-visible, input:focus-visible, textarea:focus-visible { outline: 3px solid ${C.azul}; outline-offset: 2px; }
        input, textarea { font-family: ${FONT_BODY}; }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
        .stampIn { animation: stampIn 0.5s cubic-bezier(.2,1.4,.4,1); }
        @keyframes stampIn { from { transform: scale(0.4) rotate(-30deg); opacity: 0; } to { transform: scale(1) rotate(-8deg); opacity: 1; } }
        .flipCard { transition: transform 0.5s; transform-style: preserve-3d; }
        .scrollbar::-webkit-scrollbar { width: 6px; }
        .scrollbar::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 480, background: C.paper, borderRadius: 28, boxShadow: "0 30px 60px rgba(0,0,0,0.45)", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: "92vh" }}>
        <Header progress={progress} />
        <TabBar tabs={TABS} active={tab} onSelect={setTab} />
        <div style={{ flex: 1, padding: 16, overflowY: "auto" }} className="scrollbar">
          <div style={{ display: tab === "chat" ? "block" : "none" }}>
            <ChatTab speak={speak} recordActivity={recordActivity} />
          </div>
          <div style={{ display: tab === "alphabet" ? "block" : "none" }}>
            <AlphabetTab speak={speak} voiceCount={voiceCount} ttsSupported={!!window.speechSynthesis} recordActivity={recordActivity} />
          </div>
          <div style={{ display: tab === "vocab" ? "block" : "none" }}>
            <VocabTab progress={progress} toggleLearned={toggleLearned} customDecks={customDecks} addCustomDeck={addCustomDeck} speak={speak} recordActivity={recordActivity} />
          </div>
          <div style={{ display: tab === "translate" ? "block" : "none" }}>
            <TranslateTab recordActivity={recordActivity} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  HEADER                                                            */
/* ---------------------------------------------------------------- */

function Header({ progress }) {
  return (
    <div style={{ padding: "20px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `2px dashed ${C.border}` }}>
      <div>
        <div style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", fontWeight: 600, fontSize: 28, color: C.ink, lineHeight: 1 }}>¡Habla!</div>
        <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: C.inkMuted, marginTop: 2, fontWeight: 600 }}>
          tu tutor de español
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ textAlign: "center", background: C.surface, border: `2px solid ${C.border}`, borderStyle: "dashed", borderRadius: 10, padding: "6px 10px" }}>
          <div style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 16, color: C.azul }}>{progress.learnedWords.length}</div>
          <div style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: 0.5, color: C.inkMuted, fontWeight: 600 }}>words</div>
        </div>
        <div
          className="stampIn"
          style={{
            width: 62, height: 62, borderRadius: "50%", border: `3px dashed ${C.ink}`,
            background: C.sun, color: C.ink, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", transform: "rotate(-8deg)", flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 20, lineHeight: 1 }}>{progress.streak}</span>
          <span style={{ fontSize: 7, textTransform: "uppercase", fontWeight: 700, letterSpacing: 0.5 }}>
            d{progress.streak === 1 ? "ía" : "ías"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  TAB BAR                                                            */
/* ---------------------------------------------------------------- */

function TabBar({ tabs, active, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 8, padding: "12px 16px", background: C.paper }}>
      {tabs.map((t) => {
        const isActive = t.id === active;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              padding: "8px 4px", borderRadius: 12,
              border: `2px solid ${isActive ? C.ink : C.border}`,
              background: isActive ? C.sun : C.surface,
              color: C.ink, transform: isActive ? "translateY(-2px)" : "none",
              boxShadow: isActive ? "0 4px 0 rgba(20,33,61,0.2)" : "none",
              transition: "all 0.15s",
            }}
          >
            <Icon size={17} />
            <span style={{ fontSize: 10, fontWeight: 700 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  CHAT TAB                                                          */
/* ---------------------------------------------------------------- */

function ChatTab({ speak, recordActivity }) {
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [messages, setMessages] = useState([{ role: "tutor", ...SCENARIOS[0].opener }]);
  const [apiHistory, setApiHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [correction, setCorrection] = useState(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const [micSupported, setMicSupported] = useState(true);
  const endRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const isNativeApp = !!window.Capacitor;
    if (!SR || isNativeApp) {
      // Plain Web Speech recognition does not work inside an Android WebView —
      // it needs a native plugin (see README.md, "Adding real mic support").
      setMicSupported(false);
      return;
    }
    const rec = new SR();
    rec.lang = "es-ES";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
  }, []);

  useEffect(() => {
    endRef.current && endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function toggleMic() {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (listening) {
      rec.stop();
      setListening(false);
    } else {
      try {
        rec.start();
        setListening(true);
      } catch (e) {}
    }
  }

  function selectScenario(s) {
    setScenario(s);
    setMessages([{ role: "tutor", ...s.opener }]);
    setApiHistory([]);
    setCorrection(null);
    speak(s.opener.es);
  }

  function buildSystemPrompt(s) {
    return `You are "Profe Elena", a warm, encouraging Spanish tutor for a BEGINNER (A1) English-speaking student. You are role-playing: ${s.context}. Rules: reply only in short, simple beginner-level Spanish (A1-A2), at most two short sentences, and stay in character for the roleplay. Look at the student's most recent message: if it contains grammar, vocabulary, or spelling mistakes, set "corrections" to an object with a corrected version and a short, friendly one-sentence English explanation; if there are no mistakes (or this is the first message), set "corrections" to null. Respond with ONLY minified JSON and nothing else — no markdown, no code fences — matching exactly this schema: {"reply_es":"string","reply_pronunciation":"simple hyphenated English-style phonetic spelling","reply_en":"string","corrections":null_or_object}`;
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    recordActivity();
    setMessages((prev) => [...prev, { role: "user", es: text }]);
    setLoading(true);
    const newHistory = [...apiHistory, { role: "user", content: text }];
    try {
      const raw = await callClaude(newHistory, buildSystemPrompt(scenario), 400);
      const parsed = parseJSONSafe(raw);
      if (!parsed || !parsed.reply_es) throw new Error("parse failed");
      setMessages((prev) => [...prev, { role: "tutor", es: parsed.reply_es, pron: parsed.reply_pronunciation, en: parsed.reply_en }]);
      setCorrection(parsed.corrections || "none");
      setApiHistory([...newHistory, { role: "assistant", content: parsed.reply_es }]);
      speak(parsed.reply_es);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "tutor", es: "Lo siento, hubo un problema de conexión.", pron: "loh SYEHN-toh / OO-boh oon proh-bleh-mah deh koh-nek-SYOHN", en: "Sorry, there was a connection problem. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => selectScenario(s)}
            style={{
              flexShrink: 0, padding: "7px 12px", borderRadius: 999,
              border: `2px solid ${scenario.id === s.id ? C.azul : C.border}`,
              background: scenario.id === s.id ? C.azul : C.surface,
              color: scenario.id === s.id ? "#fff" : C.ink,
              fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
            }}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 12, minHeight: 260, maxHeight: 340, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }} className="scrollbar">
        {messages.map((m, i) => (
          <ChatBubble key={i} m={m} speak={speak} />
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-start", color: C.inkMuted, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Loader2 size={14} className="spin" style={{ animation: "spin 1s linear infinite" }} /> Profe Elena está escribiendo…
          </div>
        )}
        <div ref={endRef} />
      </div>

      <CorrectionBox correction={correction} />

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          onClick={toggleMic}
          disabled={!micSupported}
          title={micSupported ? "Speak in Spanish" : "Speech recognition not supported in this browser"}
          style={{
            width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
            border: `2px solid ${listening ? C.pomegranate : C.ink}`,
            background: listening ? C.pomegranate : C.surface,
            color: listening ? "#fff" : C.ink,
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: micSupported ? 1 : 0.4,
          }}
        >
          {listening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe o habla en español…"
          style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: `2px solid ${C.border}`, fontSize: 14, background: C.surface, color: C.ink }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{ width: 42, height: 42, borderRadius: "50%", border: "none", background: C.sun, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: loading || !input.trim() ? 0.5 : 1 }}
        >
          <Send size={17} />
        </button>
      </div>
      {!micSupported && (
        <div style={{ fontSize: 11, color: C.inkMuted }}>
          {window.Capacitor
            ? "Voice input needs a native mic plugin in the APK build — see README.md."
            : "Voice input isn't supported in this browser — try Chrome to use the microphone."}
        </div>
      )}
    </div>
  );
}

function ChatBubble({ m, speak }) {
  const isTutor = m.role === "tutor";
  return (
    <div style={{ alignSelf: isTutor ? "flex-start" : "flex-end", maxWidth: "88%" }}>
      <div
        style={{
          background: isTutor ? C.paper : C.azul,
          color: isTutor ? C.ink : "#fff",
          borderRadius: 14,
          borderBottomLeftRadius: isTutor ? 4 : 14,
          borderBottomRightRadius: isTutor ? 14 : 4,
          padding: "10px 12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>{m.es}</span>
          {isTutor && (
            <button onClick={() => speak(m.es)} style={{ border: "none", background: "none", color: C.azul, padding: 2, flexShrink: 0 }}>
              <Volume2 size={15} />
            </button>
          )}
        </div>
        {isTutor && m.pron && <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.azulDark, marginTop: 4 }}>{m.pron}</div>}
        {isTutor && m.en && <div style={{ fontSize: 12, color: C.inkMuted, marginTop: 3, fontStyle: "italic" }}>{m.en}</div>}
      </div>
    </div>
  );
}

function CorrectionBox({ correction }) {
  if (!correction) return null;
  const isClean = correction === "none";
  return (
    <div
      style={{
        background: isClean ? C.verdeSoft : C.pomegranateSoft,
        border: `1px solid ${isClean ? C.verde : C.pomegranate}`,
        borderRadius: 12,
        padding: "10px 12px",
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: isClean ? C.verde : C.pomegranate, marginBottom: 3 }}>
        {isClean ? "¡Buen trabajo!" : "Corrección"}
      </div>
      {isClean ? (
        <div style={{ fontSize: 12, color: C.ink }}>No mistakes in your last message — keep going!</div>
      ) : (
        <>
          <div style={{ fontSize: 13, color: C.ink, fontWeight: 600 }}>{correction.corrected}</div>
          <div style={{ fontSize: 12, color: C.inkMuted, marginTop: 2 }}>{correction.explanation}</div>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  ALPHABET TAB                                                      */
/* ---------------------------------------------------------------- */

function AlphabetTab({ speak, voiceCount, ttsSupported, recordActivity }) {
  const [selected, setSelected] = useState(ALPHABET[0]);
  const [lastTapped, setLastTapped] = useState(false);

  function handleTap(letter) {
    setSelected(letter);
    speak(`${letter.name}, como en ${letter.es}`);
    setLastTapped(true);
    recordActivity();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!ttsSupported && (
        <div style={{ background: C.pomegranateSoft, border: `1px solid ${C.pomegranate}`, borderRadius: 12, padding: "8px 12px", fontSize: 12, color: C.ink }}>
          This browser doesn't support text-to-speech at all, so sound can't play here — try Chrome.
        </div>
      )}
      {ttsSupported && voiceCount === 0 && (
        <div style={{ background: C.pomegranateSoft, border: `1px solid ${C.pomegranate}`, borderRadius: 12, padding: "8px 12px", fontSize: 12, color: C.ink }}>
          No Spanish voice was found on this device yet. It'll use the system default voice instead — tap{" "}
          <button onClick={() => speak("Hola")} style={{ border: "none", background: "none", color: C.azul, fontWeight: 700, padding: 0, textDecoration: "underline" }}>
            here to test sound
          </button>.
        </div>
      )}
      <div
        style={{
          background: C.ink, color: "#fff", borderRadius: 18, padding: 20,
          display: "flex", alignItems: "center", gap: 16,
        }}
      >
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 52, fontWeight: 700, lineHeight: 1 }}>{selected.letter}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.sun, marginBottom: 4 }}>"{selected.name}"</div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{selected.es}</div>
          <div style={{ fontSize: 12, color: "#C7CEE0", fontStyle: "italic" }}>{selected.en}</div>
        </div>
        <button
          onClick={() => speak(`${selected.name}, como en ${selected.es}`)}
          style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${C.sun}`, background: "transparent", color: C.sun, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >
          <Volume2 size={18} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))", gap: 8 }}>
        {ALPHABET.map((l) => (
          <button
            key={l.letter}
            onClick={() => handleTap(l)}
            style={{
              aspectRatio: "1", borderRadius: 10,
              border: `2px solid ${selected.letter === l.letter ? C.ink : C.border}`,
              background: selected.letter === l.letter ? C.sun : C.surface,
              color: C.ink, fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18,
            }}
          >
            {l.letter}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 12, color: C.inkMuted, textAlign: "center" }}>Tap a letter to hear its sound and an example word.</div>
      {lastTapped && (
        <div style={{ fontSize: 11, color: C.azul, textAlign: "center", fontFamily: FONT_MONO }}>
          ▶ requested: "{selected.name}, como en {selected.es}"
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  VOCAB TAB                                                          */
/* ---------------------------------------------------------------- */

function VocabTab({ progress, toggleLearned, customDecks, addCustomDeck, speak, recordActivity }) {
  const [openDeckId, setOpenDeckId] = useState(null);
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  const allDecks = { ...PRESET_DECKS, ...customDecks };

  async function handleGenerate() {
    const t = topic.trim();
    if (!t || generating) return;
    setGenerating(true);
    setGenError("");
    try {
      const system = `Generate a beginner (A1) Spanish vocabulary flashcard deck about the topic the user gives you. Respond with ONLY a minified JSON array of exactly 10 objects, no markdown, no code fences, matching exactly this schema: [{"es":"string (Spanish word or short phrase, include article if a noun)","en":"string (English meaning)","pron":"simple hyphenated English-style phonetic spelling"}]`;
      const raw = await callClaude([{ role: "user", content: t }], system, 900);
      const parsed = parseJSONSafe(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("bad deck");
      addCustomDeck(t, parsed);
      recordActivity();
      setTopic("");
      setOpenDeckId(t);
    } catch (e) {
      setGenError("Couldn't generate that deck — try a different topic.");
    } finally {
      setGenerating(false);
    }
  }

  if (openDeckId && allDecks[openDeckId]) {
    return (
      <FlashcardViewer
        deckId={openDeckId}
        deck={allDecks[openDeckId]}
        progress={progress}
        toggleLearned={toggleLearned}
        speak={speak}
        recordActivity={recordActivity}
        onBack={() => setOpenDeckId(null)}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.inkMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Decks</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {Object.entries(allDecks).map(([id, deck]) => {
            const learnedCount = deck.cards.filter((c) => progress.learnedWords.includes(`${id}::${c.es}`)).length;
            return (
              <button
                key={id}
                onClick={() => setOpenDeckId(id)}
                style={{ textAlign: "left", background: C.surface, border: `2px solid ${C.border}`, borderRadius: 14, padding: 12 }}
              >
                <div style={{ fontSize: 22 }}>{deck.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.ink, marginTop: 4, textTransform: "capitalize" }}>{deck.title}</div>
                <div style={{ fontSize: 11, color: C.inkMuted, marginTop: 2 }}>{learnedCount}/{deck.cards.length} learned</div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ background: C.surface, border: `2px dashed ${C.border}`, borderRadius: 14, padding: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles size={14} color={C.sunDark} /> Generate a deck on any topic
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="e.g. weather, clothing, family…"
            style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: `2px solid ${C.border}`, fontSize: 13 }}
          />
          <button
            onClick={handleGenerate}
            disabled={generating || !topic.trim()}
            style={{ padding: "9px 14px", borderRadius: 10, border: "none", background: C.sun, color: C.ink, fontWeight: 700, fontSize: 13, opacity: generating || !topic.trim() ? 0.5 : 1, display: "flex", alignItems: "center", gap: 6 }}
          >
            {generating ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : "Generate"}
          </button>
        </div>
        {genError && <div style={{ fontSize: 11, color: C.pomegranate, marginTop: 6 }}>{genError}</div>}
      </div>
    </div>
  );
}

function FlashcardViewer({ deckId, deck, progress, toggleLearned, speak, recordActivity, onBack }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = deck.cards[index];
  const wordId = `${deckId}::${card.es}`;
  const isLearned = progress.learnedWords.includes(wordId);
  const learnedCount = deck.cards.filter((c) => progress.learnedWords.includes(`${deckId}::${c.es}`)).length;

  function go(delta) {
    setFlipped(false);
    setIndex((i) => (i + delta + deck.cards.length) % deck.cards.length);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <button onClick={onBack} style={{ alignSelf: "flex-start", border: "none", background: "none", color: C.azul, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
        <ChevronLeft size={15} /> All decks
      </button>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: C.ink, textTransform: "capitalize" }}>{deck.icon} {deck.title}</div>
        <div style={{ fontSize: 12, color: C.inkMuted, marginTop: 2 }}>Card {index + 1} of {deck.cards.length} · {learnedCount} learned</div>
      </div>

      <div
        onClick={() => setFlipped((f) => !f)}
        style={{
          background: flipped ? C.azul : C.surface,
          color: flipped ? "#fff" : C.ink,
          border: `2px solid ${C.ink}`,
          borderRadius: 20, minHeight: 180, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 8, padding: 20, cursor: "pointer",
        }}
      >
        {!flipped ? (
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700, textAlign: "center" }}>{card.es}</div>
        ) : (
          <>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{card.en}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 12, opacity: 0.85 }}>{card.pron}</div>
          </>
        )}
        <div style={{ fontSize: 10, opacity: 0.6, display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
          <RotateCcw size={11} /> tap to flip
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <button onClick={() => go(-1)} style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${C.border}`, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={18} color={C.ink} />
        </button>
        <button onClick={() => speak(card.es)} style={{ width: 46, height: 46, borderRadius: "50%", border: "none", background: C.azul, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Volume2 size={20} />
        </button>
        <button
          onClick={() => {
            toggleLearned(wordId);
            recordActivity();
          }}
          style={{
            width: 46, height: 46, borderRadius: "50%",
            border: `2px solid ${isLearned ? C.verde : C.border}`,
            background: isLearned ? C.verde : C.surface,
            color: isLearned ? "#fff" : C.inkMuted, display: "flex", alignItems: "center", justifyContent: "center",
          }}
          title="Mark as learned"
        >
          {isLearned ? <Check size={19} /> : <Star size={19} />}
        </button>
        <button onClick={() => go(1)} style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${C.border}`, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronRight size={18} color={C.ink} />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  TRANSLATE TAB                                                      */
/* ---------------------------------------------------------------- */

function TranslateTab({ recordActivity }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const voicesRef = useRef([]);

  useEffect(() => {
    function loadVoices() {
      voicesRef.current = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    }
    loadVoices();
    if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = loadVoices;
    let attempts = 0;
    const poll = setInterval(() => {
      loadVoices();
      attempts += 1;
      if ((voicesRef.current && voicesRef.current.length) || attempts > 10) clearInterval(poll);
    }, 300);
    return () => clearInterval(poll);
  }, []);

  function speak(t) {
    speakSpanish(t, voicesRef);
  }

  async function handleTranslate() {
    const t = text.trim();
    if (!t || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const system = `You are a Spanish translation and grammar assistant for a beginner English-speaking student. Given input text that may be in English or Spanish: 1) detect its language, 2) translate it into the other language, 3) give the Spanish version regardless of direction, 4) give a simple hyphenated phonetic pronunciation of the Spanish version, 5) break the Spanish sentence into words or short phrases with a brief grammar/usage note for each in English. Respond with ONLY minified JSON, no markdown, no code fences, matching exactly this schema: {"detected_language":"en_or_es","translation":"string (the full translated sentence in the other language)","spanish":"string (the full Spanish version)","pronunciation":"string","breakdown":[{"word":"string","meaning":"string","note":"string"}]}`;
      const raw = await callClaude([{ role: "user", content: t }], system, 900);
      const parsed = parseJSONSafe(raw);
      if (!parsed || !parsed.spanish) throw new Error("bad translate");
      setResult(parsed);
      recordActivity();
    } catch (e) {
      setError("Couldn't translate that — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type in English or Spanish…"
          rows={3}
          style={{ width: "100%", padding: 12, borderRadius: 12, border: `2px solid ${C.border}`, fontSize: 14, resize: "none" }}
        />
        <button
          onClick={handleTranslate}
          disabled={loading || !text.trim()}
          style={{ marginTop: 8, width: "100%", padding: "10px 14px", borderRadius: 12, border: "none", background: C.sun, color: C.ink, fontWeight: 700, fontSize: 14, opacity: loading || !text.trim() ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Languages size={16} />}
          Translate
        </button>
        {error && <div style={{ fontSize: 12, color: C.pomegranate, marginTop: 6 }}>{error}</div>}
      </div>

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: C.ink, color: "#fff", borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, color: C.sun, fontWeight: 700, marginBottom: 4 }}>
              {result.detected_language === "es" ? "English translation" : "Spanish translation"}
            </div>
            <div style={{ fontSize: 17, fontWeight: 600 }}>{result.translation}</div>

            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px dashed rgba(255,255,255,0.25)", display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => speak(result.spanish)} style={{ width: 32, height: 32, borderRadius: "50%", border: `2px solid ${C.sun}`, background: "transparent", color: C.sun, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Volume2 size={15} />
              </button>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{result.spanish}</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#C7CEE0" }}>{result.pronunciation}</div>
              </div>
            </div>
          </div>

          {Array.isArray(result.breakdown) && result.breakdown.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.inkMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
                Word by word
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {result.breakdown.map((b, i) => (
                  <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 12px", display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ minWidth: 70 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: C.azul }}>{b.word}</div>
                      <div style={{ fontSize: 11, color: C.inkMuted }}>{b.meaning}</div>
                    </div>
                    <div style={{ fontSize: 11, color: C.ink, textAlign: "right", flex: 1 }}>{b.note}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
