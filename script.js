// ==========================================
// Sakha & Sakhi – Ethical AI Study Companion
// Full Working Frontend Script
// ==========================================

// Elements
const avatarPlayer = document.getElementById("avatarAnimation");
const avatarNameDisplay = document.getElementById("avatarName");
const chatBox = document.getElementById("chatBox");
const timerDisplay = document.getElementById("timer");
const inputField = document.getElementById("messageInput");

const selectedAvatar = localStorage.getItem("avatar") || "sakhi";

// Display avatar name
if (avatarNameDisplay) {
  avatarNameDisplay.innerText =
    selectedAvatar === "sakha" ? "Sakha" : "Sakhi";
}

// ==========================================
// ONLINE LOTTIE AVATARS
// ==========================================

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
  if (avatarPlayer)
    avatarPlayer.setAttribute("src", animations[selectedAvatar].idle);
}

function loadTalking() {
  if (avatarPlayer)
    avatarPlayer.setAttribute("src", animations[selectedAvatar].talk);
}

if (avatarPlayer) loadIdle();

// ==========================================
// CHAT FUNCTIONS
// ==========================================

function addMessage(message, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = sender === "user" ? "user-message" : "bot-message";
  messageDiv.innerText = message;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ==========================================
// GEMINI BACKEND CALL (RENDER)
// ==========================================

async function generateResponse(prompt) {
  try {
    const response = await fetch(
      "https://sakha-backend.onrender.com/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: prompt,
          avatar: selectedAvatar
        })
      }
    );

    const data = await response.json();
    return data.reply || "Let’s keep learning together.";
  } catch (error) {
    console.error("Error:", error);
    return "Connection issue. Please try again.";
  }
}

// ==========================================
// SEND MESSAGE
// ==========================================

async function sendMessage() {
  const message = inputField.value.trim();
  if (!message) return;

  addMessage(message, "user");
  inputField.value = "";

  loadTalking();

  const aiReply = await generateResponse(message);

  loadIdle();
  addMessage(aiReply, "bot");
  speak(aiReply);
}

// ==========================================
// TEXT TO SPEECH
// ==========================================

function speak(text) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
}

// ==========================================
// TIMER (10 Minutes)
// ==========================================

let timeLeft = 600; // 10 minutes

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (timerDisplay) {
    timerDisplay.innerText =
      `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  if (timeLeft > 0) {
    timeLeft--;
  } else {
    alert("Session time is over for today.");
    inputField.disabled = true;
  }
}

if (timerDisplay) {
  setInterval(updateTimer, 1000);
}

// ==========================================
// ENTER KEY SUPPORT
// ==========================================

if (inputField) {
  inputField.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
}
