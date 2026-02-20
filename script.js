      
// ===============================
// Sakha & Sakhi – Core System
// ===============================

const chatBox = document.getElementById("chatBox");
const avatarPlayer = document.getElementById("avatarAnimation");
const avatarNameDisplay = document.getElementById("avatarName");
const input = document.getElementById("userInput");

const selectedAvatar = localStorage.getItem("avatar") || "sakha";
avatarNameDisplay.innerText = selectedAvatar === "sakha" ? "Sakha" : "Sakhi";

let messageCount = 0;
let sessionTime = 600; // 10 minutes

// ===============================
// DAILY RESET SYSTEM
// ===============================

const today = new Date().toDateString();
const lastUsed = localStorage.getItem("lastUsed");

if (lastUsed !== today) {
  localStorage.setItem("lastUsed", today);
  localStorage.setItem("messagesToday", 0);
}

messageCount = parseInt(localStorage.getItem("messagesToday")) || 0;

// ===============================
// LOAD AVATAR ANIMATION
// ===============================

function loadIdle() {
  avatarPlayer.setAttribute("src", `assets/${selectedAvatar}_idle.json`);
}

function loadTalking() {
  avatarPlayer.setAttribute("src", `assets/${selectedAvatar}_talk.json`);
}

loadIdle();

// ===============================
// TIMER SYSTEM
// ===============================

const timerDisplay = document.getElementById("timer");

const timerInterval = setInterval(() => {
  sessionTime--;

  let minutes = Math.floor(sessionTime / 60);
  let seconds = sessionTime % 60;

  timerDisplay.innerText =
    `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  if (sessionTime <= 0) {
    clearInterval(timerInterval);
    disableChat("Session limit reached for today.");
  }

}, 1000);

function disableChat(message) {
  input.disabled = true;
  addMessage(message, "ai");
}

// ===============================
// MESSAGE SYSTEM
// ===============================

async function sendMessage() {

  if (messageCount >= 20) {
    disableChat("You’ve reached your daily message limit.");
    return;
  }

  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  addMessage(text, "user");

  if (checkSafety(text)) return;

  messageCount++;
  localStorage.setItem("messagesToday", messageCount);

  const aiResponse = await generateResponse(text);
  addMessage(aiResponse, "ai");
  speak(aiResponse);
}

// ===============================
// DISPLAY MESSAGE
// ===============================

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ===============================
// AI RESPONSE LOGIC
// ===============================

async function generateResponse(prompt) {

  // Motivation Trigger
  if (prompt.toLowerCase().includes("fail") ||
      prompt.toLowerCase().includes("tired") ||
      prompt.toLowerCase().includes("give up")) {

    return motivationalResponse();
  }

  // HuggingFace API
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer YOUR_HF_TOKEN",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );

    const data = await response.json();
    return data[0]?.generated_text || defaultFallback();

  } catch {
    return defaultFallback();
  }
}

function defaultFallback() {
  return "I'm here to support your learning journey. Let’s take one step at a time.";
}

// ===============================
// MOTIVATIONAL MODULE
// ===============================

function motivationalResponse() {
  const examples = [
    "Thomas Edison failed over 1,000 times before inventing the light bulb.",
    "A.P.J. Abdul Kalam faced rejection before becoming India’s Missile Man.",
    "J.K. Rowling was rejected by 12 publishers before Harry Potter.",
    "Michael Jordan was cut from his high school basketball team."
  ];

  const randomExample =
    examples[Math.floor(Math.random() * examples.length)];

  return `I understand this feels difficult right now.

Remember: ${randomExample}

Progress happens step by step.
Try studying for just 15 focused minutes.
Small efforts build big success.`;
}

// ===============================
// SAFETY OVERRIDE
// ===============================

function checkSafety(text) {
  const riskyWords = [
    "suicide",
    "kill myself",
    "self harm",
    "want to die"
  ];

  for (let word of riskyWords) {
    if (text.toLowerCase().includes(word)) {

      const safetyMessage =
        "I'm really sorry you're feeling this way. " +
        "You’re not alone.\n\n" +
        "If you're in India, please call KIRAN (1800-599-0019).\n" +
        "If elsewhere, contact local emergency services.\n\n" +
        "Are you safe right now?";

      addMessage(safetyMessage, "ai");
      return true;
    }
  }

  return false;
}

// ===============================
// SPEECH + TALKING ANIMATION
// ===============================

function speak(text) {

  loadTalking();

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";

  const voices = window.speechSynthesis.getVoices();

  if (selectedAvatar === "sakha") {
    speech.voice =
      voices.find(v => v.name.toLowerCase().includes("male")) || voices[0];
  } else {
    speech.voice =
      voices.find(v => v.name.toLowerCase().includes("female")) || voices[0];
  }

  speech.onend = function () {
    loadIdle();
  };

  window.speechSynthesis.speak(speech);
}

// ===============================
// DARK MODE TOGGLE
// ===============================

function toggleMode() {
  document.body.classList.toggle("dark");
}
