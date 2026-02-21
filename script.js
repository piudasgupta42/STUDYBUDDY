// ==============================
// Sakha & Sakhi – Full Version
// ==============================

const avatarPlayer = document.getElementById("avatarAnimation");
const avatarNameDisplay = document.getElementById("avatarName");
const chatBox = document.getElementById("chatBox");
const timerDisplay = document.getElementById("timer");

const selectedAvatar = localStorage.getItem("avatar") || "sakhi";

if (avatarNameDisplay) {
  avatarNameDisplay.innerText =
    selectedAvatar === "sakha" ? "Sakha" : "Sakhi";
}

// ==============================
// ONLINE CARTOON AVATARS
// ==============================

const animations = {
  sakha: {
    idle: "https://assets9.lottiefiles.com/packages/lf20_8wREpI.json",
    talk: "https://assets10.lottiefiles.com/packages/lf20_touohxv0.json"
  },
  sakhi: {
    idle: "https://assets3.lottiefiles.com/packages/lf20_khzniaya.json",
    talk: "https://assets10.lottiefiles.com/packages/lf20_touohxv0.json"
  }
};

function loadIdle() {
  avatarPlayer.setAttribute("src", animations[selectedAvatar].idle);
}

function loadTalking() {
  avatarPlayer.setAttribute("src", animations[selectedAvatar].talk);
}

if (avatarPlayer) loadIdle();

// ==============================
// GEMINI API
// ==============================

// 🔴 PASTE YOUR NEW API KEY BELOW
const API_KEY = "AIzaSyDlSchaIaPTtiWZxTbC46NWPllH0_svA0I";

async function generateResponse(prompt) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are ${selectedAvatar}, an ethical AI study companion.

Rules:
- No medical, legal, financial advice.
- Supportive and growth-focused.
- If student feels discouraged: empathy + perseverance example + small action step.
- If crisis detected: encourage real-world help.

User: ${prompt}
`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    return data.candidates?.[0]?.content?.parts?.[0]?.text ||
           "Let’s keep learning together.";
  } catch (error) {
    return "Connection issue. Please try again.";
  }
}

// ==============================
// MESSAGE + LIMIT SYSTEM
// ==============================

let messageCount = 0;
let timeLeft = 600; // 10 minutes

async function sendMessage() {

  if (messageCount >= 20) {
    addMessage("Daily message limit reached.", "ai");
    return;
  }

  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  addMessage(text, "user");

  if (checkSafety(text)) return;

  messageCount++;

  loadTalking();
  const reply = await generateResponse(text);
  addMessage(reply, "ai");
  speak(reply);
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "message " + type;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ==============================
// SAFETY SYSTEM
// ==============================

function checkSafety(text) {
  const risky = ["suicide", "kill myself", "self harm", "die"];
  for (let word of risky) {
    if (text.toLowerCase().includes(word)) {
      addMessage(
        "I’m really sorry you're feeling this way. If you're in India, please call KIRAN 1800-599-0019. Are you safe right now?",
        "ai"
      );
      return true;
    }
  }
  return false;
}

// ==============================
// VOICE
// ==============================

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.onend = loadIdle;
  window.speechSynthesis.speak(speech);
}

// ==============================
// TIMER
// ==============================

if (timerDisplay) {
  setInterval(() => {
    if (timeLeft <= 0) return;
    timeLeft--;
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;
    timerDisplay.innerText = `${m}:${s < 10 ? "0" : ""}${s}`;
  }, 1000);
}

// ==============================
// DARK MODE
// ==============================

function toggleMode() {
  document.body.classList.toggle("dark");
}
